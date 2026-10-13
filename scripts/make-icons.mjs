// Generates PWA icons (no dependencies): gradient + white rounded tile + bold "W".
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const c = Buffer.alloc(4)
  c.writeUInt32BE(crc(td))
  return Buffer.concat([len, td, c])
}
function png(size, rgba) {
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

const distSeg = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy))
}
const inRoundRect = (x, y, x0, y0, w, h, r) => {
  const cx = Math.max(x0 + r, Math.min(x, x0 + w - r))
  const cy = Math.max(y0 + r, Math.min(y, y0 + h - r))
  return Math.hypot(x - cx, y - cy) <= r && x >= x0 && x <= x0 + w && y >= y0 && y <= y0 + h
}

function icon(size, safe) {
  // safe = fraction of the canvas reserved as padding (larger for maskable icons)
  const buf = Buffer.alloc(size * size * 4)
  const tile = size * (1 - 2 * safe) * 0.78
  const x0 = (size - tile) / 2, y0 = (size - tile) / 2
  const ss = 2 // supersampling
  // "W" as 4 strokes
  const p = (u, v) => [x0 + tile * u, y0 + tile * v]
  const pts = [p(0.17, 0.22), p(0.34, 0.78), p(0.5, 0.42), p(0.66, 0.78), p(0.83, 0.22)]
  const stroke = tile * 0.095
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0
      for (let sy = 0; sy < ss; sy++)
        for (let sx = 0; sx < ss; sx++) {
          const fx = x + (sx + 0.5) / ss, fy = y + (sy + 0.5) / ss
          const k = (fx + fy) / (2 * size)
          let c = [142 + (43 - 142) * k, 84 + (27 - 84) * k, 233 + (90 - 233) * k] // purple gradient
          if (inRoundRect(fx, fy + size * 0.012, x0, y0, tile, tile, tile * 0.2)) c = [20, 12, 60] // shadow
          if (inRoundRect(fx, fy, x0, y0, tile, tile, tile * 0.2)) c = [255, 255, 255]
          let d = 1e9
          for (let i = 0; i < 4; i++) d = Math.min(d, distSeg(fx, fy, ...pts[i], ...pts[i + 1]))
          if (d <= stroke / 2) c = [88, 204, 2] // green W
          r += c[0]; g += c[1]; b += c[2]
        }
      const n = ss * ss, o = (y * size + x) * 4
      buf[o] = r / n; buf[o + 1] = g / n; buf[o + 2] = b / n; buf[o + 3] = 255
    }
  return png(size, buf)
}

mkdirSync('public', { recursive: true })
writeFileSync('public/icon-192.png', icon(192, 0.08))
writeFileSync('public/icon-512.png', icon(512, 0.08))
writeFileSync('public/icon-maskable-512.png', icon(512, 0.2))
writeFileSync('public/apple-touch-icon.png', icon(180, 0.08))
console.log('icons written')

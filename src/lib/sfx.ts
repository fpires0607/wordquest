import { getState } from '../state/store'

let ctx: AudioContext | null = null

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.12) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(vol, ctx.currentTime + start)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + start)
  o.stop(ctx.currentTime + start + dur + 0.02)
}

const seq = (notes: number[], step = 0.09, type: OscillatorType = 'triangle') => notes.forEach((n, i) => tone(n, i * step, 0.18, type))

export type Sfx = 'tap' | 'undo' | 'wrong' | 'secret' | 'win' | 'coin' | 'flip'
export function sfx(kind: Sfx) {
  if (!getState().sound) return
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    switch (kind) {
      case 'tap': return tone(520 + Math.random() * 80, 0, 0.07, 'triangle', 0.1)
      case 'undo': return tone(320, 0, 0.07, 'triangle', 0.08)
      case 'flip': return tone(440, 0, 0.06, 'square', 0.04)
      case 'wrong': return seq([220, 180], 0.1, 'sawtooth')
      case 'coin': return seq([880, 1320], 0.07)
      case 'secret': return seq([660, 880, 1100], 0.08)
      case 'win': return seq([523, 659, 784, 1047], 0.11)
    }
  } catch {
    /* audio unavailable */
  }
}

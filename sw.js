// Minimal offline support. Bump VERSION to drop old caches.
const VERSION = 'wordquest-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(['./', 'manifest.webmanifest', 'icon-192.png'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET' || !req.url.startsWith('http')) return
  const isPage = req.mode === 'navigate'
  e.respondWith(
    (async () => {
      const cache = await caches.open(VERSION)
      const cached = await cache.match(req)
      // pages: network first (always get the latest build), assets/fonts: cache first + refresh in background
      const fetchAndStore = fetch(req)
        .then((res) => {
          if (res.ok || res.type === 'opaque') cache.put(req, res.clone())
          return res
        })
        .catch(() => undefined)
      if (isPage) return (await fetchAndStore) ?? cached ?? (await cache.match('./')) ?? Response.error()
      return cached ?? (await fetchAndStore) ?? Response.error()
    })(),
  )
})

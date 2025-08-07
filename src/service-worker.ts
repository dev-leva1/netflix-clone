/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope
declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: unknown }

// Precache app assets via Workbox injection
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { precacheAndRoute } from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)

const STATIC_CACHE = 'netflix-clone-static-v1'
const RUNTIME_CACHE = 'netflix-clone-runtime-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
]

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(ASSETS)).then(() => sw.skipWaiting())
  )
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k)).map((k) => caches.delete(k)))
    ).then(() => sw.clients.claim())
  )
})

sw.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  event.respondWith(
    (async () => {
      const url = new URL(req.url)

      // static: cache-first
      if (url.origin === self.location.origin) {
        const cached = await caches.match(req)
        if (cached) return cached
        const res = await fetch(req)
        const clone = res.clone()
        caches.open(STATIC_CACHE).then((cache) => cache.put(req, clone)).catch(() => {})
        return res
      }

      // api/pages: network-first with timeout; do not cache error responses
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 4000)
      try {
        const res = await fetch(req, { signal: controller.signal })
        clearTimeout(timeout)
        if (res.ok) {
          const clone = res.clone()
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(req, clone)).catch(() => {})
        }
        return res
      } catch {
        clearTimeout(timeout)
        const cached = await caches.match(req)
        return (
          cached ||
          new Response('', {
            status: 504,
            statusText: 'Offline',
          })
        )
      }
    })()
  )
})



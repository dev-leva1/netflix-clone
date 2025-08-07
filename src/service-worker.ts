/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

const sw = self as unknown as ServiceWorkerGlobalScope
declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: unknown }

// Precache app assets via Workbox injection
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { precacheAndRoute } from 'workbox-precaching'
precacheAndRoute(self.__WB_MANIFEST)

const CACHE_NAME = 'netflix-clone-v1'
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
]

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => sw.skipWaiting())
  )
})

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => sw.clients.claim())
  )
})

sw.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  event.respondWith(
    (async () => {
      const cached = await caches.match(req)
      try {
        const networkRes = await fetch(req)
        const clone = networkRes.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone)).catch(() => {})
        return networkRes
      } catch {
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



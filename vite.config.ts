import type { Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function buildServiceWorker(): Plugin {
  return {
    name: 'build-service-worker',
    apply: 'build',
    generateBundle(_, bundle) {
      const precacheAssets = new Set<string>([
        '/',
        '/index.html',
        '/manifest.webmanifest',
        '/pwa-icon.svg',
        '/pokeball-badge.svg',
      ])

      for (const fileName of Object.keys(bundle)) {
        if (!fileName.endsWith('.map')) {
          precacheAssets.add(`/${fileName}`)
        }
      }

      const serviceWorkerSource = `
const VERSION = ${JSON.stringify(new Date().toISOString())}
const APP_SHELL_CACHE = \`app-shell-\${VERSION}\`
const RUNTIME_CACHE = 'runtime-assets'
const POKEMON_CACHE_PREFIX = 'pokemon-pack-'
const PRECACHE_URLS = ${JSON.stringify(Array.from(precacheAssets))}

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map((cacheName) => {
          const isOldAppShellCache =
            cacheName.startsWith('app-shell-') && cacheName !== APP_SHELL_CACHE
          const isStaleRuntimeCache = cacheName === RUNTIME_CACHE

          if (isOldAppShellCache || isStaleRuntimeCache) {
            return caches.delete(cacheName)
          }

          return Promise.resolve(false)
        }),
      )

      await self.clients.claim()
    })(),
  )
})

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  const response = await fetch(request)

  if (response.ok) {
    const runtimeCache = await caches.open(RUNTIME_CACHE)
    await runtimeCache.put(request, response.clone())
  }

  return response
}

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const requestUrl = new URL(request.url)
  const isSameOrigin = requestUrl.origin === self.location.origin
  const isPokemonImageRequest =
    isSameOrigin &&
    requestUrl.pathname.startsWith('/pokemon/') &&
    requestUrl.pathname.endsWith('.png')
  const isStaticAssetRequest =
    isSameOrigin &&
    ['script', 'style', 'font', 'image'].includes(request.destination)

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedResponse =
          (await caches.match('/index.html')) || (await caches.match('/'))

        if (cachedResponse) {
          return cachedResponse
        }

        throw new Error('Offline and index.html is not cached')
      }),
    )
    return
  }

  if (isPokemonImageRequest || isStaticAssetRequest) {
    event.respondWith(cacheFirst(request))
  }
})
`

      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: serviceWorkerSource.trim(),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), buildServiceWorker()],
})

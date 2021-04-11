const staticCacheName = 's-app-v0';

const assetUrls = [
  'index.html',
  'offline.html',
]

self.addEventListener('install', async event => {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => {
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
      .filter(name => name !== staticCacheName)
      .map(name => caches.delete(name))
  )
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then(() => {
        return fetch(event.request).catch(() => caches.match('offline.html'))
      })
    )
});
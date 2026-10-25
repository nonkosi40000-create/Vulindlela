const CACHE_NAME = 'vulindlela-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Low-data mode strategy: Cache first, then network
  // In a real app, we'd check a header or flag for low-data mode to skip large assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Don't cache API calls or large media if low-data is preferred
          if (event.request.url.includes('/api/')) return fetchResponse;

          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      if (event.request.mode === 'navigate') {
        return caches.match('/index.html');
      }
    })
  );
});

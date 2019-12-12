const filesToCache = ['index.html', '404.html'];
const staticCacheName = 'local-cache-v1';
self.addEventListener('install', event => {
  console.log('Installing service worker and adding files to cache');
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(filesToCache))
  )
});

self.addEventListener('fetch', event => {
  console.log('Fetching', event.request);

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request);
      })
      .catch(error => {
        const url = new URL(event.request.url);
        if (url.pathname === '/') {
          return caches.match('/index.html');
        }
      })
      .catch(error => caches.match('/404.html'))
  )
});

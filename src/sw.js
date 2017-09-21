const CACHEBUST = true

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('index').then(cache => {
      return cache.addAll([
        '_assets/favicon/512.png',
        '_assets/favicon/192.png',
        '_assets/favicon/144.png',
        '_assets/favicon/32.png',
        '_assets/favicon/16.png',
        '_assets/linja-pona/linja pona.otf',
        'index.html',
        'index.css',
        'index.js',
      ].map(r => CACHEBUST ? r + '?' + Math.random() : r))
    })
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request)
    })
  )
})

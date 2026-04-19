const CACHE = 'kisanmitra-v1';
const ASSETS = [
  '/kisan-mitra_App/',
  '/kisan-mitra_App/index.html',
 '/kisan-mitra_App/app-sunlight.css',
'/kisan-mitra_App/app.js',
'/kisan-mitra_App/manifest.json',
'/kisan-mitra_App/icon-192.png',
'/kisan-mitra_App/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      return Promise.allSettled(ASSETS.map(url => c.add(url).catch(() => {})));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => cached);
    })
  );
});

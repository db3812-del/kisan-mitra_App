const CACHE = 'km-v3';
const BASE = '/kisan-mitra_App/';
const ASSETS = [
  BASE, BASE+'index.html', BASE+'app.css', BASE+'app.js',
  BASE+'manifest.json', BASE+'icon-192.png', BASE+'icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.allSettled(ASSETS.map(u => c.add(u).catch(()=>{})))
  ));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com') ||
      e.request.url.includes('openweathermap.org') ||
      e.request.url.includes('fonts.googleapis.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached ||
      fetch(e.request).catch(() => caches.match(BASE+'index.html'))
    )
  );
});

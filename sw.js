const CACHE = 'km-v4';
const BASE = '/';
const STATIC = ['/', '/index.html', '/app.css', '/app.js', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.allSettled(STATIC.map(u => c.add(u).catch(() => {})))
  ));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (url.includes('api.groq.com') ||
      url.includes('generativelanguage.googleapis.com') ||
      url.includes('openweathermap.org') ||
      url.includes('fonts.googleapis.com')) return;
  if (url.includes('data/news.json') || url.includes('data/policies.json')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached ||
      fetch(e.request).catch(() => caches.match(BASE + 'index.html'))
    )
  );
});

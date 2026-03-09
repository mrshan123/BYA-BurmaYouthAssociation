const CACHE_NAME = 'bya-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json'
];

// Service Worker ကို စတင် Install လုပ်ခြင်း
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// အချက်အလက်များကို Fetch လုပ်ခြင်း (Offline သုံးနိုင်ရန်)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache ထဲမှာရှိရင် အဲဒါကိုသုံးမယ်၊ မရှိရင် network ကနေဆွဲမယ်
        return response || fetch(event.request);
      })
  );
});

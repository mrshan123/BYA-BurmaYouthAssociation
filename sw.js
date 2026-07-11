const CACHE_NAME = 'bya-cache-v2';

// 1. Install လုပ်တဲ့အခါ Cache အဟောင်းတွေကို ဖျက်ပြီး အသစ်ယူမယ်
self.addEventListener('install', event => {
  self.skipWaiting();
});

// 2. Fetch လုပ်တဲ့အခါ Cache ထဲမှာရှိရင် ပြမယ်၊ မရှိရင် အင်တာနက်ကနေယူပြီး Cache ထဲ အလိုအလျောက်သိမ်းမယ်
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Cache ထဲမှာရှိရင် အဲဒါကိုသုံးမယ်
        }
        
        // မရှိရင် Network ကနေဆွဲမယ်
        return fetch(event.request).then(networkResponse => {
          // ရလာတဲ့ Data ကို Cache ထဲ အလိုအလျောက် သိမ်းပေးမယ်
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
  );
});

// 3. Cache အဟောင်းတွေကို ရှင်းလင်းပေးခြင်း
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

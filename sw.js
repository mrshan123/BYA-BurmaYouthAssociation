const CACHE_NAME = "bya-cache-v5";
const APP_SHELL = [
  "./",
  "./index.html",
  "./about.html",
  "./learning.html",
  "./articles.html",
  "./programs.html",
  "./impact.html",
  "./opportunities.html",
  "./get-involved.html",
  "./transparency.html",
  "./contact.html",
  "./privacy.html",
  "./safeguarding.html",
  "./terms.html",
  "./accessibility.html",
  "./learning-hub.html",
  "./partner.html",
  "./verify.html",
  "./governance.html",
  "./sdg.html",
  "./reports.html",
  "./join.html",
  "./community.html",
  "./career-center.html",
  "./resource-center.html",
  "./assistant.html",
  "./ecosystem.html",
  "./membership.html",
  "./events.html",
  "./research.html",
  "./donate.html",
  "./404.html",
  "./manifest.json",
  "./data/search-index.json",
  "./favicon.svg",
  "./assets/css/bya-v2.css",
  "./assets/css/bya-global.css",
  "./assets/css/bya-v3.css",
  "./assets/css/bya-v7.css",
  "./assets/css/bya-v8.css",
  "./assets/css/bya-v9.css",
  "./assets/js/bya-v2.js",
  "./assets/js/bya-v9.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.allSettled(APP_SHELL.map(asset => cache.add(asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // HTML/navigation: network-first so users receive the latest published BYA pages.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match("./404.html")))
    );
    return;
  }

  // Assets: cache-first with background refresh.
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
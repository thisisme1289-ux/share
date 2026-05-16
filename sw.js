const CACHE_NAME = "dobara-site-v3";
const ASSETS = [
  "index.html",
  "track.html",
  "css/base.css",
  "css/menu.css",
  "css/ui.css",
  "js/menu-catalog.js",
  "js/app.js",
  "js/track.js",
  "js/pwa.js",
  "images/temp/hero-cafe.jpg",
  "images/temp/default-food.jpg",
  "images/icons/icon-192.png",
  "images/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const networkFirst = ["document", "script", "style"].includes(event.request.destination) || url.pathname.endsWith(".html");
  if (networkFirst) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

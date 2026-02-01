const CACHE_NAME = "calc-x-v0.9.1"; // Update version untuk security fix

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./css/navbar.css",
        "./js/script.js",
        "./js/navbar.js",
        "./components/navbar.html",
        "./manifest.json",
        "./icons/icon.png"
      ]).catch(err => {
        console.error("Failed to cache files:", err);
      })
    )
  );
  self.skipWaiting(); // Aktifkan service worker baru langsung
});

// Hapus cache lama saat activate
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch strategy: Cache first, fallback to network
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(e.request);
      })
      .catch(err => {
        console.error("Fetch failed:", err);
        // Return offline page jika ada
        return caches.match("./index.html");
      })
  );
});

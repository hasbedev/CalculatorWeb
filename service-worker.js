self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("calc-x").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./css/navbar.css",
        "./js/script.js",
        "./js/navbar.js"
      ])
    )
  );
});

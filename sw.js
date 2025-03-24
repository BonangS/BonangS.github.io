self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('first-app')
        .then(function(cache) {
          cache.addAll([
            '/',
            '/index.html',
            '/src/css/app.css',
            '/src/js/app.js',
            '/manifest.json',
            'https://jsonplaceholder.typicode.com/posts'
          ])
        })
    );
    return self.clients.claim();
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(res) {
          return res;
        })
    );
  });

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request)
        .then(function(res) {
          return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
        })
        .catch(function(err) {
          return caches.match(event.request);
        })
    );
  });

  
  
var CACHE_STATIC_NAME = 'static-v10';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_STATIC_NAME)
        .then(function(cache) {
          cache.addAll([
            '/',
            '/index.html',
            '/src/css/app.css',
            '/src/js/app.js',
            '/manifest.json',
          ])
        })
    );
    return self.clients.claim();
  });

  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(
          keyList.map(function(key) {
            if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
    );
    return self.clients.claim();
  });
  

  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(event.request) 
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request, res.clone());
                  return res;
                });
            });
        })
        .catch(function() {
          return caches.match('/index.html'); 
        })
    );
  });
  



  
  
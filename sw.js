var CACHE_STATIC_NAME = 'static-v11';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';
var API_CACHE_NAME = 'api-cache-v1';

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(function(cache) {
            return cache.addAll([
                '/', 
                '/index.html',  
                '/fetch.js',  
                '/manifest.json', 
                '/about.html',
                '/src/css/app.css', 
                '/src/js/app.js'
            ]);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(
                keyList.map(function(key) {
                    if (![CACHE_STATIC_NAME, CACHE_DYNAMIC_NAME, API_CACHE_NAME].includes(key)) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    var requestUrl = new URL(event.request.url);

    // Jika request adalah untuk API, simpan di cache terpisah
    if (requestUrl.origin === 'https://jsonplaceholder.typicode.com') {
        event.respondWith(
            fetch(event.request)
                .then(function(res) {
                    return caches.open(API_CACHE_NAME).then(function(cache) {
                        cache.put(event.request, res.clone());
                        return res;
                    });
                })
                .catch(function() {
                    return caches.match(event.request);
                })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request)
                .then(function(res) {
                    return caches.open(CACHE_DYNAMIC_NAME).then(function(cache) {
                        cache.put(event.request, res.clone());
                        return res;
                    });
                })
                .catch(function() {
                    return caches.match('/about.html');
                });
        })
    );
});

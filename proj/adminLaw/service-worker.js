// 서비스 워커 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// 서비스 워커 설치
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles/main.css',
        '/scripts/main.js',
        '/images/logo.png'
        // 캐시할 리소스들을 추가합니다.
      ]);
    })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', function(event) {
  // 이전 캐시를 정리합니다.
  var cacheWhitelist = ['my-cache'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 오프라인에서 요청 가로채기
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // 캐시에 맞는 리소스가 있으면 반환합니다.
      if (response) {
        return response;
      }
      // 캐시에 없는 경우 네트워크에서 가져옵니다.
      return fetch(event.request);
    })
  );
});

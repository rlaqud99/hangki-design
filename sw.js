// 한끼설계소 서비스 워커 — 오프라인에서도 레시피를 볼 수 있도록 핵심 파일을 미리 저장해둡니다.
const CACHE_NAME = "hangki-cache-v2";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./hero-img/r1-hero.jpg",
  "./hero-img/r2-hero.jpg",
  "./hero-img/r3-hero.jpg",
  "./hero-img/r4-hero.jpg",
  "./hero-img/r5-hero.jpg",
  "./hero-img/r6-hero.jpg",
  "./hero-img/r7-hero.jpg",
  "./hero-img/r8-hero.jpg",
  "./hero-img/r9-hero.jpg",
  "./recipe-img/06b15bca-image.jpg",
  "./recipe-img/1a7b4f40-image.jpg",
  "./recipe-img/2e7993a0-image.jpg",
  "./recipe-img/35645333-image.jpg",
  "./recipe-img/370d869b-image.jpg",
  "./recipe-img/4996f1b3-image.jpg",
  "./recipe-img/4c86f5c8-image.jpg",
  "./recipe-img/52b10d6a-image.jpg",
  "./recipe-img/758b8cf5-image.jpg",
  "./recipe-img/8ef28eb3-image.jpg",
  "./recipe-img/93008de0-image.jpg",
  "./recipe-img/9d5beeb6-image.jpg",
  "./recipe-img/ad3169eb-image.jpg",
  "./recipe-img/ba526f4f-image.jpg",
  "./recipe-img/c5a58115-image.jpg",
  "./recipe-img/d7357260-image.jpg",
  "./recipe-img/db0a8a97-image.jpg",
  "./recipe-img/f54367d7-image.jpg"
];

self.addEventListener("install", function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
      return cache.addAll(PRECACHE_URLS).catch(function(err){
        // 네트워크 상태에 따라 일부 파일이 실패해도 설치 자체는 계속 진행
        console.warn("일부 파일 캐시 실패:", err);
      });
    })
  );
});

self.addEventListener("activate", function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(key){ return key !== CACHE_NAME; })
            .map(function(key){ return caches.delete(key); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(event){
  if(event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(function(cached){
      if(cached) return cached;
      return fetch(event.request).then(function(response){
        if(response && response.status === 200 && response.type === "basic"){
          var copy = response.clone();
          caches.open(CACHE_NAME).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){
        if(event.request.mode === "navigate"){
          return caches.match("./index.html");
        }
      });
    })
  );
});

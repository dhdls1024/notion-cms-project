// Service Worker — 링크허브 PWA
// 전략: API 요청은 Network Only, 정적 자산은 Cache First, 페이지는 Network First

const CACHE_NAME = "linkhub-v1"

// 설치 시 오프라인 폴백 페이지 미리 캐싱
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add("/offline.html"))
  )
  // 이전 SW가 있어도 즉시 활성화
  self.skipWaiting()
})

// 활성화 시 이전 버전 캐시 삭제
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  // 새 SW가 즉시 모든 탭을 제어
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // API 요청 — Network Only (항상 최신 Notion 데이터)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request))
    return
  }

  // 정적 자산 (_next/static) — Cache First
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetchAndCache(request)
      )
    )
    return
  }

  // 아이콘, manifest 등 public 정적 파일 — Cache First
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.json"
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) => cached ?? fetchAndCache(request)
      )
    )
    return
  }

  // 페이지 요청 — Network First (실시간 Notion 데이터 우선)
  event.respondWith(
    fetch(request).catch(() =>
      caches.match(request).then(
        (cached) => cached ?? caches.match("/offline.html")
      )
    )
  )
})

// 네트워크에서 받아 캐시에도 저장하는 헬퍼
async function fetchAndCache(request) {
  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())
  }
  return response
}

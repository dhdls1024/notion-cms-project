"use client"

// SW 등록 클라이언트 컴포넌트 — 앱 로드 후 Service Worker 등록
import { useEffect } from "react"

export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    // 브라우저가 Service Worker를 지원할 때만 등록
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW 등록 실패:", err))
    }
  }, [])

  return null
}

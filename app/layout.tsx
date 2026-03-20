import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// cn: clsx + tailwind-merge 조건부 클래스 병합 유틸리티
import { cn } from "@/lib/utils"
// ThemeProvider: next-themes의 다크모드 Provider (SSR 안전)
import { ThemeProvider } from "next-themes"
// Toaster: sonner 기반 토스트 알림 컴포넌트
import { Toaster } from "@/components/ui/sonner"
import { Header } from "@/components/layout/header"
// QueryProvider: TanStack Query 캐시 컨텍스트 (클라이언트 컴포넌트)
import { QueryProvider } from "@/providers/query-provider"
// ServiceWorkerRegistrar: PWA Service Worker 등록 (클라이언트 컴포넌트)
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar"
import "./globals.css"
import { SITE_CONFIG } from "@/lib/constants"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: SITE_CONFIG.name,
  description: SITE_CONFIG.description,
  // PWA manifest 연결
  manifest: "/manifest.json",
  // iOS 홈 화면 설치 지원
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "링크허브",
  },
  // 아이콘
  icons: {
    apple: "/icons/apple-touch-icon.svg",
  },
}

// Next.js 16: themeColor는 viewport export로 분리
export const viewport: Viewport = {
  themeColor: "#18181b",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning: next-themes SSR 하이드레이션 불일치 경고 억제
    // (서버/클라이언트 테마 초기값 불일치는 의도된 동작)
    <html lang="ko" suppressHydrationWarning>
      <body
        className={cn(geistSans.variable, geistMono.variable, "flex min-h-screen flex-col antialiased")}
      >
        <ThemeProvider
          attribute="class"          // .dark 클래스로 CSS 변수 전환
          defaultTheme="system"      // OS 다크모드 설정을 기본값으로
          enableSystem               // 시스템 테마 감지 활성화
          disableTransitionOnChange  // 테마 전환 시 CSS transition 비활성화 (깜빡임 방지)
        >
          {/* QueryProvider: TanStack Query 캐시를 ThemeProvider 안에 배치해 테마 컨텍스트 접근 가능 */}
          <QueryProvider>
            {/* PWA Service Worker 등록 — 렌더링 없는 순수 effect 컴포넌트 */}
            <ServiceWorkerRegistrar />
            <Header />
            {children}
            {/* richColors: 알림 유형별 색상 자동 적용 */}
            <Toaster richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

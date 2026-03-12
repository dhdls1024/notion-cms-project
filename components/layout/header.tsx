// 서버 컴포넌트: ThemeToggle만 클라이언트 컴포넌트
// PRD 메뉴 구조: 좌측 브랜딩(사이트명) + 우측 다크모드 토글
import Link from "next/link"
import { Container } from "./container"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { SITE_CONFIG } from "@/lib/constants"

export function Header() {
  return (
    // sticky: 스크롤 시 헤더 고정, backdrop-blur: 배경 블러 효과
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 좌측 브랜딩 — Notion에서 가져온 프로필 정보로 교체 예정 (F001) */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
          >
            {SITE_CONFIG.name}
          </Link>

          {/* 우측: 다크모드 토글 (F003) */}
          <ThemeToggle />
        </div>
      </Container>
      <Separator />
    </header>
  )
}

// Hero 섹션: 랜딩 페이지의 첫 화면 (서버 컴포넌트)
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/container"
import { SITE_CONFIG, ROUTES } from "@/lib/constants"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          {/* 상단 뱃지: 프로젝트 성격 표시 */}
          <Badge variant="secondary" className="text-sm">
            Next.js 스타터킷
          </Badge>

          {/* 메인 헤드라인 */}
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {SITE_CONFIG.description}
          </h1>

          {/* 서브 설명 */}
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            검증된 라이브러리와 컴포넌트 계층 구조로 프로덕션 준비 완료.
            바퀴 재발명 없이 바로 시작하세요.
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href={ROUTES.components}>컴포넌트 보기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

// 컴포넌트 카드 목록 페이지 — 서버 컴포넌트, SEO 메타데이터 포함
import type { Metadata } from "next"
import { Container } from "@/components/layout/container"
import { SITE_CONFIG } from "@/lib/constants"

// 페이지 메타데이터 (SEO)
export const metadata: Metadata = {
  title: `컴포넌트 쇼케이스 | ${SITE_CONFIG.name}`,
  description: "shadcn/ui 기반 컴포넌트 예제와 인터랙티브 데모 모음",
}

export default function ComponentsPage() {
  return (
    <main>
      {/* 페이지 헤더 */}
      <section className="border-b bg-muted/30 py-12">
        <Container>
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              컴포넌트 쇼케이스
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              shadcn/ui 기반 컴포넌트 예제와 패턴 모음입니다.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <p className="text-muted-foreground text-sm">
            컴포넌트 목록이 준비 중입니다.
          </p>
        </Container>
      </section>
    </main>
  )
}

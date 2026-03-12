"use client"

// UI 컴포넌트 인터랙티브 데모 페이지 — 클라이언트 컴포넌트
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"

export default function ExamplesComponentsPage() {
  return (
    <main>
      <PageHeader
        title="컴포넌트 쇼케이스"
        description="shadcn/ui 핵심 컴포넌트를 직접 클릭하고 조작해보세요."
        tags={["UI/UX", "인터랙티브"]}
      />

      <section className="py-12">
        <Container>
          <p className="text-muted-foreground text-sm">
            컴포넌트 데모가 준비 중입니다.
          </p>
        </Container>
      </section>
    </main>
  )
}

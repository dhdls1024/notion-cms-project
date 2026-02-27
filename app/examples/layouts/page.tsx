// 레이아웃 예제 페이지 — 반응형 레이아웃 패턴 (서버 컴포넌트)
import type { Metadata } from "next"
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "레이아웃 예제 | Next.js 스타터킷",
  description: "반응형 Grid, Sidebar, 카드 그리드 레이아웃 패턴 예제",
}

// 코드 스니펫 표시 컴포넌트
function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
      <code>{code}</code>
    </pre>
  )
}

export default function LayoutsPage() {
  return (
    <main>
      <PageHeader
        title="레이아웃 예제"
        description="자주 사용되는 반응형 레이아웃 패턴을 Tailwind CSS로 구현한 예제입니다."
        tags={["반응형", "레이아웃"]}
      />

      <section className="py-12">
        <Container>
          <div className="space-y-16">
            {/* 1. Grid 컬럼 패턴 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Grid 컬럼 레이아웃</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  화면 크기에 따라 컬럼 수가 변하는 반응형 그리드입니다.
                </p>
              </div>

              {/* 1열 → 2열 → 4열 그리드 예시 */}
              <div>
                <Badge variant="outline" className="mb-3 text-xs">grid-cols-1 → 2 → 4</Badge>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="rounded-lg border bg-muted/50 p-4 text-center text-sm">
                      카드 {n}
                    </div>
                  ))}
                </div>
                <CodeBlock code={`<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">`} />
              </div>

              {/* 1열 → 3열 그리드 예시 */}
              <div>
                <Badge variant="outline" className="mb-3 text-xs">grid-cols-1 → 3</Badge>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="rounded-lg border bg-muted/50 p-4 text-center text-sm">
                      아이템 {n}
                    </div>
                  ))}
                </div>
                <CodeBlock code={`<div className="grid grid-cols-1 gap-3 md:grid-cols-3">`} />
              </div>
            </div>

            <Separator />

            {/* 2. Sidebar + Content 패턴 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Sidebar + Content 레이아웃</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  고정 너비 사이드바와 유동 콘텐츠 영역 패턴입니다.
                </p>
              </div>

              <div className="rounded-lg border">
                <div className="flex min-h-48">
                  {/* 사이드바 */}
                  <aside className="w-48 shrink-0 border-r bg-muted/30 p-4">
                    <nav className="space-y-1">
                      {["대시보드", "프로필", "설정", "로그아웃"].map((item) => (
                        <div
                          key={item}
                          className="rounded px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                        >
                          {item}
                        </div>
                      ))}
                    </nav>
                  </aside>

                  {/* 메인 콘텐츠 */}
                  <main className="flex-1 p-6">
                    <p className="text-sm text-muted-foreground">
                      사이드바 오른쪽의 유동 콘텐츠 영역입니다.
                      <br />
                      <code className="mt-2 block rounded bg-muted px-2 py-1 text-xs">
                        {`aside.w-48.shrink-0 + main.flex-1`}
                      </code>
                    </p>
                  </main>
                </div>
              </div>

              <CodeBlock code={`<div className="flex">
  <aside className="w-48 shrink-0 border-r">사이드바</aside>
  <main className="flex-1">콘텐츠</main>
</div>`} />
            </div>

            <Separator />

            {/* 3. 카드 Masonry-style 그리드 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">카드 그리드 패턴</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  flex-wrap을 활용한 자동 줄바꿈 카드 그리드입니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Zod", "React Hook Form"].map((tech) => (
                  <div
                    key={tech}
                    className="rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-sm"
                  >
                    {tech}
                  </div>
                ))}
              </div>

              <CodeBlock code={`<div className="flex flex-wrap gap-3">
  {items.map((item) => (
    <div key={item} className="rounded-lg border px-4 py-3">
      {item}
    </div>
  ))}
</div>`} />
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

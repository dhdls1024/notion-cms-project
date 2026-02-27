// 데이터 페칭 페이지 로딩 Skeleton — Suspense fallback으로 자동 사용됨
import { Container } from "@/components/layout/container"
import { Skeleton } from "@/components/ui/skeleton"

// 스켈레톤 카드 반복 횟수 상수
const SKELETON_COUNT = 5

export default function DataFetchingLoading() {
  return (
    <main>
      {/* 헤더 Skeleton */}
      <section className="border-b bg-muted/30 py-10">
        <Container>
          <div className="mb-6">
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
        </Container>
      </section>

      {/* 콘텐츠 Skeleton */}
      <section className="py-12">
        <Container>
          <div className="space-y-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-lg border p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}

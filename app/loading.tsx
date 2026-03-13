// loading.tsx: Next.js 자동 로딩 UI — 페이지 데이터 로딩 중 표시
// shadcn Skeleton으로 링크 카드와 동일한 레이아웃의 로딩 상태 구현
import { Skeleton } from "@/components/ui/skeleton"

// 표시할 Skeleton 카드 개수
const SKELETON_COUNT = 6

export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* 프로필 헤더 Skeleton */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="w-32 h-6 rounded" />
          <Skeleton className="w-48 h-4 rounded" />
        </div>

        {/* 탭 Skeleton */}
        <div className="flex gap-2 mb-6">
          {["전체", "개발", "AI"].map((label) => (
            <Skeleton key={label} className="h-8 w-16 rounded-md" />
          ))}
        </div>

        {/* 링크 카드 Skeleton 그리드 — 반응형 동일 적용 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-xl border bg-card"
            >
              {/* 아이콘 Skeleton */}
              <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
              {/* 텍스트 Skeleton */}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
              {/* 버튼 Skeleton */}
              <Skeleton className="w-8 h-8 rounded shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

// 데이터 페칭 예제 — 서버 fetch + 클라이언트 Skeleton + TanStack Query 비교 페이지
import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ClientDataFetching } from "./client-section"
// TanStackQueryDemo: useQuery/useMutation/조건부 조회 예제 컴포넌트
import { TanStackQueryDemo } from "@/components/examples/tanstack-query-demo"

export const metadata: Metadata = {
  title: "데이터 페칭 | Next.js 스타터킷",
  description: "서버 컴포넌트 fetch, 클라이언트 useState, TanStack Query 데이터 패칭 패턴 비교",
}

// JSONPlaceholder API 엔드포인트 상수 (매직넘버 금지)
const PLACEHOLDER_API_BASE = "https://jsonplaceholder.typicode.com"
const POSTS_LIMIT = 5

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

// 서버 컴포넌트에서 직접 fetch — 빌드 시 혹은 요청 시 서버에서 실행됨
async function ServerPosts() {
  // 서버에서 직접 API 호출 (next: { revalidate: 3600 }으로 1시간 캐시)
  const res = await fetch(`${PLACEHOLDER_API_BASE}/posts?_limit=${POSTS_LIMIT}`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error("데이터를 불러오는 데 실패했습니다")
  }

  const posts: Post[] = await res.json()

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div key={post.id} className="rounded-lg border p-4">
          <h3 className="font-medium capitalize">{post.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.body}</p>
          <span className="mt-2 inline-block text-xs text-muted-foreground">
            User #{post.userId}
          </span>
        </div>
      ))}
    </div>
  )
}

// 서버 포스트 로딩 Skeleton (Suspense fallback)
function ServerPostsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: POSTS_LIMIT }).map((_, i) => (
        <div key={i} className="space-y-2 rounded-lg border p-4">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export default function DataFetchingPage() {
  return (
    <main>
      <PageHeader
        title="데이터 페칭"
        description="서버 컴포넌트 fetch와 클라이언트 useState 기반 데이터 로딩 패턴을 비교합니다."
        tags={["API", "비동기"]}
      />

      <section className="py-12">
        <Container>
          <div className="space-y-12">
            {/* 서버 컴포넌트 fetch 섹션 */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">서버 컴포넌트 fetch</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  서버에서 직접 API를 호출하고 HTML로 렌더링합니다. Suspense로 스트리밍합니다.
                </p>
              </div>
              {/* Suspense — 서버 컴포넌트 스트리밍 */}
              <Suspense fallback={<ServerPostsSkeleton />}>
                <ServerPosts />
              </Suspense>
            </div>

            <Separator />

            {/* 클라이언트 fetch 섹션 */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">클라이언트 fetch (useState + useEffect)</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  브라우저에서 fetch하고 Skeleton 로딩, 에러 처리, 재시도를 구현합니다.
                </p>
              </div>
              <ClientDataFetching />
            </div>

            <Separator />

            {/* TanStack Query 섹션 */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold">TanStack Query v5</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  캐싱, 자동 리패칭, 로딩/에러 상태를 선언적으로 처리합니다.
                  useQuery · useMutation · 조건부 조회(enabled) 패턴을 비교해보세요.
                </p>
              </div>
              <TanStackQueryDemo />
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

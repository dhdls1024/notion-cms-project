"use client"

// cn: clsx + tailwind-merge 조건부 클래스 병합 유틸리티
import { cn } from "@/lib/utils"
// useQuery: 데이터 조회 훅 — 캐싱, 자동 리패칭, 로딩/에러 상태를 선언적으로 처리
// useMutation: 데이터 변경 훅 — POST/PUT/DELETE 요청과 성공/실패 콜백 처리
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
// toast: sonner 기반 토스트 알림 (useMutation onSuccess에서 사용)
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Send, Search } from "lucide-react"

// JSONPlaceholder API 상수 (매직넘버 금지)
const API_BASE = "https://jsonplaceholder.typicode.com"
const POSTS_LIMIT = 5
// 조건부 조회 탭의 staleTime: 5분 동안 캐시 유지 (불필요한 리패칭 방지)
const CONDITIONAL_STALE_TIME = 5 * 60 * 1000

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

interface NewPost {
  title: string
  body: string
  userId: number
}

// ─── 탭 1: useQuery 기본 조회 ────────────────────────────────────────────────

function UseQueryTab() {
  // useQuery: queryKey로 캐시를 식별, queryFn에서 데이터를 fetch
  // 기존 useState+useEffect 방식 대비 캐싱·자동 리패칭·상태 관리를 자동으로 처리
  const { data: posts, isLoading, isError, refetch, isFetching } = useQuery<Post[]>({
    // queryKey: 캐시 키 배열. 같은 키면 캐시에서 반환, 다르면 새로 fetch
    queryKey: ["posts", "list"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/posts?_limit=${POSTS_LIMIT}`)
      if (!res.ok) throw new Error("포스트 목록 불러오기 실패")
      return res.json()
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: POSTS_LIMIT }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        데이터를 불러오는 데 실패했습니다.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 코드 비교 안내 */}
      <div className="rounded-lg bg-muted p-3 text-sm">
        <p className="font-medium">useState + useEffect 방식과 비교</p>
        <p className="mt-1 text-muted-foreground">
          기존: useState 3개 + useEffect + try/catch + 직접 리패칭 로직 ≈ 25줄
          <br />
          TanStack Query: useQuery 한 줄 + 구조 분해 ≈ 5줄
        </p>
      </div>

      {/* refetch 버튼 — isFetching: 백그라운드 리패칭 중일 때도 true */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => refetch()}
        disabled={isFetching}
      >
        <RefreshCw className={cn("mr-2 h-4 w-4", isFetching && "animate-spin")} />
        {isFetching ? "갱신 중..." : "수동 리패칭"}
      </Button>

      <div className="space-y-3">
        {posts?.map((post) => (
          <div key={post.id} className="rounded-lg border p-4">
            <h3 className="font-medium capitalize">{post.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.body}</p>
            <Badge variant="secondary" className="mt-2 text-xs">
              User #{post.userId}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 탭 2: useMutation 데이터 생성 ───────────────────────────────────────────

function UseMutationTab() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  // useQueryClient: 캐시에 직접 접근하기 위한 훅 (성공 후 캐시 무효화에 사용)
  const queryClient = useQueryClient()

  // useMutation: POST 요청을 선언적으로 처리
  // — mutationFn: 실제 요청 함수
  // — onSuccess: 성공 시 콜백 (toast 알림 + 캐시 무효화)
  // — onError: 실패 시 콜백
  const mutation = useMutation<Post, Error, NewPost>({
    mutationFn: async (newPost: NewPost) => {
      const res = await fetch(`${API_BASE}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      })
      if (!res.ok) throw new Error("포스트 생성 실패")
      return res.json()
    },
    onSuccess: (data) => {
      // toast: 성공 메시지 표시
      toast.success("포스트가 생성되었습니다!", {
        description: `ID: ${data.id} — ${data.title}`,
      })
      // invalidateQueries: 해당 캐시를 stale로 표시해 다음 렌더 시 자동 리패칭
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      // 폼 초기화
      setTitle("")
      setBody("")
    },
    onError: (error) => {
      toast.error("포스트 생성에 실패했습니다.", {
        description: error.message,
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    // mutation.mutate(): mutation 실행. isPending 상태로 전환
    mutation.mutate({ title, body, userId: 1 })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted p-3 text-sm">
        <p className="font-medium">useMutation 특징</p>
        <p className="mt-1 text-muted-foreground">
          isPending으로 중복 제출 방지, onSuccess/onError 콜백으로 부수 효과 처리,
          invalidateQueries로 관련 캐시 자동 갱신
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="post-title">제목</Label>
          <Input
            id="post-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="포스트 제목을 입력하세요"
            // isPending: mutation 진행 중일 때 입력 비활성화
            disabled={mutation.isPending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="post-body">내용</Label>
          <Input
            id="post-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="포스트 내용을 입력하세요"
            disabled={mutation.isPending}
          />
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending || !title.trim() || !body.trim()}
        >
          <Send className="mr-2 h-4 w-4" />
          {mutation.isPending ? "생성 중..." : "포스트 생성"}
        </Button>
      </form>

      {/* 마지막 생성 결과 표시 */}
      {mutation.isSuccess && mutation.data && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            생성 완료 (JSONPlaceholder는 실제 저장되지 않음)
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ID: {mutation.data.id} / Title: {mutation.data.title}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── 탭 3: useQuery + enabled 조건부 조회 ────────────────────────────────────

function ConditionalQueryTab() {
  const [userId, setUserId] = useState("")

  // useQuery + enabled: userId가 있을 때만 요청을 보냄
  // — enabled: false면 queryFn을 실행하지 않고 대기 상태 유지
  const { data: posts, isLoading, isError, isFetching } = useQuery<Post[]>({
    // queryKey에 userId를 포함 → userId 변경 시 자동으로 새 요청
    queryKey: ["posts", "byUser", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/posts?userId=${userId}&_limit=${POSTS_LIMIT}`)
      if (!res.ok) throw new Error("유저 포스트 불러오기 실패")
      return res.json()
    },
    // enabled: userId가 있을 때만 요청 (입력 전 불필요한 API 호출 차단)
    enabled: !!userId,
    // staleTime: 5분 동안 같은 userId 결과를 캐시에서 반환 (불필요한 리패칭 방지)
    staleTime: CONDITIONAL_STALE_TIME,
  })

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-muted p-3 text-sm">
        <p className="font-medium">enabled + staleTime 특징</p>
        <p className="mt-1 text-muted-foreground">
          <code className="rounded bg-background px-1">enabled: !!userId</code>로 입력 전 요청 차단.
          staleTime 5분으로 같은 userId 재조회 시 캐시 반환 (네트워크 요청 없음).
          queryKey에 userId 포함으로 값 변경 시 자동 리패칭.
        </p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <Label htmlFor="user-id">User ID (1~10)</Label>
          <div className="flex gap-2">
            <Input
              id="user-id"
              type="number"
              min={1}
              max={10}
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="숫자 입력 후 자동 조회"
            />
            {userId && (
              <Button variant="outline" size="icon" onClick={() => setUserId("")}>
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 입력 전 안내 */}
      {!userId && (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          User ID를 입력하면 해당 유저의 포스트를 조회합니다.
          <br />
          <span className="text-xs">enabled: false 상태 — 요청이 차단됩니다</span>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && userId && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* 에러 상태 */}
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          데이터를 불러오는 데 실패했습니다.
        </div>
      )}

      {/* 데이터 표시 */}
      {posts && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              User #{userId}의 포스트 {posts.length}개
            </p>
            {isFetching && <Badge variant="secondary" className="text-xs">갱신 중</Badge>}
          </div>
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg border p-4">
              <h3 className="font-medium capitalize">{post.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

// TanStackQueryDemo: 3개 탭으로 TanStack Query의 핵심 기능을 시연하는 컴포넌트
export function TanStackQueryDemo() {
  return (
    <Tabs defaultValue="use-query">
      <TabsList className="mb-6">
        <TabsTrigger value="use-query">useQuery</TabsTrigger>
        <TabsTrigger value="use-mutation">useMutation</TabsTrigger>
        <TabsTrigger value="conditional">조건부 조회</TabsTrigger>
      </TabsList>

      {/* 탭 1: 기본 조회 */}
      <TabsContent value="use-query">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">useQuery — 기본 조회</h3>
            <p className="text-sm text-muted-foreground">
              선언적 데이터 조회. 캐싱, 자동 리패칭, 로딩/에러 상태를 자동으로 관리합니다.
            </p>
          </div>
          <UseQueryTab />
        </div>
      </TabsContent>

      {/* 탭 2: 데이터 생성 */}
      <TabsContent value="use-mutation">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">useMutation — 데이터 생성</h3>
            <p className="text-sm text-muted-foreground">
              POST 요청을 선언적으로 처리. isPending으로 중복 제출 방지, 성공 시 캐시 무효화.
            </p>
          </div>
          <UseMutationTab />
        </div>
      </TabsContent>

      {/* 탭 3: 조건부 조회 */}
      <TabsContent value="conditional">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">useQuery + enabled — 조건부 조회</h3>
            <p className="text-sm text-muted-foreground">
              입력값이 있을 때만 요청. staleTime으로 캐시 유지 시간 제어.
            </p>
          </div>
          <ConditionalQueryTab />
        </div>
      </TabsContent>
    </Tabs>
  )
}

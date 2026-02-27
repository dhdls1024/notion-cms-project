"use client"

// 클라이언트 데이터 페칭 섹션 — useState + useEffect + Skeleton + 에러처리
import { useState, useEffect, useCallback } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

// API 상수 (매직넘버 금지)
const PLACEHOLDER_API_BASE = "https://jsonplaceholder.typicode.com"
const POSTS_LIMIT = 5

interface Post {
  id: number
  title: string
  body: string
  userId: number
}

type FetchState = "idle" | "loading" | "success" | "error"

export function ClientDataFetching() {
  const [posts, setPosts] = useState<Post[]>([])
  const [state, setState] = useState<FetchState>("idle")
  const [error, setError] = useState("")

  // useCallback으로 fetchPosts 함수 메모이제이션 (재시도 버튼에서 재사용)
  const fetchPosts = useCallback(async () => {
    setState("loading")
    setError("")

    try {
      const res = await fetch(`${PLACEHOLDER_API_BASE}/posts?_limit=${POSTS_LIMIT}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Post[] = await res.json()
      setPosts(data)
      setState("success")
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다")
      setState("error")
    }
  }, [])

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 로딩 상태 — Skeleton 표시
  if (state === "loading") {
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

  // 에러 상태 — Alert + 재시도 버튼
  if (state === "error") {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>데이터 로드 실패</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchPosts} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </Button>
      </div>
    )
  }

  // 성공 상태 — 포스트 목록
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
      <Button onClick={fetchPosts} variant="outline" size="sm" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        새로고침
      </Button>
    </div>
  )
}

"use client"

// TanStack Query useMutation 기반 CRUD 훅 — 클라이언트 컴포넌트에서만 사용
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { CreateLinkInput, UpdateLinkInput } from "@/types"

/**
 * ISR 캐시 무효화 요청
 * CRUD 성공 후 호출하여 /api/revalidate로 홈 페이지 캐시를 즉시 갱신한다.
 */
async function revalidate() {
  const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET
  await fetch("/api/revalidate", {
    method: "POST",
    headers: {
      // REVALIDATE_SECRET을 Bearer 토큰으로 전송
      Authorization: `Bearer ${secret ?? ""}`,
    },
  })
}

/**
 * 링크 생성 mutation 훅
 * POST /api/links 호출 후 ISR 캐시 무효화 + 페이지 새로고침 + 토스트 알림
 */
export function useCreateLink() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateLinkInput) => {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "링크 추가에 실패했습니다")
      }
      return res.json()
    },
    onSuccess: () => {
      // ISR 캐시 무효화 + 서버 컴포넌트 재렌더링 트리거
      revalidate()
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["links"] })
      toast.success("링크가 추가되었습니다")
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "링크 추가에 실패했습니다")
    },
  })
}

/**
 * 링크 수정 mutation 훅
 * PATCH /api/links/[id] 호출 후 ISR 캐시 무효화 + 페이지 새로고침 + 토스트 알림
 */
export function useUpdateLink() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateLinkInput }) => {
      const res = await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "링크 수정에 실패했습니다")
      }
      return res.json()
    },
    onSuccess: () => {
      revalidate()
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["links"] })
      toast.success("링크가 수정되었습니다")
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "링크 수정에 실패했습니다")
    },
  })
}

/**
 * 링크 순서 일괄 업데이트 mutation 훅
 * PATCH /api/links/reorder 호출 — 드래그 완료 후 변경된 항목들의 order를 Notion DB에 반영
 * 성공 시 ISR 캐시 무효화 + 페이지 새로고침 (토스트 없음 — 낙관적 업데이트로 즉시 반영됨)
 */
export function useReorderLinks() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const res = await fetch("/api/links/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "순서 저장에 실패했습니다")
      }
      return res.json()
    },
    onSuccess: () => {
      // 백그라운드에서 캐시 갱신 — UI는 낙관적 업데이트로 이미 반영된 상태
      revalidate()
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["links"] })
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "순서 저장에 실패했습니다")
    },
  })
}

/**
 * 링크 삭제 mutation 훅
 * DELETE /api/links/[id] 호출 후 ISR 캐시 무효화 + 페이지 새로고침 + 토스트 알림
 */
export function useDeleteLink() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "링크 삭제에 실패했습니다")
      }
      return res.json()
    },
    onSuccess: () => {
      revalidate()
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["links"] })
      toast.success("링크가 삭제되었습니다")
    },
    onError: (error: Error) => {
      toast.error(error.message ?? "링크 삭제에 실패했습니다")
    },
  })
}

"use client"

// 링크 추가 다이얼로그 컴포넌트
// zod 스키마 + react-hook-form으로 폼 유효성 검사, useCreateLink mutation으로 API 호출
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createLinkSchema, type CreateLinkFormInput } from "@/lib/validations"
import { useCreateLink } from "@/hooks/useLinks"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AddLinkDialogProps {
  // 링크 추가 성공 후 호출할 콜백 (선택)
  onSuccess?: () => void
}

export default function AddLinkDialog({ onSuccess }: AddLinkDialogProps) {
  // 다이얼로그 열림/닫힘 상태
  const [open, setOpen] = useState(false)

  // react-hook-form 초기화 — input 타입으로 제네릭 지정 (default 적용 전 타입)
  const form = useForm<CreateLinkFormInput>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      category: "",
      memo: "",
    },
  })

  // 링크 생성 mutation 훅 — POST /api/links 호출
  const mutation = useCreateLink()

  // 폼 제출 핸들러 — zod parse 후 CreateLinkSchema(output) 타입으로 변환됨
  // data를 명시적 캐스팅으로 mutation 타입에 맞춤
  const handleSubmit = (data: CreateLinkFormInput) => {
    const parsed = createLinkSchema.parse(data)
    mutation.mutate(parsed, {
      onSuccess: () => {
        // 폼 초기화 + 다이얼로그 닫기 + 부모 콜백 호출
        form.reset()
        setOpen(false)
        onSuccess?.()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 다이얼로그 열기 트리거 버튼 */}
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + 링크 추가
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>새 링크 추가</DialogTitle>
        </DialogHeader>

        {/* shadcn Form — react-hook-form context 제공 */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* 제목 필드 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="GitHub" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL 필드 */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 카테고리 필드 */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Input placeholder="개발" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 메모 필드 — 선택 입력, 링크에 대한 간단한 설명 */}
            <FormField
              control={form.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메모</FormLabel>
                  <FormControl>
                    <Input placeholder="간단한 메모 (선택)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              {/* 취소 버튼 — 폼 초기화 없이 다이얼로그만 닫기 */}
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                취소
              </Button>

              {/* 제출 버튼 — mutation 진행 중 비활성화 */}
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "추가 중..." : "추가"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

// 링크 수정 다이얼로그 — 기존 LinkItem 값을 폼에 채워 수정 후 PATCH API 호출
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Switch } from "@/components/ui/switch"
import { updateLinkSchema, type UpdateLinkFormInput } from "@/lib/validations"
import { useUpdateLink } from "@/hooks/useLinks"
import type { LinkItem } from "@/types"

interface EditLinkDialogProps {
  link: LinkItem
  onSuccess?: () => void
}

export default function EditLinkDialog({ link, onSuccess }: EditLinkDialogProps) {
  // 다이얼로그 열림/닫힘 상태 — 수정 성공 시 자동으로 닫기 위해 직접 관리
  const [open, setOpen] = useState(false)

  const mutation = useUpdateLink()

  // 기존 링크 데이터를 폼 기본값으로 설정
  const form = useForm<UpdateLinkFormInput>({
    resolver: zodResolver(updateLinkSchema),
    defaultValues: {
      title: link.title,
      url: link.url,
      category: link.category,
      active: link.active,
      memo: link.memo,
    },
  })

  // 폼 제출 핸들러 — zod parse 후 mutation 실행
  function handleSubmit(data: UpdateLinkFormInput) {
    const parsed = updateLinkSchema.parse(data)
    mutation.mutate(
      { id: link.id, input: parsed },
      {
        onSuccess: () => {
          setOpen(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 수정 버튼 — 카드 내 아이콘 버튼 */}
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="링크 수정">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>링크 수정</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* 제목 필드 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="링크 제목" {...field} />
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
                    <Input placeholder="https://example.com" {...field} />
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
                    <Input placeholder="개발, SNS 등" {...field} />
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

            {/* 활성화 필드 — Switch로 공개/비공개 전환 */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="cursor-pointer">공개 여부</FormLabel>
                    <FormControl>
                      {/* checked/onCheckedChange: Switch는 boolean 값을 사용 */}
                      <Switch
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 저장 버튼 — mutation 진행 중 비활성화 */}
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

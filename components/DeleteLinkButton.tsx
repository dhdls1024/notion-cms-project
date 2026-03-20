"use client"

// 링크 삭제 버튼 — AlertDialog로 확인 후 DELETE API 호출
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteLink } from "@/hooks/useLinks"

interface DeleteLinkButtonProps {
  id: string
  title: string
  onSuccess?: () => void
}

export default function DeleteLinkButton({ id, title, onSuccess }: DeleteLinkButtonProps) {
  const mutation = useDeleteLink()

  return (
    <AlertDialog>
      {/* 삭제 아이콘 버튼 — destructive 색상으로 위험 동작임을 시각적으로 표시 */}
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="링크 삭제">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>링크 삭제</AlertDialogTitle>
          <AlertDialogDescription>
            {/* 삭제 대상 링크 제목을 표시하여 실수 방지 */}
            &ldquo;{title}&rdquo; 링크를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          {/* 확인 버튼 — mutation 진행 중 비활성화하여 중복 요청 방지 */}
          <AlertDialogAction
            onClick={() => mutation.mutate(id, { onSuccess: () => onSuccess?.() })}
            disabled={mutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

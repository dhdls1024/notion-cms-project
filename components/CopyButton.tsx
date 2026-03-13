"use client"

// CopyButton: URL 클립보드 복사 클라이언트 컴포넌트
// navigator.clipboard API + sonner toast 알림 + 복사 상태 아이콘 전환
import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  url: string
}

// 복사 성공 후 원래 아이콘으로 되돌아오는 시간 (ms)
const COPY_RESET_DELAY_MS = 2000

export default function CopyButton({ url }: CopyButtonProps) {
  // 복사 완료 상태 — true이면 Check 아이콘 표시
  const [copied, setCopied] = useState(false)

  async function handleCopy(e: React.MouseEvent) {
    // 카드 전체 클릭(외부 링크 열기) 이벤트 전파 차단
    e.preventDefault()
    e.stopPropagation()

    try {
      // navigator.clipboard.writeText: 클립보드에 URL 복사
      await navigator.clipboard.writeText(url)
      setCopied(true)
      // sonner toast.success: 복사 완료 알림 표시
      toast.success("링크가 복사되었습니다!")
      // COPY_RESET_DELAY_MS 후 아이콘 원복
      setTimeout(() => setCopied(false), COPY_RESET_DELAY_MS)
    } catch {
      toast.error("복사에 실패했습니다.")
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      aria-label="URL 복사"
      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
    >
      {/* 복사 상태에 따라 Copy → Check 아이콘 전환 */}
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}

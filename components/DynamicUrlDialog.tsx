"use client"

// DynamicUrlDialog: URL의 xxxxxx 자리표시자를 사용자 입력 숫자로 치환해 새 탭으로 여는 모달
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

// 자리표시자 전역 치환 패턴 (g 플래그 — 여러 개 있을 경우 모두 교체)
const PLACEHOLDER_REPLACE_PATTERN = /x{5,}/g

interface DynamicUrlDialogProps {
  url: string
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DynamicUrlDialog({
  url,
  title,
  open,
  onOpenChange,
}: DynamicUrlDialogProps) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 다이얼로그가 열릴 때마다 입력값 초기화
  useEffect(() => {
    if (open) {
      setValue("")
      setError(null)
      // 약간의 delay 후 focus (Dialog 애니메이션 완료 후)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  function handleConfirm() {
    const trimmed = value.trim()

    // 숫자만 허용
    if (!/^\d+$/.test(trimmed)) {
      setError("숫자만 입력하세요")
      return
    }

    // xxxxxx 부분을 입력한 숫자로 치환 후 새 탭 열기
    const resolvedUrl = url.replace(PLACEHOLDER_REPLACE_PATTERN, trimmed)
    window.open(resolvedUrl, "_blank", "noopener,noreferrer")
    onOpenChange(false)
  }

  // Enter 키로 제출 지원
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-xs break-all">
            {/* URL 미리보기 — 자리표시자 부분 강조 */}
            {url.replace(PLACEHOLDER_REPLACE_PATTERN, (match) => (
              `[${match}]`
            ))}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1">
          <Input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            placeholder="숫자를 입력하세요"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(null)
            }}
            onKeyDown={handleKeyDown}
            aria-label="URL에 삽입할 숫자"
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!value}>
            이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

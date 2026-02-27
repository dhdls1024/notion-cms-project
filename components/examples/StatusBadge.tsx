// cn() — clsx + tailwind-merge로 조건부 클래스 병합
import { cn } from "@/lib/utils"
// ClassNameProps — className?: string 타입 (types/index.ts 공유 타입)
import { ClassNameProps } from "@/types"

// 상태 타입 정의 — 매직 스트링 방지를 위해 union 타입으로 선언
type BadgeStatus = "success" | "warning" | "error" | "info" | "default"

interface StatusBadgeProps extends ClassNameProps {
  status: BadgeStatus
  label: string
}

// 상태별 스타일 맵 — 매직 스트링 없이 상수로 관리
// 다크모드 대응: CSS 변수 기반 Tailwind 클래스 사용
const STATUS_STYLES: Record<BadgeStatus, string> = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  default: "bg-muted text-muted-foreground",
}

// StatusBadge 컴포넌트 — 상태를 시각적으로 나타내는 배지
export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        // 기본 배지 스타일
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        // 상태별 색상 스타일 적용
        STATUS_STYLES[status],
        className
      )}
    >
      {label}
    </span>
  )
}

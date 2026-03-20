// LinkCard: 링크 카드 서버 컴포넌트
// shadcn Card 기반, 외부 링크 + CopyButton 포함
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import CopyButton from "@/components/CopyButton"
import LinkCardActions from "@/components/LinkCardActions"
import type { LinkItem } from "@/types"

interface LinkCardProps {
  link: LinkItem
}

export default function LinkCard({ link }: LinkCardProps) {
  const { title, url, category, memo } = link

  return (
    // 카드 전체가 외부 링크로 동작 — target="_blank" 새 탭 열기
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
      aria-label={`${title} 링크 열기`}
    >
      <Card
        className={cn(
          "py-4 transition-all duration-200",
          "hover:shadow-md hover:border-primary/30 group-focus-visible:border-primary/30"
        )}
      >
        <CardContent className="flex items-center gap-3 px-4">
          {/* 제목 + 카테고리(우측 배지) + 메모 영역 */}
          <div className="flex-1 min-w-0">
            {/* 제목 행: 이름 + 카테고리 배지 */}
            <div className="flex items-center gap-2 min-w-0">
              <p className="font-medium text-sm truncate">{title}</p>
              <span className="shrink-0 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {category}
              </span>
            </div>
            {/* 메모가 있을 때만 표시 */}
            {memo && (
              <p className="text-xs text-muted-foreground truncate mt-0.5">{memo}</p>
            )}
          </div>

          {/* 외부 링크 아이콘 */}
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* URL 복사 버튼 — 클라이언트 컴포넌트 */}
          <CopyButton url={url} />

          {/* 수정/삭제 액션 버튼 — 클라이언트 컴포넌트, 카드 링크 이벤트 차단 포함 */}
          <LinkCardActions link={link} />
        </CardContent>
      </Card>
    </a>
  )
}

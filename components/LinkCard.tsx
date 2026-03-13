// LinkCard: 링크 카드 서버 컴포넌트
// shadcn Card 기반, 아이콘 렌더링 + 외부 링크 + CopyButton 포함
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import CopyButton from "@/components/CopyButton"
import type { LinkItem } from "@/types"

interface LinkCardProps {
  link: LinkItem
}

/**
 * 아이콘 값이 URL인지 판별
 * http:// 또는 https:// 로 시작하면 이미지 URL로 처리
 */
function isImageUrl(icon: string): boolean {
  return icon.startsWith("http://") || icon.startsWith("https://")
}

export default function LinkCard({ link }: LinkCardProps) {
  const { title, url, icon, category } = link

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
          {/* 아이콘 영역: URL이면 next/image, 이모지면 span */}
          <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-muted text-xl">
            {isImageUrl(icon) ? (
              <Image
                src={icon}
                alt={`${title} 아이콘`}
                width={28}
                height={28}
                className="rounded-md object-contain"
              />
            ) : (
              <span role="img" aria-label={`${title} 아이콘`}>
                {icon}
              </span>
            )}
          </div>

          {/* 제목 + 카테고리 영역 */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{title}</p>
            <p className="text-xs text-muted-foreground truncate">{category}</p>
          </div>

          {/* 외부 링크 아이콘 */}
          <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* URL 복사 버튼 — 클라이언트 컴포넌트 */}
          <CopyButton url={url} />
        </CardContent>
      </Card>
    </a>
  )
}

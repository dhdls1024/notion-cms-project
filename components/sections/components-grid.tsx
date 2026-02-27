// 컴포넌트 카드 그리드 — COMPONENT_CARDS 상수를 기반으로 카드 목록을 렌더링하는 서버 컴포넌트
import Link from "next/link"
import { COMPONENT_CARDS } from "@/lib/constants"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export function ComponentsGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {COMPONENT_CARDS.map((card) => (
        <Card
          key={card.id}
          className="flex flex-col transition-shadow hover:shadow-md"
        >
          <CardHeader>
            {/* 카드 아이콘 + 제목 */}
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {card.icon}
              </span>
              <CardTitle className="text-lg">{card.title}</CardTitle>
            </div>
            <CardDescription>{card.description}</CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            {/* 태그 뱃지 */}
            <div className="flex flex-wrap gap-2">
              {card.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter>
            {/* 예제 페이지로 이동 버튼 */}
            <Button asChild className="w-full gap-2">
              <Link href={card.href}>
                예제 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

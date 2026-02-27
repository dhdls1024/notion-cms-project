// UI 컴포넌트 쇼케이스 페이지 — Button, Badge, Input, Card (서버 컴포넌트)
import type { Metadata } from "next"
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
  title: "UI 컴포넌트 | Next.js 스타터킷",
  description: "Button, Badge, Input, Card 등 기본 UI 컴포넌트 예제",
}

// Button variant 상수 (매직 스트링 방지)
const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const

// Badge variant 상수
const BADGE_VARIANTS = ["default", "secondary", "outline", "destructive"] as const

export default function UiComponentsPage() {
  return (
    <main>
      <PageHeader
        title="UI 컴포넌트"
        description="shadcn/ui 기반 검증된 기본 컴포넌트 모음입니다."
        tags={["UI/UX", "인터랙티브"]}
      />

      <section className="py-12">
        <Container>
          <div className="flex flex-col gap-12">
            {/* Button 쇼케이스 */}
            <Card>
              <CardHeader>
                <CardTitle>Button</CardTitle>
                <CardDescription>6가지 variant + asChild 다형성 지원</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {BUTTON_VARIANTS.map((variant) => (
                    <Button key={variant} variant={variant}>
                      {variant}
                    </Button>
                  ))}
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                </div>
              </CardContent>
            </Card>

            {/* Badge 쇼케이스 */}
            <Card>
              <CardHeader>
                <CardTitle>Badge</CardTitle>
                <CardDescription>상태 표시 및 레이블 컴포넌트</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {BADGE_VARIANTS.map((variant) => (
                    <Badge key={variant} variant={variant}>
                      {variant}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Input 쇼케이스 */}
            <Card>
              <CardHeader>
                <CardTitle>Input / Label</CardTitle>
                <CardDescription>폼 입력 + 접근성 레이블</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex max-w-sm flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input id="email" type="email" placeholder="hello@example.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="disabled">비활성화</Label>
                    <Input id="disabled" placeholder="비활성화 상태" disabled />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 쇼케이스 */}
            <div>
              <h2 className="mb-4 text-xl font-semibold">Card</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {["기본 카드", "정보 카드", "액션 카드"].map((title, index) => (
                  <Card key={title}>
                    <CardHeader>
                      <CardTitle className="text-base">{title}</CardTitle>
                      <CardDescription>카드 예시 {index + 1}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        CardHeader, CardContent, CardFooter로 구성된 유연한
                        컨테이너입니다.
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        자세히 보기
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

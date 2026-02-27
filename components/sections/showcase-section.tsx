// 쇼케이스 섹션: 설치된 UI 컴포넌트 예시 (서버 컴포넌트)
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
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"

// Button variant 상수 (매직 스트링 방지)
const BUTTON_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
] as const

// Badge variant 상수
const BADGE_VARIANTS = [
  "default",
  "secondary",
  "outline",
  "destructive",
] as const

export function ShowcaseSection() {
  return (
    <section id="showcase" className="py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-12">
          {/* 섹션 헤더 */}
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">UI 컴포넌트</h2>
            <p className="mt-2 text-muted-foreground">
              shadcn/ui 기반 검증된 컴포넌트 모음
            </p>
          </div>

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
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="disabled">비활성화</Label>
                  <Input id="disabled" placeholder="비활성화 상태" disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 쇼케이스 */}
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

          <Separator />
        </div>
      </Container>
    </section>
  )
}

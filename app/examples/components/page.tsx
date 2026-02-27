"use client"

// UI 컴포넌트 인터랙티브 데모 페이지 — 클라이언트 컴포넌트
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { DialogDemo } from "@/components/examples/dialog-demo"
import { OverlayDemo } from "@/components/examples/overlay-demo"
import { FeedbackDemo } from "@/components/examples/feedback-demo"
import { InputControlsDemo } from "@/components/examples/input-controls-demo"
import { NavigationDemo } from "@/components/examples/navigation-demo"

export default function ExamplesComponentsPage() {
  return (
    <main>
      <PageHeader
        title="컴포넌트 쇼케이스"
        description="shadcn/ui 핵심 컴포넌트를 직접 클릭하고 조작해보세요."
        tags={["UI/UX", "인터랙티브"]}
      />

      <section className="py-12">
        <Container>
          <div className="space-y-12">
            {/* Dialog / AlertDialog 섹션 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dialog & AlertDialog</h2>
              <p className="text-sm text-muted-foreground">
                모달 대화상자로 추가 정보 입력이나 작업 확인을 처리합니다.
              </p>
              <DialogDemo />
            </div>

            <Separator />

            {/* Overlay 섹션 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tooltip & Popover & DropdownMenu</h2>
              <p className="text-sm text-muted-foreground">
                오버레이 기반 UI 패턴으로 추가 정보와 메뉴를 표시합니다.
              </p>
              <OverlayDemo />
            </div>

            <Separator />

            {/* 입력 컨트롤 섹션 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Switch & Checkbox & RadioGroup & Select</h2>
              <p className="text-sm text-muted-foreground">
                다양한 입력 컨트롤 컴포넌트입니다.
              </p>
              <InputControlsDemo />
            </div>

            <Separator />

            {/* 피드백 섹션 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Alert & Toast & Progress & Skeleton</h2>
              <p className="text-sm text-muted-foreground">
                사용자에게 상태와 피드백을 전달하는 컴포넌트입니다.
              </p>
              <FeedbackDemo />
            </div>

            <Separator />

            {/* 네비게이션 섹션 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Tabs & Breadcrumb & Pagination</h2>
              <p className="text-sm text-muted-foreground">
                콘텐츠 구조와 페이지 탐색을 위한 네비게이션 컴포넌트입니다.
              </p>
              <NavigationDemo />
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

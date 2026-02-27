// Tabs / Breadcrumb / Pagination 네비게이션 컴포넌트 데모 (서버 컴포넌트)
import { ROUTES } from "@/lib/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export function NavigationDemo() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb — 현재 위치 경로 표시 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Breadcrumb</h3>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.home}>홈</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTES.components}>컴포넌트</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>네비게이션</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Tabs — 탭 전환 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Tabs</h3>
        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">개요</TabsTrigger>
            <TabsTrigger value="tab2">사용법</TabsTrigger>
            <TabsTrigger value="tab3">API</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" className="mt-4 text-sm text-muted-foreground">
            컴포넌트의 기본 개요와 목적을 설명하는 탭입니다.
          </TabsContent>
          <TabsContent value="tab2" className="mt-4 text-sm text-muted-foreground">
            컴포넌트를 사용하는 방법과 예제 코드가 표시됩니다.
          </TabsContent>
          <TabsContent value="tab3" className="mt-4 text-sm text-muted-foreground">
            Props, 메서드, 이벤트 등 API 문서가 표시됩니다.
          </TabsContent>
        </Tabs>
      </div>

      {/* Pagination — 페이지 번호 네비게이션 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Pagination</h3>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

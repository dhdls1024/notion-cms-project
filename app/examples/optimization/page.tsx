// 설정 및 최적화 예제 페이지 — next/image, generateMetadata, dynamic import (서버 컴포넌트)
import type { Metadata } from "next"
import Image from "next/image"
import { PageHeader } from "@/components/common/page-header"
import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DynamicCounterWrapper } from "./dynamic-counter-wrapper"

// next/image 예제용 이미지 URL (picsum.photos — seed로 동일 이미지 재현)
const IMAGE_URLS = {
  nextjsSample: "https://picsum.photos/seed/nextjs/300/200",
  optimizationSample: "https://picsum.photos/seed/optimization/400/225",
} as const

export const metadata: Metadata = {
  title: "설정 및 최적화 | Next.js 스타터킷",
  description: "next/image 최적화, generateMetadata SEO, dynamic import 코드 스플리팅 예제",
  openGraph: {
    title: "설정 및 최적화",
    description: "Next.js 성능 최적화 패턴 모음",
    type: "website",
  },
}

// 코드 블록 표시 컴포넌트
function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="space-y-2">
      {label && <Badge variant="outline" className="text-xs">{label}</Badge>}
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function OptimizationPage() {
  return (
    <main>
      <PageHeader
        title="설정 및 최적화"
        description="Next.js의 핵심 최적화 기능들을 코드 예제와 함께 확인하세요."
        tags={["최적화", "SEO"]}
      />

      <section className="py-12">
        <Container>
          <div className="space-y-16">
            {/* 1. next/image 최적화 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">next/image 최적화</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  자동 WebP 변환, lazy loading, blur placeholder를 제공합니다.
                </p>
              </div>

              <div className="flex flex-wrap gap-6">
                {/* 최적화된 이미지 예시 */}
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">width/height 명시</Badge>
                  <div className="overflow-hidden rounded-lg border">
                    <Image
                      src={IMAGE_URLS.nextjsSample}
                      alt="next/image 예제"
                      width={300}
                      height={200}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* fill + aspect-ratio 예시 */}
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">fill + aspect-ratio</Badge>
                  <div className="relative aspect-video w-72 overflow-hidden rounded-lg border">
                    <Image
                      src={IMAGE_URLS.optimizationSample}
                      alt="fill 예제"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              <CodeBlock
                label="기본 사용법"
                code={`import Image from "next/image"

// width/height 지정 — 레이아웃 시프트 방지
<Image
  src="/hero.jpg"
  alt="Hero 이미지"
  width={1200}
  height={600}
  priority  // LCP 이미지에 사용
/>

// fill 모드 — 부모 컨테이너에 맞게 채움
<div className="relative aspect-video">
  <Image src="/banner.jpg" alt="배너" fill className="object-cover" />
</div>`}
              />
            </div>

            <Separator />

            {/* 2. generateMetadata */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">generateMetadata (SEO)</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  동적 메타데이터로 페이지별 SEO와 Open Graph를 설정합니다.
                </p>
              </div>

              <CodeBlock
                label="정적 메타데이터"
                code={`import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "페이지 제목",
  description: "페이지 설명",
  openGraph: {
    title: "OG 제목",
    description: "OG 설명",
    images: [{ url: "/og-image.jpg" }],
  },
}`}
              />

              <CodeBlock
                label="동적 메타데이터 (params 기반)"
                code={`// app/posts/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await fetchPost(params.id)

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  }
}`}
              />
            </div>

            <Separator />

            {/* 3. Dynamic Import 코드 스플리팅 */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Dynamic Import (코드 스플리팅)</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  필요할 때만 컴포넌트를 로드해 초기 번들 크기를 줄입니다.
                </p>
              </div>

              {/* dynamic import로 로드된 클라이언트 컴포넌트 */}
              <div className="rounded-lg border p-4">
                <p className="mb-3 text-sm text-muted-foreground">
                  아래 카운터는 dynamic import로 지연 로드됩니다:
                </p>
                <DynamicCounterWrapper />
              </div>

              <CodeBlock
                label="dynamic import 패턴"
                code={`import dynamic from "next/dynamic"

// ssr: false — 서버에서 렌더링하지 않는 클라이언트 전용 컴포넌트
const HeavyChart = dynamic(() => import("./HeavyChart"), {
  ssr: false,
  loading: () => <Skeleton className="h-64 w-full" />,
})

// 조건부 로드 — 사용자 액션 후 로드
const Modal = dynamic(() => import("./Modal"))`}
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

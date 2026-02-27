// 네비게이션 메뉴 아이템 상수
export const NAV_ITEMS = [
  { label: "컴포넌트", href: "/components" },
  { label: "기술 스택", href: "#tech-stack" },
  { label: "GitHub", href: "https://github.com", external: true },
] as const

// 기술 스택 정보 상수
export const TECH_STACK = [
  {
    name: "Next.js",
    description: "React 풀스택 프레임워크",
    version: "16.x",
    href: "https://nextjs.org",
  },
  {
    name: "TypeScript",
    description: "정적 타입 언어",
    version: "5.x",
    href: "https://typescriptlang.org",
  },
  {
    name: "Tailwind CSS",
    description: "유틸리티 우선 CSS",
    version: "4.x",
    href: "https://tailwindcss.com",
  },
  {
    name: "shadcn/ui",
    description: "검증된 UI 컴포넌트",
    version: "3.x",
    href: "https://ui.shadcn.com",
  },
  {
    name: "next-themes",
    description: "SSR 안전 다크모드",
    version: "latest",
    href: "https://github.com/pacocoursey/next-themes",
  },
  {
    name: "react-hook-form",
    description: "고성능 폼 상태 관리",
    version: "latest",
    href: "https://react-hook-form.com",
  },
] as const

// 컴포넌트 카드 목록 상수 (ComponentCardItem[] 타입)
import type { ComponentCardItem } from "@/types"

export const COMPONENT_CARDS: ComponentCardItem[] = [
  {
    id: "ui-components",
    title: "UI 컴포넌트",
    description: "Button, Badge, Input, Card 등 기본 UI 컴포넌트를 확인하세요.",
    href: "/examples/ui-components",
    tags: ["UI/UX", "인터랙티브"],
    icon: "🎨",
  },
  {
    id: "components",
    title: "컴포넌트 쇼케이스",
    description: "Dialog, Tooltip, Switch 등 shadcn/ui 핵심 컴포넌트를 직접 조작해보세요.",
    href: "/examples/components",
    tags: ["UI/UX", "인터랙티브"],
    icon: "🧩",
  },
  {
    id: "forms",
    title: "폼 예제",
    description: "react-hook-form + zod로 구현한 로그인, 회원가입 폼과 실시간 검증을 확인하세요.",
    href: "/examples/forms",
    tags: ["검증", "상태관리"],
    icon: "📝",
  },
  {
    id: "layouts",
    title: "레이아웃 예제",
    description: "Grid, Sidebar, 카드 그리드 등 자주 쓰이는 반응형 레이아웃 패턴을 살펴보세요.",
    href: "/examples/layouts",
    tags: ["반응형", "레이아웃"],
    icon: "🏗️",
  },
  {
    id: "hooks",
    title: "usehooks-ts 예제",
    description: "useLocalStorage, useDebounce, useMediaQuery 등 유용한 커스텀 훅 데모입니다.",
    href: "/examples/hooks",
    tags: ["훅", "유틸리티"],
    icon: "🪝",
  },
  {
    id: "data-fetching",
    title: "데이터 페칭",
    description: "서버 컴포넌트 fetch와 클라이언트 Skeleton 로딩, 에러 처리 패턴을 확인하세요.",
    href: "/examples/data-fetching",
    tags: ["API", "비동기"],
    icon: "🌐",
  },
  {
    id: "optimization",
    title: "설정 및 최적화",
    description: "next/image 최적화, generateMetadata SEO, dynamic import 코드 스플리팅 예제입니다.",
    href: "/examples/optimization",
    tags: ["최적화", "SEO"],
    icon: "⚡",
  },
]

// 앱 내부 라우트 상수 — 하드코딩 방지
export const ROUTES = {
  home: "/",
  components: "/components",
  examples: {
    root: "/examples",
    components: "/examples/components",
    forms: "/examples/forms",
    layouts: "/examples/layouts",
    hooks: "/examples/hooks",
    dataFetching: "/examples/data-fetching",
    optimization: "/examples/optimization",
    uiComponents: "/examples/ui-components",
  },
} as const

// 예제용 외부 이미지 URL 상수
export const IMAGE_URLS = {
  nextjsSample: "https://picsum.photos/seed/nextjs/300/200",
  optimizationSample: "https://picsum.photos/seed/optimization/400/225",
} as const

// 사이트 메타데이터 상수
export const SITE_CONFIG = {
  name: "Next.js 스타터킷",
  description: "모던 웹 개발을 빠르게 시작하는 검증된 스타터킷",
  url: "https://example.com",
} as const

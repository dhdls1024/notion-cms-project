import type { NavItem } from "@/types"

// 네비게이션 메뉴 아이템 상수
// PRD 메뉴 구조: 헤더에 다크모드 토글만 존재, 별도 네비게이션 링크 없음
export const NAV_ITEMS: NavItem[] = []

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
    name: "@notionhq/client",
    description: "Notion 공식 Node.js SDK",
    version: "latest",
    href: "https://github.com/makenotion/notion-sdk-js",
  },
] as const

// 앱 내부 라우트 상수 — 하드코딩 방지
export const ROUTES = {
  home: "/",
} as const

// 사이트 메타데이터 상수
export const SITE_CONFIG = {
  name: "Notion CMS 링크 허브",
  description: "Notion 데이터베이스를 CMS로 활용한 개인 디지털 명함 사이트",
  url: "https://example.com",
} as const

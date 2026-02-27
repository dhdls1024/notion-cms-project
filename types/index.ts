// 네비게이션 아이템 타입
export interface NavItem {
  label: string
  href: string
  external?: boolean
}

// 기술 스택 아이템 타입
export interface TechStackItem {
  name: string
  description: string
  version: string
  href: string
}

// 테마 타입
export type Theme = "light" | "dark" | "system"

// 공통 컴포넌트 props 타입
export interface ClassNameProps {
  className?: string
}

export interface ChildrenProps {
  children: React.ReactNode
}

// 컴포넌트 카드 태그 타입
export type ComponentCardTag =
  | "UI/UX"
  | "인터랙티브"
  | "검증"
  | "상태관리"
  | "반응형"
  | "레이아웃"
  | "훅"
  | "유틸리티"
  | "API"
  | "비동기"
  | "최적화"
  | "SEO"

// 컴포넌트 카드 아이템 타입
export interface ComponentCardItem {
  id: string
  title: string
  description: string
  href: string
  tags: ComponentCardTag[]
  icon: string
}

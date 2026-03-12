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

// Notion 링크 아이템 타입 — Notion DB 속성을 앱에서 사용하는 형태로 정규화
export interface LinkItem {
  id: string // Notion 페이지 ID
  title: string // Name 속성
  url: string // URL 속성
  icon: string // Icon 속성 (이모지 또는 이미지 URL)
  category: string // Category 속성
  active: boolean // Active 속성
  order: number // Order 속성
}

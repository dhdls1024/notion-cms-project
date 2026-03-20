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
  category: string // Category 속성
  active: boolean // CheckBox 속성
  memo: string // Memo 속성 (메모/설명)
}

// 링크 생성 입력 타입 — id, active는 서버에서 자동 결정 (active 기본값 true)
export interface CreateLinkInput {
  title: string
  url: string
  category: string
  memo?: string
}

// 링크 수정 입력 타입 — 모든 필드 선택적 (부분 업데이트 허용)
export interface UpdateLinkInput {
  title?: string
  url?: string
  category?: string
  active?: boolean
  memo?: string
}

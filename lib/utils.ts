import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 동적 URL 자리표시자 감지 패턴 — x가 5개 이상 연속
const DYNAMIC_PLACEHOLDER_PATTERN = /x{5,}/

// hasDynamicPlaceholder: URL에 자리표시자(xxxxxx 등)가 포함되어 있는지 판별
// 예: "https://hiyobi.org/reader/xxxxxx" → true
export function hasDynamicPlaceholder(url: string): boolean {
  return DYNAMIC_PLACEHOLDER_PATTERN.test(url)
}

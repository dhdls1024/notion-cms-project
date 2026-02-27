# Critical Issues 해결 가이드

> PRD 검증 결과 발견된 3가지 Critical Issues를 해결하기 위한 실무 가이드입니다.
> 개발 시작 전 반드시 이 문서를 읽고 각 항목을 해결해주세요.

---

## 🔴 Issue #1: ISR (Incremental Static Regeneration) 설정 명시

### 문제 상황

PRD에서 "**별도의 배포 없이 Notion 수정만으로 실시간 업데이트**"라고 명시했으나, Next.js에서 이를 구현하는 정확한 방식이 불명확합니다.

### 핵심 개념

Next.js 16의 기본 동작:
- **정적 생성 (Static Generation)**: 빌드 시점에만 HTML 생성
- **동적 렌더링 (Dynamic Rendering)**: 요청마다 최신 데이터 조회

Notion 수정 후 즉시 반영하려면 **ISR (Incremental Static Regeneration)** 설정이 필수입니다.

### 해결책: ISR 설정 (권장)

#### 1단계: `app/page.tsx` 수정

```typescript
// app/page.tsx

import { notionClient } from '@/lib/notion'
import LinkHubClient from '@/components/LinkHubClient'

// ✅ ISR 설정: 3600초(1시간)마다 페이지 재생성
// - Notion 수정 후 최대 1시간 이내에 반영됨
// - 개인 링크 사이트 특성상 충분한 주기임
export const revalidate = 3600

// ✅ 타입 정의
interface LinkItem {
  id: string
  title: string
  url: string
  icon: string
  category: string
  active: boolean
}

// ✅ 서버 컴포넌트에서 Notion API 직접 호출
export default async function HomePage() {
  try {
    // Notion DB 조회
    const response = await notionClient.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        property: 'Active',
        checkbox: { equals: true },
      },
      sorts: [
        { property: 'Order', direction: 'ascending' },
      ],
    })

    // 데이터 변환
    const links: LinkItem[] = response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Title.title[0]?.text.content || 'Untitled',
      url: page.properties.URL.url || '#',
      icon: normalizeIcon(page.properties.Icon),
      category: page.properties.Category.select?.name || 'Other',
      active: page.properties.Active.checkbox,
    }))

    return <LinkHubClient links={links} />
  } catch (error) {
    console.error('Failed to fetch links:', error)
    return <ErrorFallback />
  }
}

// ✅ Icon 정규화 함수 (Text/Files 둘 다 지원)
function normalizeIcon(iconData: any): string {
  // Files & media 경우: URL 추출
  if (Array.isArray(iconData?.files) && iconData.files.length > 0) {
    return iconData.files[0]?.file?.url || '🔗'
  }
  // Text 경우: 이모지 반환
  return iconData?.rich_text?.[0]?.text?.content || '🔗'
}

// ✅ 에러 Fallback UI
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">링크를 불러올 수 없습니다</h2>
        <p className="text-gray-500">
          Notion 연결 상태를 확인해주세요
        </p>
        <p className="text-sm text-gray-400">
          .env.local에 NOTION_API_KEY와 NOTION_DATABASE_ID가 올바르게 설정되어 있는지 확인하세요
        </p>
      </div>
    </div>
  )
}
```

#### 2단계: 갱신 주기 선택

| 갱신 주기 | 코드 | 사용 시나리오 |
|---------|------|-------------|
| **1시간** | `revalidate = 3600` | ✅ 권장 (개인 링크 사이트) |
| **30분** | `revalidate = 1800` | 자주 업데이트하는 경우 |
| **1일** | `revalidate = 86400` | 가끔 업데이트하는 경우 |
| **매번 요청** | `revalidate = 0` | 완전 동적 (느림) |

### 대안: On-Demand ISR (Webhook 활용)

더 정교한 구현을 원한다면 Notion webhook으로 즉시 갱신 가능합니다.

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Notion webhook에서 호출될 엔드포인트
export async function POST(request: NextRequest) {
  // ✅ 보안: webhook 토큰 검증
  const token = request.headers.get('x-revalidate-token')
  if (token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // ✅ 홈페이지만 재생성
    revalidatePath('/')
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}
```

**주의**: Notion Integration이 webhook을 공식 지원하지 않으므로, 외부 자동화 도구(IFTTT, Zapier) 필요.

### 권장 선택

**개발 초기**: `revalidate = 3600` (1시간)
- 설정 간단
- 대부분의 사용 시나리오에 충분
- 개인 사이트이므로 1시간 지연도 무방

**추후 고도화**: On-Demand ISR
- Notion 수정 즉시 반영 필요한 경우만 적용
- 복잡도가 높으므로 필요할 때 추가

---

## 🔴 Issue #2: Icon 속성 처리 방식

### 문제 상황

Notion DB에서 Icon을 여러 방식으로 저장 가능합니다:
1. **Text** (권장): 이모지 입력 (예: 🔗, 💼, 📱)
2. **Files & media**: 이미지 파일 업로드
3. **Rich text**: 텍스트 설명

앱에서 모든 경우를 처리해야 하는데, 사용자 가이드가 명확하지 않습니다.

### 해결책: 사용자 가이드 명시

#### 1단계: Notion 설정 가이드

사용자가 Notion DB를 설정할 때 다음을 안내하세요:

**✅ 권장: Icon은 "Text" 타입으로 설정**

```markdown
### Notion 데이터베이스 설정 방법

#### 1. "Links" 데이터베이스에서 "Icon" 속성 추가

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | Text | 링크 제목 |
| URL | URL | 링크 주소 |
| **Icon** | **Text** | **이모지 입력 (예: 🔗)** |
| Category | Select | 카테고리 (개발, SNS, 포트폴리오 등) |
| Active | Checkbox | 활성화 여부 |
| Order | Number | 표시 순서 |

#### 2. Icon 입력 방법

각 링크의 Icon 속성에 **이모지만 입력**하세요:

예시:
- GitHub: 🔗
- LinkedIn: 💼
- Twitter: 🐦
- Portfolio: 🎨
- Blog: 📝
- Email: 📧

#### 3. 이모지 찾기

- 구글 검색: "github emoji"
- 이모지피디아: https://emojipedia.org/
- Mac: Cmd + Ctrl + Space
- Windows: Win + ;
```

#### 2단계: 코드에서 Icon 정규화

```typescript
// lib/notion.ts

/**
 * Notion Icon 속성을 정규화하는 함수
 * Text (이모지) 또는 Files (이미지)를 모두 지원합니다.
 */
export function normalizeIcon(iconProperty: any): string {
  // ✅ Case 1: Rich Text (Text 타입)
  if (iconProperty?.rich_text && iconProperty.rich_text.length > 0) {
    const text = iconProperty.rich_text[0]?.text?.content || ''
    // 이모지만 유효함 (1-2자 유니코드)
    if (text.length > 0) return text
  }

  // ✅ Case 2: Files & Media (이미지 URL)
  if (iconProperty?.files && iconProperty.files.length > 0) {
    const file = iconProperty.files[0]
    const url = file?.file?.url || file?.external?.url
    if (url) return url
  }

  // ✅ Fallback: 기본 이모지
  return '🔗'
}

/**
 * 링크 데이터를 TypeScript 타입으로 변환
 */
export interface LinkItem {
  id: string
  title: string
  url: string
  icon: string // 이모지 또는 이미지 URL
  category: string
  active: boolean
  order: number
}

export async function fetchAllLinks(): Promise<LinkItem[]> {
  const response = await notionClient.databases.query({
    database_id: process.env.NOTION_DATABASE_ID!,
    filter: {
      property: 'Active',
      checkbox: { equals: true },
    },
    sorts: [
      { property: 'Order', direction: 'ascending' },
    ],
    page_size: 100, // Pagination 지원
  })

  return response.results.map((page: any) => ({
    id: page.id,
    title: page.properties.Title?.title?.[0]?.text?.content || 'Untitled',
    url: page.properties.URL?.url || '#',
    icon: normalizeIcon(page.properties.Icon), // ✅ 정규화
    category: page.properties.Category?.select?.name || 'Other',
    active: page.properties.Active?.checkbox || false,
    order: page.properties.Order?.number || 999,
  }))
}
```

#### 3단계: UI에서 Icon 렌더링

```typescript
// components/LinkCard.tsx

import Image from 'next/image'

interface LinkCardProps {
  icon: string
  title: string
  url: string
}

export default function LinkCard({ icon, title, url }: LinkCardProps) {
  // ✅ 이모지인지 URL인지 자동 판별
  const isImageUrl = icon.startsWith('http')

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      {/* ✅ 이모지 */}
      {!isImageUrl && (
        <span className="text-2xl shrink-0">{icon}</span>
      )}

      {/* ✅ 이미지 URL */}
      {isImageUrl && (
        <Image
          src={icon}
          alt={title}
          width={24}
          height={24}
          className="shrink-0"
        />
      )}

      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
      </div>
    </a>
  )
}
```

### 권장 방식 정리

| 방식 | 설정 난이도 | 구현 난이도 | 결과 품질 | 추천 |
|------|-----------|----------|---------|------|
| **Text (이모지)** | 매우 쉬움 | 쉬움 | 좋음 | ✅ 권장 |
| **Files (이미지)** | 어려움 | 중간 | 매우 좋음 | 선택사항 |

### 최종 권장

1. **초기 설정**: 사용자에게 "Icon은 이모지 입력"으로 안내
2. **코드**: 이모지와 이미지 URL 모두 처리
3. **확장**: 필요하면 나중에 Figma 아이콘 라이브러리 연동

---

## 🔴 Issue #3: Notion API Rate Limit 문서화

### 문제 상황

Notion API 공식 문서에는 **rate limit이 명시되어 있지 않습니다**. 대규모 배포 시 예상치 못한 문제가 발생할 수 있습니다.

### 현황 분석

**Notion API Rate Limit:**
- **공식 명시**: ❌ 없음
- **실제 제한**: ⚠️ 존재하지만 명확하지 않음
- **개인 사용**: ✅ 거의 문제 없음
- **대규모 배포**: ⚠️ 발생 가능

### 해결책: 문서화 및 모니터링

#### 1단계: README에 Rate Limit 정보 추가

`README.md`의 "주의사항" 섹션에 다음 추가:

```markdown
## ⚠️ 주의사항

### Notion API Rate Limit

**현황:**
- Notion API 공식 문서에는 rate limit이 명시되지 않음
- 개인/소규모 사용자: 거의 제약 없음
- 대규모 배포 (많은 동시 방문자): 제한 발생 가능

**개인 사이트 범위에서:**
- ✅ 하루에 수천 번 접속 가능
- ✅ 현재 설정 (ISR 3600초)에서 문제 없음
- ✅ 일반적인 사용 시나리오에 충분함

**대규모 배포 시 (예: 회사 링크 허브):**
- ⚠️ 높은 트래픽에서 API 호출 제한 가능
- 📞 Notion 지원팀에 문의 필요
- 💡 캐싱 전략 (Redis, CDN) 고려

### 더 자세히

- 공식 Notion API 문서: https://developers.notion.com/reference
- 커뮤니티 보고: https://github.com/makenotion/notion-sdk-js/discussions
```

#### 2단계: 에러 처리 강화

Rate limit 발생 시 대응 코드 추가:

```typescript
// lib/notion.ts

import { Client, APIErrorCode, isNotionClientError } from '@notionhq/client'

const notionClient = new Client({
  auth: process.env.NOTION_API_KEY,
})

/**
 * Rate limit 대응 로직을 포함한 Notion API 호출
 */
export async function fetchAllLinks(retries = 3): Promise<LinkItem[]> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await notionClient.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        // ... 쿼리 옵션
      })

      return response.results.map(normalizeLinkData)
    } catch (error) {
      // ✅ Rate limit 감지
      if (isNotionClientError(error)) {
        if (error.code === APIErrorCode.RateLimited) {
          // ❌ Rate limit 초과
          if (attempt < retries - 1) {
            // 재시도: 지수 백오프 (1초, 2초, 4초...)
            const delay = Math.pow(2, attempt) * 1000
            console.warn(`Rate limit exceeded, retrying after ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          } else {
            console.error('Rate limit exceeded after retries')
            throw new Error('Notion API Rate limit exceeded')
          }
        }

        // ✅ 권한 오류
        if (error.code === APIErrorCode.Unauthorized) {
          console.error('Invalid Notion API key or insufficient permissions')
          throw new Error('Notion API authentication failed')
        }

        // ✅ DB 없음
        if (error.code === APIErrorCode.ObjectNotFound) {
          console.error('Notion database not found')
          throw new Error('NOTION_DATABASE_ID is invalid')
        }
      }

      throw error
    }
  }

  throw new Error('Failed to fetch links after retries')
}

/**
 * Rate limit 정보 로깅 (선택사항)
 */
export function logRateLimitInfo(response: any) {
  const remaining = response.headers?.['x-notion-request-limit-remaining']
  if (remaining) {
    console.log(`Notion API requests remaining: ${remaining}`)
  }
}
```

#### 3단계: 모니터링 (선택사항)

장기적으로 높은 트래픽을 예상한다면:

```typescript
// lib/monitoring.ts

/**
 * Notion API 호출 통계 추적
 */
class NotionAPIMonitor {
  private calls: Array<{ timestamp: number; success: boolean }> = []

  recordCall(success: boolean) {
    this.calls.push({ timestamp: Date.now(), success: !success })

    // 1시간 이상 된 기록 삭제
    const oneHourAgo = Date.now() - 3600000
    this.calls = this.calls.filter(c => c.timestamp > oneHourAgo)
  }

  getStats() {
    const total = this.calls.length
    const failed = this.calls.filter(c => c.success).length
    const failureRate = total > 0 ? (failed / total) * 100 : 0

    return {
      totalCalls: total,
      failedCalls: failed,
      failureRate: failureRate.toFixed(2) + '%',
      period: '1 hour',
    }
  }
}

export const notionMonitor = new NotionAPIMonitor()
```

#### 4단계: 문제 해결 가이드

사용자가 rate limit 오류를 만났을 때:

```markdown
## 🔧 Rate Limit 오류 해결

### 증상
```
Error: Notion API Rate limit exceeded
```

### 원인
- Notion API에 너무 많은 요청 발생
- ISR 갱신 주기가 너무 짧음
- 대규모 트래픽으로 인한 동시 요청

### 해결 방법

#### 1️⃣ ISR 갱신 주기 조정
```typescript
// app/page.tsx
export const revalidate = 7200 // 3600 → 7200 (2시간으로 증가)
```

#### 2️⃣ 캐싱 강화
```typescript
// lib/notion.ts
const CACHE_DURATION = 3600 // 1시간 캐시
const cachedLinks = new Map<string, { data: any; timestamp: number }>()

export async function fetchAllLinks() {
  const cacheKey = 'all_links'
  const cached = cachedLinks.get(cacheKey)

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION * 1000) {
    return cached.data
  }

  // API 호출
  const data = await notionClient.databases.query({ /* ... */ })
  cachedLinks.set(cacheKey, { data, timestamp: Date.now() })
  return data
}
```

#### 3️⃣ Notion 지원팀 문의
- 이메일: support@notion.so
- 내용: API rate limit 제한 상황 설명
- 첨부: 오류 메시지, 트래픽 패턴 통계

### 예방

- ✅ ISR 갱신 주기: 3600초 이상 권장
- ✅ 캐싱 전략: 서버 사이드 캐싱 적용
- ✅ CDN: Vercel의 Edge Caching 활용
```

---

## 📋 구현 체크리스트

개발 시작 전 다음 항목들을 모두 완료하세요:

### Issue #1: ISR 설정

- [ ] `app/page.tsx`에 `export const revalidate = 3600` 추가
- [ ] 서버 컴포넌트에서 Notion API 호출 구현
- [ ] ErrorFallback UI 추가
- [ ] README에 "Notion 수정 후 최대 1시간 내 반영됨" 명시

### Issue #2: Icon 처리

- [ ] Notion 설정 가이드 문서화
- [ ] `lib/notion.ts`에 `normalizeIcon()` 함수 구현
- [ ] `components/LinkCard.tsx`에서 이모지/URL 자동 판별
- [ ] README에 "Icon은 이모지 권장" 안내

### Issue #3: Rate Limit

- [ ] README의 "주의사항" 섹션에 Rate Limit 정보 추가
- [ ] `lib/notion.ts`에 에러 처리 로직 강화 (선택사항)
- [ ] 재시도 로직 구현 (선택사항)

---

## 🎯 다음 단계

이 문서의 모든 항목을 완료하면:

1. ✅ **기술적 명확성** 확보
2. ✅ **사용자 안내** 완성
3. ✅ **에러 처리** 강화
4. ✅ **개발 시작** 가능

**예상 소요 시간**: 1-2시간 (구현 제외)

이제 `docs/PRD.md`와 함께 이 가이드를 참고하여 개발을 진행하세요! 🚀

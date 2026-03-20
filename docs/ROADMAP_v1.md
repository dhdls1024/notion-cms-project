# Notion CMS 링크 허브 개발 로드맵 v1

Notion 데이터베이스를 CMS로 활용하여 코드 배포 없이 링크 페이지를 실시간 관리하는 개인 디지털 명함 사이트 — CRUD 기능 확장판

## 개요

기존 Read 전용 서비스에 Create / Update / Delete 기능을 추가하여, 웹 UI에서 직접 Notion DB의 링크를 생성·수정·삭제할 수 있는 완전한 CRUD 관리 기능을 제공합니다.

- **Create (F006)**: 새 링크 폼 입력 → Notion DB에 페이지 자동 추가
- **Update (F007)**: 링크 카드 수정 버튼 → 인라인 수정 폼 → Notion DB 업데이트
- **Delete (F008)**: 링크 카드 삭제 버튼 → 확인 다이얼로그 → Notion DB 페이지 아카이브

---

## 현재 구현 상태 (Phase 1~4 완료)

| 파일 | 역할 | 상태 |
|------|------|------|
| `lib/notion.ts` | Notion API 레이어 (`fetchAllLinks`) | ✅ 완료 |
| `components/LinkCard.tsx` | 링크 카드 서버 컴포넌트 | ✅ 완료 |
| `components/CopyButton.tsx` | URL 복사 클라이언트 컴포넌트 | ✅ 완료 |
| `components/LinkHubClient.tsx` | 카테고리 탭 필터 클라이언트 컴포넌트 | ✅ 완료 |
| `app/page.tsx` | ISR 서버 컴포넌트 (`revalidate = 3600`) | ✅ 완료 |
| `types/index.ts` | LinkItem 타입 정의 | ✅ 완료 |

---

## 개발 워크플로우

1. **작업 계획**

   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP_v1.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `010-notion-crud-api.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   - 완료된 작업 파일을 예시로 참조하되, 새 작업은 빈 체크박스와 변경 사항 요약 없이 초기 상태로 작성

3. **작업 구현**

   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

   - 로드맵에서 완료된 작업을 ✅로 표시
   - 상태 아이콘: ✅ 완료 / 🚧 진행중 / ⬜ 미시작

---

## 개발 단계

### Phase 5: CRUD 기능 구현

> 목표: Notion API CRUD 레이어 → Route Handler → UI 컴포넌트 → 클라이언트 상태 관리 순서로 단계별 구현.
> 각 Task는 이전 Task의 결과물에 의존하므로 순서대로 진행한다.

---

#### ✅ Task-010: Notion API CRUD 레이어 구현 — 우선순위

> `lib/notion.ts`에 생성·수정·삭제 함수를 추가한다. 기존 `fetchAllLinks` 코드는 변경하지 않는다.

**관련 파일**

| 파일 | 변경 유형 |
|------|----------|
| `lib/notion.ts` | 수정 (함수 추가) |
| `types/index.ts` | 수정 (입력 타입 추가) |

**추가할 타입 (`types/index.ts`)**

```ts
// 링크 생성 입력 타입 — id, active, order는 서버에서 자동 결정
export interface CreateLinkInput {
  title: string
  url: string
  icon: string
  category: string
  order: number
}

// 링크 수정 입력 타입 — 모든 필드 선택적 (부분 업데이트 허용)
export interface UpdateLinkInput {
  title?: string
  url?: string
  icon?: string
  category?: string
  active?: boolean
  order?: number
}
```

**구현 단계**

- [ ] `types/index.ts`에 `CreateLinkInput`, `UpdateLinkInput` 타입 추가
- [ ] `lib/notion.ts`에 `createLink(input: CreateLinkInput): Promise<LinkItem>` 구현
  - `notion.pages.create`로 Notion DB에 새 페이지 추가
  - `Name`(title), `URL`(url), `Icon`(rich_text), `Category`(select), `Order`(number), `CheckBox`(checkbox, 기본값 `true`) 속성 설정
  - 생성된 페이지를 `LinkItem`으로 정규화하여 반환
- [ ] `lib/notion.ts`에 `updateLink(id: string, input: UpdateLinkInput): Promise<LinkItem>` 구현
  - `notion.pages.update`로 해당 페이지 ID의 속성 업데이트
  - 전달된 필드만 업데이트 (undefined 필드는 생략)
  - 업데이트된 페이지를 `LinkItem`으로 정규화하여 반환
- [ ] `lib/notion.ts`에 `deleteLink(id: string): Promise<void>` 구현
  - `notion.pages.update`로 `archived: true` 설정 (Notion은 페이지 삭제 대신 아카이브 처리)
  - 성공 시 void 반환, 실패 시 에러 throw
- [ ] 세 함수 모두 기존 `fetchWithRetry` 래퍼 적용 (Rate Limit 보호)
- [ ] `npm run build`로 타입 에러 없음 확인

**수락 기준**

- `createLink` 호출 후 Notion DB에 신규 페이지가 생성되어야 한다
- `updateLink` 호출 후 해당 페이지 속성이 변경되어야 한다
- `deleteLink` 호출 후 해당 페이지가 아카이브(숨김) 처리되어야 한다
- 세 함수 모두 Rate Limit 시 지수 백오프 재시도가 동작해야 한다
- TypeScript 컴파일 오류가 없어야 한다

**테스트 체크리스트** (Playwright MCP)

- [ ] `createLink` 실행 후 Notion 웹에서 새 항목이 추가되었는지 확인
- [ ] `updateLink` 실행 후 Notion 웹에서 해당 항목의 속성이 변경되었는지 확인
- [ ] `deleteLink` 실행 후 Notion 웹에서 해당 항목이 아카이브되었는지 확인

---

#### ✅ Task-011: Next.js Route Handler 구현

> Next.js App Router의 Route Handler로 CRUD API 엔드포인트를 구현한다.
> 클라이언트 컴포넌트가 직접 Notion SDK를 호출하지 않도록 서버 측 엔드포인트로 분리한다.

**관련 파일**

| 파일 | 변경 유형 |
|------|----------|
| `app/api/links/route.ts` | 신규 생성 |
| `app/api/links/[id]/route.ts` | 신규 생성 |

**API 엔드포인트 설계**

| 메서드 | 경로 | 기능 | 요청 바디 | 응답 |
|--------|------|------|----------|------|
| `POST` | `/api/links` | 링크 생성 | `CreateLinkInput` | `{ data: LinkItem }` |
| `PATCH` | `/api/links/[id]` | 링크 수정 | `UpdateLinkInput` | `{ data: LinkItem }` |
| `DELETE` | `/api/links/[id]` | 링크 삭제 | 없음 | `{ success: true }` |

**구현 단계**

- [ ] `app/api/links/route.ts` 신규 생성
  - `POST` 핸들러: `request.json()`으로 바디 파싱 → zod로 `CreateLinkInput` 유효성 검사 → `createLink()` 호출 → `NextResponse.json({ data: link }, { status: 201 })` 반환
  - 유효성 검사 실패 시 `400 Bad Request` + 에러 메시지 반환
  - Notion API 오류 시 `500 Internal Server Error` 반환
- [ ] `app/api/links/[id]/route.ts` 신규 생성
  - `PATCH` 핸들러: 바디 파싱 → zod로 `UpdateLinkInput` 유효성 검사 → `updateLink(id, input)` 호출 → `NextResponse.json({ data: link })` 반환
  - `DELETE` 핸들러: `deleteLink(id)` 호출 → `NextResponse.json({ success: true })` 반환
  - 각 핸들러에서 `try-catch`로 Notion API 오류 처리
- [ ] `lib/validations.ts` 신규 생성 — zod 스키마 정의
  - `createLinkSchema`: title(최소 1자), url(URL 형식), icon(선택, 기본값 '🔗'), category(최소 1자), order(정수, 기본값 0)
  - `updateLinkSchema`: 모든 필드 `.optional()`로 감싼 부분 업데이트 스키마
- [ ] `npm run build`로 빌드 성공 확인

**수락 기준**

- `POST /api/links` 요청 시 Notion DB에 새 링크가 생성되고 `201` 응답을 반환해야 한다
- `PATCH /api/links/[id]` 요청 시 해당 링크가 수정되고 `200` 응답을 반환해야 한다
- `DELETE /api/links/[id]` 요청 시 해당 링크가 삭제되고 `200` 응답을 반환해야 한다
- 잘못된 요청 바디에 대해 `400` 응답을 반환해야 한다
- 존재하지 않는 ID에 대해 Notion SDK 오류를 `500`으로 전달해야 한다

**테스트 체크리스트** (Playwright MCP)

- [ ] `POST /api/links`에 올바른 바디 전송 후 `201` 응답과 `LinkItem` 데이터 확인
- [ ] `PATCH /api/links/[id]`에 title 변경 바디 전송 후 `200` 응답과 변경된 데이터 확인
- [ ] `DELETE /api/links/[id]` 요청 후 `200` 응답과 `{ success: true }` 확인
- [ ] 잘못된 URL 형식으로 `POST` 요청 시 `400` 응답 확인
- [ ] 빈 바디로 `POST` 요청 시 `400` 응답과 유효성 에러 메시지 확인

---

#### ✅ Task-012: AddLinkDialog 컴포넌트 구현 (Create UI)

> 새 링크를 추가하는 모달 다이얼로그 컴포넌트를 구현한다.
> shadcn Dialog + react-hook-form + zod로 폼 검증을 처리한다.

**관련 파일**

| 파일 | 변경 유형 |
|------|----------|
| `components/AddLinkDialog.tsx` | 신규 생성 |
| `components/LinkHubClient.tsx` | 수정 (AddLinkDialog 추가 버튼 삽입) |

**구현 단계**

- [ ] `components/AddLinkDialog.tsx` 신규 생성 (`"use client"` 지시어)
  - shadcn `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` 사용
  - `react-hook-form`의 `useForm`으로 폼 상태 관리
  - zod `createLinkSchema` (`lib/validations.ts`) 연결 (`zodResolver` 사용)
  - 폼 필드 구성:
    - `title`: `Input` (필수, 링크 제목)
    - `url`: `Input` (필수, https:// 형식 검증)
    - `icon`: `Input` (선택, 이모지 또는 이미지 URL, placeholder: '🔗')
    - `category`: `Input` (필수, 카테고리명)
    - `order`: `Input` (숫자, 기본값 0, 표시 순서)
  - `handleSubmit`: `POST /api/links` 호출 → 성공 시 `toast.success` + 다이얼로그 닫기 + `onSuccess` 콜백 호출
  - 실패 시 `toast.error` 알림 표시
  - 제출 중 버튼 비활성화 + 로딩 스피너 표시
  - `onSuccess?: () => void` props로 부모에게 갱신 신호 전달
- [ ] `components/LinkHubClient.tsx`에 "링크 추가" 버튼(AddLinkDialog 트리거) 삽입
  - 카테고리 탭 상단 우측에 `AddLinkDialog` 컴포넌트 배치
  - `onSuccess` 콜백에서 `router.refresh()` 호출하여 서버 컴포넌트 데이터 갱신

**수락 기준**

- "링크 추가" 버튼 클릭 시 다이얼로그가 열려야 한다
- 필수 필드 미입력 시 인라인 에러 메시지가 표시되어야 한다
- 올바른 데이터 입력 후 제출 시 Notion DB에 링크가 추가되어야 한다
- 제출 성공 후 `toast.success` 알림과 함께 다이얼로그가 닫혀야 한다
- 제출 성공 후 링크 목록이 새 항목을 포함하여 갱신되어야 한다
- 잘못된 URL 입력 시 필드 아래 에러 메시지가 표시되어야 한다

**테스트 체크리스트** (Playwright MCP)

- [ ] "링크 추가" 버튼 클릭 시 다이얼로그 열림 확인
- [ ] 필수 필드 빈 채로 제출 시 각 필드 에러 메시지 표시 확인
- [ ] 잘못된 URL 형식 입력 시 URL 필드 에러 메시지 확인
- [ ] 올바른 데이터 입력 후 제출 시 `toast.success` 알림 표시 확인
- [ ] 제출 완료 후 다이얼로그가 닫히고 링크 목록에 새 항목 표시 확인
- [ ] 제출 중 버튼 비활성화 상태 확인

---

#### ✅ Task-013: EditLinkDialog 및 삭제 확인 다이얼로그 구현 (Update / Delete UI)

> 링크 카드에 수정·삭제 버튼을 추가하고, 각각 EditLinkDialog와 삭제 확인 AlertDialog를 구현한다.
> LinkCard는 서버 컴포넌트이므로, 수정/삭제 버튼은 별도 클라이언트 컴포넌트로 분리한다.

**관련 파일**

| 파일 | 변경 유형 |
|------|----------|
| `components/EditLinkDialog.tsx` | 신규 생성 |
| `components/DeleteLinkButton.tsx` | 신규 생성 |
| `components/LinkCardActions.tsx` | 신규 생성 |
| `components/LinkCard.tsx` | 수정 (LinkCardActions 추가) |

**구현 단계**

- [ ] `components/EditLinkDialog.tsx` 신규 생성 (`"use client"` 지시어)
  - shadcn `Dialog` 기반 수정 폼 컴포넌트
  - `link: LinkItem` props로 기존 데이터를 폼 기본값으로 설정 (`defaultValues`)
  - `react-hook-form` + zod `updateLinkSchema` 연결
  - 폼 필드: `title`, `url`, `icon`, `category`, `active`(Switch 컴포넌트), `order`
  - `handleSubmit`: `PATCH /api/links/[id]` 호출 → 성공 시 `toast.success` + 다이얼로그 닫기 + `onSuccess` 콜백 호출
  - 실패 시 `toast.error` 알림 표시
  - 제출 중 버튼 비활성화 + 로딩 스피너 표시
- [ ] `components/DeleteLinkButton.tsx` 신규 생성 (`"use client"` 지시어)
  - shadcn `AlertDialog`로 삭제 확인 다이얼로그 구현
  - "정말 삭제하시겠습니까?" 확인 메시지 표시
  - 확인 클릭 시 `DELETE /api/links/[id]` 호출 → 성공 시 `toast.success` + `onSuccess` 콜백 호출
  - 취소 클릭 시 다이얼로그 닫기
  - 삭제 중 버튼 비활성화 처리
- [ ] `components/LinkCardActions.tsx` 신규 생성 (`"use client"` 지시어)
  - `link: LinkItem`, `onSuccess?: () => void` props 수신
  - `EditLinkDialog`와 `DeleteLinkButton`을 하나의 액션 영역으로 묶음
  - 수정/삭제 버튼을 아이콘 버튼(Pencil, Trash2 아이콘)으로 표시
  - 카드 호버 시에만 버튼이 보이도록 처리 (CSS visibility 또는 opacity 전환)
- [ ] `components/LinkCard.tsx` 수정
  - `LinkCardActions` 클라이언트 컴포넌트를 카드 우측 하단 또는 호버 영역에 배치
  - 카드 전체 링크 클릭과 수정/삭제 버튼 클릭이 충돌하지 않도록 이벤트 전파 차단 확인

**수락 기준**

- 링크 카드에 수정(연필) 및 삭제(휴지통) 아이콘 버튼이 표시되어야 한다
- 수정 버튼 클릭 시 기존 데이터가 채워진 EditLinkDialog가 열려야 한다
- 수정 폼 제출 후 Notion DB의 해당 항목이 변경되어야 한다
- 삭제 버튼 클릭 시 AlertDialog 확인 메시지가 표시되어야 한다
- 삭제 확인 후 해당 링크가 목록에서 제거되고 Notion DB에서 아카이브되어야 한다
- 수정/삭제 버튼 클릭 시 카드의 외부 링크 이동이 발생하지 않아야 한다

**테스트 체크리스트** (Playwright MCP)

- [ ] 링크 카드 호버 시 수정/삭제 버튼 표시 확인
- [ ] 수정 버튼 클릭 시 기존 데이터가 채워진 EditLinkDialog 열림 확인
- [ ] EditLinkDialog에서 title 변경 후 제출 시 `toast.success` 알림 확인
- [ ] 제출 완료 후 링크 목록의 해당 카드 제목이 변경되었는지 확인
- [ ] 삭제 버튼 클릭 시 AlertDialog 확인 메시지 표시 확인
- [ ] AlertDialog 취소 클릭 시 목록 유지 확인
- [ ] AlertDialog 확인 클릭 시 `toast.success` 알림 및 목록에서 항목 제거 확인
- [ ] 수정/삭제 버튼 클릭 시 카드의 외부 링크로 이동하지 않는지 확인

---

#### ✅ Task-014: 클라이언트 상태 관리 — TanStack Query mutation + ISR revalidate 연동

> TanStack Query의 `useMutation`으로 CRUD 상태를 관리하고,
> Next.js의 `router.refresh()`와 `revalidatePath` API를 연동하여 ISR 캐시를 즉시 갱신한다.

**관련 파일**

| 파일 | 변경 유형 |
|------|----------|
| `hooks/useLinks.ts` | 신규 생성 |
| `app/api/revalidate/route.ts` | 신규 생성 |
| `components/LinkHubClient.tsx` | 수정 (useLinks 훅 연동) |
| `components/AddLinkDialog.tsx` | 수정 (useMutation 연동) |
| `components/EditLinkDialog.tsx` | 수정 (useMutation 연동) |
| `components/DeleteLinkButton.tsx` | 수정 (useMutation 연동) |

**구현 단계**

- [ ] `app/api/revalidate/route.ts` 신규 생성
  - `POST` 핸들러: `revalidatePath('/')` 호출로 홈 페이지 ISR 캐시 즉시 무효화
  - 환경변수 `REVALIDATE_SECRET`으로 무단 호출 방지 (Authorization 헤더 검증)
  - 성공 시 `{ revalidated: true }` 반환
- [ ] `hooks/useLinks.ts` 신규 생성 (`"use client"` 컨텍스트에서만 사용)
  - `useCreateLink()`: `useMutation`으로 `POST /api/links` 호출, 성공 후 `revalidate` API 호출
  - `useUpdateLink()`: `useMutation`으로 `PATCH /api/links/[id]` 호출, 성공 후 `revalidate` API 호출
  - `useDeleteLink()`: `useMutation`으로 `DELETE /api/links/[id]` 호출, 성공 후 `revalidate` API 호출
  - 각 mutation의 `onSuccess`에서 `queryClient.invalidateQueries()`로 캐시 무효화
  - 각 mutation의 `onError`에서 `toast.error` 알림 표시
- [ ] `components/LinkHubClient.tsx` 수정
  - TanStack Query `QueryClientProvider`가 상위에 있음을 확인 (`app/providers.tsx` 또는 `app/layout.tsx` 확인)
  - CRUD 성공 후 `router.refresh()` 호출로 서버 컴포넌트 재렌더링 트리거
- [ ] `AddLinkDialog`, `EditLinkDialog`, `DeleteLinkButton`에서 `useCreateLink`, `useUpdateLink`, `useDeleteLink` 훅 적용
  - 기존 직접 `fetch` 호출을 훅으로 교체
  - 로딩 상태(`isPending`)를 버튼 비활성화에 활용
- [ ] `.env.example`에 `REVALIDATE_SECRET` 항목 추가

**수락 기준**

- 링크 생성/수정/삭제 후 홈 페이지가 새 데이터를 즉시 반영해야 한다
- `revalidatePath('/')` 호출로 ISR 캐시가 무효화되어야 한다
- 네트워크 오류 시 `toast.error` 알림이 표시되어야 한다
- `isPending` 상태 동안 중복 제출이 방지되어야 한다
- `REVALIDATE_SECRET` 없는 호출에 대해 `401` 응답을 반환해야 한다

**테스트 체크리스트** (Playwright MCP)

- [ ] 링크 생성 후 페이지 새로고침 없이 목록에 새 항목이 나타나는지 확인
- [ ] 링크 수정 후 페이지 새로고침 없이 변경된 내용이 반영되는지 확인
- [ ] 링크 삭제 후 페이지 새로고침 없이 목록에서 항목이 제거되는지 확인
- [ ] CRUD 작업 중 버튼 비활성화(로딩) 상태 확인
- [ ] 네트워크 오류 시뮬레이션 후 `toast.error` 알림 표시 확인
- [ ] `REVALIDATE_SECRET` 없이 `/api/revalidate` POST 요청 시 `401` 응답 확인

---

#### ✅ Task-015: CRUD 전체 검증 — E2E 테스트 및 빌드 최종 확인

> Phase 5 전체 기능의 E2E 통합 테스트를 수행하고, 빌드 및 접근성을 최종 검증한다.

**관련 파일**

| 파일 | 변경 유형 |
|------|----------|
| `.env.example` | 수정 (REVALIDATE_SECRET 포함 최종 확인) |

**구현 단계**

- [ ] `npm run lint` 실행 → 오류 0 확인
- [ ] `npm run build` 실행 → 빌드 성공 확인
- [ ] 전체 사용자 플로우 E2E 테스트 (Playwright MCP)
- [ ] 모바일(375px), 태블릿(768px), 데스크탑(1280px) 뷰포트별 CRUD UI 확인
- [ ] 다크모드에서 다이얼로그 및 폼 색상 이상 없음 확인
- [ ] 키보드 접근성 확인 (Tab 이동, Enter 제출, Escape 닫기)
- [ ] 에러 엣지 케이스 테스트 (네트워크 오류, 잘못된 입력, 중복 제출)

**수락 기준**

- `npm run lint` 오류 0건
- `npm run build` 성공 (타입 에러, 빌드 오류 없음)
- Create → Read → Update → Delete 전체 플로우가 오류 없이 동작해야 한다
- 모든 뷰포트에서 CRUD UI가 올바르게 표시되어야 한다
- 다크모드에서 다이얼로그 및 폼 스타일이 정상이어야 한다
- 키보드만으로 전체 CRUD 작업이 가능해야 한다

**테스트 체크리스트** (Playwright MCP)

- [ ] **Create 플로우**: "링크 추가" 버튼 → 폼 입력 → 제출 → 목록 갱신 확인
- [ ] **Read 플로우**: 페이지 로드 후 Notion 링크 카드 렌더링 + 카테고리 필터 동작 확인
- [ ] **Update 플로우**: 수정 버튼 → EditLinkDialog → 데이터 변경 → 목록 갱신 확인
- [ ] **Delete 플로우**: 삭제 버튼 → AlertDialog 확인 → 목록에서 항목 제거 확인
- [ ] 모바일 뷰포트(375px)에서 다이얼로그 레이아웃 확인
- [ ] 다크모드 전환 후 다이얼로그 및 폼 색상 확인
- [ ] Tab 키로 다이얼로그 내 폼 필드 이동 확인
- [ ] Escape 키로 다이얼로그 닫힘 확인
- [ ] 필수 필드 공백 제출 시 각 필드 에러 메시지 확인
- [ ] 동일 링크에 수정 제출을 연속 2회 클릭해도 중복 요청이 발생하지 않음 확인
- [ ] `npm run build` 빌드 성공 확인

---

## 핵심 파일 목록 (Phase 5 추가)

| 파일 | 상태 | 역할 |
|------|------|------|
| `types/index.ts` | ✅ 완료 | `CreateLinkInput`, `UpdateLinkInput` 타입 추가 |
| `lib/validations.ts` | ✅ 완료 | zod 스키마 (`createLinkSchema`, `updateLinkSchema`) |
| `lib/notion.ts` | ✅ 완료 | `createLink`, `updateLink`, `deleteLink` 함수 추가 |
| `app/api/links/route.ts` | ✅ 완료 | POST `/api/links` Route Handler |
| `app/api/links/[id]/route.ts` | ✅ 완료 | PATCH, DELETE `/api/links/[id]` Route Handler |
| `app/api/revalidate/route.ts` | ✅ 완료 | ISR 캐시 무효화 Route Handler |
| `hooks/useLinks.ts` | ✅ 완료 | TanStack Query mutation 훅 (useCreateLink, useUpdateLink, useDeleteLink) |
| `components/AddLinkDialog.tsx` | ✅ 완료 | 링크 생성 모달 (shadcn Dialog + react-hook-form + zod) |
| `components/EditLinkDialog.tsx` | ✅ 완료 | 링크 수정 모달 (shadcn Dialog + react-hook-form + zod) |
| `components/DeleteLinkButton.tsx` | ✅ 완료 | 링크 삭제 확인 (shadcn AlertDialog) |
| `components/LinkCardActions.tsx` | ✅ 완료 | 수정/삭제 액션 버튼 묶음 클라이언트 컴포넌트 |
| `components/LinkCard.tsx` | ✅ 완료 | LinkCardActions 추가 |
| `components/LinkHubClient.tsx` | ✅ 완료 | AddLinkDialog 추가 + router.refresh() 연동 |
| `.env.example` | ✅ 완료 | REVALIDATE_SECRET 항목 추가 |

---

## 의존성 그래프 (Phase 5)

```
Task-010 (Notion CRUD 레이어)
    ↓
Task-011 (Route Handler API)
    ↓
Task-012 (AddLinkDialog — Create UI)
    ↓
Task-013 (EditLinkDialog + DeleteLinkButton — Update/Delete UI)
    ↓
Task-014 (TanStack Query mutation + ISR revalidate 연동)
    ↓
Task-015 (E2E 전체 검증)
```

---

## PRD 기능 요구사항 매핑 (Phase 5 확장)

| PRD ID | 기능명 | 구현 Task | 상태 |
|--------|--------|-----------|------|
| F001 | Notion 데이터 동기화 (ISR) | Task-003, Task-007 | ✅ |
| F002 | 반응형 링크 카드 그리드 | Task-004, Task-006 | ✅ |
| F003 | 다크모드 전환 | Task-001, Task-007 | ✅ |
| F004 | URL 복사 + 토스트 알림 | Task-005 | ✅ |
| F005 | 카테고리 탭 필터링 | Task-006 | ✅ |
| F006 | 링크 생성 (Create) | Task-010, Task-011, Task-012 | ✅ |
| F007 | 링크 수정 (Update) | Task-010, Task-011, Task-013 | ✅ |
| F008 | 링크 삭제 (Delete) | Task-010, Task-011, Task-013 | ✅ |
| F009 | 클라이언트 상태 관리 + ISR 연동 | Task-014 | ✅ |

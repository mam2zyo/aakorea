<!-- docs/deferred/FUTURE_IMPLEMENTATION_GOALS.md -->

# FUTURE_IMPLEMENTATION_GOALS

## 이 문서의 역할

이 문서는 현재 MVP 범위 밖이지만, 추후 구현 목표로 유지할 기능과 권장 구현 방향을 정리한다.

이 문서가 답하는 질문:

- 어떤 기능을 중장기 구현 목표로 유지할 것인가?
- 현재 구조를 기준으로 각 기능은 어떤 식으로 확장하는 편이 좋은가?
- 어떤 선행 작업과 연관 관계를 고려해야 하는가?

현재 범위 판단의 기준은 `../current/PRODUCT_SCOPE.md`,
현재 구현 상태의 기준은 `../current/IMPLEMENTATION_PLAN.md`,
현재 프론트 구조의 기준은 `../current/FRONTEND_STRUCTURE.md`를 따른다.

---

## 현재 기준에서의 출발점

현재 구현은 아래 상태를 출발점으로 본다.

- 공개 모임 검색은 지역 / 요일 / 현재 위치 nearby search를 제공한다
- `Meeting`에는 주소와 `latitude`, `longitude`가 저장되며, 자동 지오코딩이 지원된다
- 범용 첨부파일(`Attachment`) 엔티티와 로컬 스토리지 기반 관리 체계가 구축되어 있다
- 권한 모델(AdminUser, Role, Permission)이 구축되어 운영자별 접근 제어가 가능하다
- 공개 사이트 테마는 draft / publish / rollback 구조를 가진다
- 공개 프론트는 React + Vite SPA이고 SEO를 위한 SSR / SSG 구조는 아직 없다

---

1. [관리자 페이지의 공개 사이트 메뉴 편집 기능 추가](#1-관리자-페이지의-공개-사이트-메뉴-편집-기능-추가)
2. [ContentPage 보조 첨부파일(매뉴얼 등) 관리 기능](#3-contentpage-보조-첨부파일매뉴얼-등-관리-기능)
3. [SEO를 위한 프론트 Next.js 전환](#2-seo를-위한-프론트-nextjs-전환)

---

## 1. 관리자 페이지의 공개 사이트 메뉴 편집 기능 추가

### 목표

- 공개 헤더 / 푸터 메뉴를 관리자에서 편집할 수 있게 한다.
- 방문자에게 보이는 메뉴의 임의 수정이 가능하되, 깨진 링크가 생기지 않도록 제약을 둔다.

### 권장 구현 방향

- **게시 흐름 재사용**: 현재 공개 테마가 가진 `draft / publish / rollback` 흐름을 메뉴 편집에도 적용한다.
- **메뉴 타입 및 타깃**: `HOME`, `MEETINGS`, `NOTICE_LIST`, `CONTENT_PAGE`, `EXTERNAL_URL` 등의 타입을 명시적으로 관리한다.
- **편집 편의성**: 드래그 정렬, 노출/숨김 토글, 새 창 열기 여부 등의 설정을 제공한다.

---

## 2. SEO를 위한 프론트 Next.js 전환

### 목표

- 공개 페이지를 검색엔진 친화적으로 전환(SSR)하고 메타데이터 및 sitemap 관리를 강화한다.

### 권장 구현 방향

- **하이브리드 전환**: 공개 사이트만 Next.js로 분리하고, 관리자 콘솔은 생산성을 위해 기존 SPA를 유지하는 구조가 효율적이다.
- **점진적 이전**: 홈 / 안내 / 공지 페이지를 우선 이전하고, 상호작용이 많은 `/meetings`를 마지막에 이전한다.
- **Nginx 라우팅**: 게이트웨이 수준에서 공개 라우트는 Next.js 앱으로, `/admin` 및 `/api`는 기존 모듈로 분기한다.

---

## 3. ContentPage 보조 첨부파일(매뉴얼 등) 관리 기능

### 목표

- `ContentPage`(장기 컨텐츠) 하단에 다운로드 가능한 보조 자료(PDF, 안내문 등)를 노출한다.
- 운영자가 HTML 본문 수정과 별개로 첨부파일을 관리할 수 있는 인터페이스를 제공한다.

### 권장 구현 방향

- **백엔드**: 이미 구축된 `ContentAttachment` 및 `syncContentAttachments` 로직을 활용한다.
- **관리자 UI**: `Notice` 생성/수정 UI에 적용된 첨부파일 업로드 컴포넌트를 `ContentPage` 관리 화면에도 이식한다.
- **공개 레이아웃**: `ContentPageDetail` 컴포넌트 하단에 첨부파일 목록(아이콘, 파일명, 용량 포함)을 렌더링하는 영역을 추가한다.
- **일관성**: 공지사항의 첨부파일과 동일한 다운로드 엔드포인트(`/api/public/attachments/{id}/download`)를 사용하여 사용자 경험을 통일한다.

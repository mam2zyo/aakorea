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

## 추후 구현 목표 순위 (Priority)

실효성과 의존 관계를 고려하여 아래 순서로 구현을 권장한다.

1. [주요 도메인 변경점의 수정자 추적 기능](#1-주요-도메인-변경점의-수정자-추적-기능-audit-log)
2. [번들 최적화: 관리자 및 공개 사이트 분리](#2-번들-최적화-관리자-및-공개-사이트-분리)
3. [관리자 페이지의 공개 사이트 메뉴 편집 기능 추가](#3-관리자-페이지의-공개-사이트-메뉴-편집-기능-추가)
4. [SEO를 위한 프론트 Next.js 전환](#4-seo를-위한-프론트-nextjs-전환)

---

## 1. 주요 도메인 변경점의 수정자 추적 기능 (Audit Log)

### 목표

- 누가 어떤 주요 도메인을 언제 수정했는지 추적한다
- 운영 화면에서 최근 수정자와 변경 이력을 확인할 수 있게 한다

### 권장 구현 방향

- 단순 `updatedBy`만 붙이는 수준과, 실제 변경 이벤트를 남기는 수준을 분리한다.

1. **JPA Auditing 도입**: `AuditorAware`를 사용해 `createdAt`, `createdBy`, `updatedAt`, `updatedBy` 필드를 자동 관리한다.
2. **변경 이벤트 로그**: `ChangeLog` 테이블을 두고 `entityType`, `entityId`, `action`, `diffJson` 등을 기록한다.

### 권장 대상 도메인

- `District`, `Group`, `Meeting`, `ContentPage`, `Notice`, `PublicThemeSetting` 등

---

## 2. 번들 최적화: 관리자 및 공개 사이트 분리

### 목표

- 일반 방문자가 관리자용 코드와 스타일을 다운로드하지 않게 하여 초기 로딩 속도를 개선한다.
- 경로 기반 코드 분할(Route-based Code Splitting)을 적용한다.

### 권장 구현 방향

- **React.lazy & Suspense**: 정적 임포트된 페이지들을 동적 임포트로 교체하여 별도 JS 청크로 분리한다.
- **CSS 자산 격리**: `App.jsx`에서 일괄 로드하던 스타일시트를 각 전용 레이아웃(`AdminAppScreen`, `PublicAppScreen`)으로 이동시킨다.
- **로딩 상태 처리**: 스켈레톤 UI 또는 로딩 스피너를 적용하여 사용자 경험을 유지한다.

---

## 3. 관리자 페이지의 공개 사이트 메뉴 편집 기능 추가

### 목표

- 공개 헤더 / 푸터 메뉴를 관리자에서 편집할 수 있게 한다.
- 방문자에게 보이는 메뉴의 임의 수정이 가능하되, 깨진 링크가 생기지 않도록 제약을 둔다.

### 권장 구현 방향

- **게시 흐름 재사용**: 현재 공개 테마가 가진 `draft / publish / rollback` 흐름을 메뉴 편집에도 적용한다.
- **메뉴 타입 및 타깃**: `HOME`, `MEETINGS`, `NOTICE_LIST`, `CONTENT_PAGE`, `EXTERNAL_URL` 등의 타입을 명시적으로 관리한다.
- **편집 편의성**: 드래그 정렬, 노출/숨김 토글, 새 창 열기 여부 등의 설정을 제공한다.

---

## 4. SEO를 위한 프론트 Next.js 전환

### 목표

- 공개 페이지를 검색엔진 친화적으로 전환(SSR)하고 메타데이터 및 sitemap 관리를 강화한다.

### 권장 구현 방향

- **하이브리드 전환**: 공개 사이트만 Next.js로 분리하고, 관리자 콘솔은 생산성을 위해 기존 SPA를 유지하는 구조가 효율적이다.
- **점진적 이전**: 홈 / 안내 / 공지 페이지를 우선 이전하고, 상호작용이 많은 `/meetings`를 마지막에 이전한다.
- **Nginx 라우팅**: 게이트웨이 수준에서 공개 라우트는 Next.js 앱으로, `/admin` 및 `/api`는 기존 모듈로 분기한다.

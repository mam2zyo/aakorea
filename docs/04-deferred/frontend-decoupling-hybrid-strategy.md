# 프론트엔드 분리 및 하이브리드 전략 (SvelteKit + React)

*   **상태**: 보류 (Deferred)
*   **작성일**: 2026-04-21
*   **관련 이슈**: 아키텍처 고도화 및 SEO 최적화

## 1. 개요 (Overview)
현재 하나의 React 프로젝트에 섞여 있는 공개 사이트(Public)와 관리자 페이지(Admin)를 별도의 어플리케이션으로 분리하여, 각각의 목적에 최적화된 기술 스택을 사용하는 **하이브리드 모노레포(Hybrid Monorepo)** 구조로 전환하는 전략입니다.

## 2. 제안된 아키텍처 (Proposed Architecture)

### 2.1 기술 스택 (Technical Stack)
*   **공개 사이트 (Public Site)**: **SvelteKit**
    *   사용자 경험(UX), 로딩 속도, 검색 엔진 최적화(SEO)가 중요한 영역이므로 SSR(Server Side Rendering)에 강점이 있는 SvelteKit을 사용합니다.
*   **관리자 페이지 (Admin Panel)**: **React** (기존 유지)
    *   복잡한 폼 처리, 풍부한 외부 라이브러리 의존성, 기존 코드의 안정성이 중요한 영역이므로 리액트 생태계를 그대로 유지합니다.
*   **백엔드 (Backend)**: **Spring Boot REST API** (기존 유지)
    *   두 종류의 프론트엔드 앱에 공통 API를 제공합니다.

### 2.2 디렉토리 구조 (Directory Structure)
모노레포(Monorepo) 워크스페이스 구조를 채택하여 코드 일관성을 관리합니다.
```text
/aakorea-main
├── apps/
│   ├── admin/           # React 기반 관리자 앱
│   └── web/             # SvelteKit 기반 공개 사이트 앱
├── packages/            # 공유 로직
│   ├── api/             # API 클라이언트 및 데이터 전송 객체(DTO) 정의
│   └── styles/          # 공통 CSS 변수 및 디자인 토큰
├── backend/             # Spring Boot 프로젝트
└── deploy/              # Nginx 및 인프라 설정
```

## 3. 결정 배경 및 근거 (Rationale)
1.  **실용적 일관성**: 전체를 하나의 프레임워크로 맞추는 '코드 일관성'보다, 각 영역의 비즈니스 목적(SEO vs 기능성)에 맞는 최적의 도구를 사용하는 '생산성 일관성'을 우선했습니다.
2.  **마이그레이션 비용 최소화**: 잘 동작하는 관리자 페이지를 Svelte로 재작성하는 데 드는 비용(Opportunity Cost)을 절약하고, 이를 공개 사이트의 고도화에 집중합니다.
3.  **UI 공유의 실효성**: 공개 사이트와 관리자 페이지 간의 UI 공유 요소가 적을 것으로 판단되어, 컴포넌트 단위의 공유보다 데이터(API) 단위의 공유에 집중하는 것이 효율적입니다.

## 4. 인프라 및 배포 전략
Nginx 리버스 프록시를 통해 클라이언트 요청을 경로에 따라 배분합니다.
*   `/admin/**` → React Admin (정적 파일 서버)
*   `/api/**` → Spring Boot (API 서버)
*   `/**` (기타) → SvelteKit (Node.js SSR 서버)

## 5. 향후 추진 시 고려사항
*   **인증 공유**: 도메인 쿠키를 통한 세션/토큰 공유 방식 검토.
*   **자산(Asset) 관리**: `/api/public/assets/` 경로를 통한 통합 파일 접근 방식 유지.
*   **워크스페이스 설정**: npm 또는 pnpm workspaces를 통한 패키지 간 의존성 관리.

---
*본 문서는 2026-04-21 논의된 내용을 바탕으로 작성되었으며, 실제 구현은 추후 결정에 따라 진행합니다.*

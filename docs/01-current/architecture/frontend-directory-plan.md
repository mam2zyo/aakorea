# 프론트엔드 디렉터리 구조 개선 가이드 (Frontend Directory Architecture Guide)

본 문서는 관리자(Admin)와 공개 사이트(Public)의 물리적 분리를 용이하게 하고, 코드의 응집도를 높이기 위한 프론트엔드 디렉터리 재구조화 가이드를 제공합니다.

---

## 1. 아키텍처 원칙

1.  **도메인 중심 관리 (Domain-First)**: 기술적 타입(Page, Component 등)보다 누가 사용하는지(Admin, Public)를 우선하여 코드를 그룹화합니다.
2.  **물리적 격리 (Physical Isolation)**: Admin 코드는 Public 코드를 직접 참조하지 않으며, 그 반대도 마찬가지입니다. 모든 공유 코드는 `shared/` 레이어를 통해서만 교환됩니다.
3.  **공유 커널 (Shared Kernel)**: 양쪽 도메인에서 모두 사용하는 순수 UI 컴포넌트, API 클라이언트, 유틸리티는 `src/shared`에서 엄격히 관리합니다.

---

## 2. 권장 디렉터리 구조

```text
src/
├── admin/                 # [ADMIN DOMAIN] - 관리자 전용 영역
│   ├── app/               # 관리자 전용 라우터, 상태 제공자(Providers)
│   ├── pages/             # 관리자 페이지 구성 요소 (Route 단위)
│   ├── components/        # 관리자 비즈니스 컴포넌트
│   ├── layouts/           # 관리자 전용 레이아웃
│   ├── styles/            # 관리자 전용 CSS 및 테마 변수
│   └── hooks/             # 관리자 전용 로직 Hooks
│
├── public/                # [PUBLIC DOMAIN] - 공개 사이트 전용 영역
│   ├── app/               # 공개 사이트 전용 라우터, 상태 제공자
│   ├── pages/             # 공개 사이트 페이지 구성 요소 (Route 단위)
│   ├── components/        # 공개 사이트 비즈니스 컴포넌트
│   ├── layouts/           # 공개 사이트 전용 레이아웃
│   ├── styles/            # 공개 사이트 전용 CSS 및 테마 변수
│   └── hooks/             # 공개 사이트 전용 로직 Hooks
│
├── shared/                # [SHARED KERNEL] - 도메인 중립 영역
│   ├── api/               # 공통 API 클라이언트 및 엔드포인트 정의
│   ├── ui/                # 기초 UI 컴포넌트 (Button, Input, Modal 등)
│   ├── utils/             # 포맷터, 공통 헬퍼 함수
│   ├── constants/         # 공통 상수 및 타입 정의
│   ├── hooks/             # 중립적 Hooks (useWindowSize 등)
│   └── features/          # 교차 도메인 로직 (예: Auth 상태 관리)
│
├── App.jsx                # 최상위 브릿지 (Admin/Public 라우팅 분기)
└── main.jsx               # React 실행 엔트리 포인트
```

---

## 3. 분리 작업 로드맵 (Migration Roadmap)

### Phase 1: 페이지 레이어 이동 (Pages Migration)
*   `src/pages/admin/*` -> `src/admin/pages/`
*   `src/pages/public/*` -> `src/public/pages/`
*   내부 import 경로 및 `routeDefinitions.js` 참조 경로 업데이트.

### Phase 2: 공유 및 도메인 컴포넌트 정제 (Resource Cleanup)
*   `src/ui`에 혼재된 컴포넌트 분류.
*   공통 컴포넌트는 `shared/ui`로, 특정 도메인 전용(예: `PublicAttachmentList`)은 `public/components`로 이동.
*   `src/features`의 비즈니스 로직을 `shared`로 통합 또는 도메인별로 배분.

### Phase 3: 라우터 및 엔트리 분리 (Entry Decoupling)
*   `App.jsx`의 거대 로직을 `AdminApp`, `PublicApp`으로 분리.
*   최종적으로 `admin.html`과 `index.html`을 통한 별도 빌드 체계 구축.

---

## 4. 기대 효과

*   **빌드 최적화**: 관리자용 무거운 라이브러리가 공개 사이트 번들에 포함될 가능성 차단.
*   **유지보수성**: 특정 도메인의 변경이 다른 도메인에 미치는 부작용(Side Effect) 최소화.
*   **확장성**: 추후 한쪽 서비스를 Next.js 등 다른 프레임워크로 이전할 때 코드 추출이 용이함.

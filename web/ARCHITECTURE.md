# AAKorea Public Web Architecture Guide

본 문서는 `old/docs/architecture`의 설계 철학을 계승하면서, 관리자(Admin) 요소가 배제된 **SvelteKit 기반 공개 사이트(web)**의 최적화된 구조를 정의합니다.

---

## 1. 핵심 설계 원칙 (Design Principles)

1.  **SvelteKit Idiomatic**: 프레임워크가 제공하는 규칙(`src/routes`, `src/lib`)을 최우선으로 따르며, 추가적인 추상화 레이어를 최소화합니다.
2.  **Feature-Oriented Cohesion**: 비즈니스 로직(모임 검색, 공지사항)은 관련 컴포넌트와 유기적으로 결합하여 관리합니다.
3.  **Data-Driven SSR**: 검색 엔진 최적화(SEO)와 초기 렌더링 성능을 위해, SvelteKit의 `+page.ts` (또는 `+page.server.ts`) 로드 함수를 통해 데이터를 사전에 로드하여 렌더링하는 것을 지향합니다.
4.  **Style Separation**: 디자인 토큰과 실제 스타일 구현을 분리하여 테마 확장이 용이하게 관리합니다.

---

## 2. 디렉터리 구조 (Directory Structure)

```text
web/src/
├── routes/                 # [ROUTING & DOMAIN] 페이지 및 라우트별 지역 컴포넌트
│   ├── +layout.svelte      # 전역 공통 레이아웃 (헤더, 푸터 적용)
│   ├── +page.svelte        # 홈 메인 페이지
│   ├── +page.ts            # 홈 페이지 데이터 사전 로드
│   ├── Hero.svelte         # 홈 전용 로컬 Hero 영역 컴포넌트
│   │
│   ├── meetings/           # 모임 찾기 도메인
│   │   ├── +page.svelte    # 모임 검색 메인 페이지
│   │   ├── +page.ts        # 지역연합(districts) 사전 데이터 로드
│   │   └── components/     # 모임 찾기 전용 로컬 컴포넌트
│   │       ├── FilterModal.svelte
│   │       ├── GroupDetailModal.svelte
│   │       ├── KakaoMeetingMap.svelte
│   │       ├── MeetingCard.svelte
│   │       └── MeetingInfoModal.svelte
│   │
│   └── notices/            # 공지사항 도메인
│       ├── +page.svelte    # 공지사항 목록 페이지
│       ├── +page.ts        # 공지사항 목록 사전 데이터 로드
│       └── [id]/           # 공지사항 상세 도메인
│           ├── +page.svelte # 공지사항 상세 페이지
│           └── +page.ts     # 특정 공지사항 상세 사전 데이터 로드
│
├── lib/                    # [LIBRARY] 범용 공유 영역 (Shared 레이어)
│   ├── api/                # 백엔드 통신 클라이언트 및 API 정의
│   │   ├── client.ts       # Axios API 클라이언트 인스턴스
│   │   ├── publicContent.ts # 공개 콘텐츠 API 모음 (지역연합, 그룹, 모임, 공지 등)
│   │   └── api.d.ts        # 백엔드 API 공통 인터페이스/타입 정의
│   │
│   ├── assets/             # 이미지 등 정적 에셋 (Vite 최적화 빌드 대상)
│   │   └── hero-bg.png
│   │
│   ├── components/         # [SHARED UI]
│   │   ├── ui/             # 공통 UI 원자 컴포넌트 (Button, Container, Section, SubPageHero)
│   │   └── shared/         # 전역 레이아웃/비즈니스 공유 컴포넌트 (Header, Footer)
│   │
│   ├── data/               # 클라이언트용 정적 데이터 정의 (요일/유형 옵션 등)
│   │   └── options.ts
│   │
│   ├── styles/             # 전역 스타일 및 디자인 시스템 토큰
│   │   └── tokens.css      # 디자인 시스템 토큰 (색상, 타이포그래피 등)
│   │
│   └── utils/              # 범용 유틸리티/헬퍼 함수
│       ├── distance.ts     # 두 좌표 간의 거리 계산 유틸
│       ├── format.ts       # 날짜/전화번호 포맷팅 유틸
│       └── sorting.ts      # 모임/목록 정렬 유틸
│
├── app.css                 # 전역 스타일 메인 CSS
├── app.d.ts                # SvelteKit 전역 TypeScript 설정 정의
└── app.html                # 기본 HTML 템플릿
```

---

## 3. 계층별 역할 상세 (Layer Responsibilities)

### 3.1 `src/routes` (The Domain Home)

- **Co-location**: 특정 페이지나 도메인에서만 쓰이는 컴포넌트나 관련 파일은 `$lib`로 보내지 않고 해당 라우트 폴더 내의 `components/` 등 하위 경로에 배치합니다.
- **+ 접두어**: SvelteKit 예약 파일(`+page`, `+layout`, `+server`) 외의 일반 `.svelte` 파일은 라우트로 인식되지 않으므로 안심하고 배치합니다.
- **삭제 용이성**: 특정 기능을 제거할 때 `routes` 아래의 폴더만 삭제하면 관련 UI 컴포넌트까지 한 번에 정리됩니다.

### 3.2 `src/lib/components/ui` (The Primitives)

- **Zero Knowledge**: 비즈니스 로직이나 API 구조를 전혀 모르는 순수 UI 원자(Primitive) 요소입니다.
- **재사용성**: 프로젝트 전반에서 수십 번 이상 반복 사용되는 기본 단위들입니다.

### 3.3 `src/lib/components/shared` (The Cross-Route Features)

- **Multi-use**: 최소 2개 이상의 서로 다른 도메인(예: 헤더, 푸터 등)에서 공통으로 쓰이는 레이아웃/비즈니스 컴포넌트입니다.

### 3.4 `src/lib/api` (The Bridge)

- 백엔드 서버와의 통신을 담당하는 유일한 접점입니다.
- `api.d.ts`에 백엔드 응답 인터페이스 타입을 명시하고 요청 클라이언트를 제공합니다.

---

## 4. 유지보수를 위한 실천 가이드

- **Admin 코드 반입 금지**: `office/`의 코드를 복사해올 경우, 관리자 전용 라이브러리나 스타일이 섞이지 않도록 Svelte 및 SvelteKit 환경에 맞춰 정제해야 합니다.
- **성능 모드 대응**: `backdrop-filter` 등 무거운 CSS 속성은 사양에 따라 조건부로 적용될 수 있도록 `styles/tokens.css`의 클래스 구조를 활용합니다.
- **이미지 최적화**: 모든 정적 이미지는 가급적 `static/` 보다는 Vite의 최적화를 거칠 수 있도록 `lib/assets`에 배치하고 import 하여 사용합니다. (단, 고정 주소가 필요한 경우 제외)

---

## 5. 기존 구조 대비 개선점

1.  **관리 효율성**: Admin/Public 혼재로 인한 복잡성이 완전히 제거되어 빌드 결과물이 가볍습니다.
2.  **Svelte 5 룬(Runes) 및 런타임 최적화**: Svelte 5의 룬(Runes - `$state`, `$derived`, `$props()`)을 도입하여 단순하고 효율적인 데이터 흐름을 구현하고 런타임 성능을 극대화했습니다.
3.  **검색 성능**: SvelteKit의 SSR을 바탕으로 초기 페이지 렌더링 및 모임 검색 결과의 초기 인덱싱/SEO 성능이 대폭 향상됩니다.


<!-- docs/front/OVERVIEW.md -->
# 프론트엔드 아키텍처 개요 (Frontend Overview)

이 문서는 AAKorea Main 프론트엔드의 전반적인 설계 원칙과 소스 코드 구조를 관리합니다.

## 1. 핵심 설계 철학
- **MPA (Multi-Page Application) 기반 도메인 격리**: Public(공개)과 Admin(관리자) 환경을 독립적인 HTML 진입로 분리하여 물리적 번들 격리와 보안을 달성합니다.
- **Shared Kernel 아키텍처**: 도메인 간 중복 코드는 `src/shared/`에서 엄격히 관리하며, 도메인 간 직접 참조를 금지합니다.
- **성능 중심**: 각 도메인은 자기에게 필요한 라이브러리만 로드하여 초기 로딩 성능(Lighthouse 90점 이상)을 극대화합니다.
- **별칭 기반 경로(Path Aliases)**: 모든 경로는 `@/` 별칭을 사용하여 모듈 간 결합도를 낮추고 유지보수성을 높입니다.
- **사용자 맥락 중심 (Experience First)**: 도메인별 주 사용 환경에 맞춰 디자인 목표를 이원화합니다.

## 2. 도메인별 디자인 목표 (Design Philosophy)

AAKorea Main은 사용자의 환경과 목적에 따라 서로 다른 디자인 철학을 적용합니다.

### Public: 모바일 우선 (Mobile-First)
- **주 사용 환경**: 스마트폰 (이동 중 검색)
- **핵심 목표**: **"빠른 도달과 직관적인 터치"**
- **디자인 원칙**: 
  - 큰 터치 타겟 (최소 44x44px 영역 확보)
  - 한 손 조작이 용이한 버튼 배치 및 바텀 시트 활용
  - 텍스트 가독성을 위한 시원한 여백 (High Padding)

### Admin: 생산성 우선 (Efficiency-First)
- **주 사용 환경**: 태블릿 및 PC (사무실/가정 내 장시간 작업)
- **핵심 목표**: **"정보 밀도와 피로도 최소화"**
- **디자인 원칙**: 
  - 높은 정보 밀도 (Density) - 한눈에 더 많은 데이터를 파악할 수 있는 그리드
  - 시각적 피로도를 낮추는 차분한 색조 및 낮은 대조의 배경 사용
  - 정밀한 조작을 위한 키보드 단축키 및 마우스 오버 인터랙션 강화

## 3. 소스 코드 구조 (Source Map)

프론트엔드 소스는 관심사에 따라 다음과 같이 구조화되어 있습니다.

- **Entry Points**:
  - `index.html` / `src/public-main.jsx`: 공개 사이트 진입점.
  - `admin.html` / `src/admin-main.jsx`: 관리자 콘솔 진입점.
- **`src/public/`**: 공개 사이트 전용 도메인 코드 (Pages, Components, Hooks).
- **`src/admin/`**: 관리자 콘솔 전용 도메인 코드 (Pages, Features, UI).
- **`src/shared/`**: 도메인 간 공유되는 인프라 스트럭처.
  - `api/`: 공통 API 클라이언트 및 엔드포인트 정의.
  - `ui/`: 도메인 중립적인 기초 UI 컴포넌트.
  - `lib/`: 비즈니스 로직이 없는 순수 유틸리티.
  - `hooks/`: 재사용 가능한 리액트 훅.
  - `app/`: 라우팅 및 위치 제어 공통 로직.

## 4. 별칭 시스템 (Path Aliases)

프로젝트는 상대 경로의 복잡성을 해결하기 위해 Vite 별칭 설정을 사용합니다.
- **`@/`**: `src/` 디렉터리를 가리킵니다.
- **설정**: `vite.config.js` 및 `jsconfig.json`에서 정의되어 있습니다.

## 6. 패턴 및 관례 (Patterns & Conventions)

### Container-Presenter 패턴
복잡한 비즈니스 로직과 UI 렌더링을 분리하기 위해 Container-Presenter 패턴을 권장합니다.
- **Container**: 데이터 페칭, 상태 관리(`useReducer` 등), 이벤트 핸들러 정의를 담당합니다.
- **Presenter**: Props로 전달받은 데이터를 화면에 출력하고 사용자의 입력을 Container로 전달하는 UI 역할만 담당합니다.
- **이점**: 비즈니스 로직의 테스트 용이성 확보 및 UI 컴포넌트의 재사용성 향상.

### 상태 관리 (State Management)
- 복잡한 페이지 상태는 `useState`의 나열 대신 `useReducer`를 사용하여 상태 전이 로직을 명확히 관리합니다.
- 도메인 간 공유가 필요한 전역 상태는 최소화하며, 필요한 경우 React Context 또는 전용 Store를 검토합니다.

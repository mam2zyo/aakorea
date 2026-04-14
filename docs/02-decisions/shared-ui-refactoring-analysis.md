# Shared UI 리팩토링 분석 및 향후 제안 (2026-04-14)

이 문서는 `shared/ui` 도입 과정에서 발생한 레이아웃 이슈를 분석하고, 향후 성공적인 리팩토링을 위한 전략을 기록한다.

## 1. 실패 원인 분석

### CSS 선택자 충돌 및 우선순위
`shared/ui/Overlay` 도입 시 공통 클래스(`headless-overlay`)를 부여했으나, 기존 `admin-overlay`나 `public-overlay`에서 정의한 스타일과 충돌이 발생했다. 특히 `display: flex`, `position: fixed` 등 레이아웃 핵심 속성이 중복 정의되거나 덮어쓰이지 못해 중앙 정렬 등이 어긋나는 현상이 발생했다.

### DOM 계층 구조 변화 (Portal 도입)
기존에 부모 컴포넌트 내부에 존재하던 모달을 `Portal`을 통해 `body` 바로 아래로 옮기면서 **CSS 상속 관계(Cascading)**가 끊어졌다. 부모 컨테이너의 클래스에 의존하던 스타일(`.parent .modal-content`)이 적용되지 않아 레이아웃이 무너졌다.

### 과도한 추상화
Admin과 Public의 UI가 시각적으로 매우 다름에도 불구하고 하나의 `Overlay` 컴포넌트로 통합하려다 보니 설정이 복잡해지고 예측 불가능한 결과가 나왔다.

## 2. 향후 리팩토링 접근 전략

### Headless UI 패턴 (Logic First)
`shared/ui`에는 스타일(CSS)을 넣지 않고, 오직 기능(상태, 키보드 감지, Portal 로직 등)만 담당하는 `useOverlay` 훅이나 로직 전용 컴포넌트를 제공한다. 스타일은 각 도메인(`admin`, `public`)에서 직접 부여한다.

### 디자인 시스템 토큰화 (CSS Variables)
`shared` 컴포넌트가 스타일을 가져야 한다면 고정된 값이 아닌 CSS 변수(`--overlay-bg` 등)를 참조하게 하고, 각 도메인의 글로벌 CSS에서 이 변수값을 다르게 설정한다.

### 단계적 전환 (Incremental Migration)
모든 페이지를 한꺼번에 바꾸지 않고, 신규 기능이나 단순한 모달부터 단계적으로 적용하며 검증한다.
- 1단계: `Portal` 기능만 추출
- 2단계: 이벤트 핸들링 로직 추출
- 3단계: 최종 레이아웃 구조 통합

### 시각적 회귀 테스트
리팩토링 전후의 스크린샷을 비교하는 도구(Storybook, Playwright 등)를 활용하여 레이아웃 변화를 자동 검증한다.

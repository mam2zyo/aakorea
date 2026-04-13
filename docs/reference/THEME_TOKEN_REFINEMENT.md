<!-- docs/reference/THEME_TOKEN_REFINEMENT.md -->

# 테마 토큰 고도화 전략 (Theme Token Refinement)

> [!NOTE]
> **상태: 구현 완료 (2026-04-12)**  
> 이 문서는 설계 초안입니다. 현재 프론트엔드에 적용된 최신 디자인 시스템 명세는 [STYLE_SYSTEM.md](../front/STYLE_SYSTEM.md)을 참조하세요.

이 문서는 현재의 단순 색상 변수 체계를 다층적인 디자인 토큰 시스템으로 정제하기 위한 가이드라인을 제시합니다.

## 1. 토큰 계층화 구조 (Token Layers)

현재 산재해 있는 변수들을 다음 3단계 계층으로 분리하여 관리합니다.

### Layer 1: Primitives (Base Palette)
*   **역할**: 디자인에 사용되는 모든 원천 색상 및 값 정의.
*   **예시**: `--palette-green-500: #2c6a4b;`, `--palette-sand-100: #f5f1e8;`
*   **특징**: 테마가 바뀌어도 이 값 자체는 변하지 않지만, 아래 계층에서 참조(Alias)하여 사용합니다.

### Layer 2: Semantic Tokens (System-wide)
*   **역할**: 디자인상의 '의미'를 담당하는 전역 변수.
*   **예시**: `--color-primary`, `--color-text-muted`, `--radius-lg`, `--space-4`
*   **특징**: 테마를 전환한다는 것은 이 Semantic 토큰들이 참조하는 Primitive 값을 바꾸는 것을 의미합니다.

### Layer 3: Component Tokens (Scoped)
*   **역할**: 특정 컴포넌트의 가독성과 사용성을 위한 독립 변수.
*   **예시**: `--btn-primary-bg`, `--input-padding-y`, `--nav-item-active-text`
*   **특징**: 특정 버튼의 여백이나 그림자 강도만을 미세하게 조정할 때 사용합니다.

---

## 2. 세부 정제 대상

### 타이포그래피 (Typography Scale)
현재 폰트 종류만 토큰화되어 있으나, 크기와 가독성 관련 요소까지 확장합니다.
*   `--font-size-h1`: 2.5rem
*   `--font-size-body`: 1rem
*   `--line-height-base`: 1.5
*   `--letter-spacing-tight`: -0.02em

### 상태 레이어 (Interaction States)
인터랙션 피드백의 일관성을 위해 분리합니다.
*   `--state-hover-overlay`: rgba(0, 0, 0, 0.04)
*   `--state-active-overlay`: rgba(0, 0, 0, 0.08)
*   `--state-disabled-opacity`: 0.5

### 형태 및 장식 (Surface Details)
*   `--border-width-base`: 1px
*   `--shadow-elevation-low`: 0 2px 8px var(--color-shadow)
*   `--shadow-elevation-high`: 0 12px 32px var(--color-shadow)

---

## 3. 구현 지침

1.  **Hardcoded Value 지양**: 컴포넌트 CSS에서 `rgba(0, 0, 0, 0.1)` 같은 값을 직접 쓰지 말고 반드시 토큰을 거쳐야 합니다.
2.  **Alpha 채널 처리**: 색상 코드와 투명도를 분리하여 정의하면 테마 대응이 훨씬 유연해집니다.
    *   예: `--color-primary-rgb: 44, 106, 75;`
    *   사용: `rgba(var(--color-primary-rgb), 0.1)`
3.  **반응형 대응**: 모바일 환경에서는 `--space-4` 등의 값을 미세하게 줄이도록 미디어 쿼리 내에서 토큰 값만 덮어쓰는 방식을 권장합니다.

---

## 4. 기대 효과
*   **신규 테마 추가 비용 절감**: 토큰 정의만으로 사이트 전체 분위기 전환 가능.
*   **디자인 일관성**: 모든 컴포넌트가 동일한 간격과 색상 규칙을 가짐.
*   **유지보수 용이성**: 전역적인 디자인 변경(예: "모든 코너를 더 둥글게") 시 한 곳의 토큰만 수정하여 대응 가능.

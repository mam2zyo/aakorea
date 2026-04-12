<!-- docs/front/STYLE_SYSTEM.md -->
# 디자인 시스템 및 스타일 가이드 (Style System)

이 문서는 AAKorea Main의 시각적 일관성을 유지하기 위한 디자인 토큰 체계와 스타일링 규칙을 정의합니다.

## 1. 3계층 디자인 토큰 아키텍처 (3-Layer Tokens)

유지보수와 테마 확장을 위해 모든 스타일링은 다음 3단계 토큰 계층을 거칩니다.

### Layer 1: Primitives (기초 팔레트)
- **역할**: 디자인에 사용되는 원천 색상 및 수치 정의. 특정 맥락을 담지 않습니다.
- **파일**: `tokens.css` 내 `:root`
- **예시**: `--palette-forest-500: #2c6a4b;`, `--space-4: 1rem;`

### Layer 2: Semantic (의미적 토큰)
- **역할**: "이 값이 어디에 쓰이는가"에 대한 의미를 부여합니다.
- **파일**: 테마별 섹션 (예: `.public-theme[data-theme='classic']`)
- **예시**: `--color-primary`, `--color-text-muted`, `--radius-lg`

### Layer 3: Component (컴포넌트 토큰)
- **역할**: 특정 컴포넌트의 가독성과 정교한 스타일을 위한 독립 변수.
- **파일**: 테마별 상세 정의
- **예시**: `--public-dialog-border`, `--admin-shell-background`

## 2. 타이포그래피 표준 (Typography)

하드코딩된 폰트 크기 대신 다음 표준 스케일을 사용합니다.

- **Scale**: `xs`(0.75rem), `sm`(0.875rem), `base`(1rem), `lg`(1.125rem) ~ `4xl`(2.25rem)
- **변수명**: `--font-size-*` (기존의 `--text-size-*`는 폐기됨)
- **줄 간격**: `--line-height-base`(1.5), `--line-height-tight`(1.2)

## 3. 반응형 스케일링 (Responsive Scaling)

화면 크기에 따라 토큰 값이 자동으로 조정되어 자연스러운 레이아웃을 제공합니다.

- **브레이크포인트**: 640px (모바일), 920px (태블릿)
- **모바일 스케일링 (640px 이하)**:
  - 모든 공간(`--space-*`) 및 주요 폰트(`--font-size-h1` 등) 값이 **약 20% 축소**됩니다.
  - 이를 통해 좁은 화면에서도 가독성과 공간 밀도를 최적화합니다.
- **920px 스케일링**:
  - 레이아웃이 1단으로 전환되며, 주요 섹션 간격(`page-stack gap`)이 `--space-8`에서 `--space-6`으로 조정됩니다.

## 4. 구현 지침
1. **Literal 금지**: CSS 파일에서 `1.5rem`, `rgba(0,0,0,0.5)` 등 하위 값을 직접 쓰지 말고 토큰을 사용하세요.
2. **테마 전환**: `document.documentElement`의 `data-public-theme` 속성 값을 변경하여 전체 테마를 즉시 전환할 수 있습니다.
3. **색상 활용**: 투명도가 필요한 경우 `color-mix` 함수 또는 정의된 `rgb` 토큰을 활용하세요.

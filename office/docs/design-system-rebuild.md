# Office Admin — 디자인 시스템 재구성 계획

> **목표**: 현재 스타일이 손상된 `office` 관리자 앱에 VSCode/Linear 감성의 다크 퍼스트(dark-first) 디자인 시스템을 새롭게 구축한다.
>
> **원칙**: 코드 변경 최소화 (기존 클래스명 `office-*` 유지), CSS Custom Properties 기반, 라이트/다크 양쪽 완전 지원.

---

## 배경

### 왜 새로 만드는가?

| 구분 | 설명 |
|------|------|
| **현재 상태** | `surface.css` 290줄만 존재. 테이블·툴바·위저드·에디트시트 등 약 80%의 컴포넌트 스타일 누락 |
| **구 시스템 재활용 불가** | 구 `admin-*` 접두사 기반, `classic/harbor/breeze`는 **공개 사이트용 테마** → 어드민에 무관 |
| **새 방향** | 내부 어드민 툴 특성에 맞는 **정보 밀도 높은 전문가용 UI** |

### 참고 레퍼런스 서비스

- **Linear** — 사이드바, 테이블, 인라인 에디터의 밀도·간결함
- **Vercel Dashboard** — 다크/라이트 전환, 중성 팔레트
- **VSCode** — 다크 테마 컬러 시스템, 패널/트리 구조

---

## Phase 1. 컬러 & 타이포그래피 기초 (1~2일)

### 1-1. 컬러 팔레트

두 가지 모드를 완전하게 지원한다.

#### 다크 모드 (기본, `[data-theme='dark']`)

```css
/* 배경 계층 (가장 어두운 것부터) */
--bg:          #0d0d0d   /* 최외곽 배경 */
--surface-1:   #141414   /* 사이드바, 패널 */
--surface-2:   #1a1a1a   /* 카드, 다이얼로그 */
--surface-3:   #222222   /* 호버 상태, 강조 셀 */

/* 텍스트 계층 */
--text-primary:  #e8e8e8
--text-secondary: #8a8a8a
--text-muted:    #5a5a5a

/* 경계선 */
--border:       #2a2a2a
--border-strong: #363636

/* 브랜드 액센트 */
--accent:       #5b8af5   /* 파랑 계열, VSCode 느낌 */
--accent-hover: #7aa3ff
--accent-soft:  rgba(91, 138, 245, 0.12)

/* 시맨틱 */
--success:      #3fb950   /* GitHub green */
--success-soft: rgba(63, 185, 80, 0.12)
--danger:       #f85149
--danger-soft:  rgba(248, 81, 73, 0.12)
--warning:      #d29922
--warning-soft: rgba(210, 153, 34, 0.12)
```

#### 라이트 모드 (`[data-theme='light']`)

```css
--bg:          #f5f5f5
--surface-1:   #ffffff
--surface-2:   #fafafa
--surface-3:   #f0f0f0

--text-primary:  #1a1a1a
--text-secondary: #6b6b6b
--text-muted:    #9a9a9a

--border:       #e4e4e4
--border-strong: #d4d4d4

--accent:       #2563eb
--accent-hover: #1d4ed8
--accent-soft:  rgba(37, 99, 235, 0.08)
```

> **주의**: 두 모드 모두 `--color-*` 네임스페이스를 유지하여 하위 호환성을 갖춘다.

### 1-2. 타이포그래피

```html
<!-- index.html 또는 main.tsx에 추가 -->
<link rel="preconnect" href="https://cdn.jsdelivr.net" />
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
```

```css
/* 한글: Pretendard Variable (weight 400~700) */
/* 영문/숫자: Inter Variable */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

:root {
  --font-sans: 'Pretendard Variable', 'Pretendard', 'Inter', -apple-system,
               BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Menlo, monospace;

  /* 크기 스케일 */
  --text-xs:   0.75rem;   /* 12px */
  --text-sm:   0.8125rem; /* 13px — 어드민에서 자주 쓰는 크기 */
  --text-base: 0.9375rem; /* 15px */
  --text-lg:   1.0625rem; /* 17px */
  --text-xl:   1.25rem;   /* 20px */
  --text-2xl:  1.5rem;    /* 24px */
  --text-3xl:  1.875rem;  /* 30px */

  /* 두께 */
  --font-normal:  400;
  --font-medium:  500;
  --font-semibold: 600;

  /* 줄간격 */
  --leading-tight:  1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

> `13px` 크기(`--text-sm`)를 강조하는 이유: Linear, GitHub, VSCode 모두 어드민 UI에서 실제 읽기 단위로 이 크기를 사용한다.

---

## Phase 2. CSS 파일 구조 재설계 (0.5일)

### 새 파일 트리

```
src/assets/styles/
  index.css           ← @import만 존재
  tokens.css          ← Layer 1 (primitives) + Layer 2 (semantics)
  base.css            ← reset, html/body/a/button/input 기본
  shell.css           ← 레이아웃 골격 (sidebar, topbar, main)
  surface.css         ← 공용 컴포넌트 (button, panel, form, table, overlay...)
  group.css           ← groups 피처 전용 (wizard, edit-sheet, modal)
  theme.css           ← 다크/라이트 전환 로직, prefers-color-scheme 연동
```

#### `index.css` (최종형)

```css
@import './tokens.css';
@import './base.css';
@import './shell.css';
@import './surface.css';
@import './group.css';
@import './theme.css';
```

### 각 파일의 책임

| 파일 | 책임 | 대략 줄 수 |
|------|------|-----------|
| `tokens.css` | CSS 변수 전체 (팔레트, 시맨틱, 컴포넌트 토큰) | ~350줄 |
| `base.css` | box-sizing, 요소 reset, 유틸리티 클래스 | ~120줄 |
| `shell.css` | `.office-shell`, `.office-sidebar`, `.office-main`, 반응형 | ~300줄 |
| `surface.css` | 버튼, 패널, 폼 필드, 테이블, 오버레이, 공용 유틸 | ~600줄 |
| `group.css` | 그룹 위저드, 에디트시트, 주소 검색, 우편 연락처 | ~600줄 |
| `theme.css` | 테마 전환 트랜지션, `prefers-color-scheme` | ~50줄 |

---

## Phase 3. 토큰 시스템 상세 설계 (상세)

### Layer 1: Primitives (팔레트 원자값)

```css
:root {
  /* Neutral Zinc */
  --zinc-50:  #fafafa;
  --zinc-100: #f4f4f5;
  --zinc-200: #e4e4e7;
  --zinc-300: #d4d4d8;
  --zinc-400: #a1a1aa;
  --zinc-500: #71717a;
  --zinc-600: #52525b;
  --zinc-700: #3f3f46;
  --zinc-800: #27272a;
  --zinc-850: #1e1e21;
  --zinc-900: #18181b;
  --zinc-950: #0d0d10;

  /* Brand Blue */
  --blue-300: #93bbfd;
  --blue-400: #6fa0fb;
  --blue-500: #5b8af5;
  --blue-600: #3b6ee9;
  --blue-700: #2563eb;
  --blue-800: #1d4ed8;

  /* Semantic primitives */
  --green-500: #3fb950;
  --red-500:   #f85149;
  --amber-500: #d29922;
}
```

### Layer 2: Semantics (테마별 재정의)

```css
/* ── 다크 테마 ─────────────────────────── */
.office-theme[data-theme='dark'],
.office-theme:not([data-theme]) {   /* 기본값: 다크 */
  color-scheme: dark;

  --color-bg:             var(--zinc-950);
  --color-surface:        var(--zinc-900);
  --color-surface-2:      var(--zinc-850);
  --color-surface-3:      var(--zinc-800);
  --color-surface-hover:  var(--zinc-700);
  --color-text:           #e8e8e8;
  --color-text-muted:     var(--zinc-400);
  --color-text-subtle:    var(--zinc-600);
  --color-border:         var(--zinc-800);
  --color-border-strong:  var(--zinc-700);
  --color-primary:        var(--blue-500);
  --color-primary-hover:  var(--blue-400);
  --color-primary-soft:   rgba(91, 138, 245, 0.12);
  --color-danger:         var(--red-500);
  --color-danger-soft:    rgba(248, 81, 73, 0.12);
  --color-success:        var(--green-500);
  --color-success-soft:   rgba(63, 185, 80, 0.12);
  --color-warning:        var(--amber-500);
  --color-warning-soft:   rgba(210, 153, 34, 0.12);

  /* 입력 요소 */
  --color-input-bg:          var(--zinc-900);
  --color-input-border:      var(--zinc-700);
  --color-input-border-focus: var(--blue-500);
  --color-input-text:        var(--color-text);
  --color-input-placeholder: var(--zinc-600);

  /* 그림자 */
  --shadow-sm:  0 1px 3px rgba(0,0,0,0.5);
  --shadow-md:  0 4px 16px rgba(0,0,0,0.6);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.7);
  --shadow-xl:  0 20px 60px rgba(0,0,0,0.75);

  /* 오버레이 */
  --overlay-bg: rgba(0,0,0,0.7);
}

/* ── 라이트 테마 ────────────────────────── */
.office-theme[data-theme='light'] {
  color-scheme: light;

  --color-bg:             var(--zinc-100);
  --color-surface:        #ffffff;
  --color-surface-2:      var(--zinc-50);
  --color-surface-3:      var(--zinc-100);
  --color-surface-hover:  var(--zinc-200);
  --color-text:           var(--zinc-900);
  --color-text-muted:     var(--zinc-500);
  --color-text-subtle:    var(--zinc-400);
  --color-border:         var(--zinc-200);
  --color-border-strong:  var(--zinc-300);
  --color-primary:        var(--blue-700);
  --color-primary-hover:  var(--blue-800);
  --color-primary-soft:   rgba(37, 99, 235, 0.08);
  --color-danger:         #dc2626;
  --color-danger-soft:    rgba(220, 38, 38, 0.08);
  --color-success:        #16a34a;
  --color-success-soft:   rgba(22, 163, 74, 0.08);
  --color-warning:        #b45309;
  --color-warning-soft:   rgba(180, 83, 9, 0.08);

  --color-input-bg:           #ffffff;
  --color-input-border:       var(--zinc-300);
  --color-input-border-focus: var(--blue-700);
  --color-input-text:         var(--zinc-900);
  --color-input-placeholder:  var(--zinc-400);

  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  --shadow-xl: 0 20px 60px rgba(0,0,0,0.15);

  --overlay-bg: rgba(0,0,0,0.35);
}
```

### Layer 3: Component Tokens (컴포넌트 전용 변수)

```css
/* 토큰 예시 — tokens.css 하단에 추가 */
.office-theme {
  /* 사이드바 */
  --sidebar-bg:          var(--color-surface);
  --sidebar-border:      var(--color-border);
  --sidebar-nav-hover:   var(--color-surface-3);
  --sidebar-nav-active:  var(--color-primary-soft);
  --sidebar-nav-indicator: var(--color-primary);

  /* 테이블 */
  --table-bg:            var(--color-surface);
  --table-border:        var(--color-border);
  --table-header-bg:     var(--color-surface-2);
  --table-row-hover:     var(--color-surface-hover);

  /* 다이얼로그 */
  --dialog-bg:           var(--color-surface-2);
  --dialog-border:       var(--color-border-strong);
  --dialog-shadow:       var(--shadow-xl);

  /* 스위치 */
  --switch-track-bg:       var(--color-border-strong);
  --switch-track-active:   var(--color-primary-soft);
  --switch-thumb-bg:       var(--color-text);
  --switch-thumb-active:   var(--color-primary);

  /* 반경 */
  --radius-xs:  4px;
  --radius-sm:  6px;
  --radius-md:  10px;
  --radius-lg:  14px;
  --radius-xl:  20px;

  /* 스페이싱 (4px 기준) */
  --space-1:  0.25rem;  /* 4px */
  --space-2:  0.5rem;   /* 8px */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1rem;     /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.5rem;   /* 24px */
  --space-8:  2rem;     /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
}
```

---

## Phase 4. 컴포넌트 스타일 구현 (3~5일)

### 4-1. `shell.css` — 레이아웃 골격

구현 포인트:
- `office-shell`: `display: grid; grid-template-columns: 220px 1fr` (구보다 20px 좁게)
- `office-sidebar`: `position: sticky; top: 0; height: 100dvh` + `backdrop-filter: blur(16px)`
- 사이드바 네비게이션 active indicator: 좌측 3px 세로 바 (현재 구 시스템과 동일 패턴 유지)
- `office-main__bar`: `position: sticky; top: 0; backdrop-filter: blur(12px)`

반응형:
- `< 1024px`: 사이드바 → 상단 바로 전환
- `< 640px`: 상단 바 → 컴팩트 모드

### 4-2. `surface.css` — 공용 컴포넌트

**버튼 (`primary-button`, `ghost-button`)**

Linear 스타일: 작고 촘촘한 패딩, 명확한 경계선
```
primary-button: bg=accent, 호버 시 미세 밝기 증가, active 시 약간 눌리는 효과
ghost-button: border=1px, 배경 투명, 호버 시 surface-hover
ghost-button--danger: border/text=danger, 호버 시 danger-soft 배경
primary-button--small / ghost-button--small: padding 1/3 축소
```

**테이블 (`office-table`)**

VSCode Explorer/Linear 테이블 참고:
- 행 구분선은 `border-bottom: 1px solid var(--color-border)`
- 행 호버: `background: var(--table-row-hover)` (미세하게)
- 헤더: 작은 uppercase 레이블 (`text-xs`, `font-medium`, `letter-spacing: 0.06em`)
- 액션 셀은 오른쪽 정렬, 기본 숨김 → 행 호버 시 표시 (optional CSS hack)

**오버레이 (`office-overlay`, `office-overlay__dialog`)**

- 배경: `var(--overlay-bg)` + `backdrop-filter: blur(8px)`
- 다이얼로그: `border: 1px solid var(--dialog-border)`, `box-shadow: var(--dialog-shadow)`
- `--submodal`: 더 넓음 (`min(100%, 760px)`)

**폼 필드 (`field`, `field__label`, `field__error`)**

- 라벨: `--text-sm`, `--font-medium`, `color: var(--color-text-muted)`
- 포커스 링: `box-shadow: 0 0 0 2px var(--color-primary-soft)`
- 에러 상태: `border-color: var(--color-danger)` + 에러 메시지 `--text-sm`

**패널 (`panel`, `editor-card`)**

- `panel`: `border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface)`
- `editor-card`: `panel`보다 약간 작은 radius, `background: var(--color-surface-2)`

**엔티티 리스트 (`entity-list`, `entity-item`)**

- 구분선 기반 (border 없이 `border-bottom`만)

### 4-3. `group.css` — 그룹 피처 전용

구현 대상 클래스 (총 ~55개):

```
office-group-wizard, office-group-wizard__form, office-group-wizard__grid(--intro/--meeting-meta)
office-group-wizard__field(--wide/--compact), office-group-wizard__section(--mailing/--meetings)
office-group-wizard__section-head, office-group-wizard__actions(--split)
office-group-wizard__meeting-list/item/summary/location/address/contact/actions/empty/add
office-group-wizard__postcode, office-group-wizard__progress

office-group-modal__header(--submodal), office-group-modal__body, office-group-modal__panel

office-group-edit-sheet, office-group-edit-sheet__header/title/header-actions
office-group-edit-sheet__rows, office-group-edit-sheet__rowline
office-group-edit-sheet__rowlabel, office-group-edit-sheet__rowcontrol(--compact/--wide)
office-group-edit-sheet__rowvalue, office-group-edit-sheet__section(--meetings)
office-group-edit-sheet__section-head, office-group-edit-sheet__section-actions
office-group-edit-sheet__meeting-list/item/summary/meta-actions
office-group-edit-sheet__status-toggle/status-label
office-group-edit-sheet__switch-track/switch-thumb (토글 스위치)

address-search-field__value(--disabled), address-search-field__action
postal-contact-card, postal-contact-card__grid, postal-contact-card__meta
```

### 4-4. 테마 전환 (`theme.css`)

```css
/* 다크/라이트 전환 트랜지션 */
.office-theme * {
  transition:
    background-color 150ms ease,
    border-color     150ms ease,
    color            150ms ease;
}

/* 사용자 OS 설정 자동 적용 */
@media (prefers-color-scheme: dark) {
  .office-theme:not([data-theme]) {
    /* tokens.css의 다크 기본값이 자동 적용됨 */
  }
}
```

---

## Phase 5. ThemeProvider 업그레이드 (1일)

### 현재 상태 문제점

```tsx
// 현재: resolvedTheme이 항상 'light', data-theme 속성이 DOM에 반영 안 됨
const defaultValue: ThemeContextType = {
  resolvedTheme: 'light',
  ...
};
```

### 개선 방향

1. `localStorage`에 테마 선호도 저장/읽기
2. `prefers-color-scheme` 미디어 쿼리 연동
3. `document.documentElement`(또는 `.office-theme` 요소)에 `data-theme` 속성 동기화

```tsx
// 예시 구조 (실제 구현은 별도 PR)
function useThemeManager() {
  const [preference, setPreference] = useState<'light' | 'dark' | 'system'>(
    () => (localStorage.getItem('theme-pref') as 'light' | 'dark' | 'system') ?? 'system'
  );
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    const el = document.querySelector('.office-theme');
    el?.setAttribute('data-theme', resolved);
  }, [resolved]);

  return { preference, setPreference, resolved };
}
```

---

## Phase 6. 계정 설정 페이지 — 테마 선택 UI (0.5일)

`OfficeAccountPage`의 테마 선택 섹션 (`theme-choice-list`, `theme-choice-meta`)을 새 디자인에 맞게 업데이트.

선택지: `시스템 기본값 | 라이트 | 다크`

---

## 작업 순서 요약

```
Phase 1. tokens.css 재작성           — Day 1
Phase 2. base.css + shell.css        — Day 1~2
Phase 3. surface.css (공용)          — Day 2~3
Phase 4. group.css (그룹 전용)       — Day 3~4
Phase 5. ThemeProvider 업그레이드    — Day 4~5
Phase 6. 계정 페이지 테마 선택 UI   — Day 5
```

총 예상 기간: **4~6일** (혼자 작업 기준)

---

## 클래스명 변경 없음 원칙

기존 JSX에서 사용 중인 **모든 클래스명은 변경하지 않는다**.

CSS만 새로 작성하면 되므로 컴포넌트 파일 수정은 Phase 5 (`ThemeProvider`)를 제외하고 **불필요**.

변경 없이 유지하는 클래스 예시:
```
office-theme / office-shell / office-sidebar / office-main
office-table / office-list-toolbar / office-overlay
office-group-wizard__* / office-group-edit-sheet__*
primary-button / ghost-button / panel / field__*
```

---

## 결과물 기대 비교

| 항목 | 현재 | 목표 |
|------|------|------|
| 다크 모드 | ❌ 없음 | ✅ 완전 지원, 기본값 |
| 라이트 모드 | ⚠️ 부분적 (80% 스타일 누락) | ✅ 완전 지원 |
| 폰트 | Noto Sans KR | Pretendard Variable + Inter |
| 컬러 | Solarized 기반 | Zinc 중성 팔레트 + Blue 액센트 |
| 테마 전환 | ❌ 동작 안 함 | ✅ localStorage + OS 설정 연동 |
| CSS 파일 수 | 3개 (80% 누락) | 7개 (완전) |
| 총 CSS 줄 수 | ~700줄 | ~1,500줄 |

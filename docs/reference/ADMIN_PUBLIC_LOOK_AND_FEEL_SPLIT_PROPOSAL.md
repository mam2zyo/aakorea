<!-- docs/reference/ADMIN_PUBLIC_LOOK_AND_FEEL_SPLIT_PROPOSAL.md -->

# ADMIN_PUBLIC_LOOK_AND_FEEL_SPLIT_PROPOSAL

## 이 문서의 역할

이 문서는 AAKorea Main 프론트엔드에서  
`admin` 영역과 `public` 영역의 **look and feel을 완전히 분리하는 방법**을 제안한다.

이 문서가 답하는 질문:

- 공개 화면과 운영 화면의 시각 체계를 어디까지 분리해야 하는가?
- 무엇을 공유하고, 무엇은 공유하지 말아야 하는가?
- 현재 구조에서 어떤 순서로 분리하는 것이 안전한가?
- 분리 이후 프론트 구조를 어떤 경계로 유지하는 것이 좋은가?
- 장기적으로 public 운영 테마와 admin 개인 테마 선택을 어떻게 지원하는가?

## 이 문서에 포함하지 않는 내용

- 개별 화면의 최종 시안
- 폰트/컬러의 최종 확정안
- 백엔드 API 계약 변경
- 배포 인프라의 상세 재구성

현재 구현 구조는 `../current/FRONTEND_STRUCTURE.md`,  
화면 분리의 상위 배경은 `./FRONTEND_SCREEN_SPLIT_PROPOSAL.md`를 따른다.

## 문서 상태

이 문서는 처음에는 분리 제안서로 작성되었고,  
2026-04-07 기준으로 1차 UI 분리 작업의 반영 상태까지 함께 기록한다.

따라서 아래처럼 읽는 것이 가장 정확하다.

- `제안 배경`, `핵심 판단`, `단계별 마이그레이션 제안`은 작업 시작 시점의 판단 기준이다.
- `현재 반영 상태 (2026-04-07)`는 실제 코드베이스에 반영된 결과를 정리한다.
- 장기 과제로 남아 있는 것은 public 테마 운영 API와 admin 테마 선호의 서버 저장이다.

---

## 제안 배경

현재 프론트엔드는 라우트 기준으로는 `public`과 `admin`이 나뉘어 있다.

- 공개 영역: 홈, 안내 페이지, 공지, 모임 찾기
- 운영 영역: 로그인, `District`, `Group`, `ContentPage`, `Notice`, 테스트 도구

작업 시작 당시 시각 구조는 하나의 글로벌 스타일 체계에 강하게 묶여 있었다.

당시에는 아래 요소가 중앙집중적으로 연결되어 있었다.

- 단일 앱 진입점
- 단일 전역 CSS import
- 단일 디자인 토큰 세트
- 공용 UI 컴포넌트
- 공용 class naming과 panel/button/form 표현

이 상태에서는 화면이 둘로 나뉘어 있어도,  
실제로는 “같은 제품의 하위 섹션”처럼 보이기 쉽다.

이번 목표가 단순한 메뉴 분리가 아니라  
**운영 콘솔과 대외 공개 웹을 서로 다른 표정으로 갖게 하는 것**이라면,  
레이아웃만 분리해서는 부족하다.

즉, 앞으로는 아래 수준까지 경계를 올려야 한다.

- 브랜드 인상
- 타이포그래피
- 색 체계
- spacing / density
- 버튼 / 패널 / 폼의 상호작용 감각
- empty / loading / feedback 표현

---

## 핵심 판단

### 1. “테마 2개”보다 “surface 2개”가 더 적절하다

이번 요구는 단일 디자인 시스템 위에 색만 다르게 얹는 수준보다 강하다.

따라서 `public`과 `admin`은
하나의 theme switch 구조보다 **같은 저장소 안의 서로 다른 surface app**처럼 다루는 편이 좋다.

여기서 `surface`는 다음을 의미한다.

- 각자 독립적인 레이아웃
- 각자 독립적인 visual component 집합
- 각자 독립적인 tokens / typography / spacing 체계
- 각자 독립적인 page composition 규칙

공유는 가능하지만, 공유 범위는 로직과 데이터 계층으로 제한하는 것이 좋다.

### 2. 공유 기준은 “보이는가, 보이지 않는가”로 나누는 것이 좋다

가장 실무적으로 안전한 기준은 아래다.

#### 공유 가능한 것

- API client
- request / error parsing
- auth session 처리
- formatter / validator / mapper
- domain utility
- headless hook

#### 공유하지 않는 것이 좋은 것

- layout
- page shell
- panel
- button
- form field wrapper
- table / list presentation
- status banner / empty state
- typography token
- color token
- spacing / radius token

즉, **데이터와 동작은 공유할 수 있지만, 화면에 보이는 것은 가급적 공유하지 않는다**는 원칙이 적합하다.

### 3. 작업 시작 시점의 구조는 완전 분리의 출발점으로는 좋지만, 최종 구조로는 부족했다

작업 시작 시점에도 라우트 단에서는 `route.section === 'admin' | 'public'` 구분이 있었다.  
또한 `AdminLayout`, `PublicLayout`, `features/groups/admin`, `features/groups/public`처럼 일부 경계도 이미 형성돼 있었다.

이 점은 장점이다.

하지만 당시에는 아래 요소의 결합도가 여전히 높았다.

- 전역 `index.css`
- 전역 `App.css`
- 단일 `tokens.css`
- 공용 `components/ui.jsx`

따라서 다음 단계는  
이미 있는 route / feature 경계를 바탕으로  
**스타일과 visual component 경계를 뒤따라 분리하는 작업**이 되어야 한다.

---

## 권장 구조

권장 방향은 “앱을 두 개의 감각으로 나눈다”이지,  
반드시 빌드 산출물을 지금 즉시 두 개로 쪼갠다는 뜻은 아니다.

초기 단계에서는 같은 Vite 앱 안에서 아래 구조를 먼저 만드는 것이 현실적이다.

```text
src/
  shared/
    api/
    auth/
    lib/
    hooks/
    model/

  public/
    app/
    layouts/
    pages/
    ui/
    features/
    styles/

  admin/
    app/
    layouts/
    pages/
    ui/
    features/
    styles/
```

### `shared/`에 둘 것

- API 호출과 응답 처리
- 인증 세션 로직
- 비즈니스 유틸리티
- 도메인 기반 포맷터
- pure function 성격의 공용 모듈

### `public/`에 둘 것

- 공개 웹용 shell
- 공개 네비게이션
- 공개 페이지 헤더 / hero / card / 안내성 컴포넌트
- 공개 검색 결과 / 상세 UI
- 공개 전용 tokens / typography / animations

### `admin/`에 둘 것

- 운영 콘솔 shell
- 사이드바 / 툴바 / 데이터 밀도 높은 header
- 관리용 form / list / table / modal / sheet
- 상태 표시와 작업 확인 UI
- 운영 전용 tokens / typography / spacing

---

## 스타일 분리 원칙

### 1. token 파일을 분리한다

현재처럼 하나의 `:root` 토큰 세트로는  
두 영역의 look and feel을 강하게 벌리기 어렵다.

권장 방식:

- `public/styles/tokens.css`
- `admin/styles/tokens.css`

그리고 각 영역의 shell 상위에 scope class를 두는 편이 좋다.

예:

- `.public-theme`
- `.admin-theme`

이렇게 두면 변수 재정의와 스타일 캡슐화가 쉬워진다.

### 2. base는 최소화하고 visual base는 각 영역이 소유한다

전역 `base.css`는 정말 공통인 reset 수준만 남기는 것이 좋다.

예:

- `box-sizing`
- 기본 margin reset
- form element font inherit

반대로 아래는 전역에서 빼는 편이 좋다.

- body background
- body text color
- brand font
- default border / surface color
- panel / button의 기본 모양

이런 값은 사실상 look and feel의 핵심이므로  
각 영역이 직접 가져야 한다.

### 3. class 이름보다 ownership이 더 중요하다

class prefix를 `admin-`, `public-`으로 나누는 것도 도움이 된다.

하지만 더 중요한 것은  
어느 폴더의 컴포넌트가 그 class와 스타일을 소유하느냐이다.

즉:

- `shared/ui/Button`보다
- `admin/ui/AdminButton`, `public/ui/PublicButton`

구조가 이번 목적에 더 맞다.

---

## 컴포넌트 분리 원칙

### 1. 공용 UI 컴포넌트 파일을 더 키우지 않는 것이 좋다

현재 공용 `ui.jsx`에는 이미 아래 성격이 섞여 있다.

- 공개 화면에서 쓰는 intro/panel
- 운영 화면에서 쓰는 header
- 전역 empty state / stat card / field

이 구조를 유지하면 앞으로도
“어느 한쪽에서 개선하면 다른 쪽이 같이 끌려가는 문제”가 계속 생긴다.

따라서 이 파일은 장기적으로 분해하는 편이 좋다.

예:

- `public/ui/PageIntro.jsx`
- `public/ui/ContentPanel.jsx`
- `admin/ui/AdminPageHeader.jsx`
- `admin/ui/AdminEmptyState.jsx`
- `admin/ui/AdminField.jsx`

### 2. headless와 visual을 분리한다

정말 공유 가치가 있는 것은 대부분 headless 계층이다.

예:

- `useFlashState`
- `useAdminSession`
- 검색 상태 관리 훅
- 데이터 fetching 훅

반면 결과를 실제로 그리는 컴포넌트는  
각 영역이 따로 갖는 편이 유지보수성이 높다.

---

## 라우팅과 앱 진입 구조

현재처럼 하나의 라우터 안에서 `section`을 나누는 방식은 유지해도 된다.  
다만 화면 렌더링 진입점은 더 분명히 둘로 나누는 것이 좋다.

권장 형태:

```text
App
 ├─ Shared providers
 └─ Surface switch
    ├─ PublicApp
    └─ AdminApp
```

여기서 `Shared providers`는 다음 정도만 맡는다.

- route parsing
- flash state
- session state
- navigation bridge

그리고 실제 렌더는 아래처럼 분기하는 편이 좋다.

- `public/app/PublicAppScreen`
- `admin/app/AdminAppScreen`

이렇게 하면 이후 각 영역이
자기 shell, 자기 layout, 자기 feedback 시스템을 더 쉽게 키울 수 있다.

---

## 단계별 마이그레이션 제안

한 번에 크게 뒤엎기보다 아래 순서를 권장한다.

### 1단계. 경계 선언

먼저 팀 기준을 문서로 확정한다.

- visual component는 공유하지 않는다
- token은 admin/public 별도 소유로 간다
- `shared`에는 headless 로직만 둔다

이 단계의 목표는 구현보다 판단 기준을 흔들리지 않게 만드는 것이다.

### 2단계. 스타일 진입점 분리

현재 전역 CSS import 구조를 아래 방향으로 바꾼다.

- 전역 reset 최소화
- public 스타일 묶음 분리
- admin 스타일 묶음 분리

이 단계에서는 화면 모양이 크게 바뀌지 않아도 된다.  
핵심은 파일 ownership을 분리하는 것이다.

### 3단계. 공용 UI 해체

현재 공용 `ui.jsx`를 분해한다.

우선순위:

1. `AdminPageHeader`
2. `PageIntro`
3. `Field`
4. `EmptyState`
5. `StatCard`

가장 먼저 운영용과 공개용이 모두 사용하는 표현 컴포넌트부터 끊는 것이 좋다.

### 4단계. shell과 typography 분리

이 단계부터 체감 look and feel 차이가 커진다.

- admin: 높은 정보 밀도, 빠른 스캔, 차분한 업무용 톤
- public: 신뢰감, 안내성, 여백감, 정서적으로 부드러운 톤

이 단계에서 font, radius, elevation, interaction을 본격적으로 벌린다.

### 5단계. feature 내부 visual 정리

이미 `features/groups/admin`, `features/groups/public`로 갈라진 흐름이 있으므로,  
각 feature가 자기 영역의 UI만 참조하도록 정리한다.

이 단계가 끝나면 admin/public은 코드상으로도  
“서로 다른 제품 표면”에 가까워진다.

### 6단계. 필요 시 빌드/배포 분리 검토

여기까지 간 뒤에도 더 강한 운영 분리가 필요하면,  
그때 아래를 검토하면 된다.

- `/admin`과 `/`를 별도 bundle로 나누기
- admin 서브도메인 분리
- 운영용 asset caching 정책 분리

하지만 현재 단계에서는 구조와 ownership 분리가 먼저다.

---

## 권장 look and feel 방향

### public

공개 영역은 “도움을 요청하는 사람도 부담 없이 들어올 수 있는 분위기”가 중요하다.

권장 성격:

- 더 넓은 여백
- 안내 중심 구성
- 감정적으로 덜 위협적인 대비
- 카드와 흐름 중심 레이아웃
- 행동 유도는 명확하지만 과하지 않은 CTA

핵심은 기능성보다 **신뢰감과 진입 장벽 완화**다.

### admin

운영 영역은 “실수를 줄이고 빠르게 처리하는 도구”라는 인상이 중요하다.

권장 성격:

- 더 높은 정보 밀도
- 정돈된 그리드와 정렬
- 상태 변화가 명확한 피드백
- 검색, 필터, 정렬, bulk 작업에 강한 구조
- 시각적 장식보다 판단 속도를 돕는 hierarchy

핵심은 감성보다 **작업 효율과 명료성**이다.

---

## 피해야 할 방향

### 1. 토큰만 살짝 바꾸고 공용 컴포넌트를 유지하는 방식

이 방식은 초기에 빨라 보여도,  
결국 두 영역이 서로의 제약이 된다.

### 2. 화면만 분리하고 CSS는 계속 전역으로 유지하는 방식

이 경우 ownership이 불명확해져  
후속 작업 때 회귀가 반복된다.

### 3. 너무 이르게 별도 저장소로 찢는 방식

지금은 API와 도메인 이해가 계속 움직이는 단계이므로,  
운영 비용만 커질 가능성이 있다.

같은 저장소 안에서 경계를 먼저 세우는 편이 좋다.

---

## 장기 테마 운영까지 고려할 때의 추가 판단

admin/public 분리 이후에 아래 요구까지 들어오면  
추가 설계 기준이 필요하다.

- public 영역은 운영 측에서 자체적으로 테마를 바꿔 가며 운용하고 싶다
- admin 영역은 운영자 개인이 라이트/다크를 선택하고 싶다

이 둘은 모두 “테마”처럼 보이지만, 실제로는 성격이 다르다.

### 1. public 테마와 admin 테마는 같은 문제로 취급하지 않는 것이 좋다

#### public 테마

public 테마는 사이트 전체에 영향을 주는 **운영 설정**에 가깝다.

즉, 아래가 중요하다.

- 누가 바꿀 수 있는가
- 초안을 저장할 수 있는가
- 미리보기 후 발행할 수 있는가
- 이전 버전으로 되돌릴 수 있는가
- 특정 시점의 공개 화면이 어떤 테마였는지 추적 가능한가

#### admin 테마

admin 라이트/다크는 사이트 운영 정책보다  
개별 운영자의 **사용자 선호 설정**에 가깝다.

즉, 아래가 중요하다.

- 사용자별 저장
- 즉시 전환
- 시스템 설정 연동 여부
- 다음 로그인 때도 같은 모드 유지

따라서 장기 구조에서는
`public theme management`와 `admin theme preference`를 분리해서 설계하는 편이 좋다.

### 2. 테마를 CSS 묶음이 아니라 런타임 상태로 다뤄야 한다

초기 분리 단계에서는 스타일 파일 ownership만 갈라도 충분하다.  
하지만 장기적으로 테마를 바꿔 운용하려면  
테마는 더 이상 정적 CSS 파일 집합만으로는 부족하다.

필요한 것은 아래에 가깝다.

- 어떤 surface인지
- 어떤 theme id를 쓰는지
- 현재 사용자의 preference가 무엇인지
- 테마 토큰 세트가 어디서 오는지
- 브라우저 최초 렌더 전에 어떤 모드를 적용할지

즉, 테마는 “스타일 자산”이면서 동시에  
**상태와 설정이 섞인 런타임 개념**으로 올라가야 한다.

---

## 장기 테마 구조 제안

### 1. token 계층을 3단계로 나누는 것이 좋다

장기 테마 운영을 위해서는 토큰을 아래처럼 나누는 편이 좋다.

#### primitive token

실제 색상값, 그림자, 반경, 간격 같은 원재료다.

예:

- `--gray-50`
- `--green-700`
- `--radius-12`

#### semantic token

컴포넌트가 직접 참조하는 의미 기반 토큰이다.

예:

- `--color-surface`
- `--color-text-primary`
- `--color-border-strong`
- `--color-accent`
- `--color-danger`

#### component token

복잡한 컴포넌트가 필요할 때만 한 단계 더 둔다.

예:

- `--button-primary-bg`
- `--panel-shadow`
- `--table-row-hover-bg`

핵심은 컴포넌트가 raw color를 직접 보지 않게 하는 것이다.  
그래야 public 테마가 늘어나거나 admin 다크 모드가 들어와도  
재작업 범위를 줄일 수 있다.

### 2. theme scope를 명시적으로 둔다

장기적으로는 루트 DOM에 아래와 같은 속성을 두는 편이 좋다.

- `data-surface="public"`
- `data-surface="admin"`
- `data-theme="classic"`
- `data-theme="campaign-2027"`
- `data-theme="light"`
- `data-theme="dark"`

예를 들어:

```html
<body data-surface="public" data-theme="classic">
```

또는

```html
<body data-surface="admin" data-theme="dark">
```

이렇게 하면 CSS selector, 초기 부트스트랩, 테스트 코드가 모두 단순해진다.

### 3. `color-scheme`까지 함께 관리해야 한다

admin 다크 모드를 제대로 지원하려면 색만 바꾸는 것으로 끝나지 않는다.

브라우저 기본 form control, scroll bar, focus ring, 내장 UI와의 어색함을 줄이려면  
테마별로 `color-scheme: light` 또는 `dark`를 함께 선언하는 편이 좋다.

---

## public 운영 테마를 위해 필요한 추가 조치

### 1. 발행 가능한 테마 개념이 필요하다

public 테마는 단순 토글보다 아래 구조가 더 적합하다.

- theme id
- theme name
- 현재 발행 버전
- draft 버전
- 마지막 발행 시각
- 마지막 수정자

즉, public 테마는 장기적으로  
`운영 설정 + 발행 이력` 구조로 관리하는 편이 좋다.

### 2. 저장과 발행을 분리하는 것이 안전하다

운영자가 public 테마를 수정할 때는
바로 실서비스에 반영되기보다 아래 흐름이 좋다.

1. draft 저장
2. preview 확인
3. publish 수행
4. 필요 시 rollback

이 구조가 있어야 seasonal theme이나 행사 기간 테마 변경도 안전하다.

### 3. 미리보기 경로가 필요하다

public 테마를 운영하려면  
admin 안에서 theme editor만 두는 것보다  
실제 public 화면을 preview 상태로 보는 경로가 중요하다.

예:

- preview query parameter
- preview token
- draft theme id 기반 내부 preview route

핵심은 운영자가 “설정값”이 아니라  
**실제 public 화면 결과**를 보고 발행할 수 있어야 한다는 점이다.

### 4. 테마 설정 저장 위치를 미리 정해야 한다

초기에는 정적 파일 기반으로 시작할 수 있지만,  
장기적으로는 서버 저장이 더 자연스럽다.

가능한 방향:

- theme metadata는 DB 저장
- 실제 token payload는 JSON 저장
- 기본 제공 테마는 코드 저장
- 운영 편집분은 DB override로 적용

어느 방식을 택하든 중요한 것은  
“현재 공개 중인 theme가 무엇인가”를 서버 기준으로 판단할 수 있어야 한다는 점이다.

---

## admin 라이트/다크 지원을 위해 필요한 추가 조치

### 1. 개인 선호 저장소가 필요하다

admin 라이트/다크는 1차로는 로컬 저장소만으로도 시작할 수 있다.

예:

- `localStorage['admin-theme'] = 'dark'`

하지만 장기적으로는 아래 순서가 더 좋다.

1. 미로그인 또는 초기 단계: local storage
2. 운영 계정 체계가 안정되면: 사용자 설정 API

이렇게 하면 여러 기기에서 같은 계정으로 로그인해도  
같은 관리 화면 모드를 유지할 수 있다.

### 2. `light`, `dark`, `system` 3상태를 고려하는 편이 좋다

처음에는 라이트/다크 2개만 있어도 충분하지만,  
구조는 가능하면 아래 3상태를 견디게 두는 것이 좋다.

- `light`
- `dark`
- `system`

이렇게 해 두면 OS 설정 연동이 필요할 때  
구조를 다시 뒤엎지 않아도 된다.

### 3. 최초 렌더 전 부트스트랩이 필요하다

React가 뜬 뒤에 다크 모드를 적용하면  
초기 깜빡임이 생긴다.

이를 줄이려면 앱 초기 스크립트에서 아래를 먼저 해야 한다.

1. 저장된 admin theme preference 확인
2. 필요 시 `prefers-color-scheme` 확인
3. `data-theme` 적용
4. 이후 React hydrate/render 진행

이 부트스트랩 단계는 장기적으로 체감 품질에 큰 영향을 준다.

---

## 공통적으로 필요한 구조 보강

### 1. ThemeProvider 또는 동등한 상태 계층

장기적으로는 아래 역할을 맡는 공통 계층이 필요하다.

- 현재 surface 확인
- 현재 theme 확인
- 변경 함수 제공
- 저장소 동기화
- DOM attribute 반영

이 계층은 visual component보다 상위에 있어야 한다.

### 2. visual asset variant 전략

테마는 CSS만의 문제가 아니다.

아래 요소도 함께 고려해야 한다.

- 로고
- 패턴/배경 이미지
- 아이콘 강조색
- 차트 팔레트
- 지도 주변 패널 색상 대비

즉, 테마별로 바뀌는 자산과  
항상 고정될 자산을 미리 나눠 두는 것이 좋다.

### 3. 접근성과 회귀 테스트

테마 수가 늘면 회귀 가능성도 커진다.

필요한 최소 검증:

- 명도 대비 검사
- focus visible 확인
- disabled / error / success 상태 확인
- screenshot regression
- 모바일/데스크톱 주요 화면 비교

특히 public은 신뢰감과 읽기 편의가 중요하고,  
admin은 장시간 사용 시 피로도와 스캔성이 중요하므로  
테마별 검증 기준을 별도로 두는 편이 좋다.

---

## 장기 테마 운영을 반영한 권장 순서

장기적으로는 아래 순서가 가장 무난하다.

### 1단계. admin/public visual ownership 분리

먼저 이번 문서의 기본 제안을 따른다.

- visual component 분리
- token 분리
- shell 분리

### 2단계. semantic token 체계 도입

raw color 참조를 줄이고  
의미 기반 토큰으로 바꾼다.

### 3단계. admin 라이트/다크 먼저 도입

이쪽이 발행 문제 없이 개인 선호 문제이므로  
리스크가 더 낮고 구조 검증에 좋다.

### 4단계. ThemeProvider / bootstrap 정리

테마 상태와 초기 적용 흐름을 안정화한다.

### 5단계. public draft / preview / publish 구조 도입

이 단계부터 public 테마를 운영 기능으로 승격한다.

### 6단계. rollback / versioning / visual regression 강화

테마 수가 늘어도 운영 안정성이 유지되게 만든다.

---

## 현재 반영 상태 (2026-04-07)

이 절은 실제 코드 기준으로  
admin/public UI 분리 작업이 어디까지 반영됐는지 기록한다.

### 1. surface 렌더 경계는 1차 분리가 반영됐다

현재 앱 렌더 진입은 `shared provider -> surface switch -> admin/public screen` 구조로 정리되어 있다.

주요 반영 지점:

- `src/app/AppScreen.jsx`에서 `AdminAppScreen`, `PublicAppScreen`으로 분기
- `src/admin/app/renderAdminPage.jsx`, `src/public/app/renderPublicPage.jsx`로 page renderer 분리
- `src/admin/layouts/AdminLayout.jsx`, `src/public/layouts/PublicLayout.jsx`로 layout ownership 분리

즉, 라우팅은 하나를 유지하지만  
실제 화면 렌더는 admin/public이 각자 자기 surface를 소유하는 구조가 반영됐다.

### 2. 공용 visual UI 파일은 해체됐고 ownership이 갈렸다

과거 공용 visual 진입점이던 `src/components/ui.jsx`는 제거되었다.

현재는 아래처럼 surface별 UI 모듈이 각자 존재한다.

- `src/admin/ui/index.jsx`
- `src/public/ui/index.jsx`

여기에는 아직 `PageSection`, `Field`, `EmptyState`, `DetailItem`처럼  
이름이 유사한 primitive가 양쪽에 모두 존재하지만,  
중요한 점은 **공용 파일 공유가 아니라 각 surface가 자기 파일을 소유한다는 것**이다.

즉, 같은 이름을 쓰더라도 이제는 admin/public 중 한쪽의 수정이  
다른 쪽 visual 파일을 직접 흔들지 않는다.

### 3. 스타일 ownership도 분리됐다

현재 shared 스타일은 `src/shared/styles/base.css`만 남고,  
실제 visual CSS entry는 각 surface가 직접 들고 간다.

현재 구조:

- `src/admin/styles/index.css`
- `src/public/styles/index.css`
- `src/shared/styles/base.css`

또한 예전의 공용 `shell.css`, `forms.css`, `responsive.css`, `common.css` 구조는 정리되었고,  
public/admin은 각자 자기 스타일 묶음을 import하는 구조로 바뀌었다.

이 상태는 “완전히 다른 look and feel”로 벌어지기 위한 파일 ownership 기준이  
이미 잡혔다는 의미다.

### 4. 토큰 분리와 document-level theme runtime도 반영됐다

테마 준비 작업도 제안 단계를 넘어 실제 코드에 반영되어 있다.

주요 반영 지점:

- `src/admin/styles/tokens.css`
- `src/public/styles/tokens.css`
- `src/app/themeDocument.js`
- `index.html`

현재는 다음이 동작한다.

- admin은 `light`, `dark`, `system` 선호를 지원한다.
- public은 `classic`, `harbor` registry와 preview query 기반 전환 뼈대를 가진다.
- 최초 paint 전에 `index.html` bootstrap이 `data-*`와 body theme 값을 먼저 심는다.
- React 진입 이후에는 `AdminAppScreen`, `PublicAppScreen`이 document theme state를 계속 동기화한다.

즉, “토큰 분리만 해 둔 상태”가 아니라  
실제 theme runtime과 bootstrap까지 1차 반영이 끝난 상태다.

### 5. public/admin visual 테스트 기반도 마련됐다

현재 테스트 레이어는 세 갈래로 나뉜다.

- 순수 로직 테스트: `test/themeDocument.test.js`, `test/publicTheme.test.js`, `test/routeDefinitions.test.js`
- React/jsdom 테스트: `test/react/PublicLayout.test.jsx`, `test/react/useAdminTheme.test.jsx`, `test/react/documentThemeSync.test.jsx`
- 브라우저 smoke 테스트: `test/e2e/themeSmoke.e2e.js`

또한 프론트 package script도 아래처럼 정리돼 있다.

- `npm test`
- `npm run test:node`
- `npm run test:react`
- `npm run test:e2e`

따라서 UI 분리 작업은  
“스타일 파일만 갈라 놓은 상태”가 아니라  
route/theme/document sync까지 포함해 회귀를 잡을 수 있는 최소 검증 체계가 있다.

### 6. 현재 시점에서 남은 큰 범위

UI 분리와 토큰 준비 작업의 1차 목표는 대부분 반영됐다.  
다만 아래는 아직 장기 과제로 남아 있다.

- public 운영 테마의 `draft / preview / publish / rollback`을 다루는 서버 API
- admin 개인 테마 선호를 계정 설정 API로 서버 저장하는 단계
- 테마 수가 늘어났을 때의 versioning과 시각 회귀 강화

정리하면, 현재 코드베이스는  
**admin/public UI ownership 분리, theme runtime 준비, 테스트 기반 확보까지는 완료에 가깝고,  
남은 큰 일은 API와 운영 기능 승격 단계**라고 보는 것이 가장 정확하다.

---

## 최종 권장안

현재 AAKorea Main에는 아래 방향이 가장 적절하다.

1. 프론트 저장소는 당분간 하나로 유지한다.
2. 라우팅은 유지하되 렌더 surface를 `PublicApp`과 `AdminApp`으로 분리한다.
3. `shared`는 headless 로직만 남기고 visual component는 비운다.
4. `public`과 `admin`은 각자 별도의 tokens, styles, ui, layouts를 소유한다.
5. 장기적으로는 semantic token, theme scope, bootstrap 구조를 도입해 다중 테마를 견디는 기반을 만든다.
6. admin의 라이트/다크는 개인 선호 설정으로, public의 테마 변경은 draft/publish 가능한 운영 설정으로 분리해 설계한다.
7. 분리 1차 목표는 “서로 다른 제품처럼 보이되, 같은 코드베이스에서 안정적으로 유지되는 구조”로 둔다.

즉, 이번 작업의 본질은  
“스타일 파일을 나누는 것”이 아니라  
**화면 ownership을 사용자 역할 기준으로 재정의하는 것**이다.

이 원칙으로 가면 이후 디자인 개편, 운영 기능 확장, 반응형 개선이 모두 쉬워진다.

<!-- docs/README.md -->

# 문서 안내

이 디렉토리는 AAKorea Main 웹앱 프로젝트의 설계 문서를 관리한다.  
문서 간 중복을 줄이기 위해, 각 문서는 **하나의 질문에만 답하도록** 구성한다.

---

## 문서 운영 원칙

문서는 아래 네 영역으로 구분한다.

- `current/`
  현재 MVP 기준으로 **실제로 따를 문서**를 둔다.

- `runbooks/`
  로컬 실행, env 설정, 배포, 재시작처럼 **운영 절차 문서**를 둔다.

- `reference/`
  배경 분석, 디자인 토큰 명세(`THEME_TOKEN_REFINEMENT.md`), 콘텐츠 구조 전략 등 **참조용 문서**를 둔다.

- `deferred/`
  현재 MVP 범위 밖이지만, 이후 확장 가능성이 있는 주제를 둔다.
  필요 시 이 원칙에 따라 문서를 추가한다.

현재 구현과 설계 판단의 기준은 항상 `current/` 아래 문서고,
실행 및 운영 절차의 기준은 `runbooks/` 아래 문서다.

---

## 권장 읽기 순서

처음 문서를 읽을 때는 아래 순서를 권장한다.

1. `current/PRODUCT_SCOPE.md`
2. `current/ACTORS_AND_USE_CASES.md`
3. `current/domain/README.md`
4. `current/api/README.md`
5. `current/IMPLEMENTATION_PLAN.md`
6. `front/OVERVIEW.md`
7. `runbooks/README.md`

이 순서는 다음 흐름을 따른다.

- 무엇을 만들지 정하고
- 누가 무엇을 하는지 확인하고
- 어떤 도메인과 필드를 쓰는지 확인하고
- API 계약을 정리하고
- 구현 상태와 다음 작업을 본다
- 프론트엔드 상세 구조(Style/Logic)와 운영 절차를 확인한다

현재 MVP 밖의 확장 목표를 검토할 때는
`deferred/FUTURE_IMPLEMENTATION_GOALS.md`를 별도로 본다.

---

## 문서 간 중복을 줄이는 규칙

문서가 늘어날수록 같은 내용을 여러 파일에 반복해서 적기 쉽다.  
이를 줄이기 위해 아래 규칙을 따른다.

### 1. 범위는 `PRODUCT_SCOPE.md`에만 둔다

다른 문서에서 “무엇을 포함/제외하는가”를 길게 다시 설명하지 않는다.

### 2. 사용자 행동은 `ACTORS_AND_USE_CASES.md`에만 둔다

다른 문서에서 사용자 시나리오를 상세히 반복하지 않는다.

### 3. 도메인 의미와 필드는 `current/domain/` 아래 각 문서를 기준으로 한다

`District`, `Group`, `Meeting` 같은 개체의 의미와 필드 목록은
각 도메인 문서 한 곳에서 관리한다.

### 4. 콘텐츠 구분 기준은 `current/domain/README.md`에 둔다

`ContentPage`와 `Notice`의 차이는
각 문서에 반복하지 말고 도메인 허브에서 비교 기준으로 관리한다.

### 5. API 계약은 `current/api/`를 기준으로 한다

공통 규약은 `current/api/COMMON.md`에 두고,
상세 엔드포인트 계약은 `current/api/` 아래 책임별 문서로 나눈다.

다른 문서에서는 필요한 경우 API 이름만 언급하고, 상세 형식은 반복하지 않는다.

### 6. 구현 순서는 `IMPLEMENTATION_PLAN.md`에만 둔다

다른 문서에서 단계별 작업 순서를 자세히 반복하지 않는다.

### 7. 운영 절차는 `runbooks/`를 기준으로 한다

배포, env 설정, 재시작, import/backfill 같은 실행 절차는
설계 문서와 섞지 않고 `runbooks/` 아래에서 관리한다.

---

## 새 문서를 추가할 때의 기준

새 문서는 아래 조건을 만족할 때만 추가한다.

- 기존 문서에 넣기에는 책임이 다르다
- 같은 정보를 여러 문서에 반복하게 될 가능성이 높다
- 이후에도 독립적으로 유지·수정할 가치가 있다

새 문서를 만들 때는 반드시 문서 상단에 아래 두 항목을 짧게 적는다.

- 이 문서의 역할
- 이 문서에 포함하지 않는 내용

이 원칙을 지키면 문서 간 책임 경계가 흐려지는 것을 줄일 수 있다.

---

## 유지보수 원칙

문서를 수정할 때는 먼저 아래를 확인한다.

1. 이 내용이 정말 이 문서의 책임인가?
2. 이미 다른 문서의 단일 기준으로 정의되어 있지 않은가?
3. 반복 서술 대신 링크 또는 참조 문장으로 끝낼 수 없는가?

가능하면 다음 방식으로 쓴다.

- 자세한 범위 판단은 `PRODUCT_SCOPE.md`를 따른다
- 도메인 의미와 필드는 `current/domain/README.md`와 해당 세부 문서를 따른다
- API 계약은 `current/api/README.md`와 해당 세부 문서를 따른다

즉, **반복해서 다시 쓰기보다 기준 문서를 가리키는 방식**을 우선한다.

---

## 현재 문서 구조

```text
docs/
├─ README.md
├─ current/
│  ├─ PRODUCT_SCOPE.md
│  ├─ ACTORS_AND_USE_CASES.md
│  ├─ IMPLEMENTATION_PLAN.md
│  ├─ auth/
│  │  ├─ AUTHENTICATION_MODEL.md
│  │  └─ AUTHORIZATION_POLICY.md
│  ├─ domain/
│  │  ├─ README.md
│  │  ├─ SharedTypes.md
│  │  ├─ Attachment.md
│  │  ├─ District.md
│  │  ├─ Group.md
│  │  ├─ GroupContact.md
│  │  ├─ Meeting.md
│  │  ├─ ContentPage.md
│  │  ├─ Notice.md
│  │  └─ PublicThemeSetting.md
│  └─ api/
│     ├─ README.md
│     ├─ COMMON.md
│     ├─ AUTH.md
│     ├─ ADMIN_AUTHORIZATION.md
│     ├─ PUBLIC_THEME.md
│     ├─ PUBLIC_CONTENT.md
│     ├─ PUBLIC_ATTACHMENT.md
│     ├─ PUBLIC_MEETINGS.md
│     ├─ ADMIN_GENERAL_SERVICES.md
│     ├─ ADMIN_GROUPS.md
│     ├─ ADMIN_MEETINGS.md
│     ├─ ADMIN_MEETING_IMPORTS.md
│     ├─ ADMIN_CONTENT.md
│     └─ ADMIN_ATTACHMENT.md
├─ deferred/
│  └─ FUTURE_IMPLEMENTATION_GOALS.md
├─ runbooks/
│  ├─ README.md
│  ├─ LOCAL_DEVELOPMENT.md
│  └─ NGINX_TERMUX_DEPLOYMENT.md
├─ front/
│  ├─ OVERVIEW.md
│  ├─ STYLE_SYSTEM.md
│  ├─ PUBLIC_APP.md
│  └─ ADMIN_APP.md
└─ reference/
   ├─ THEME_TOKEN_REFINEMENT.md
   ├─ CONTENT_ARCHITECTURE_STRATEGY.md   
   ├─ java-null-safety.md
```

## 추가 확장 제안

`runbooks/` 분리까지는 반영했지만, 실제 코드와 운영 기능이 더 늘면
결정 기록과 보관 문서도 분리하는 편이 좋다.

다음 단계에서는 아래 구조를 권장한다.

- `current/`
  제품 범위, 도메인, 프론트 구조처럼 **지금 따를 기준**만 둔다.

- `current/api/`
  현재 HTTP 계약만 둔다.

- `runbooks/`
  배포, env 설정, import, backfill 같은 **운영 절차 문서**를 둔다.

- `adr/`
  `Meeting` 위치 ownership, 공개 테마 운영 정책 같은 **짧은 결정 기록**을 둔다.

- `reference/`
  외부 사이트 분석, 디자인 레퍼런스, 배경 조사처럼
  **현재 구현 기준이 아닌 참고 자료**만 둔다.

- `archive/`
  구현에 흡수된 proposal, 일회성 메모, 과거 검토안 중
  **보존 가치가 있는 기록**만 둔다.

권장 운영 규칙은 아래와 같다.

- 구현이 끝난 proposal 문서는 `reference/`에 계속 두지 않는다.
- 현재 기준이 되면 `current/`에 흡수하고, 기록만 남길 가치가 있으면 `archive/`로 보낸다.
- 배포 / 운영 절차는 `current/` 설명 문서와 섞지 않고 `runbooks/`로 분리한다.

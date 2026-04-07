<!-- docs/README.md -->

# 문서 안내

이 디렉토리는 AAKorea Main 웹앱 프로젝트의 설계 문서를 관리한다.  
문서 간 중복을 줄이기 위해, 각 문서는 **하나의 질문에만 답하도록** 구성한다.

---

## 문서 운영 원칙

문서는 아래 세 영역으로 구분한다.

- `current/`  
  현재 MVP 기준으로 **실제로 따를 문서**를 둔다.

- `reference/`  
  배경 분석, 참고 자료, 비교 검토 등 **참고용 문서**를 둔다.

- `deferred/`  
  현재 MVP 범위 밖이지만, 이후 확장 가능성이 있는 주제를 둔다.
  아직 디렉토리가 없더라도, 필요 시 이 원칙에 따라 추가한다.

현재 구현과 설계 판단의 기준은 항상 `current/` 아래 문서다.

---

## 권장 읽기 순서

처음 문서를 읽을 때는 아래 순서를 권장한다.

1. `current/PRODUCT_SCOPE.md`
2. `current/ACTORS_AND_USE_CASES.md`
3. `current/DOMAIN_MODEL.md`
4. `current/CONTENT_MODEL.md`
5. `current/MVP_FIELDS.md`
6. `current/api/README.md`
7. `current/IMPLEMENTATION_PLAN.md`
8. `current/FRONTEND_STRUCTURE.md`
9. `current/NGINX_DEPLOYMENT.md`

이 순서는 다음 흐름을 따른다.

- 무엇을 만들지 정하고
- 누가 무엇을 하는지 확인하고
- 어떤 개체를 쓸지 정하고
- 콘텐츠 구분 기준을 확인하고
- 최소 필드를 확정하고
- API 계약을 정리하고
- 구현 순서를 정한다
- 프론트 구조와 남은 정리 포인트를 확인한다

---

## 문서 간 중복을 줄이는 규칙

문서가 늘어날수록 같은 내용을 여러 파일에 반복해서 적기 쉽다.  
이를 줄이기 위해 아래 규칙을 따른다.

### 1. 범위는 `PRODUCT_SCOPE.md`에만 둔다

다른 문서에서 “무엇을 포함/제외하는가”를 길게 다시 설명하지 않는다.

### 2. 사용자 행동은 `ACTORS_AND_USE_CASES.md`에만 둔다

다른 문서에서 사용자 시나리오를 상세히 반복하지 않는다.

### 3. 개체 의미는 `DOMAIN_MODEL.md`에만 둔다

다른 문서에서 도메인 채택 이유를 장문으로 반복하지 않는다.

### 4. 콘텐츠 구분 기준은 `CONTENT_MODEL.md`에만 둔다

`ContentPage`와 `Notice`의 차이를 다른 문서에서 길게 다시 쓰지 않는다.

### 5. 필드는 `MVP_FIELDS.md`를 기준으로 한다

다른 문서에서 필드 목록을 완전히 다시 적지 않는다.

### 6. API 계약은 `current/api/`를 기준으로 한다

공통 규약은 `current/api/COMMON.md`에 두고,  
상세 엔드포인트 계약은 `current/api/` 아래 책임별 문서로 나눈다.

다른 문서에서는 필요한 경우 API 이름만 언급하고, 상세 형식은 반복하지 않는다.

### 7. 구현 순서는 `IMPLEMENTATION_PLAN.md`에만 둔다

다른 문서에서 단계별 작업 순서를 자세히 반복하지 않는다.

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
- 필드 정의는 `MVP_FIELDS.md`를 따른다
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
│  ├─ DOMAIN_MODEL.md
│  ├─ CONTENT_MODEL.md
│  ├─ MVP_FIELDS.md
│  ├─ IMPLEMENTATION_PLAN.md
│  ├─ FRONTEND_STRUCTURE.md
│  ├─ NGINX_DEPLOYMENT.md
│  └─ api/
│     ├─ README.md
│     ├─ COMMON.md
│     ├─ AUTH.md
│     ├─ PUBLIC_CONTENT.md
│     ├─ PUBLIC_MEETINGS.md
│     ├─ ADMIN_GENERAL_SERVICES.md
│     ├─ ADMIN_GROUPS.md
│     ├─ ADMIN_MEETINGS.md
│     ├─ ADMIN_MEETING_IMPORTS.md
│     └─ ADMIN_CONTENT.md
└─ reference/
   ├─ AA_ORG_DESIGN_ANALYSIS.md
   ├─ ADMIN_PUBLIC_LOOK_AND_FEEL_SPLIT_PROPOSAL.md
   ├─ FRONTEND_SCREEN_SPLIT_PROPOSAL.md
   └─ GROUP_PUBLIC_API_DTO_REFACTOR.md
```

필요 시 이후에 다음과 같은 구조를 추가할 수 있다.

- `deferred/`
- `adr/`

다만 현재 단계에서는 문서 수를 늘리기보다,
기존 문서의 책임을 분명히 유지하는 것을 우선한다.

# API 경계와 네임스페이스 기준

작성일: 2026-03-26

## 1. 목적

이 문서는 프런트엔드와 백엔드가 같은 언어로 API를 설계할 수 있도록, 네임스페이스와 DTO 경계를 정리한 기준 문서다.
공통 도메인 원칙은 `DOMAIN_SPEC.md`, 인증 기준은 `AUTH_ACCESS_MODEL.md`를 따른다.

---

## 2. 핵심 원칙

### 2.1. 도메인 우선

API는 기술 계층이 아니라 도메인 기준으로 나눈다.

- `basic`
- `member`
- `service`
- `store`
- `heart`

### 2.2. 공개 조회와 운영 명령 분리

동일한 개념이라도 아래를 분리한다.

- 공개 조회 API
- 사용자용 보호 API
- 관리자용 운영 API

### 2.3. `admin`은 표면이고 소유권이 아니다

`/admin/service/*`, `/admin/store/*`, `/admin/heart/*`는 운영자 접근 표면을 뜻한다.
도메인 소유권은 여전히 `service`, `store`, `heart` 각각이 가진다.

---

## 3. 권장 네임스페이스

### 3.1. 공개 조회 API

```text
/api/basic/meetings
/api/basic/groups/{groupId}
/api/basic/content/{slug}
```

### 3.2. 멤버 API

```text
/api/member/me
/api/member/addresses
```

### 3.3. 서비스 운영 API

```text
/api/admin/service/districts
/api/admin/service/groups
/api/admin/service/meetings
/api/admin/service/notices
/api/admin/service/content
/api/admin/service/gsrs
```

### 3.4. 스토어 사용자/운영 API

```text
/api/store/items
/api/store/cart
/api/store/orders

/api/admin/store/items
/api/admin/store/orders
/api/admin/store/inventory
```

### 3.5. 하트 사용자/운영 API

```text
/api/heart/plans
/api/heart/subscriptions

/api/admin/heart/subscriptions
/api/admin/heart/deliveries
/api/admin/heart/issues
```

---

## 4. DTO 경계 규칙

### 4.1. 공개 조회 DTO

- 화면 렌더링에 필요한 조합 결과를 우선한다.
- 캐시 친화적이고 읽기 최적화된 응답을 허용한다.
- 관리자 내부 상태를 그대로 노출하지 않는다.

### 4.2. 명령 DTO

- 생성, 수정, 삭제 같은 명령 의도를 드러내야 한다.
- 입력 검증 규칙과 필수 필드를 명확히 가진다.
- 성공과 실패 결과가 명확해야 한다.

### 4.3. 금지 규칙

- 공개 조회 DTO와 관리자 명령 DTO를 같은 파일이나 같은 응답 모델로 섞지 않는다.
- 프런트 편의를 이유로 여러 도메인의 쓰기 모델을 하나의 API에 섞지 않는다.

---

## 5. 응답과 오류 형식

세부 포맷은 구현에서 확정하되, 최소한 아래 원칙은 유지한다.

### 5.1. 정상 응답

- 컬렉션은 목록과 페이지 메타를 분리할 수 있어야 한다.
- 단건은 필요한 식별자와 상태를 함께 내려준다.

### 5.2. 오류 응답

권장 공통 필드:

- `code`
- `message`
- `fieldErrors`(선택)
- `traceId` 또는 요청 추적 값(선택)

프런트가 일관되게 에러 메시지와 필드 에러를 처리할 수 있어야 한다.

---

## 6. 프런트엔드 구조와의 연결

프런트엔드에서는 다음 기준을 유지한다.

- 공통 fetch client는 `shared/api/client.js`
- 도메인별 API 모듈은 `domains/<domain>/<feature>/api.js`
- 공개 조회 클라이언트와 관리자 명령 클라이언트를 같은 파일에 무분별하게 섞지 않는다

예시:

- `domains/basic/meeting-search/api.js`
- `domains/service/groups/api.js`
- `domains/store/admin/items/api.js`

---

## 7. API 설계 체크리스트

새 API를 추가할 때는 아래를 확인한다.

1. 이 API는 어느 도메인이 소유하는가
2. 공개 조회인가, 사용자 보호 API인가, 관리자 명령 API인가
3. 인증과 권한은 어디서 판정하는가
4. 현재 상태와 과거 스냅샷 중 무엇을 반환해야 하는가
5. 이 DTO가 다른 맥락에서 재사용되어 경계를 흐리게 만들지는 않는가

---

## 8. 구현 우선순위

1. `basic`, `service`의 공개 조회와 운영 API 네임스페이스 확정
2. `member`의 `me`, `addresses` 경계 확정
3. `store`, `heart` 사용자 API와 운영 API 분리
4. 공통 오류 응답 포맷 정리
5. 프런트 API 모듈과 백엔드 컨트롤러 네이밍 일치

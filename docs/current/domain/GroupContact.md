<!-- docs/current/domain/GroupContact.md -->

# GroupContact

## 이 문서의 역할

이 문서는 `GroupContact`의 현재 모델 의미와 필드를 정리한다.

이 문서에 포함하지 않는 내용:

- 제품 범위 판단
- 사용자 행동 흐름
- API 요청 / 응답 JSON 상세

---

## 현재 모델 의미

`GroupContact`는 `Group`에 연결된 **대표 연락처**다.

현재 도메인 문맥에서는 `GroupContact`를
복수 연락처 목록보다 **대표 연락 지점 1건**으로 이해하는 편이 정확하다.

---

## 현재 핵심 필드

- `id`
- `groupId`
- `phone`
- `email`
- `postalContact.recipient`
- `postalContact.postalCode`
- `postalContact.roadAddress`
- `postalContact.detailAddress`

### 필드 메모

- `phone`은 필수다
- `email`은 선택이다
- `postalContact`는 선택이다
- 우편 정보가 전부 비어 있으면 `null`처럼 취급한다

---

## 현재 규칙

- 그룹당 연락처는 1건만 허용한다
- 같은 그룹에 연락처가 이미 있으면 생성 시 `409 Conflict`를 반환한다
- 현재 별도 `DELETE /group-contacts/{id}`는 없고, 수정 중심으로 관리한다

---

## 공개 흐름에서의 의미

- 공개 화면의 기본 대표 연락처는 이 번호다
- 다만 특정 모임은 `Meeting.contactPhoneOverride`가 우선한다

즉, 공개 전화 연결 규칙은 아래와 같다.

- `Meeting.contactPhoneOverride ?? GroupContact.phone`

---

## 운영 흐름에서의 의미

- 그룹 생성 1단계에서 함께 입력한다
- 그룹 수정 시트에서는 연락처 섹션을 별도 서브 모달로 편집한다

---

## 관계

- 하나의 `GroupContact`는 하나의 `Group`에 속한다
- 현재 구현 기준으로 하나의 `Group`은 대표 연락처 1건을 가진다

---

## 제외 / 보류

현재는 아래를 지원하지 않는다.

- 복수 공개 연락처
- 연락처 우선순위 목록
- 연락처 타입 분류

---

## 관련 API 문서

- `../api/ADMIN_GROUPS.md`
- `../api/PUBLIC_MEETINGS.md`

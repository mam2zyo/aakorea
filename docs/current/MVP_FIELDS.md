<!-- docs/current/MVP_FIELDS.md -->

# MVP_FIELDS

## 이 문서의 역할

이 문서는 현재 MVP에서 실제로 유지하는 최소 필드를 정리한다.

원칙:

- 현재 구현에 직접 쓰는 필드만 핵심으로 본다
- 목업 상태의 필드는 별도로 표시한다
- 최근 논의로 제외된 필드는 명시적으로 적어 둔다

---

## 1. District

### 현재 핵심 필드

- `id`
- `name`

### 비고

- `name`은 지역연합 이름이다

---

## 2. Group

### 현재 핵심 필드

- `id`
- `districtId`
- `name`

### 현재 제외한 필드

- `locationName`
- `locationAddress`
- `introduction`
- `notice`
- `changeSummary`

### 비고

- 그룹은 위치를 직접 가지지 않는다
- 공개 상세 모달은 그룹 문맥을 보여 주지만, 실제 장소는 선택된 모임 기준으로 바뀐다

---

## 3. GroupContact

### 현재 저장 필드

- `id`
- `groupId`
- `phone`

### 현재 구현 규칙

- 그룹당 연락처는 1건만 허용한다
- 현재 공개 화면도 이 대표 연락처 1건을 사용한다

### 관리자 UI에만 있는 목업 필드

아래 필드는 화면에 비활성 mock으로만 존재하고 아직 저장되지 않는다.

- `email`
- `mailingAddress.recipient`
- `mailingAddress.postalCode`
- `mailingAddress.roadAddress`
- `mailingAddress.addressDetails`

즉, 프론트에서는 미래 구조를 보기 위한 자리만 있고,
현재 API와 DB에는 아직 반영되지 않았다.

---

## 4. Meeting

### 현재 저장 필드

- `id`
- `groupId`
- `province`
- `locationName`
- `locationAddress`
- `dayOfWeek`
- `startTime`
- `type`
- `active`

### 필드 의미

- `province`
  공개 검색 기준 지역

- `locationName`
  장소명

- `locationAddress`
  주소

- `dayOfWeek`
  반복 요일

- `startTime`
  시작 시간 (`HH:mm`)

- `type`
  `OPEN | CLOSED | NOTFIXED`

- `active`
  공개 탐색 노출 여부

### 현재 운영 UI 규칙

- 새 모임 추가의 기본 `active`는 `true`
- 새 모임 추가에서는 상태 필드를 노출하지 않는다
- 모임 수정에서만 `진행중 / 잠정 중단` 토글을 노출한다

### 현재 제외한 필드

- `meetingPlaceNote`

---

## 5. 공개 화면 최소 노출 필드

### 모임 검색 리스트

- `Meeting.id`
- `Meeting.groupId`
- `Group.name`
- `Meeting.dayOfWeek`
- `Meeting.startTime`
- `Meeting.type`
- `Meeting.locationName`
- `Meeting.locationAddress`

### 모임 상세 모달

- `Group.name`
- `District.name`
- `GroupContact.phone`
- `Meeting` 목록
- 선택된 `Meeting.locationAddress`
- 선택된 `Meeting.locationName`

---

## 6. 관리자 화면 최소 노출 필드

### 그룹 목록

- `Group.name`
- `District.name`

### 그룹 수정 메인 모달

- 기본 정보: `Group.name`, `District.name`
- 연락처: `GroupContact.phone`
- 모임 정보: 각 `Meeting`의 `dayOfWeek`, `startTime`, `locationName`

### 모임 수정 서브 모달

- `dayOfWeek`
- `startTime`
- `type`
- `locationName`
- `province`
- `locationAddress`
- `active`

---

## 7. 다음 저장 후보

현재 논의는 끝났지만 아직 저장 구조로 확정되지 않은 항목:

- `GroupContact.email`
- `GroupContact.mailingAddress`
- 주소 검색 API 기반 `postalCode` 저장
- 주소 기반 `province` 자동 저장

이 항목들은 현재 MVP 핵심 필드가 아니라 **다음 확장 후보**다.

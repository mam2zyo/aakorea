<!-- docs/current/api/ADMIN_MEETINGS.md -->

# API_ADMIN_MEETINGS

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 운영 `Meeting` 관리 API 계약을 정의한다.

이 문서가 답하는 질문:

- 운영자는 `Meeting`을 어떻게 조회, 생성, 수정하는가?
- `MeetingType`과 `meetingPlaceNote`는 어떤 형식으로 전달되는가?
- 어떤 검증이 필요한가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 공개 `Meeting` 조회 API
- 운영 `generalservice`, `Group`, `GroupContact` API
- 도메인 채택 이유

공통 규약은 `COMMON.md`를 따른다.

---

## 현재 계약과 다음 조정 방향

이 문서는 **현재 구현된 운영 `Meeting` API 계약**을 설명한다.

현재 구현은 `Meeting`을 `Group`의 하위 일정 단위로 다룬다.

- 기본 위치 정보는 `Group`이 보유한다
- `Meeting`은 요일, 시간, 진행 여부, 공개 형식, 예외 장소 메모를 가진다
- 운영자는 `Group` 편집 화면에서 기본 장소와 일정 정보를 함께 관리한다

---

## 운영 API

운영 API는 인증이 필요한 관리용 API다.

### 1. Meeting 목록 조회

## GET `/api/admin/meetings`

Meeting 목록을 조회한다.

### Query Params

- `groupId` (optional)
- `province` (optional)
- `active` (optional)

### Response 200

```json
{
  "data": [
    {
      "id": 100,
      "groupId": 20,
      "province": "seoul",
      "dayOfWeek": "MONDAY",
      "startTime": "19:30",
      "type": "OPEN",
      "meetingPlaceNote": "지하 강당",
      "active": true
    }
  ]
}
```

---

### 2. Meeting 생성

## POST `/api/admin/meetings`

Meeting을 생성한다.

### Request Body

```json
{
  "groupId": 20,
  "province": "seoul",
  "dayOfWeek": "MONDAY",
  "startTime": "19:30",
  "type": "OPEN",
  "meetingPlaceNote": "지하 강당",
  "active": true
}
```

### Response 201

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "province": "seoul",
    "dayOfWeek": "MONDAY",
    "startTime": "19:30",
    "type": "OPEN",
    "meetingPlaceNote": "지하 강당",
    "active": true
  }
}
```

### 기본 검증

- `groupId` 필수
- `province` 필수
- `dayOfWeek` 필수
- `startTime` 필수
- `type` 필수
- `province` 허용값 검증
- `dayOfWeek` 허용값 검증
- `type` 허용값 검증
- `startTime` 형식 검증
- `meetingPlaceNote`는 optional
- 참조 대상 Group이 존재해야 한다

---

### 3. Meeting 수정

## PUT `/api/admin/meetings/{id}`

Meeting을 수정한다.

### Request Body

```json
{
  "groupId": 20,
  "province": "seoul",
  "dayOfWeek": "TUESDAY",
  "startTime": "20:00",
  "type": "NOTFIXED",
  "meetingPlaceNote": "1층 마음홀",
  "active": true
}
```

### Response 200

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "province": "seoul",
    "dayOfWeek": "TUESDAY",
    "startTime": "20:00",
    "type": "NOTFIXED",
    "meetingPlaceNote": "1층 마음홀",
    "active": true
  }
}
```

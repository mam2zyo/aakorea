<!-- docs/current/api/ADMIN_MEETINGS.md -->

# API_ADMIN_MEETINGS

## 이 문서의 역할

이 문서는 현재 구현된 운영 `Meeting` API 계약을 정리한다.

---

## 현재 구조 요약

`Meeting`은 현재 아래 필드를 직접 가진다.

- `province`
- `locationDetail`
- `locationAddress`
- `latitude`
- `longitude`
- `dayOfWeek`
- `startTime`
- `type`
- `active`

즉, 위치 정보는 `Group`이 아니라 `Meeting`이 가진다.

---

## 1. 모임 목록 조회

### GET `/api/admin/meetings`

#### Query Params

- `groupId` (optional)
- `province` (optional)
- `active` (optional)

#### Response 200

```json
{
  "data": [
    {
      "id": 100,
      "groupId": 20,
      "province": "seoul",
      "locationDetail": "강남역 인근",
      "locationAddress": "서울특별시 강남구 테헤란로 123",
      "latitude": 37.4979,
      "longitude": 127.0276,
      "dayOfWeek": "MONDAY",
      "startTime": "19:30",
      "type": "OPEN",
      "active": true
    }
  ]
}
```

---

## 2. 모임 생성

### POST `/api/admin/meetings`

#### Request Body

```json
{
  "groupId": 20,
  "locationDetail": "강남역 인근",
  "locationAddress": "서울특별시 강남구 테헤란로 123",
  "latitude": 37.4979,
  "longitude": 127.0276,
  "dayOfWeek": "MONDAY",
  "startTime": "19:30",
  "type": "OPEN",
  "active": true
}
```

#### Response 201

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "province": "seoul",
    "locationDetail": "강남역 인근",
    "locationAddress": "서울특별시 강남구 테헤란로 123",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "dayOfWeek": "MONDAY",
    "startTime": "19:30",
    "type": "OPEN",
    "active": true
  }
}
```

#### 기본 검증

- `groupId` 필수
- `locationDetail` 필수
- `locationAddress` 필수
- `latitude`, `longitude`는 선택
- `dayOfWeek` 필수
- `startTime` 필수
- `type` 필수
- `active` 필수
- 대상 `Group`이 존재해야 한다
- `locationAddress`에서 `province`를 자동 산출할 수 있어야 한다
- `latitude`, `longitude`는 함께 오거나 둘 다 비어 있어야 한다

#### 관리자 UI 메모

- 현재 관리자의 `새 모임 추가` 화면은 상태 UI를 보여주지 않는다
- 프론트는 기본값 `active=true`로 생성 요청을 보낸다

---

## 3. 모임 수정

### PUT `/api/admin/meetings/{id}`

#### Request Body

```json
{
  "groupId": 20,
  "locationDetail": "강남역 인근",
  "locationAddress": "서울특별시 강남구 테헤란로 123",
  "latitude": 37.4979,
  "longitude": 127.0276,
  "dayOfWeek": "TUESDAY",
  "startTime": "20:00",
  "type": "NOTFIXED",
  "active": false
}
```

#### Response 200

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "province": "seoul",
    "locationDetail": "강남역 인근",
    "locationAddress": "서울특별시 강남구 테헤란로 123",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "dayOfWeek": "TUESDAY",
    "startTime": "20:00",
    "type": "NOTFIXED",
    "active": false
  }
}
```

#### 관리자 UI 메모

- 현재 수정 모달에서는 `모임 상태` 토글을 통해 `active`를 바꾼다
- UI 표기는 `진행중 / 잠정 중단`이다

---

## 4. 모임 삭제

### DELETE `/api/admin/meetings/{id}`

#### Response 204

응답 본문 없음

#### 현재 구현 규칙

- 대상 모임이 없으면 `404`
- 관리자 그룹 수정 화면에서 `수정` 옆 `삭제` 버튼으로 호출한다

---

## 현재 제외한 필드

- `meetingPlaceNote`

이 필드는 이번 구조 정리에서 제거했다.

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
- `contactPhoneOverride`
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
      "contactPhoneOverride": "010-9999-0000",
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
  "contactPhoneOverride": "010-9999-0000",
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
    "contactPhoneOverride": "010-9999-0000",
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
- `contactPhoneOverride`는 선택
- `dayOfWeek` 필수
- `startTime` 필수
- `type` 필수
- `active` 필수
- 대상 `Group`이 존재해야 한다
- `locationAddress`에서 `province`를 자동 산출할 수 있어야 한다
- `latitude`, `longitude`는 함께 오거나 둘 다 비어 있어야 한다
- `latitude`, `longitude`가 둘 다 비어 있으면 서버가 카카오 Local REST API로 주소 지오코딩을 시도한다
- 지오코딩에 실패하면 `400`
- 지오코딩 기능 자체를 사용할 수 없으면 `503`

#### 관리자 UI 메모

- 현재 관리자의 `새 모임 추가` 화면은 상태 UI를 보여주지 않는다
- 프론트는 기본값 `active=true`로 생성 요청을 보낸다
- 모임별 담당자가 다르면 `contactPhoneOverride`로 별도 번호를 저장할 수 있다
- 대화면 공개 모달에서 지도를 표시하려면 좌표가 필요하므로, 운영 입력에서는 주소만 정확해도 서버가 좌표를 채우는 흐름을 우선 사용한다

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
  "contactPhoneOverride": null,
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
    "contactPhoneOverride": null,
    "dayOfWeek": "TUESDAY",
    "startTime": "20:00",
    "type": "NOTFIXED",
    "active": false
  }
}
```

#### 관리자 UI 메모

- 현재 수정 모달에서는 `모임 상태` 토글을 통해 `active`를 바꾼다
- UI 표기는 `공개 중 / 비공개`다
- 수정 시에도 `latitude`, `longitude`를 비우고 저장하면 서버가 주소 기준으로 다시 좌표를 계산한다

---

## 4. 모임 삭제

### DELETE `/api/admin/meetings/{id}`

#### Response 204

응답 본문 없음

#### 현재 구현 규칙

- 대상 모임이 없으면 `404`
- 관리자 그룹 수정 화면에서 `수정` 옆 `삭제` 버튼으로 호출한다

---

## 5. 좌표 일괄 보정

### POST `/api/admin/meetings/backfill-coordinates`

기존 데이터 중 `locationAddress`는 있지만 `latitude` 또는 `longitude`가 비어 있는 모임만 찾아,
카카오 Local REST API로 좌표를 조회한다.

### Query Params

- `dryRun` (optional, default `true`)

#### `dryRun=true`

- 실제 DB는 갱신하지 않는다
- 몇 건이 반영 가능한지, 어떤 주소가 실패하는지 미리 본다

#### `dryRun=false`

- 조회한 좌표를 실제 `Meeting.location.latitude`, `Meeting.location.longitude`에 반영한다
- 이미 좌표가 있는 모임은 건드리지 않는다

### Response 200

```json
{
  "data": {
    "dryRun": true,
    "totalCandidateCount": 273,
    "resolvedCount": 268,
    "updatedCount": 0,
    "failedCount": 5,
    "items": [
      {
        "meetingId": 409,
        "groupId": 315,
        "groupName": "곤지암",
        "locationAddress": "경기도 광주광역시 곤지암로 11번길 7-17",
        "latitude": null,
        "longitude": null,
        "status": "FAILED",
        "message": "locationAddress cannot determine coordinates"
      },
      {
        "meetingId": 410,
        "groupId": 316,
        "groupName": "교본연구",
        "locationAddress": "서울특별시 중구 정동길 9",
        "latitude": 37.5677208007304,
        "longitude": 126.970382993414,
        "status": "READY",
        "message": "coordinates resolved"
      }
    ]
  }
}
```

### 현재 운영 메모

- 관리자 `테스트 도구` 화면에서 dry-run과 실제 반영을 순서대로 실행할 수 있다
- 실패 건은 주로 광역시/기초지자체 표기 오류 같은 주소 정규화 문제일 가능성이 높다
- 같은 주소가 여러 모임에 반복되면 API 응답에서도 같은 좌표 또는 같은 실패 사유가 반복될 수 있다

---

## 현재 제외한 필드

- `meetingPlaceNote`

이 필드는 이번 구조 정리에서 제거했다.

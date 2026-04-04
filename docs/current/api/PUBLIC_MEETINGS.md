<!-- docs/current/api/PUBLIC_MEETINGS.md -->

# API_PUBLIC_MEETINGS

## 이 문서의 역할

이 문서는 현재 구현된 공개 모임 조회 API와 프론트 사용 방식을 함께 정리한다.

---

## 현재 공개 흐름 요약

현재 공개 화면은 아래 흐름을 사용한다.

1. `/meetings`에서 지역/요일 기준으로 모임을 찾는다
2. 모임을 클릭하면 같은 페이지 위에 상세 모달이 열린다
3. 모달은 `groupId`, `meetingId` 쿼리로 상태를 유지한다
4. 실제 상세 데이터는 `GET /api/public/groups/{id}`를 메인으로 사용한다

즉, 현재 공개 UI는 별도 `GroupDetails` 페이지보다
**검색 페이지 내 모달 상세**에 가깝다.

---

## 1. 모임 목록 조회

### GET `/api/public/meetings`

지역 기준으로 공개 모임 목록을 조회한다.

#### Query Params

- `province` (required)
- `dayOfWeek` (optional)

#### Response 200

```json
{
  "data": [
    {
      "id": 100,
      "groupId": 20,
      "groupName": "강남그룹",
      "province": "seoul",
      "dayOfWeek": "MONDAY",
      "startTime": "19:30",
      "type": "OPEN",
      "locationDetail": "강남역 인근",
      "locationAddress": "서울특별시 강남구 테헤란로 123",
      "latitude": 37.4979,
      "longitude": 127.0276
    }
  ]
}
```

#### 현재 규칙

- `province`는 필수
- `active=true`인 모임만 반환
- `dayOfWeek`는 선택 필터

---

## 2. 그룹 상세 조회

### GET `/api/public/groups/{id}`

현재 공개 상세 모달의 메인 데이터 소스다.

#### Response 200

```json
{
  "data": {
    "id": 20,
    "name": "강남그룹",
    "district": {
      "id": 1,
      "name": "서울지역연합"
    },
    "contactPhone": "02-1234-5678",
    "meetings": [
      {
        "id": 100,
        "province": "seoul",
        "dayOfWeek": "MONDAY",
        "startTime": "19:30",
        "type": "OPEN",
        "locationDetail": "강남역 인근",
        "locationAddress": "서울특별시 강남구 테헤란로 123",
        "latitude": 37.4979,
        "longitude": 127.0276
      }
    ]
  }
}
```

#### 현재 프론트 사용 방식

- `/meetings?province=seoul&groupId=20&meetingId=100`
- `groupId`로 그룹 상세를 불러온다
- `meetingId`로 초기 포커스 모임을 고른다
- 사용자가 모임 리스트를 다시 누르면 같은 모달 안에서 장소가 바뀐다

#### 연락처 규칙

- 현재 서비스는 `GroupContact` 중 `id` 오름차순 첫 연락처를 대표 번호로 반환한다
- 현재 관리자 UI는 그룹당 연락처 1건만 허용한다

---

## 3. 모임 단건 조회

### GET `/api/public/meetings/{id}`

현재 백엔드에는 남아 있는 공개 단건 상세 API다.

#### Response 200

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "groupName": "강남그룹",
    "district": {
      "id": 1,
      "name": "서울지역연합"
    },
    "contactPhone": "02-1234-5678",
    "province": "seoul",
    "dayOfWeek": "MONDAY",
    "startTime": "19:30",
    "type": "OPEN",
    "locationDetail": "강남역 인근",
    "locationAddress": "서울특별시 강남구 테헤란로 123",
    "latitude": 37.4979,
    "longitude": 127.0276,
    "groupMeetings": [
      {
        "id": 100,
        "province": "seoul",
        "dayOfWeek": "MONDAY",
        "startTime": "19:30",
        "type": "OPEN",
        "locationDetail": "강남역 인근",
        "locationAddress": "서울특별시 강남구 테헤란로 123",
        "latitude": 37.4979,
        "longitude": 127.0276
      }
    ]
  }
}
```

#### 비고

- 현재 메인 프론트 흐름은 이 API보다 `GET /api/public/groups/{id}`를 더 직접적으로 사용한다
- 다만 단건 기준 상세 응답은 아직 백엔드에 유지한다

---

## 현재 제외된 것

아래 항목은 공개 모임 계약에서 제외되었다.

- `meetingPlaceNote`
- `Group.introduction`
- `Group.notice`
- `Group.changeSummary`

현재 공개 모달은 **그룹명, 지역연합, 연락처, 모임 리스트, 선택된 모임 장소** 중심으로 유지한다.

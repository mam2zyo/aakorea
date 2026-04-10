<!-- docs/current/api/PUBLIC_MEETINGS.md -->

# API_PUBLIC_MEETINGS

## 이 문서의 역할

이 문서는 현재 구현된 공개 모임 조회 API와 프론트 사용 방식을 함께 정리한다.

---

## 현재 공개 흐름 요약

현재 공개 화면은 아래 흐름을 사용한다.

1. `/meetings` 진입 시 초기 데이터 없이 가이드 문구가 노출된다.
2. "지역 검색" 또는 "가까운 모임" 버튼 중 하나를 클릭하여 백엔드로부터 데이터를 불러온다. (이때 검색 상태가 `REGION_ACTIVE` 또는 `NEARBY_ACTIVE`로 전환된다.)
3. 불러온 데이터는 클라이언트에 캐싱되며, 이후 "상세 조건" 필터(요일, 유형, 연합, 키워드) 변경 시에는 백엔드 요청 없이 캐시된 데이터를 실시간으로 필터링하여 보여준다.
4. "검색 초기화"를 누르면 모든 필터와 캐시가 비워지고 초기 가이드 상태(`IDLE`)로 돌아간다.
5. 모달은 `groupId`, `meetingId` 쿼리로 상태를 유지한다.
6. 실제 상세 데이터는 `GET /api/public/groups/{id}`를 메인으로 사용한다.

즉, **대량의 기본 데이터를 한 번에 가져와서 정교한 상세 필터링을 클라이언트에서 처리**하는 고성능 검색 흐름을 가진다.

즉, 현재 공개 UI는 별도 `GroupDetails` 페이지보다
**검색 페이지 내 모달 상세**에 가깝다.

---

## 1. 모임 목록 조회

### GET `/api/public/meetings`

지역 기준 또는 현재 위치 기준으로 공개 모임 목록을 조회한다.

#### Query Params

- `province` (region search에서 required)
- `dayOfWeek` (optional)
- `latitude` (nearby search에서 required)
- `longitude` (nearby search에서 required)
- `radiusKm` (nearby search에서 optional, 기본 반경은 프론트에서 시작 반경을 넣는다)

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
      "longitude": 127.0276,
      "districtId": 5,
      "distanceKm": 0.2
    }
  ]
}
```

#### 현재 규칙

- `province=all`을 통해 전국 데이터를 한 번에 가져와 클라이언트에서 전체 검색을 수행할 수 있다.
- `active=true`인 모임만 반환한다.
- nearby search에서는 `latitude`, `longitude` 기준으로 **최대 100km** 반경 안의 결과를 거리순으로 최대 500건 반환한다.
- nearby search 응답의 `distanceKm`는 현재 위치 기준 거리다.
- 응답 데이터의 `districtId`는 클라이언트의 "지역연합" 필터링에 사용된다.

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
    "notice": "첫 방문자는 10분 전에 와 주세요.",
    "meetings": [
      {
        "id": 100,
        "contactPhone": "010-9999-0000",
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
- `/meetings?searchMode=nearby&dayOfWeek=MONDAY&latitude=37.4979&longitude=127.0276&radiusKm=20&groupId=20&meetingId=100`
- `groupId`로 그룹 상세를 불러온다
- `meetingId`로 초기 포커스 모임을 고른다
- 사용자가 모임 리스트를 다시 누르면 같은 모달 안에서 장소가 바뀐다
- nearby search일 때는 선택된 모임 주변의 `카카오맵 위치 보기`, `T map 길안내` 링크를 함께 노출한다

#### 연락처 규칙

- 현재 서비스는 `GroupContact` 중 `id` 오름차순 첫 연락처를 그룹 대표 번호로 본다
- 현재 관리자 UI는 그룹당 연락처 1건만 허용한다
- 다만 선택된 모임에 `contactPhoneOverride`가 있으면, 모달 하단의 실제 전화 연결은 그 번호를 우선 사용한다
- `meetings[]`의 각 항목도 `contactPhone`을 포함하므로, 모임을 바꿀 때 표시 번호도 함께 바뀐다

#### 그룹 공지 규칙

- `notice`는 선택 필드다
- 공백만 저장되면 `null`로 정규화된다
- 현재 최대 200자까지 허용한다

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
    "contactPhone": "010-9999-0000",
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
        "contactPhone": "010-9999-0000",
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
- 단건 상세의 `contactPhone`도 `Meeting.contactPhoneOverride ?? GroupContact.phone` 규칙을 따른다

---

## 현재 제외된 것

아래 항목은 공개 모임 계약에서 제외되었다.

- `meetingPlaceNote`
- `Group.introduction`
- `Group.changeSummary`

현재 공개 모달은 **그룹명, 지역연합, 그룹 공지, 연락처, 모임 리스트, 선택된 모임 장소** 중심으로 유지한다.

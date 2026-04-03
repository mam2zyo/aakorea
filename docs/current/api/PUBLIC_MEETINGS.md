<!-- docs/current/api/PUBLIC_MEETINGS.md -->

# API_PUBLIC_MEETINGS

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP에서 공개 `Meeting` 조회 API 계약을 정의한다.

이 문서가 답하는 질문:

- 방문자는 지역 기준으로 어떻게 모임을 조회하는가?
- 공개 모임 상세는 어떤 정보를 반환하는가?
- 공개 조회에서 어떤 기본 검증과 노출 규칙을 적용하는가?

이 문서에 포함하지 않는 내용:

- 공통 응답 형식과 상태 코드의 전체 규약
- 운영용 `Meeting` 관리 API
- `Meeting` 도메인 채택 이유
- 복잡한 일정 모델

공통 규약은 `COMMON.md`를 따른다.

---

## 현재 계약과 다음 조정 방향

이 문서는 **현재 구현된 공개 API 계약**을 설명한다.

현재 구현은 아래 기준을 따른다.

- 공개 검색 시작점은 계속 `Meeting` 목록으로 유지
- 목록 응답에는 Group 기본 위치 요약과 `meetingPlaceNote`를 함께 포함한다
- 상세 응답은 선택된 일정 정보와 `Group` 기본 장소/안내/다른 공개 일정까지 함께 반환한다

다음 조정에서는 아래 방향을 권장한다.

- 공개 검색 시작점은 계속 `Meeting` 목록으로 유지한다
- 검색 결과를 클릭하면 `GroupDetails` 페이지로 이동한다
- 상세 화면은 `Group`을 바깥 문맥으로 사용하되,
  선택된 `Meeting`의 장소를 포커스로 보여 준다
- `introduction`, `notice`, `changeSummary`는 현 단계에서 제외한다
- 위치 정보는 `Group`이 아니라 `Meeting`이 직접 가진다

---

## 공개 API

공개 API는 방문자의 정보 탐색을 위한 조회 전용 API다.

### 1. Meeting 목록 조회

## GET `/api/public/meetings`

지역 기준으로 모임 목록을 조회한다.

### Query Params

- `province` (required)
- `dayOfWeek` (optional)

### Response 200

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
      "meetingPlaceNote": "지하 강당",
      "groupLocation": {
        "name": "강남역 인근",
        "address": "서울특별시 강남구 테헤란로 123"
      }
    }
  ]
}
```

### 기본 검증

- `province`는 필수
- `province`는 허용값 내에 있어야 한다
- `dayOfWeek`가 있으면 허용값 내에 있어야 한다
- 공개 조회에서는 `active=true`인 Meeting만 반환

### 비고

현재 MVP에서 공개 탐색의 중심은 `Meeting`이다.  
상세 정보의 중심은 실제 구현에서도 `Group` 쪽으로 옮겨 두었다.  
모델 배경은 `../DOMAIN_MODEL.md`를 따른다.

---

## 다음 공개 상세 조정 방향

현재 `GET /api/public/meetings/{id}`는
검색 결과에서 바로 상세 패널을 여는 현재 구현을 지원한다.

다음 조정에서는 아래 구조를 권장한다.

### 1. 검색 API는 유지

- `GET /api/public/meetings`
- 역할: `province`, 필요 시 `dayOfWeek` 기준으로 검색 결과 목록 제공
- 검색 결과에는 `id`, `groupId`, `groupName`, `dayOfWeek`, `startTime`, `type`,
  그리고 해당 `Meeting`의 장소 요약이 포함된다

### 2. 상세 API는 `GroupDetails` 중심으로 재구성

권장 경로:

- `GET /api/public/groups/{id}`

권장 사용 방식:

- 프론트 라우트는 `/groups/:groupId?meetingId=:meetingId`
- API는 그룹 기본 정보와 공개 모임 목록을 반환한다
- 프론트는 `meetingId`를 사용해 초기 포커스 모임을 선택한다
- 사용자가 모임 목록을 다시 선택하면 장소 표시만 갱신한다

권장 응답 예시:

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
        "locationName": "강남역 인근",
        "locationAddress": "서울특별시 강남구 테헤란로 123"
      }
    ]
  }
}
```

이 구조에서는 `GroupDetails` 페이지가 아래 정보를 자연스럽게 표현할 수 있다.

- 그룹 이름
- 지역연합 정보
- 연락처
- 모임 리스트
- 선택된 모임의 장소

---

### 2. Meeting 단건 조회

## GET `/api/public/meetings/{id}`

모임 상세를 조회한다.

### Path Params

- `id`: Meeting 식별자

### Response 200

```json
{
  "data": {
    "id": 100,
    "groupId": 20,
    "groupName": "강남그룹",
    "province": "seoul",
    "dayOfWeek": "MONDAY",
    "startTime": "19:30",
    "type": "OPEN",
    "meetingPlaceNote": "지하 강당",
    "contactPhone": "02-1234-5678",
    "group": {
      "id": 20,
      "name": "강남그룹",
      "locationName": "강남역 인근",
      "locationAddress": "서울특별시 강남구 테헤란로 123",
      "introduction": "처음 오신 분도 편하게 문의하실 수 있습니다.",
      "notice": "공휴일 운영 여부는 대표 연락처로 먼저 확인해 주세요.",
      "changeSummary": "최근 장소 변경 없음"
    },
    "groupMeetings": [
      {
        "id": 100,
        "province": "seoul",
        "dayOfWeek": "MONDAY",
        "startTime": "19:30",
        "type": "OPEN",
        "meetingPlaceNote": "지하 강당"
      }
    ]
  }
}
```

### 기본 규칙

- 공개 조회에서는 `active=true`인 Meeting만 반환
- 연락 가능한 번호는 현재 등록된 GroupContact를 기준으로 반환
- 상세 응답은 선택된 일정이 속한 Group의 기본 장소와 다른 공개 일정을 함께 반환한다
- 사용할 대표 연락처 선택 방식은 구현에서 결정한다

### 다음 조정 메모

- 현재 단건 조회는 과도기적 상세 API로 본다
- 다음 구조에서는 `GroupDetails` 조회 API가 상세의 중심이 되고,
  `meetingId`는 포커스 지정 용도로 URL에 유지하는 편을 권장한다

### 기본 검증

- `id`는 숫자 형식
- 대상 없으면 404 반환

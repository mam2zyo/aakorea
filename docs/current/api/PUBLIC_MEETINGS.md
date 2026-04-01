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

### 기본 검증

- `id`는 숫자 형식
- 대상 없으면 404 반환

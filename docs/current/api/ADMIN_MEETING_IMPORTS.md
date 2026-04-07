<!-- docs/current/api/ADMIN_MEETING_IMPORTS.md -->

# API_ADMIN_MEETING_IMPORTS

## 이 문서의 역할

이 문서는 HTML 기반 모임표를 정제 JSON으로 변환한 뒤, 그 JSON을 현재 `Group`, `GroupContact`, `Meeting` 모델로 import 하는 운영 API 계약을 정리한다.

---

## 현재 구조 요약

- 1차 입력은 원본 HTML 문자열이다
- `normalize`는 HTML을 정제 JSON으로 변환한다
- `preview`와 `apply`는 HTML이 아니라 정제 JSON을 입력으로 받는다
- 현재 관리자 UI는 pre-generated 정제 JSON을 붙여넣거나 업로드한 뒤 `preview` / `apply` / `reset`을 사용한다
- apply는 정제 JSON을 바탕으로 District / Group / GroupContact / Meeting을 upsert 한다
- import는 현재 규칙상 `그룹명 다르면 다른 그룹`으로 본다
- 필요할 때 정제 JSON을 생성해 [imports](/home/mam2z/apps/aakorea-main/backend/aakorea-main/src/main/resources/imports)에 두고 검토한다
- 재생성 유틸은 [normalize_meeting_html.py](/home/mam2z/apps/aakorea-main/backend/aakorea-main/scripts/normalize_meeting_html.py)에 둔다

---

## 1. Normalize

### POST `/api/admin/meeting-imports/normalize`

### Request Body

```json
{
  "html": "<html>...</html>"
}
```

### Response 200

```json
{
  "data": {
    "sourceMeetingCount": 270,
    "issues": [],
    "groups": [
      {
        "districtName": "호남연합",
        "name": "다락방",
        "phone": "010-3912-1256",
        "notice": "송정공원역 4번 출구",
        "meetings": [
          {
            "dayOfWeek": "THURSDAY",
            "startTime": "19:00",
            "type": "NOTFIXED",
            "province": "GWANGJU",
            "locationAddress": "광주 광산구 상무대로 309-1",
            "locationDetail": "황금마트 3층",
            "contactPhoneOverride": null,
            "heuristicLocationSplit": false,
            "active": true
          }
        ]
      }
    ]
  }
}
```

---

## 2. Preview

### POST `/api/admin/meeting-imports/preview`

### Request Body

```json
{
  "sourceMeetingCount": 270,
  "issues": [],
  "groups": [
    {
      "districtName": "호남연합",
      "name": "다락방",
      "phone": "010-3912-1256",
      "notice": "송정공원역 4번 출구",
      "meetings": [
        {
          "dayOfWeek": "THURSDAY",
          "startTime": "19:00",
          "type": "NOTFIXED",
          "province": "GWANGJU",
          "locationAddress": "광주 광산구 상무대로 309-1",
          "locationDetail": "황금마트 3층",
          "contactPhoneOverride": null,
          "heuristicLocationSplit": false,
          "active": true
        }
      ]
    }
  ]
}
```

### Response 200

```json
{
  "data": {
    "sourceMeetingCount": 270,
    "importedGroupCount": 207,
    "importedMeetingCount": 270,
    "missingDistrictNames": ["호남연합"],
    "issues": [],
    "groups": [
      {
        "districtName": "호남연합",
        "name": "다락방",
        "phone": "010-3912-1256",
        "notice": "송정공원역 4번 출구",
        "meetingCount": 1,
        "meetings": [
          {
            "dayOfWeek": "THURSDAY",
            "startTime": "19:00",
            "type": "NOTFIXED",
            "locationAddress": "광주 광산구 상무대로 309-1",
            "locationDetail": "황금마트 3층",
            "contactPhoneOverride": null,
            "active": true,
            "heuristicLocationSplit": false
          }
        ]
      }
    ]
  }
}
```

---

## 3. Apply

### POST `/api/admin/meeting-imports/apply`

### Request Body

```json
{
  "sourceMeetingCount": 270,
  "issues": [],
  "groups": [
    {
      "districtName": "호남연합",
      "name": "다락방",
      "phone": "010-3912-1256",
      "notice": "송정공원역 4번 출구",
      "meetings": [
        {
          "dayOfWeek": "THURSDAY",
          "startTime": "19:00",
          "type": "NOTFIXED",
          "province": "GWANGJU",
          "locationAddress": "광주 광산구 상무대로 309-1",
          "locationDetail": "황금마트 3층",
          "contactPhoneOverride": null,
          "heuristicLocationSplit": false,
          "active": true
        }
      ]
    }
  ]
}
```

### Response 200

```json
{
  "data": {
    "sourceMeetingCount": 270,
    "importedGroupCount": 207,
    "importedMeetingCount": 270,
    "createdDistrictCount": 1,
    "createdGroupCount": 207,
    "updatedGroupCount": 0,
    "createdGroupContactCount": 207,
    "updatedGroupContactCount": 0,
    "createdMeetingCount": 270,
    "updatedMeetingCount": 0,
    "createdDistrictNames": ["호남연합"],
    "issues": []
  }
}
```

---

## 4. Reset

### POST `/api/admin/meeting-imports/reset`

### Request Body

없음

### Response 200

```json
{
  "data": {
    "deletedDistrictCount": 11,
    "deletedGroupCount": 207,
    "deletedGroupContactCount": 207,
    "deletedMeetingCount": 270
  }
}
```

---

## 현재 import 규칙 메모

- 기존 `boxtable` HTML은 예전 규칙대로 파싱한다
- `meeting_normalized.html` 같은 평면 `<table>` 형식에서는 `<!-- <tr>...</tr> -->` 행도 보존하고 `meeting.active = false`로 정제한다
- HTML 정규화 단계에서 일부 주소는 `김해시`, `청주시`, `삼척시` 같은 locality fallback으로 province를 추론한다
- `그룹명 다르면 다른 그룹`이다
- 같은 그룹명 안에서 전화번호 또는 정규화된 장소가 같으면 같은 그룹으로 묶는다
- 대표 전화번호 외 번호는 해당 meeting의 `contactPhoneOverride`에 기록한다
- 괄호/대괄호 안내 문구와 비주간 규칙도 `group.notice`에 `/` 구분으로 기록한다
- 같은 meeting key가 중복되면 `active=true`인 행을 우선한다
- reset은 테스트용으로 `meetings -> group_contacts -> groups -> districts` 순서로만 비운다
- 좌표는 원본 HTML에 없으므로 신규 생성 시 `null`이다
- 기존 Meeting 좌표가 있으면 update 시 유지한다
- import 적용 후 좌표가 비어 있는 모임은 `POST /api/admin/meetings/backfill-coordinates`로 일괄 보정할 수 있다

<!-- docs/current/domain/Meeting.md -->

# Meeting

## 이 문서의 역할

이 문서는 `Meeting`의 현재 모델 의미와 필드를 정리한다.

이 문서에 포함하지 않는 내용:

- 제품 범위 판단
- 사용자 행동 흐름
- API 요청 / 응답 JSON 상세

---

## 현재 모델 의미

`Meeting`은 공개 탐색의 시작점이며,
동시에 **장소와 일정의 실제 소유자**다.

현재 확정된 해석:

- 사용자는 `Meeting` 목록으로 탐색을 시작한다
- 공개 상세는 그룹 문맥으로 보여 주되, 실제 장소는 선택된 `Meeting` 기준으로 바뀐다
- 그룹 대표 번호와 다른 담당자를 써야 하는 예외도 `Meeting` 단위로 둔다

---

## 현재 핵심 필드

- `id`
- `groupId`
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

### 필드 메모

- 위치 정보는 내부적으로 `Location` 값 객체에 묶지만,
  API 계약에서는 평평한 필드로 노출한다
- `dayOfWeek`, `type`, `province`는 공용 값 타입을 따른다

---

## 현재 규칙

- 위치 ownership은 `Meeting`에 있다
- `locationDetail`, `locationAddress`는 함께 다룬다
- `province`는 저장 시 주소에서 자동 판별한다
- `latitude`, `longitude`는 둘 다 오거나 둘 다 비어 있어야 한다
- 좌표가 비어 있으면 서버가 카카오 REST API로 지오코딩을 시도한다
- `contactPhoneOverride`는 선택이다
- `active=true`만 공개 탐색에 노출된다

현재 운영 UI 규칙:

- 새 모임 추가의 기본 `active`는 `true`
- 새 모임 추가에서는 상태 필드를 노출하지 않는다
- 모임 수정에서만 `공개 중 / 비공개` 토글을 노출한다

---

## 공개 흐름에서의 의미

- 공개 검색의 시작점이다
- `/meetings`와 `/groups/:id` 상세 흐름 모두 결국 `Meeting` 선택 상태를 중심으로 동작한다
- 선택된 모임이 바뀌면 장소와 실제 전화 연결 번호도 함께 바뀐다

---

## 운영 흐름에서의 의미

- `Meeting`은 최상위 관리 화면보다 `Group` 편집 맥락 안에서 관리한다
- 현재 관리자 화면에서는 그룹 수정 시트 안에서 생성 / 수정 / 삭제한다
- 주소만 정확해도 서버가 지역과 좌표를 보정하므로 입력 비용을 줄이는 방향을 택한다

---

## 관계

- 하나의 `Meeting`은 하나의 `Group`에 속한다
- 하나의 `Group`은 여러 `Meeting`을 가진다
- 기본 연락처는 `GroupContact`를 따르고, 예외만 `contactPhoneOverride`를 쓴다

---

## 제외 / 보류

현재 핵심 필드로 채택하지 않는 정보:

- `meetingPlaceNote`
- 지오코딩 상태 메타데이터
- 주소 정규화 캐시
- 지도 공급자별 place id

---

## 관련 API 문서

- 공개 API: Swagger UI의 Public Meetings 영역 참고
- 관리자 API: Swagger UI의 Admin Meetings 영역 참고

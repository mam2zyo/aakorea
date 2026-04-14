<!-- docs/current/domain/SharedTypes.md -->

# SharedTypes

## 이 문서의 역할

이 문서는 여러 도메인이 함께 쓰는 **공용 값 타입과 값 객체**를 정리한다.

이 문서에 포함하지 않는 내용:

- 개별 엔티티의 책임과 소유권
- 공개 / 운영 화면 전체 흐름
- API 요청 / 응답 계약

---

## 1. Province

`Province`는 공개 모임 검색과 `Meeting.location.province`에 쓰는 지역 코드다.

현재 지원 코드:

- `seoul`
- `busan`
- `daegu`
- `incheon`
- `gwangju`
- `daejeon`
- `ulsan`
- `sejong`
- `gyeonggi`
- `gangwon`
- `chungbuk`
- `chungnam`
- `jeonbuk`
- `jeonnam`
- `gyeongbuk`
- `gyeongnam`
- `jeju`

현재 규칙:

- API에서는 문자열 코드로 다룬다
- `Meeting` 저장 시 주소 prefix로 자동 판별할 수 있다
- 공개 모임 검색에서는 필수 필터로 사용한다

---

## 2. DayOfWeek

`DayOfWeek`는 모임 반복 요일이다.

현재 API 표현:

- `MONDAY`
- `TUESDAY`
- `WEDNESDAY`
- `THURSDAY`
- `FRIDAY`
- `SATURDAY`
- `SUNDAY`

현재 규칙:

- 공개 검색에서는 선택 필터다
- `Meeting` 저장 시 필수 값이다

---

## 3. MeetingType

`MeetingType`은 공개 / 비공개 성격을 단순 분류한 enum이다.

현재 허용값:

- `OPEN`
- `CLOSED`
- `NOTFIXED`

`NOTFIXED`는 단일한 `OPEN` 또는 `CLOSED`로 설명하기 어려운 경우를 위한 완충값이다.

---

## 4. PostalContact

`PostalContact`는 `GroupContact` 안에 포함되는 우편 수신 정보 값 객체다.

현재 필드:

- `recipient`
- `postalCode`
- `roadAddress`
- `detailAddress`

현재 규칙:

- 전체가 비어 있으면 `null`처럼 취급한다
- 그룹 대표 연락처의 부가 정보로만 사용한다

---

## 5. Location

`Location`은 `Meeting` 안에 포함되는 위치 값 객체다.

현재 필드:

- `province`
- `detail`
- `address`
- `latitude`
- `longitude`

현재 규칙:

- API에서는 `locationDetail`, `locationAddress`, `latitude`, `longitude`처럼 평평한 필드로 풀어 낸다
- 현재 위치 ownership은 `Meeting`에만 있다

---

## 관련 문서

- `Meeting.md`
- `GroupContact.md`
- `../api/COMMON.md`
- `../api/ADMIN_MEETINGS.md`
- `../api/PUBLIC_MEETINGS.md`

# Group Public API DTO 리팩토링 메모

작성일: 2026-04-03

## 이 문서의 역할

이 문서는 `group` 패키지의 공개 API에서 서비스 내부 DTO가 직접 노출되던 구조를 왜, 어떻게 분리했는지 설명한다.

## 이 문서에 포함하지 않는 내용

이 문서는 모임 조회 기능 자체의 요구사항이나 JSON 필드 정의를 새로 정하지 않는다. 공개 API 계약 자체는 기존 문서를 그대로 따른다.

## 배경

리팩토링 전에는 공개 컨트롤러가 아래와 같이 서비스 내부 `record` 타입을 그대로 반환했다.

- `PublicMeetingQueryService.PublicMeetingSummary`
- `PublicMeetingQueryService.PublicMeetingDetail`
- `PublicMeetingQueryService.PublicGroupDetail`

이 구조는 당장은 동작하지만, 서비스 내부 표현이 곧바로 HTTP 응답 계약처럼 굳어지는 문제가 있다.

예를 들어 서비스 내부에서 필드 이름을 바꾸거나 DTO를 나누고 싶을 때, 컨트롤러와 JSON 응답까지 함께 흔들릴 수 있다.

## 이번 변경의 목표

이번 변경은 기능 변경이 아니라 책임 분리를 위한 구조 개선이다.

- 공개 API 응답 모델은 `api.publicapi` 패키지에 둔다.
- 서비스는 기존처럼 조회 결과를 만든다.
- 컨트롤러는 서비스 결과를 API 전용 DTO로 한 번 변환해서 응답한다.

즉, "서비스 내부 데이터"와 "외부로 약속한 응답 형태" 사이에 얇은 경계를 추가한 것이다.

## 변경 후 흐름

```text
PublicMeetingQueryService
    -> 서비스 내부 DTO 반환
PublicMeetingResponseMapper
    -> API 전용 DTO로 변환
PublicMeetingController / PublicGroupController
    -> API DTO를 HTTP 응답으로 반환
```

## 추가된 파일

- `backend/aakorea-main/src/main/java/org/aakorea/main/group/api/publicapi/PublicMeetingResponses.java`
- `backend/aakorea-main/src/main/java/org/aakorea/main/group/api/publicapi/PublicMeetingResponseMapper.java`

## 수정된 파일

- `backend/aakorea-main/src/main/java/org/aakorea/main/group/api/publicapi/PublicMeetingController.java`
- `backend/aakorea-main/src/main/java/org/aakorea/main/group/api/publicapi/PublicGroupController.java`
- `backend/aakorea-main/src/main/java/org/aakorea/main/group/api/publicapi/package-info.java`

## 초급 개발자를 위한 이해 포인트

### 1. 왜 DTO를 두 번 쓰는가

처음 보면 "서비스 DTO가 있는데 왜 API DTO를 또 만들지?"라는 생각이 들 수 있다.

여기서 중요한 것은 DTO의 개수보다 경계다.

- 서비스 DTO는 애플리케이션 내부 계산 결과를 표현한다.
- API DTO는 외부 클라이언트에게 약속한 응답 형태를 표현한다.

두 역할을 분리하면 내부 구현을 바꿔도 외부 계약을 안정적으로 유지하기 쉽다.

### 2. 매퍼가 하는 일

`PublicMeetingResponseMapper`는 한 객체를 다른 객체로 옮겨 담는 단순한 번역기다.

이 클래스는 비즈니스 규칙을 새로 만들지 않는다. 이미 서비스가 만든 값을, API 계층에서 쓰는 응답 DTO로 복사만 한다.

그래서 추후 서비스 내부 DTO가 바뀌더라도, 수정 지점을 매퍼 한 곳으로 좁힐 수 있다.

### 3. 이번 리팩토링으로 바뀌지 않은 것

- URL
- 요청 파라미터
- JSON 필드 이름
- 서비스의 조회 규칙
- 테스트가 기대하는 응답 내용

즉, 사용자 입장에서는 동작이 같고, 개발자 입장에서는 구조가 더 안전해졌다.

## 남은 확장 가능성

이번 작업은 공개 API만 대상으로 했다. 같은 문제는 `group` 패키지의 admin API나 다른 bounded context에도 비슷하게 존재할 수 있다.

다만 한 번에 넓게 바꾸면 변경량이 커지므로, 이번에는 공개 API 경계만 먼저 정리했다.

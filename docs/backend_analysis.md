# 백엔드 분석 보고서

## 1. 보안 분석

### [Critical] 세션 기반 인증 환경에서 CSRF 보호 비활성화
- **위치**: `SecurityConfig.java` (51행)
- **문제점**: `http.csrf(AbstractHttpConfigurer::disable)`가 호출되었습니다. 하지만 시스템은 인증을 위해 `HttpSessionSecurityContextRepository`(133행)를 사용하고 있습니다.
- **위험**: 인증이 브라우저에서 관리하는 세션 쿠키에 의존하기 때문에, 애플리케이션이 CSRF(Cross-Site Request Forgery) 공격에 취약합니다. 공격자는 로그인된 관리자가 악성 사이트를 방문할 경우 관리자 권한으로 동작을 수행하도록 유도할 수 있습니다.
- **권장사항**: CSRF 보호를 활성화하십시오. 프론트엔드가 다른 도메인에 있는 경우 `CookieCsrfTokenRepository.withHttpOnlyFalse()`를 사용하고, 프론트엔드에서 `X-XSRF-TOKEN` 헤더를 전송하도록 설정하십시오.

### [Warning] 관대한 보안 정책 (Permissive Policy)
- **위치**: `SecurityConfig.java` (70행)
- **문제점**: 필터 체인 끝에 `.anyRequest().permitAll()`이 사용되었습니다.
- **위험**: `/api/office/**` 패턴에 해당하지 않는 새 엔드포인트가 추가될 경우, 기본적으로 모두 공개됩니다. 이는 "화이트리스트" 방식이 아닌 "블랙리스트" 방식을 따르고 있어 보안상 위험합니다.
- **권장사항**: `.anyRequest().authenticated()`로 변경하여 모든 새로운 엔드포인트가 기본적으로 인증을 요구하도록 설정하십시오.

### [Warning] 데이터베이스 스키마 관리 설정
- **위치**: `application.yml` (10행)
- **문제점**: `spring.jpa.hibernate.ddl-auto: update`
- **위험**: 개발 시에는 편리하지만, 운영 환경에서 `update`를 사용하면 의도치 않은 스키마 변경이 발생하거나 애플리케이션 시작 시 성능 이슈가 발생할 수 있습니다.
- **권장사항**: 운영 환경에서는 `validate` 또는 `none`을 사용하고, Flyway나 Liquibase 같은 마이그레이션 도구를 통해 스키마를 관리하십시오.

---

## 2. 성능 분석

### [High] 모임 요약 조회 시 N+1 쿼리 문제
- **위치**: `PublicMeetingQueryService.java` (157-172행)
- **문제점**: `toSummary` 메서드에서 `meeting.getGroup().getName()`과 `meeting.getGroup().getDistrict().getId()`에 접근합니다.
- **위험**: 검색 결과로 100개의 모임이 반환될 경우, 각 모임마다 그룹(Group)과 지역(District) 엔티티를 조회하기 위한 추가 쿼리가 100번 발생합니다.
- **권장사항**: 리포지토리 쿼리나 Specification에서 `JOIN FETCH`를 사용하여 단일 쿼리로 그룹과 지역 엔티티를 함께 조회하도록 개선하십시오.



### [Low] 키워드 검색 시 Full Table Scan 위험
- **위치**: `MeetingSpecifications.java` (40행)
- **문제점**: 그룹 이름과 위치 상세 정보에 대해 `like %keyword%`를 사용합니다.
- **위험**: 와일드카드가 앞에 오는 검색은 표준 B-tree 인덱스를 활용할 수 없습니다.
- **권장사항**: 데이터 양이 적을 때는 문제가 없으나, 데이터가 많아질 경우 PostgreSQL의 Full-Text Search(tsvector)나 전용 검색 인덱스 도입을 고려하십시오.

---

## 3. 버그 가능성 및 리팩토링

### [Bug] 모임이 없는 그룹 조회 시 404 발생 가능성
- **위치**: `PublicMeetingQueryService.java` (93행)
- **문제점**: `activeMeetings.isEmpty()`일 경우 `getGroup`이 404 에러를 던집니다.
- **시나리오**: 시스템에 등록된 그룹이지만 현재 활성화된 모임이 하나도 없는 경우, 그룹 상세 페이지 전체가 404 에러를 반환하게 됩니다.
- **권장사항**: 모임이 없더라도 그룹 정보는 조회할 수 있도록 허용하거나, 의도된 비즈니스 로직인지 확인이 필요합니다.

### [Refactoring] 에러 응답 일관성
- **위치**: `GlobalExceptionHandler.java`
- **의견**: `ApiErrorCode`를 사용한 구조적 에러 처리가 잘 되어 있습니다.
- **개선**: `HttpMessageNotReadableException` 발생 시 어떤 필드나 형식이 잘못되었는지에 대한 힌트를 추가로 제공하면 프론트엔드 개발자의 연동 편의성을 높일 수 있습니다.

### [Refactoring] GIS 로직 중앙화
- **의견**: `PublicMeetingQueryService`가 거리 계산과 Specification 빌드 로직을 직접 처리하고 있습니다.
- **개선**: JTS Geometry 팩토리 로직 등을 전용 유틸리티나 컴포넌트로 분리하여 서비스 레이어를 깔끔하게 유지하십시오.

# 백엔드 패키지 구조 개선 제안서

## 1) 배경 및 목적

현재 프로젝트 README는 아키텍처 방향을 **모듈러 모놀리스**로 명확히 제시하고 있으며, 핵심 도메인 축(`basic`, `service`, `store`, `heart`)을 기준으로 장기적으로 MSA 분리를 고려하고 있습니다.

다만 현재 백엔드 코드는 `controller / service / repository / dto / domain` 중심의 **레이어 우선 패키징** 구조이며, `admin` 하위만 별도 분리된 형태입니다. 이 구조는 초기 개발 속도에는 유리하지만, 도메인 경계가 커질수록 다음 리스크가 생깁니다.

- 기능 변경 시 여러 상위 패키지를 횡단해야 해서 변경 영향도 파악이 어려움
- 도메인별 책임(예: meeting vs group vs district)이 패키지 레벨에서 약하게 표현됨
- 향후 `basic/service/store/heart` 단위로 분리할 때 물리적 이동 비용 증가

본 제안서는 README의 아키텍처 목표(모듈러 모놀리스 → 점진적 분리)에 맞춰, **도메인 중심 패키지 구조**로의 개편 방향을 제안합니다.

---

## 2) 현재 구조 진단 (요약)

현재 구조(요약):

- `io.step5.aakorea.controller` (+ `controller.admin`)
- `io.step5.aakorea.service` (+ `service.admin`)
- `io.step5.aakorea.repository`
- `io.step5.aakorea.domain`
- `io.step5.aakorea.dto` (+ `dto.admin`)

특징:

1. 횡단형 레이어 구조
   - 동일 도메인의 구성요소가 여러 패키지에 분산됨
2. admin 관심사의 별도 하위 패키지 존재
   - 운영 기능 분리 의도는 좋지만, 도메인 경계와 완전히 일치하지는 않음
3. README의 4대 모듈(`basic/service/store/heart`)과 코드 패키지 간 1:1 대응이 아직 없음

---

## 3) 목표 구조 원칙

패키지 개편은 아래 5개 원칙을 기준으로 진행하는 것을 권장합니다.

1. **도메인 우선, 레이어는 도메인 내부로 내재화**
   - 최상위는 업무 영역(모듈), 그 안에서 controller/application/domain/infrastructure를 배치
2. **읽기/쓰기 유스케이스 분리(CQRS-lite)**
   - 조회 API와 관리/변경 API의 애플리케이션 서비스 분리
3. **모듈 경계 명시**
   - 다른 모듈 접근은 `api`(public) 혹은 `port`를 통해서만 허용
4. **admin은 별도 모듈이 아니라 각 도메인의 유스케이스로 수용**
   - 예: `meeting` 도메인 안에 `admin` 유스케이스 패키지
5. **MSA 분리 가능한 물리적 단위 유지**
   - 모듈 별 독립 빌드/테스트 가능성을 염두

---

## 4) 제안 패키지 구조 (권장안)

```text
io.step5.aakorea
├─ common
│  ├─ config
│  ├─ exception
│  ├─ response
│  └─ security            (추후)
├─ modules
│  ├─ basic               // 비로그인 사용자 중심 기능
│  │  ├─ meeting
│  │  │  ├─ api           // Controller
│  │  │  ├─ application   // UseCase, Service
│  │  │  ├─ domain        // Entity, Enum, DomainService
│  │  │  ├─ infrastructure// JPA Adapter, Query impl
│  │  │  └─ dto
│  │  ├─ group
│  │  └─ content          // 소개/자료/공지성 콘텐츠
│  ├─ service             // 관리자/봉사자 업무 기능
│  │  ├─ district
│  │  ├─ gsr
│  │  ├─ group
│  │  └─ meeting
│  ├─ store               // 도서 구매
│  └─ heart               // 월간지 구독
└─ support
   ├─ persistence         // 공통 JPA 설정
   └─ external            // 외부 연동 어댑터
```

### 보조 규칙

- `Entity`는 해당 모듈 `domain` 외부 직접 참조 금지(필요 시 ID/읽기 전용 DTO/port 사용)
- `Repository interface`는 `application` 또는 `domain`에 두고, 구현체는 `infrastructure`에 배치
- API DTO와 내부 커맨드/쿼리 객체를 구분

---

## 5) 현재 코드의 매핑 예시

아래는 현재 주요 클래스의 권장 이동 예시입니다.

- `MeetingController` → `modules.basic.meeting.api` (공개 조회 API)
- `AdminGroupController` / `AdminDistrictController` / `AdminGsrController`
  → `modules.service.{group|district|gsr}.api`
- `MeetingQueryService`, `GroupQueryService`
  → `modules.basic.{meeting|group}.application.query`
- `AdminMeetingService`, `AdminGroupService`, `AdminDistrictService`, `AdminGsrService`
  → `modules.service.*.application.command`
- `*Repository`
  → 인터페이스/구현 분리 후 `modules.*.*.infrastructure.persistence`
- `ApiExceptionHandler`
  → `common.exception`

---

## 6) 단계별 전환 계획 (무중단 리팩터링)

### Phase 1. 패키지 골격 도입

- `common`, `modules`, `support` 최상위 패키지 생성
- 신규 기능부터 새 구조를 우선 적용
- 기존 코드는 유지 (혼재 허용)

### Phase 2. 조회 기능 우선 이관

- `meeting/group` 조회 API를 `modules.basic` 하위로 이동
- 기존 엔드포인트/응답 스펙은 유지
- 회귀 테스트로 동작 동일성 확인

### Phase 3. 관리자 기능 이관

- `admin` 패키지 기능을 `modules.service` 하위 도메인별로 분해
- 공통 예외/응답 포맷을 `common`으로 통일

### Phase 4. 저장소/도메인 경계 정리

- repository interface/adapter 분리
- 패키지 간 직접 엔티티 참조 최소화
- 모듈 간 의존 방향 검증(ArchUnit 등)

### Phase 5. MSA 대비 인터페이스 고정

- 모듈별 public API(내부용) 명세 고정
- store/heart 선제 분리 PoC 진행 가능 상태 확보

---

## 7) 기대 효과

1. **변경 용이성 향상**: 도메인 단위로 코드가 모여 영향 범위 추적이 쉬워짐
2. **협업 생산성 향상**: 팀이 모듈별로 병렬 작업 가능
3. **테스트 전략 고도화**: 모듈 단위 테스트 슬라이스 구성 용이
4. **분리 비용 절감**: 추후 store/heart 분리 시 코드 이동량 최소화

---

## 8) 리스크 및 대응

- 리스크: 대규모 패키지 이동으로 merge conflict 증가
  - 대응: 단계별(도메인 단위) PR, 이동 전후 API 회귀 테스트 자동화

- 리스크: 클래스 이동 중 순환 의존 발생
  - 대응: 모듈 의존 규칙 문서화 + ArchUnit 검사 도입

- 리스크: 개발자 적응 비용
  - 대응: 패키지 네이밍 컨벤션 문서 + 템플릿 제공

---

## 9) 결론

README에서 제시한 아키텍처 목표를 실제 코드 구조에 반영하려면, 레이어 중심 구조에서 **도메인 모듈 중심 구조**로 점진 이행하는 것이 가장 현실적입니다.

특히 현재 시점에서는 다음 3가지를 우선 실행하는 것을 권장합니다.

1. `modules.basic` / `modules.service` 골격 도입
2. `meeting`, `group` 조회 유스케이스 우선 이관
3. `admin` 기능을 도메인별 `modules.service.*`로 재배치

이 순서라면 기존 서비스 안정성을 유지하면서도, 향후 `store/heart` 분리 및 MSA 전환 준비도를 빠르게 높일 수 있습니다.

---

## 10) 대안안: **MSA 분리를 하지 않는 경우**의 권장 패키지 구조

MSA 분리 계획이 없다면, 패키지 설계의 최우선 목표는 "분리 용이성"보다 **운영 단순성/개발 속도/내부 일관성**이 됩니다.
이 경우에는 `basic/service/store/heart` 같은 서비스 분리 관점보다, 실제 변경 빈도가 높은 **업무 기능(feature) 중심 + 공통 기술 계층 최소화** 구조를 추천합니다.

### 10-1. 권장 구조 (Monolith 최적화형)

```text
io.step5.aakorea
├─ common
│  ├─ config
│  ├─ exception
│  ├─ util
│  └─ response
├─ feature
│  ├─ meeting
│  │  ├─ api
│  │  ├─ application
│  │  ├─ domain
│  │  ├─ persistence
│  │  └─ dto
│  ├─ group
│  │  ├─ api
│  │  ├─ application
│  │  ├─ domain
│  │  ├─ persistence
│  │  └─ dto
│  ├─ district
│  ├─ gsr
│  ├─ notice
│  └─ admin
│     ├─ api
│     ├─ application
│     └─ dto
└─ batch (필요 시)
```

핵심 포인트:

- `modules.basic/service/...`처럼 미래 분리 단위를 미리 강제하지 않고, 실제 기능 응집도를 기준으로 묶습니다.
- `infrastructure`를 크게 두는 대신 `persistence` 등 필요한 기술 하위만 feature 안에 둡니다.
- admin은 완전 별도 서비스가 아니라, 운영 화면/권한과 밀접하므로 `feature.admin`으로 집중 관리합니다.

### 10-2. 이 구조가 유리한 상황

1. 1개 팀 또는 소수 인원으로 장기간 운영 예정
2. 트래픽 특성상 서비스별 독립 스케일링 요구가 낮음
3. 배포 파이프라인을 단순하게 유지하는 것이 중요함
4. 도메인 분리보다 기능 개발 속도가 우선임

### 10-3. 설계 규칙 (MSA 미전제)

- 패키지 공개 범위를 축소하고(`package-private`) feature 외부 직접 호출 최소화
- feature 간 참조는 `application` 레벨로 제한 (controller/repository 직접 참조 금지)
- 공통 코드는 `common`으로 모으되, 3회 이상 중복될 때만 승격
- 트랜잭션 경계는 feature application service에서만 선언
- 조회 성능 최적화는 feature 내부 read model(DTO projection)로 처리

### 10-4. 현재 코드에 대한 적용 우선순위

1. `controller/service/repository/domain/dto` 횡단 패키지를 `feature` 하위로 1차 이동
2. `admin` 관련 클래스들을 `feature.admin`으로 집약
3. 예외 처리/응답 포맷을 `common`으로 통일
4. 테스트를 feature 단위(`meeting`, `group`, `admin`)로 재정렬

### 10-5. 기존 권장안과의 선택 기준

- **향후 분리 가능성(중~고)**: 본 문서의 4번 구조(`modules.basic/service/store/heart`) 권장
- **단일 애플리케이션 고정(중~고)**: 본 10번 구조(`feature` 중심) 권장

즉, "MSA를 하지 않는다"가 확정이라면, 미래 분리 대비를 위한 구조적 복잡성을 줄이고
**기능 응집/개발 생산성 최적화형 모놀리스 구조**를 선택하는 것이 더 실용적입니다.

---

## 11) FAQ: 모놀리스 구조로 개발하면서 `store.aakorea.org` / `heart.aakorea.org` 분리는 가능한가?

### Q1. 10-1 권장구조(`feature` 중심)로 개발해도 나중에 `store`, `heart`를 분리할 수 있나?

**가능합니다.** 다만 10-1 구조는 "분리를 하지 않을 가능성이 높은 조직"에 최적화된 구조이므로,
분리 가능성을 남기려면 아래 최소 규칙을 함께 적용하는 것이 좋습니다.

- `feature.store`, `feature.heart`는 다른 feature와 직접 클래스 참조를 피하고, 인터페이스(포트) 경유 호출
- DB 테이블도 논리적으로 경계를 구분(스키마 분리 또는 명확한 네이밍 규칙)
- 트랜잭션을 서브도메인 내부에서 닫고, 교차 기능은 이벤트/비동기 처리 우선
- 외부로 노출될 API 계약(요청/응답 DTO)을 초기에 안정화

즉, **완전 MSA 지향 구조보다 이동 비용은 조금 더 들 수 있지만**, 설계 규칙만 지키면
`store.aakorea.org`, `heart.aakorea.org`로의 단계적 분리는 충분히 현실적입니다.

### Q2. 한쪽(예: store) 서비스가 죽으면 전체 서비스가 먹통이 되나?

아키텍처 형태에 따라 다릅니다.

1. **단일 모놀리스(프로세스 1개)인 경우**
   - store 기능 오류가 전역 예외/스레드풀 고갈/DB 락 경합으로 번지면 전체 응답성이 떨어질 수 있습니다.
   - 즉, 설계를 잘못하면 "부분 장애 → 전체 장애"로 확산될 가능성이 있습니다.

2. **store/heart를 별도 서비스로 분리한 경우**
   - 정상적으로 격리되어 있으면 store 장애가 basic/service 전체를 즉시 먹통으로 만들지는 않습니다.
   - 다만 동기 호출 의존이 강하면 타임아웃 전파로 사용자 체감 장애가 생길 수 있습니다.

### Q3. 장애 전파를 줄이기 위해 지금부터 무엇을 준비해야 하나?

- 동기 호출에는 timeout + retry 제한 + circuit breaker 적용
- 필수 기능과 부가 기능(store/heart)을 라우팅/배포 단위에서 분리
- 장애 시 기본 사이트는 "핵심 조회 기능 우선"으로 degraded mode 제공
- 이벤트 기반 연동(주문, 결제 후처리, 구독 갱신 등)으로 결합도 축소
- 헬스체크/알람을 서브도메인별로 분리해 장애 감지와 복구를 독립화

결론적으로,
- **네, 분리는 가능**하고,
- **아니요, 반드시 전체가 먹통이 되는 것은 아닙니다.**

다만 이것은 패키지 이름보다도 "호출 방식(동기/비동기), 타임아웃 정책, 격리 배포" 설계 품질에 의해 결정됩니다.

---

## 12) 공통 `User`(통합 로그인) 사용 시 장애 전파 관점과 권장 접근

질문 시나리오:
- `store.aakorea.org`, `heart.aakorea.org`가 공통 `User`를 사용
- 사용자는 1회 로그인으로 도서 구매/월간지 구독을 모두 이용(SSO)

### 12-1. 결론부터

공통 `User`를 쓴다는 사실만으로 장애 전파가 "높다"고 단정되지는 않습니다.
장애 전파 여부는 **User를 어떤 방식으로 의존하는지**(실시간 동기 조회인지, 토큰 검증인지, 캐시/복제인지)에 의해 결정됩니다.

### 12-2. 위험도가 높아지는 구조

아래 구조에서는 전파 가능성이 커집니다.

1. 모든 요청마다 store/heart가 중앙 user-service DB를 동기 조회
2. 인증/인가 외에 프로필, 권한, 구독 상태까지 실시간 강결합 호출
3. 타임아웃/서킷브레이커/캐시 없이 동기 체인 호출

이 경우 user 쪽 장애가 store/heart 요청 지연·실패로 바로 이어질 수 있습니다.

### 12-3. 권장 구조 (실무 우선순위)

#### A안: 중앙 IdP + 로컬 검증(권장)

- 로그인은 중앙 인증 서버(예: Keycloak/사내 Auth)에서 수행
- store/heart는 JWT 서명키(JWKS) 기반 **로컬 토큰 검증**
- 업무 API 요청 시 user-service를 매번 호출하지 않음

장점:
- 인증 서버 순간 장애가 있어도, 이미 발급된 토큰은 만료 전까지 검증 가능
- 서비스 간 동기 의존 감소로 장애 전파 완화

#### B안: 사용자 읽기 모델 복제(Event-driven)

- 공통 User 변경 이벤트를 store/heart로 비동기 전파
- 각 서비스가 필요한 최소 사용자 정보(읽기 모델)만 로컬 보관

장점:
- 조회 시 원천 user-service 의존 최소화
- 부분 장애 시에도 읽기 기능 유지 용이

주의:
- 최종 일관성(eventual consistency) 전제 필요

#### C안: 단계적 현실안(모놀리스/초기단계)

- 초기에는 공통 User DB를 사용하되,
  - 인증은 세션/토큰 캐시,
  - 권한은 TTL 캐시,
  - 핵심 경로에 서킷브레이커/타임아웃 적용
- 이후 트래픽 증가 시 A안/B안으로 점진 전환

### 12-4. "1회 로그인"을 유지하면서도 안전하게 가는 체크리스트

- SSO는 하되, **업무 호출마다 중앙 User 동기조회 금지**
- Access Token 짧게, Refresh Token 회전으로 보안/가용성 균형
- 사용자 핵심 식별자(`userId`, `role`)는 토큰 클레임으로 전달
- 서비스별로 필요한 부가 정보만 로컬 read model/caching
- 장애 시 store/heart 각각 독립 degraded mode 제공
  - 예: 도서 구매는 일시 중단해도 월간지 조회는 계속 가능

### 12-5. 추천 의사결정

- 현재 규모가 작고 빠른 출시가 목표라면:
  - "공통 User + 캐시/타임아웃/서킷브레이커"로 시작
- 중기적으로 서비스 분리 가능성이 높다면:
  - 인증은 중앙 IdP, 사용자 데이터는 이벤트 기반 부분 복제로 전환

핵심은 "공통 User" 자체가 문제가 아니라,
**공통 User에 대한 런타임 의존을 동기식으로 강하게 묶어두는 설계**가 문제라는 점입니다.

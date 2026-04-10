<!-- docs/deferred/FUTURE_IMPLEMENTATION_GOALS.md -->

# FUTURE_IMPLEMENTATION_GOALS

## 이 문서의 역할

이 문서는 현재 MVP 범위 밖이지만, 추후 구현 목표로 유지할 기능과 권장 구현 방향을 정리한다.

이 문서가 답하는 질문:

- 어떤 기능을 중장기 구현 목표로 유지할 것인가?
- 현재 구조를 기준으로 각 기능은 어떤 식으로 확장하는 편이 좋은가?
- 어떤 선행 작업과 연관 관계를 고려해야 하는가?

이 문서에 포함하지 않는 내용:

- 현재 MVP 범위의 확정 기준
- 각 기능의 상세 API 계약 최종안
- 배포 / 운영 절차
- 안정화 이후 별도 기술 업그레이드 트랙

현재 범위 판단의 기준은 `../current/PRODUCT_SCOPE.md`,
현재 구현 상태의 기준은 `../current/IMPLEMENTATION_PLAN.md`,
현재 프론트 구조의 기준은 `../current/FRONTEND_STRUCTURE.md`를 따른다.

---

## 현재 기준에서의 출발점

현재 구현은 아래 상태를 출발점으로 본다.

- 공개 모임 검색은 지역 / 요일 기준 기본 검색과 현재 위치 nearby search를 제공한다
- `Meeting`에는 이미 주소와 `latitude`, `longitude`가 저장된다
- `ContentPage`, `Notice`의 본문은 Rich Text 에디터(TipTap) 기반의 HTML 문자열로 관리한다
- 범용 첨부파일(`Attachment`) 엔티티와 로컬 스토리지 기반의 파일 관리 체계가 구축되어 있다
- 공개 헤더 메뉴와 관리자 사이드바 메뉴는 현재 코드에 하드코딩되어 있다
- 주요 도메인의 `createdBy`, `updatedBy`, 변경 이력은 아직 추적하지 않는다
- 공개 프론트는 React + Vite SPA이고 SEO를 위한 SSR / SSG 구조는 아직 없다
- 권한 모델(AdminUser, Role, Permission)이 구축되어 운영자별 접근 제어가 가능하다

---

## 이번에 추후 구현 목표로 유지하는 항목

아래 5개 항목을 추후 구현 목표로 유지한다.

~~1. 모임 검색기능 고도화~~ (완료)
2. 관리자 페이지의 공개 사이트 메뉴 편집 기능 추가
3. SEO를 위한 프론트 Next.js 전환
4. 주요 도메인 변경점의 수정자 추적 기능
5. 권한 모델의 Scope 확장 (District / Group 단위 제한)

명시적 제외:

- `Java 25`, `Spring Boot 4.x`, virtual thread, JVM tuning은 위 기능 안정화 이후 별도 기술 업그레이드 트랙으로 다룬다

---

## 공통 설계 원칙

아래 원칙을 공통으로 유지하는 편이 좋다.

### 1. 코드가 책임지는 것과 DB가 책임지는 것을 분리한다

- 라우트 존재 여부, 권한 검증, 공개 여부 판단 같은 핵심 규칙은 코드가 최종 책임을 가진다
- DB는 라벨, 정렬, 노출 여부, draft 상태처럼 운영자가 조정할 수 있는 설정을 들고 가는 편이 안전하다

### 2. 공개 사이트와 관리자 콘솔은 같은 방식으로 확장하지 않는다

- 공개 사이트는 SEO, 성능, 링크 안정성이 중요하다
- 관리자 콘솔은 생산성, 권한, 감사 로그, 실수 방지가 더 중요하다

### 3. 권한, 메뉴, 변경 이력은 한 세트로 본다

- 메뉴를 데이터 기반으로 바꾸려면 권한 정보가 함께 와야 한다
- 누가 무엇을 바꿨는지 남기려면 운영자 식별 모델이 먼저 안정화되어야 한다

### 4. 공개 영향이 있는 설정은 draft / preview / publish를 우선 검토한다

- 현재 공개 테마처럼, 방문자에게 바로 노출되는 설정은 즉시 반영보다 초안과 게시 흐름이 더 안전하다
- 공개 사이트 메뉴도 같은 패턴을 재사용하는 편이 운영 리스크가 낮다

---

---

*이 항목은 현재 구현되어 2026-04-10 기준으로 MVP 범위에 포함되었습니다. 상태 머신 기반 검색 흐름과 클라이언트 사이드 캐싱 필터링이 적용되었습니다. 상세 설계는 `docs/current/FRONTEND_STRUCTURE.md`를, API 변경사항은 `docs/current/api/PUBLIC_MEETINGS.md`를 참조하세요.*

---

---

*이 항목은 현재 구현되어 2026-04-10 기준으로 MVP 범위에 포함되었습니다. 상세 설계와 구현은 `docs/current/domain/Attachment.md`와 `docs/current/api/ADMIN_ATTACHMENT.md`를 참조하세요.*

---

## 2. 관리자 페이지에 공개 사이트 메뉴 편집 기능 추가

### 목표

- 공개 헤더 / 푸터 메뉴를 관리자에서 편집할 수 있게 한다
- 방문자에게 보이는 메뉴는 임의 수정이 가능하되, 깨진 링크나 무의미한 메뉴 구성이 나오지 않게 제약을 둔다

### 권장 구현 방향

- 공개 메뉴는 관리자 메뉴보다 더 강한 초안 / 미리보기 / 게시 흐름이 필요하다
- 현재 공개 테마가 `draft / publish / rollback` 구조를 가지므로, 메뉴도 같은 흐름을 재사용하는 편이 좋다

### 권장 메뉴 타입

- `PUBLIC_HEADER`
- `PUBLIC_FOOTER`
- 필요 시 `PUBLIC_QUICK_LINKS`

### 메뉴 아이템의 타깃 제안

- `HOME`
- `MEETINGS`
- `NOTICE_LIST`
- `CONTENT_PAGE`
- `EXTERNAL_URL`

- 공지 상세 단건이나 임의 내부 경로 직접 입력보다, 의미 있는 타깃 타입을 고르는 방식이 안전하다

### 편집 기능 제안

- 드래그 정렬
- 노출 / 숨김
- 새 창 열기 여부
- 외부 링크 여부
- `ContentPage` 선택형 연결
- 메뉴 미리보기
- 게시 / 롤백

### 주의점

- 공개 메뉴와 실제 라우트 존재 여부는 항상 검증해야 한다
- 삭제되었거나 비게시된 `ContentPage`를 가리키는 메뉴는 저장 시 차단하거나 자동 비활성화하는 규칙이 필요하다
- 공개 메뉴는 Next.js 전환과 함께 metadata / breadcrumbs / sitemap 생성 기준에도 영향을 준다

---

## 3. SEO를 위한 프론트 Next.js 전환

### 목표

- 공개 페이지를 검색엔진 친화적으로 전환한다
- 메타데이터, sitemap, canonical, OG 정보 같은 SEO 기본기를 함께 강화한다
- 현재 관리자 콘솔의 생산성을 해치지 않는 방식으로 전환한다

### 권장 구현 방향

- 전체 프론트를 한 번에 Next.js로 옮기기보다, 공개 사이트만 Next.js로 분리하고 관리자 콘솔은 기존 SPA를 유지하는 하이브리드 전환이 가장 현실적이다
- SEO의 직접 수혜는 공개 홈 / 안내 / 공지 / 콘텐츠 페이지가 크고, 관리자 화면은 SSR 이점이 거의 없기 때문이다

### 권장 대상 범위

1. `/`
2. `/content-pages/[key]`
3. `/notices`
4. `/notices/[id]`
5. `/meetings`

- 이 중 `/meetings`는 검색 폼과 모달 상호작용이 많으므로 “서버 렌더링되는 페이지 셸 + 클라이언트 검색 컴포넌트” 구조가 적절하다

### 마이그레이션 제안

1. 백엔드 API 계약은 가능한 한 유지한다
2. Next.js App Router 기반으로 공개 전용 앱을 먼저 만든다
3. 홈 / 안내 / 공지 페이지부터 이전한다
4. `/meetings`는 마지막에 옮기고, 지도 / 모달 / query 상태는 client component로 남긴다
5. `/admin`은 기존 Vite 앱을 유지하거나 별도 배포 단위로 둔다

### SEO 구현 메모

- 콘텐츠 페이지와 공지는 서버에서 title / description / canonical / OG 태그를 생성하는 편이 좋다
- `sitemap.xml`, `robots.txt`, 구조화 데이터(JSON-LD)도 함께 도입하는 편이 좋다
- 공지 / 콘텐츠의 대표 요약문을 만들 수 있도록 excerpt 생성 규칙도 함께 검토한다

### 배포 메모

- 같은 도메인 아래에서 `nginx` 또는 게이트웨이가 공개 라우트는 Next.js로, `/api`는 Spring Boot로, `/admin`은 기존 관리자 앱으로 라우팅하는 구성이 무난하다
- 공개 테마 preview query와 같은 현재 기능은 Next.js에서도 유지 가능한지 초기에 검증해 두는 편이 좋다

---

*이 항목은 현재 구현되어 2026-04-10 기준으로 MVP 범위에 포함되었습니다. 상세 설계와 구현은 `docs/current/auth/AUTHORIZATION_POLICY.md`와 `docs/current/auth/AUTHENTICATION_MODEL.md`를 참조하세요.*

---

## 4. 주요 도메인 변경점에 대해서 수정한 사람 추적 기능

### 목표

- 누가 어떤 주요 도메인을 언제 수정했는지 추적한다
- 운영 화면에서 최근 수정자와 변경 이력을 확인할 수 있게 한다

### 권장 구현 방향

- 단순 `updatedBy`만 붙이는 수준과, 실제 변경 이벤트를 남기는 수준을 분리해서 보는 편이 좋다
- 최소 2단계 접근이 적절하다

1. 주요 엔티티 공통 감사 필드 추가
2. 읽기 쉬운 변경 이벤트 로그 추가

### 권장 대상 도메인

- `District`
- `Group`
- `GroupContact`
- `Meeting`
- `ContentPage`
- `Notice`
- `PublicThemeSetting`
- 추후 메뉴 / 권한 관련 도메인

### 1단계 제안

주요 엔티티에 아래 공통 필드를 둔다.

- `createdAt`
- `createdBy`
- `updatedAt`
- `updatedBy`

- Spring Data JPA auditing + `AuditorAware`를 사용해 현재 로그인한 운영자를 연결하는 방식이 가장 단순하다

### 2단계 제안

- 별도 `AuditEvent` 또는 `ChangeLog` 테이블을 두고 도메인별 주요 변경점을 기록한다

권장 필드 예시:

- `entityType`
- `entityId`
- `action`
  예: `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `ROLLBACK`
- `actorId`
- `actorNameSnapshot`
- `occurredAt`
- `summary`
- `diffJson`

### 구현 원칙

- 모든 필드 전체를 기계적으로 저장하기보다, 운영자가 읽을 수 있는 변경 요약을 같이 남기는 편이 좋다
- 예를 들어 `Meeting`은 요일 / 시각 / 주소 / 공개 상태 변경을 요약하고, `PublicThemeSetting`은 게시 / 롤백 이벤트를 별도 action으로 남기는 편이 좋다
- import, backfill 같은 배치성 변경은 `SYSTEM` 또는 `BATCH` actor 유형을 구분할 수 있어야 한다

### UI 제안

- 목록 화면에는 `최종 수정 시각`, `최종 수정자`를 노출한다
- 상세 편집 화면에는 “변경 이력” 패널 또는 드로어를 붙이는 편이 좋다
- 권한 모델과 연결해 `audit:read` 권한이 있는 사용자만 이력을 보게 하는 편이 좋다

---

## 5. 권한 모델의 Scope 확장 (District / Group 단위 제한)

### 목표

- 모든 운영자가 전역 권한을 갖는 대신, 특정 지역연합(District)이나 그룹(Group)으로 권한 범위를 제한할 수 있게 한다.
- 대규모 운영 환경에서 실수와 보안 리스크를 줄인다.

### 권장 구현 방향

- 현재의 `AdminUserPermissionGrant`에 `scopeType`과 `scopeId` 필드를 추가하여 확장한다.
- 백엔드의 각 서비스 계층에서 대상 데이터의 소속 정보를 현재 principal의 scope와 비교 검증하는 로직을 추가한다.
- 프론트엔드에서는 선택된 scope에 따라 필터링된 목록을 보여준다.

---

## 권장 구현 순서

의존 관계를 고려하면 아래 순서를 권장한다.

1. 주요 도메인 수정자 추적 기능
2. 공개 사이트 메뉴 편집 기능
3. 모임 검색 고도화
4. 공개 프론트 Next.js 전환
5. 권한 모델 Scope 확장

이 순서를 권장하는 이유는 아래와 같다.

- 권한과 변경 이력이 먼저 있어야 이후 운영 기능이 안전해진다
- 메뉴 기능은 권한 모델과 자연스럽게 연결된다
- 콘텐츠 에디터와 공개 메뉴 구조가 먼저 안정돼야 Next.js 전환 시 중복 변경을 줄일 수 있다

단, SEO 우선순위가 특히 높다면 `Next.js 공개 전환`은 `공지 / 콘텐츠 에디터`와 병렬로 탐색할 수 있다.

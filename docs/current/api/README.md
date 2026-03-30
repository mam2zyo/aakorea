<!-- docs/current/api/README.md -->

# API

## 이 문서의 역할

이 문서는 AAKorea Main 웹앱의 현재 MVP API 문서 구조를 안내하는 허브다.

이 문서가 답하는 질문:

- 현재 API 계약은 어디서 확인하는가?
- 어떤 API 문서를 어떤 기준으로 나누었는가?
- 어떤 순서로 API 문서를 읽으면 되는가?
- 현재 MVP에서 우선 필요한 API는 무엇인가?

이 문서에 포함하지 않는 내용:

- 각 엔드포인트의 상세 요청/응답 형식
- 공통 응답 형식과 상태 코드의 상세 정의
- 필드 채택 이유나 도메인 배경 설명
- 구현 단계별 작업 순서

---

## 현재 API 문서 구조

현재 MVP의 API 계약 기준 문서는 `current/api/` 아래에 둔다.

- `COMMON.md`
  공통 규약, 응답 형식, 상태 코드, 값 형식, 공통 주의사항

- `AUTH.md`
  운영 인증 API 계약

- `PUBLIC_CONTENT.md`
  공개 `ContentPage`, `Notice` 조회 API 계약

- `PUBLIC_MEETINGS.md`
  공개 `Meeting` 조회 API 계약

- `ADMIN_ORG.md`
  운영 `District`, `Group`, `GroupContact` API 계약

- `ADMIN_MEETINGS.md`
  운영 `Meeting` API 계약

- `ADMIN_CONTENT.md`
  운영 `ContentPage`, `Notice` API 계약

즉, 공통 규칙은 한 문서에 두고,  
엔드포인트 계약은 책임별 문서로 분리한다.

---

## 권장 읽기 순서

처음 API 문서를 읽을 때는 아래 순서를 권장한다.

1. `COMMON.md`
2. `AUTH.md`
3. `PUBLIC_CONTENT.md`
4. `PUBLIC_MEETINGS.md`
5. `ADMIN_ORG.md`
6. `ADMIN_MEETINGS.md`
7. `ADMIN_CONTENT.md`

이 순서는 다음 흐름을 따른다.

- 공통 규약을 먼저 이해하고
- 인증 구조를 확인한 뒤
- 공개 조회 API를 보고
- 운영 입력 API를 본다

---

## 최소 운영 화면 기준으로 필요한 API 요약

현재 MVP에서 우선 필요한 API를 요약하면 아래와 같다.

### 공개

- `GET /api/public/content-pages/{key}`
- `GET /api/public/notices`
- `GET /api/public/notices/{id}`
- `GET /api/public/meetings`
- `GET /api/public/meetings/{id}`

### 인증

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 운영

- `GET /api/admin/districts`
- `POST /api/admin/districts`
- `PUT /api/admin/districts/{id}`
- `GET /api/admin/groups`
- `POST /api/admin/groups`
- `PUT /api/admin/groups/{id}`
- `GET /api/admin/group-contacts`
- `POST /api/admin/group-contacts`
- `PUT /api/admin/group-contacts/{id}`
- `GET /api/admin/meetings`
- `POST /api/admin/meetings`
- `PUT /api/admin/meetings/{id}`
- `GET /api/admin/content-pages`
- `POST /api/admin/content-pages`
- `PUT /api/admin/content-pages/{id}`
- `GET /api/admin/notices`
- `POST /api/admin/notices`
- `PUT /api/admin/notices/{id}`

---

## 현재 보류하는 API

아래 API는 현재 MVP의 직접 범위에 포함하지 않는다.

### 1. 일반 사용자 계정 API

- 회원가입
- 사용자 로그인
- 비밀번호 재설정
- 마이페이지

### 2. 복잡한 권한 관리 API

- 역할별 운영자 권한 관리
- 승인 워크플로우
- 세분 권한 매트릭스

### 3. 범용 게시판 API

- 게시글
- 댓글
- 첨부파일
- 커뮤니티 상호작용

### 4. 고급 탐색 API

- 복합 검색
- 추천
- 즐겨찾기
- 개인화 피드

### 5. 미디어 자산 API

- 이미지 업로드
- 파일 라이브러리
- 첨부 재사용 관리

---

## 사용 원칙

API 문서를 사용할 때는 아래 방식으로 본다.

- 공통 규약을 확인할 때: `COMMON.md`
- 인증 API를 확인할 때: `AUTH.md`
- 공개 콘텐츠 API를 확인할 때: `PUBLIC_CONTENT.md`
- 공개 모임 API를 확인할 때: `PUBLIC_MEETINGS.md`
- 운영 조직 API를 확인할 때: `ADMIN_ORG.md`
- 운영 모임 API를 확인할 때: `ADMIN_MEETINGS.md`
- 운영 콘텐츠 API를 확인할 때: `ADMIN_CONTENT.md`

필드 의미의 원본은 여전히 `../MVP_FIELDS.md`를 따른다.  
도메인 배경은 `../DOMAIN_MODEL.md`를 따른다.

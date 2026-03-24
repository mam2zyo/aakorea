# A.A. KOREA 웹앱 리뉴얼 프로젝트

> "고통받는 알코올 중독자가 AA 모임에 관한 정보를 빠르게 찾을 수 있고, 기존 멤버들과 관련 전문가들에게 유용한 자료를 제공하며, 관리자 및 봉사자들에게 효율적인 업무 환경을 제공하는 것을 목표로 합니다."

본 프로젝트는 기존 `www.aakorea.org`의 파편화된 정보 구조를 개선하고, 최신 웹 기술 스택을 활용해 사용자 중심의 직관적인 웹앱을 재구축하는 프로젝트입니다.

## Tech Stack

- Backend: Java 21, Spring Boot 3.5.x, Spring Data JPA
- Database: PostgreSQL 18
- Frontend: React, Tailwind CSS, Vite
- Architecture: Modular Monolith

## 프로젝트 방향

시스템은 단일 애플리케이션으로 시작하되, 도메인 경계를 분리한 모듈러 모놀리스 구조를 채택합니다.
핵심 서비스는 공개 정보 조회, 운영 백오피스, 회원/주소록, 도서 판매, 월간지 구독의 다섯 축으로 구성됩니다.

- `basic`: 비로그인 사용자 대상 공개 정보, 모임 찾기, 안내 콘텐츠
- `service`: 관리자 및 봉사자용 조직/그룹/모임/공지 관리
- `member`: 인증, 역할, 프로필, 배송지 마스터
- `store`: 도서 주문, 재고, 배송 처리
- `heart`: 월간지 구독, 발송 이력, 만료 관리

## 현재 구현 상태

현재 저장소에는 아래 범위의 초기 구현이 포함되어 있습니다.

- 백엔드: 공개 모임 조회 API, 그룹 상세 조회 API, 관리자용 지역연합/그룹/GSR 관리 API
- 프론트엔드: 모임 검색 화면, 그룹 상세 화면, 관리자용 지역연합/그룹 관리 화면
- 테스트: 관리자 컨트롤러 테스트와 모임 저장소 테스트 일부 포함

아직 전체 도메인이 완성된 상태는 아니며, `store`, `heart`, 인증/인가 고도화 등은 후속 구현 범위입니다.

## 문서 안내

상세 설계와 요구사항은 아래 문서로 분리해 관리합니다.

- [도메인 명세서](./docs/DOMAIN_SPEC.md): 아키텍처 원칙, 모듈 경계, 데이터 소유권, 핵심 엔티티와 도메인 규칙
- [요구사항 명세서](./docs/REQUIREMENTS.md): 사용자 그룹별 목표, 서비스 요구사항, 주요 이용 시나리오

## 저장소 구성

```text
backend/
frontend/
docs/
```

`backend`와 `frontend`는 각각 서버와 클라이언트 애플리케이션을 담당하며, `docs`는 설계 및 요구사항 문서를 관리합니다.

## 사전 준비

로컬 개발을 위해 아래 환경을 권장합니다.

- Java 21
- Node.js 20 이상
- npm
- PostgreSQL 18

백엔드는 기본적으로 로컬 PostgreSQL 데이터베이스를 사용하도록 설정되어 있습니다.

- DB URL: `jdbc:postgresql://localhost:5432/aakorea`
- Username: `servant`
- Password: `1234`

테스트는 H2 메모리 DB 설정을 사용합니다.

## 빠른 시작

### 1. 백엔드 실행

작업 디렉터리:

```powershell
cd backend\aakorea
```

애플리케이션 실행:

```powershell
.\gradlew.bat bootRun
```

테스트 실행:

```powershell
.\gradlew.bat test
```

### 2. 프론트엔드 실행

작업 디렉터리:

```powershell
cd frontend\aakorea
```

의존성 설치:

```powershell
npm install
```

개발 서버 실행:

```powershell
npm run dev
```

프로덕션 빌드:

```powershell
npm run build
```

## 개발 메모

- 프론트엔드의 API 호출은 상대 경로 `fetch(path)`를 사용하므로, 로컬 개발 시 프록시 또는 동일 오리진 구성 여부를 함께 점검해야 합니다.
- 백엔드 기본 설정은 `ddl-auto: update`, `show-sql: true`로 되어 있어 개발 편의 중심입니다.
- 테스트 프로파일은 H2의 PostgreSQL 호환 모드를 사용합니다.

<!-- README.md -->

# AAKorea Main 웹앱 프로젝트

> AAKorea Main 웹앱 프로젝트는 기존 `www.aakorea.org`의 파편화된 정보 구조와 직관적이지 않은 인터페이스를 개선하고, 사용자 중심의 웹앱으로 재구축하는 것을 목표로 합니다. 세부적으로는

> 1. 도움을 필요로 하는 알코올중독자가 AA 에 관한 정보를 빠르게 찾을 수 있도록 돕고,
> 2. AA 멤버들에게 모임 생활에 필요한 정보에 효율적으로 접근할 수 있도록 돕고,
> 3. 알코올중독자의 가족이나 이해관계 당사자들에게도 유용한 정보를 제공하며
> 4. GSO 관리자나 봉사자들이 업무를 효율적으로 볼 수 있는 환경을 제공하는 것입니다.

현재 프로젝트는 **초기 구현 단계**이며, 먼저 아래 핵심 사용자 가치를 빠르게 검증하는 방향으로 진행합니다.

- 초심자가 `Province` 기준으로 `Meeting`을 검색할 수 있어야 한다
- 모임 조회 후 `GroupContact.phone`으로 바로 전화할 수 있어야 한다
- 운영자는 `District`, `Group`, `Meeting`, `ContentPage`, `Notice`를 관리할 수 있어야 한다

---

## 기술 스택

### Backend

- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security

### Database

- PostgreSQL

### Frontend

- React
- Vite

프론트엔드 앱은 `frontend/aakorea-main` 아래에 있으며,  
공개 홈/안내 페이지/공지/모임 조회와 운영 `District`/`Group`/콘텐츠 관리 화면을 React + Vite로 구성한다.

---

## 저장소 구성

```text
backend/
  aakorea-main/
frontend/
  aakorea-main/
docs/
```

- `backend/aakorea-main`: Spring Boot 기반 백엔드 애플리케이션
- `frontend/`: 프론트엔드 작업 영역
- `docs/`: 프로젝트 문서

---

## 문서 안내

현재 프로젝트 문서는 `docs/` 아래에서 관리합니다.

문서 허브:

- [docs/README.md](./docs/README.md)

---

## 빠른 시작

## 1. 백엔드 실행

작업 디렉터리:

```powershell
cd backend\aakorea-main
```

애플리케이션 실행:

```powershell
.\gradlew bootRun
```

테스트 실행:

```powershell
.\gradlew test
```

---

## 2. 프론트엔드 실행

작업 디렉터리:

```bash
cd frontend/aakorea-main
```

개발 서버 실행:

```bash
npm run dev
```

빌드:

```bash
npm run build
```

프론트엔드는 기본적으로 `/api` 상대 경로를 사용하고,  
로컬 개발에서는 Vite proxy가 `http://localhost:8080` 백엔드로 요청을 전달한다.

---

## 로컬 개발 환경

권장 환경:

- Java 21
- Node.js 20 이상
- npm
- PostgreSQL

백엔드는 기본적으로 로컬 PostgreSQL을 사용하도록 구성합니다.

권장 설정 파일:

- `application-local.yml`
- `application-test.yml`

예시 DB 설정:

- URL: `jdbc:postgresql://localhost:5432/aakorea`
- Username: `<local username>`
- Password: `<local password>`

---

## 개발 메모

- 프론트엔드는 API 호출을 상대 경로 기반으로 구성합니다
- 로컬 개발 시 프론트엔드는 Vite proxy로 `/api` 요청을 백엔드로 전달합니다
- 현재는 최소 필드 기준으로 빠르게 CRUD와 조회 흐름을 검증하는 것이 우선입니다
- 현재 프론트엔드는 공개 홈과 안내 페이지, 공지, 모임 찾기, 운영 로그인, `District` 관리, `Group` 중심 작업공간, 콘텐츠 관리 화면을 제공합니다

현재 가장 먼저 검증할 핵심 흐름:

1. 운영자가 `District`를 생성한다
2. 운영자가 `Group`과 `GroupContact.phone`을 생성한다
3. 운영자가 `Meeting`을 생성한다
4. 운영자가 `ContentPage`와 `Notice`를 게시한다
5. 공개 사용자가 안내 페이지와 공지를 확인한다
6. 공개 사용자가 `Province` 기준으로 모임을 조회한다
7. 모임 조회 후 전화번호로 바로 연결한다

---

## 라이선스 / 운영 참고

라이선스 정책, 배포 전략, 운영 환경 구성 등은 프로젝트가 더 안정화된 뒤 별도 문서로 정리합니다.

<!-- README.md -->

# AAKorea Main 웹앱 프로젝트

> AAKorea Main 웹앱 프로젝트는 기존 `www.aakorea.org`의 파편화된 정보 구조와 직관적이지 않은 인터페이스를 개선하고, 사용자 중심의 웹앱으로 재구축하는 것을 목표로 합니다. 세부적으로는
> 1. 도움을 필요로 하는 알코올중독자가 AA 에 관한 정보를 빠르게 찾을 수 있도록 돕고,
> 2. AA 멤버들에게 모임 생활에 필요한 정보에 효율적으로 접근할 수 있도록 돕고,
> 3. 알코올중독자의 가족이나 이해관계 당사자들(치료시설, 교정시설, 법원 관계자 등)에게도 유용한 정보를 제공하며
> 4. GSO 관리자나 봉사자들이 업무를 효율적으로 볼 수 있는 환경을 제공하는 것입니다.

이 프로젝트는 우선 아래 핵심 사용자 가치를 빠르게 검증하는 방향으로 진행합니다.

- 사용자가 지역을 기준으로 모임을 검색하고, 상세 조건(연합, 요일, 유형, 키워드)으로 필터링할 수 있어야 한다.
- 현재 위치 기준 일정 반경 이내의 가까운 모임을 실시간으로 찾을 수 있어야 한다.
- 모임 조회 후 모바일에서 바로 전화할 수 있어야 한다.
- 관리자가 지역연합 정보 및 그룹/모임 정보를 쉽게 생성, 수정, 삭제할 수 있어야 한다.
- 관리자가 공지 및 첨부파일을 직관적으로 생성, 수정, 삭제할 수 있어야 한다.

---

## 기술 스택

### Backend
- Java 21
- Spring Boot 3.5
- Spring Data JPA
- Spring Security

### Database
- PostgreSQL + PostGIS

### Frontend
- React (관리자 오피스)
- SvelteKit (사용자 웹앱)

---

## 저장소 구성

```text
backend/     # Spring Boot 백엔드 애플리케이션
web/         # SvelteKit 사용자 웹앱 (SSR/Node)
office/      # React + Vite 관리자 오피스 (Static SPA)
deploy/      # Nginx 설정 및 OCI 배포 쉘 스크립트
docs/        # 분석 및 설계 문서
```

---

## 문서 안내

현재 프로젝트 설계 및 사양 문서는 `docs/` 아래에서 체계적으로 관리합니다. 자세한 안내는 [docs/README.md](./docs/README.md) 파일을 참고하십시오.

*   [Core 개념 정의](./docs/core/): [제품 범위(Product Scope)](./docs/core/PRODUCT_SCOPE.md), [사용자 유스케이스](./docs/core/ACTORS_AND_USE_CASES.md), [개발 로드맵](./docs/core/ROADMAP.md)
*   [도메인 모델 스펙](./docs/domain/): [Meeting](./docs/domain/Meeting.md), [Group](./docs/domain/Group.md), [District](./docs/domain/District.md) 등 주요 엔티티 스펙
*   [분석 및 감사 보고서](./docs/README.md#3-코드-분석-및-감사-보고서-root): [백엔드 분석](./docs/backend_analysis.md), [웹 성능 분석](./docs/low-end-mobile-css-performance.md) 등
*   [PostGIS 설치 가이드](./docs/postgis-setup.md): 공간 검색 기능 활성화를 위한 데이터베이스 설정 가이드

---

## 빠른 시작

### 1. 백엔드 실행

로컬 환경 변수 설정 템플릿 복사 및 실행:

```bash
# 템플릿 복사
cp deploy/env/local-dev.env.example ~/aakorea-local.env
# 내용 수정 (DB 비밀번호, 카카오 API 키 등 입력)
nano ~/aakorea-local.env

# 백엔드 디렉터리 이동 및 환경 변수 로드 후 실행
cd backend
set -a
source ~/aakorea-local.env
set +a
./gradlew bootRun
```

백엔드 로컬 실행 시 카카오 주소 지오코딩을 사용하려면 `AAKOREA_KAKAO_REST_API_KEY` 환경 변수가 필요합니다.

테스트 실행:
```bash
cd backend
./gradlew test
```

---

### 2. 사용자 웹 (SvelteKit) 실행

사용자 화면 웹 애플리케이션은 SvelteKit 기반으로 빌드됩니다.

```bash
cd web
npm install
npm run dev
```

*   **개발 서버 주소:** `http://localhost:5173`
*   **Vite Proxy:** `/api` 경로의 요청을 `http://localhost:8081` 백엔드로 자동 프록시합니다.
*   **지도의 정상 동작을 위한 환경 변수 설정 (중요):**
    대화면 지도 렌더링 및 모바일 길찾기 링크 활성화를 위해 실행 전 또는 `web/` 경로 아래 `.env` 파일에 아래 환경 변수 설정이 권장됩니다.
    *   `VITE_KAKAO_MAP_JAVASCRIPT_KEY`: 카카오맵 로드용 자바스크립트 키 (미설정 시 지도 영역이 렌더링되지 않음)
    *   `VITE_TMAP_APP_KEY`: 티맵 길안내 버튼 연동용 API Key (선택 사항)
    
    *`.env` 파일 작성 예시 (`web/.env`):*
    ```env
    VITE_KAKAO_MAP_JAVASCRIPT_KEY=your_kakao_key_here
    VITE_TMAP_APP_KEY=your_tmap_key_here
    ```

---

### 3. 관리자 오피스 (React) 실행

관리자용 화면은 React + Vite SPA로 빌드되며, 빌드 결과물은 Nginx의 `/office` 경로에 정적으로 배포됩니다.

```bash
cd office
npm install
npm run dev
```

*   **개발 서버 주소:** `http://localhost:3001/office/`
*   **Vite Proxy:** `/api` 경로의 요청을 `http://localhost:8081` 백엔드로 자동 프록시합니다.

---

## 로컬 개발 환경

권장 환경:
- Java 21
- Node.js 20 이상
- npm
- PostgreSQL + PostGIS

---

## 개발 메모

- 프론트엔드는 API 호출을 상대 경로 기반으로 구성합니다.
- 로컬 개발 환경 포트:
  - 백엔드 API (Spring Boot): `8081`
  - 사용자 웹 (SvelteKit Dev): `5173` (배포 시 Node 서버 포트: `3000`)
  - 관리자 오피스 (React Dev): `3001` (배포 시 Nginx `/office` 경로 정적 서빙)
- 현재 제공하는 화면:
  - **사용자 웹:** 공개 홈, 안내 페이지, 공지사항, 모임 찾기 (현재 위치 기준 검색 및 카카오 지도 연동)
  - **관리자 오피스:** 운영 로그인, 지역연합(`District`) 관리, 그룹/모임(`Group`/`Meeting`) 관리, 콘텐츠/공지사항 관리

---

## 운영 참고

- `nginx` 정적 서빙 / OCI 배포 가이드: [deploy/README.md](./deploy/README.md)

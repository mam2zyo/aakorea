<!-- docs/current/IMPLEMENTATION_PLAN.md -->

# IMPLEMENTATION_PLAN

## 이 문서의 역할

이 문서는 초기 계획서라기보다, **현재 구현 상태와 가까운 후속 작업 후보**를 기록한다.

---

## 현재 완료된 큰 흐름

### 1. 기반 구조

- 공통 `ApiResponse` / `ErrorResponse`
- 세션 기반 운영 인증
- 공개 / 운영 라우트 분리
- admin / public surface 분리와 document theme runtime 동기화

### 2. 공개 흐름

- 홈 / 안내 페이지 / 공지 조회
- 지역 / 요일 기준 모임 검색
- `/meetings` 안의 같은 페이지 모달 상세
- `/groups/:id` 직접 진입으로 같은 상세 흐름 재사용
- 그룹 문맥 + 선택된 모임 포커스 표시
- 그룹 공지 / 전화 걸기 연결
- 대화면 카카오 지도 표시
- active public theme 조회와 `themePreview` 기반 미리보기 링크 유지

### 3. 운영 조직 / 그룹 / 모임 흐름

- 지역연합 목록 / 생성 / 수정 / 삭제
- 그룹 목록 / 생성 / 수정 / 삭제
- 그룹당 대표 연락처 1건 관리
- 이메일 / 우편수신주소 관리
- 카카오 우편번호 기반 주소 검색 입력
- 그룹 삭제 시 연결 모임 / 연락처 함께 삭제
- 모임 생성 / 수정 / 삭제 / 상태 토글
- 주소 기반 `province` 자동 판별
- 저장 시 카카오 REST API 지오코딩과 좌표 일괄 보정

### 4. 운영 콘텐츠 / 테마 / 도구 흐름

- `ContentPage`, `Notice` CRUD (Rich Text 에디터 통합)
- 첨부파일 및 에디터 이미지 자산 업로드/관리
- 공개 사이트 theme draft / publish / rollback
- 운영 콘솔 theme preference 로컬 저장
- HTML normalize + 정제 JSON import preview / apply / reset
- 좌표 backfill dry-run / apply

---

## 현재 구현 기준 상세 상태

### 로컬 / 배포 실행 기준

- `application-local.yml`, `application-nginx.yml` 모두 현재 백엔드를 `8081`에 띄운다
- Vite dev proxy 기본 대상은 `http://localhost:8081`이다
- `nginx`는 `8080`에서 정적 앱을 서빙하고 `/api`를 `8081`로 프록시한다
- 상세 절차는 `docs/runbooks/LOCAL_DEVELOPMENT.md`, `docs/runbooks/NGINX_TERMUX_DEPLOYMENT.md`를 따른다

### 공개 테마

- 지원 preset theme id: `classic`, `harbor`, `breeze`
- `GET /api/public/theme`로 active theme를 불러온다
- 공개 라우트는 `themePreview` query param으로 미리보기 상태를 유지할 수 있다
- 운영 페이지에서 draft 저장, 게시, 직전 테마 롤백을 수행한다

### 모임 입력 / 지도

- `Meeting` 저장 시 주소에서 `province`를 자동 판별한다
- `latitude`, `longitude`가 비어 있으면 서버가 카카오 REST API로 좌표를 계산한다
- 대화면 공개 모달은 저장된 좌표와 프론트 env key가 있으면 카카오 지도를 렌더링한다
- backfill API는 기존 데이터의 빈 좌표만 찾아 재계산한다

### import 도구

- 현재 관리자 UI는 원본 HTML을 붙여넣거나 업로드해 `normalize`한 뒤, 정제 JSON 기준으로 `preview / apply / reset`을 사용한다
- 이미 준비된 정제 JSON을 바로 붙여넣거나 업로드해 같은 흐름으로 이어갈 수도 있다
- reset은 테스트용 import 데이터 정리에만 사용한다

---

## 다음 작업 후보

### 1. 공개 모임의 상세 검색 조건 UI 정리

- 현재는 지역 / 요일 / nearby search까지 제공하고, 상세 필터 UI는 아직 최소 상태다

### 2. 운영자 개인 설정의 서버 저장 여부 결정

- `admin/account`의 theme preference는 현재 localStorage에만 저장한다

### 3. 운영 runbook 확장

- 배포와 환경 설정 문서는 `runbooks/`로 분리했다
- import, backfill, theme publish 같은 운영 절차도 같은 위치로 확장할 수 있다

---

## 추후 구현 목표

현재 MVP 범위를 넘어서는 중장기 확장 목표는 `../deferred/FUTURE_IMPLEMENTATION_GOALS.md`에서 관리한다.

현재 추후 구현 목표로 유지하는 항목:

- 관리자 페이지 메뉴 구성 기능 도입
- SEO를 위한 공개 프론트 Next.js 전환
- 관리자 페이지의 공개 사이트 메뉴 편집 기능 추가
- 권한 모델 세분화
- 주요 도메인 변경점의 수정자 추적 기능

아래 항목은 위 문서에 포함하지 않고, 안정화 이후 별도 기술 업그레이드 트랙으로 분리한다.

- `Java 25`, `Spring Boot 4.x`, virtual thread, JVM tuning

---

## 현재 구현 검증 기준

현재는 아래가 안정적으로 동작하면 핵심 흐름이 성립한다고 본다.

- 방문자가 지역 / 요일 기준으로 모임을 찾을 수 있다
- 방문자가 현재 위치 기준 가까운 모임을 찾을 수 있다
- 방문자가 모달에서 장소와 연락처를 확인할 수 있다
- 운영자가 그룹과 모임을 생성 / 수정 / 삭제할 수 있다
- 운영자가 Rich Text 에디터와 첨부파일을 사용해 콘텐츠를 편집할 수 있다
- 방문자가 공개 페이지에서 공지사항의 첨부파일을 다운로드할 수 있다
- 운영자가 공개 사이트 theme를 draft / publish / rollback 할 수 있다
- 운영자가 필요 시 import / 좌표 보정 도구를 사용할 수 있다

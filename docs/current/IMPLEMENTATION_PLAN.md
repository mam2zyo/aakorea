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
- 3계층(Primitives, Semantic, Component) 디자인 토큰 아키텍처 수립 및 적용

### 2. 공개 흐름

- 홈 / 안내 페이지 / 공지 조회
- 지역 / 요일 기준 모임 검색
- `/meetings` 안의 같은 페이지 모달 상세
- `/groups/:id` 직접 진입으로 같은 상세 흐름 재사용
- 그룹 문맥 + 선택된 모임 포커스 표시
- 그룹 공지 / 전화 걸기 연결
- 카카오 지도 표시
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

- `Notice` CRUD (Rich Text 에디터 통합)
- `ContentPage` CRUD (HTML 파일 업로드 기반 하이브리드 아키텍처)
- 첨부파일 및 에디터 이미지 자산 업로드/관리
- 운영자 권한 세분화 (AdminUser / Role / Permission)
- 공개 사이트 theme draft / publish / rollback
- 운영 콘솔 theme preference 로컬 저장
- 디자인 토큰 시스템 구축 (색상 리터럴 완전 제거 및 시맨틱 변수화)
- HTML normalize + 정제 JSON import preview / apply / reset
- 좌표 backfill dry-run / apply

---

## 추후 구현 목표

확장 목표는 `../deferred/FUTURE_IMPLEMENTATION_GOALS.md`에서 관리한다.

현재 추후 구현 목표로 유지하는 항목:

- 주요 도메인 변경 이력 추적 기능 (Audit Log)
- 번들 최적화 (관리자 및 공개 사이트 분리)

---

## 현재 구현 검증 기준

현재는 아래가 안정적으로 동작하면 핵심 흐름이 성립한다고 본다.

- 방문자가 지역 / 요일 기준으로 모임을 찾을 수 있다
- 방문자가 현재 위치 기준 가까운 모임을 찾을 수 있다
- 방문자가 모달에서 장소와 연락처를 확인할 수 있다
- 방문자가 공개 페이지에서 공지사항의 첨부파일을 다운로드할 수 있다
- 운영자가 그룹과 모임을 생성 / 수정 / 삭제할 수 있다
- 운영자가 역할(Role)과 권한(Permission)에 따라 차등적으로 기능에 접근할 수 있다
- 운영자가 `Notice`는 Rich Text 에디터로, `ContentPage`는 HTML 파일 업로드를 통해 편집할 수 있다
- 운영자가 공개 사이트 theme를 draft / publish / rollback 할 수 있다
- 운영자가 필요 시 import / 좌표 보정 도구를 사용할 수 있다

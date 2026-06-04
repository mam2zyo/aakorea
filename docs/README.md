# 문서 안내

이 디렉토리는 AAKorea Main 웹앱 프로젝트의 설계 및 사양 문서를 관리합니다.

---

## 문서 구조

문서는 아래 영역으로 구분하여 관리합니다.

### 1. Core 개념 (`docs/core/`)
프로젝트의 핵심 가이드, 제품 범위, 유즈케이스 및 개발 로드맵을 정의합니다.
*   [PRODUCT_SCOPE.md](./core/PRODUCT_SCOPE.md): MVP 제품 범위 정의 (In/Out 범위)
*   [ACTORS_AND_USE_CASES.md](./core/ACTORS_AND_USE_CASES.md): 사용자 액터 및 유스케이스 정의
*   [ROADMAP.md](./core/ROADMAP.md): 현재 구현 상태와 향후 개발 로드맵

### 2. 도메인 모델 명세 (`docs/domain/`)
현재 MVP 기준 데이터베이스 및 실제 비즈니스 도메인 규칙을 정의합니다.
*   [README.md](./domain/README.md): 도메인 개요 및 공지/콘텐츠 구분 기준
*   [SharedTypes.md](./domain/SharedTypes.md): 공용 값 타입 (Province, Location 등)
*   [District.md](./domain/District.md): 지역연합 모델
*   [Group.md](./domain/Group.md): 그룹 모델
*   [GroupContact.md](./domain/GroupContact.md): 그룹 대표 연락처 모델
*   [Meeting.md](./domain/Meeting.md): 모임 일정 및 위치 모델
*   [Notice.md](./domain/Notice.md): 공지사항 모델
*   [ContentPage.md](./domain/ContentPage.md): 설명 및 안내 콘텐츠 모델
*   [Attachment.md](./domain/Attachment.md): 첨부파일 및 미디어 자산 모델
*   [PublicThemeSetting.md](./domain/PublicThemeSetting.md): 공개 사이트 테마 설정 모델

### 3. 코드 분석 및 감사 보고서 (Root)
프로젝트 초기에 작성된 코드 품질, 보안 및 리팩토링 검토 보고서입니다.
*   [backend_analysis.md](./backend_analysis.md): 백엔드(Spring Boot) 보안, 성능, 리팩토링 검토
*   [web_analysis.md](./web_analysis.md): 사용자 웹(SvelteKit) 아키텍처 및 디자인 시스템 분석
*   [office_analysis.md](./office_analysis.md): 관리자 오피스(React) 아키텍처 및 번들 최적화 분석
*   [feature_proposals.md](./feature_proposals.md): 주요 기능 제안 및 상세 분석

---

## 문서 운영 원칙

1.  **중복 기술 금지:** 각 문서는 하나의 질문 또는 단일 도메인 개념에만 답하도록 분리하여 관리합니다.
2.  **동기화 유지:** 코드 또는 스키마가 변경되면 해당 도메인 문서(`docs/domain/`)의 필드 설명도 함께 업데이트되어야 합니다.
3.  **참조(Link) 활용:** 필드 스펙이나 API 형식을 여러 문서에 중복해서 적는 대신, 기준이 되는 도메인 문서 링크를 활용해 참조합니다.

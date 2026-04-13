<!-- docs/front/OVERVIEW.md -->
# 프론트엔드 아키텍처 개요 (Frontend Overview)

이 문서는 AAKorea Main 프론트엔드의 전반적인 설계 원칙과 소스 코드 구조를 관리합니다.

## 1. 핵심 설계 철학
- **MPA (Multi-Page Application) 기반 도메인 격리**: Public(공개)과 Admin(관리자) 환경을 독립적인 HTML 진입로 분리하여 물리적 번들 격리와 보안을 달성합니다.
- **Shared Kernel 아키텍처**: 도메인 간 중복 코드는 `src/shared/`에서 엄격히 관리하며, 도메인 간 직접 참조를 금지합니다.
- **성능 중심**: 각 도메인은 자기에게 필요한 라이브러리만 로드하여 초기 로딩 성능(Lighthouse 90점 이상)을 극대화합니다.
- **상태 중심 검색**: 복잡한 URL 쿼리 대신 상태 머신(`useMeetingSearch`)을 통해 검색 흐름을 제어합니다.

## 2. 소스 코드 구조 (Source Map)

프론트엔드 소스는 관심사에 따라 다음과 같이 구조화되어 있습니다.

- **Entry Points**:
  - `index.html` / `src/public-main.jsx`: 공개 사이트 진입점.
  - `admin.html` / `src/admin-main.jsx`: 관리자 콘솔 진입점.
- `src/public/`: 공개 사이트 전용 도메인 코드.
- `src/admin/`: 관리자 콘솔 전용 도메인 코드.
- `src/shared/`: 도메인 간 공유되는 라이브러리, 유틸리티, 공통 스타일(Kernel).
- `src/shared/lib/request.js`: 서버 통신을 위한 공통 API 클라이언트.

## 3. 개발 가이드라인
- **Domain Isolation**: 새로운 기능은 해당 도메인(`admin/` 또는 `public/`)의 `features/` 또는 `pages/`에 배치합니다. 도메인 간 직접 임포트는 절대 금지입니다.
- **Shared Kernel**: 두 도메인에서 공통으로 필요한 로직은 반드시 `src/shared/`로 추출한 뒤 참조합니다.
- **Zero-Guess Infrastructure**: Nginx 및 백엔드 설정은 각 HTML 진입점(MPA)을 정확히 서빙하도록 구성되어야 합니다.

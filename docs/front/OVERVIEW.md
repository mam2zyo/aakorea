<!-- docs/front/OVERVIEW.md -->
# 프론트엔드 아키텍처 개요 (Frontend Overview)

이 문서는 AAKorea Main 프론트엔드의 전반적인 설계 원칙과 소스 코드 구조를 관리합니다.

## 1. 핵심 설계 철학
- **Surface 분리**: Public(공개)과 Admin(관리자) 환경을 독립적인 App 레이어로 분리하여 보안과 성능을 최적화합니다.
- **상태 중심 검색**: 복잡한 URL 쿼리 대신 상태 머신(`useMeetingSearch`)을 통해 검색 흐름을 제어합니다.
- **UI 일관성**: 공유 스타일과 디자인 토큰을 통해 전 영역에 걸쳐 시각적 통일성을 유지합니다.

## 2. 소스 코드 구조 (Source Map)

프론트엔드 소스는 관심사에 따라 다음과 같이 구조화되어 있습니다.

- `src/AppScreen.jsx`: 공통 라우트, 세션, 네비게이션 브릿지 관리.
- `src/public/app/*`, `src/admin/app/*`: 각 서비스별 진입점 및 도큐먼트 테마 동기화.
- `src/pages/*`: 라우트 진입점 페이지 컴포넌트.
- `src/features/*`: 실제 화면 로직, API 클라이언트, 하위 컴포넌트 (도메인 중심).
- `src/shared/`: 여러 영역에서 공유되는 라이브러리 및 공통 스타일.
- `src/shared/lib/request.js`: 서버 통신을 위한 공통 API 클라이언트.

## 3. 개발 가이드라인
- **Feature Ownership**: 새로운 기능은 `features/` 하위의 도메인 디렉토리에 배치하는 것을 권장합니다.
- **Route Wrapper**: `pages/`에서는 복잡한 로직을 지양하고 `features/`의 컨테이너를 호출하는 역할만 수행합니다.
- **API 동기화**: 백엔드 API 명세와 프론트엔드 호출 로직의 정합성을 항상 확인해야 합니다.

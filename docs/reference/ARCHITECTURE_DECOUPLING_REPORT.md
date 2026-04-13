<!-- docs/reference/ARCHITECTURE_DECOUPLING_REPORT.md -->
# 아키텍처 디커플링 결과 보고서 (Architecture Decoupling Report)

이 문서는 2026년 4월 진행된 AAKorea Main 프로젝트의 프론트엔드 아키텍처 개편 결과와 성능 개선 성과를 기록합니다.

---

## 1. 개편 배경 (Background)
- **문제점**: 단일 SPA(Single Page Application) 구조로 인해 관리자용 무거운 라이브러리가 일반 사용자 화면에서도 로드되어 초기 로딩 성능 저하(Lighthouse 50점대) 발생.
- **목표**: Public과 Admin 도메인을 물리적으로 분리하여 로딩 속도를 높이고 보안 경계를 강화함.

## 2. 주요 아키텍처 변화 (Architecture Changes)

### SPA → MPA (Multi-Page Application) 전환
- **진입점 분리**: `index.html`(공개용)과 `admin.html`(관리용)로 진입로를 이원화함.
- **번들 격리**: Vite 설정을 통해 각 도메인 전용 번들을 생성하도록 구성.
- **Shared Kernel**: 도메인 간 공유가 필요한 로직(API 클라이언트, 테마 훅 등)은 `src/shared/`로 추출하여 엄격히 관리.

### 인프라 통합 라우팅
- **Backend (Spring Boot)**: `SpaRoutingController`를 통해 주소 기반의 HTML 포워딩 처리.
- **Nginx**: `/admin` 경로 감지 및 `admin.html` 서빙 규칙 추가.
- **Vite Dev Server**: 개발 환경에서도 MPA 라우팅이 작동하도록 커스텀 미들웨어 적용.

## 3. 성능 개선 성과 (Performance Results)

### Lighthouse 지표 변화
| 지표 | 개편 전 | 개편 후 | 개선 결과 |
| :--- | :--- | :--- | :--- |
| **Performance** | ~50 | **91** (+41) | 약 82% 향상 |
| **Accessibility** | ~80 | **100** (+20) | 완벽한 접근성 달성 |
| **Best Practices**| ~85 | **100** (+15) | 웹 표준 준수 완료 |
| **SEO** | ~70 | **100** (+30) | 검색 엔진 최적화 완료 |

### 번들 사이즈 다이어트 (Public Site 기준)
- **개편 전**: 약 **760 KB** (모든 기능 포함)
- **개편 후**: 약 **55 KB** (**약 14배 절감**)
- **효과**: 저사양 모바일 기기에서도 즉각적인 화면 렌더링 가능.

## 4. 결론 및 제언 (Conclusion)
성공적인 '다이어트'를 통해 서비스 성능과 유지보수성을 모두 확보했습니다. 향후 관리자 기능이 확장되더라도 공개 서비스의 성능에는 전혀 영향을 주지 않는 구조가 완성되었습니다.

---
> [!TIP]
> **유지보수 가이드**
> 새로운 라이브러리를 추가할 때는 해당 기능이 어느 도메인에 속하는지 명확히 구분하여 전역 번들이 무거워지는 것을 상시 방지해야 합니다.

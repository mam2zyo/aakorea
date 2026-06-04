# AAKorea 프로젝트 기능 제안사항

문서 리뷰 및 코드베이스 추가 검토를 바탕으로, 현재 프로젝트에 도입하면 좋을 주요 기능 및 인프라 개선 사항을 제안합니다.

## 1. 아키텍처 및 인프라 (Architecture & Infrastructure)


### 모니터링 및 알림 (Monitoring & Alerting)
- **목적**: 장애의 빠른 인지 및 안정적 서비스 운영
- **내용**: 
  - **Sentry**: 프론트엔드(Web, Office)와 백엔드의 런타임 에러, 예외 발생 시 스택 트레이스를 수집하여 슬랙(Slack) 등으로 알림을 받을 수 있습니다.
  - **Prometheus + Grafana**: Spring Boot Actuator를 연동하여 서버 리소스(CPU, 메모리, 커넥션 풀 등) 모니터링 대시보드를 구축하는 것을 권장합니다.

### API 처리율 제한 (Rate Limiting)
- **목적**: 악의적인 트래픽 및 봇(Bot) 공격 방어
- **내용**: 공용(Public) API, 특히 모임 검색과 같은 엔드포인트에 대해 IP 기반의 처리율 제한(Rate Limiting)을 걸어 데이터베이스 과부하를 방지해야 합니다. (Bucket4j 또는 API Gateway 수준에서 적용)

---

## 2. 사용자 경험 (UX/UI) 및 프론트엔드 개선

### PWA (Progressive Web App) 지원
- **목적**: 모바일 사용자 편의성 증대
- **내용**: `Web` 프로젝트에 서비스 워커(Service Worker)와 Web App Manifest를 추가하여 모바일 기기 바탕화면에 앱처럼 설치할 수 있게 합니다.

### 다크 모드 (Dark Mode) 지원
- **목적**: 야간 사용 편의성 및 최신 UI 트렌드 반영
- **내용**: SvelteKit(Web) 및 React(Office) 모두 CSS 변수(Variables)를 적극적으로 활용하고 있으므로, `prefers-color-scheme` 및 토글 버튼을 활용한 다크 모드 구현이 비교적 수월할 것입니다.

### SEO 자동화 및 동적 사이트맵 (Sitemap.xml)
- **목적**: 검색 엔진 노출 극대화
- **내용**: 현재 `robots.txt`만 존재합니다. SvelteKit 서버 엔드포인트를 활용하여 데이터베이스의 활성화된 모임 및 공지사항 URL을 기반으로 동적으로 `sitemap.xml`을 생성해 검색 엔진 최적화(SEO)를 강화해야 합니다.

---

## 3. 백엔드 코드 품질 및 운영

### 자동화된 테스트 커버리지 확대
- **목적**: 리팩토링 안정성 보장 및 회귀 버그(Regression Bug) 방지
- **내용**: 현재 `ApplicationTests.java` 외에 실질적인 단위(Unit)/통합(Integration) 테스트 코드가 극히 부족합니다. 특히 복잡한 검색 로직(`PublicMeetingQueryService`)과 인증/인가 로직에 대해 Testcontainers를 활용한 통합 테스트 작성이 시급합니다.

### 에디터 콘텐츠 이미지 최적화 및 파이프라인
- **목적**: 네트워크 대역폭 절약 및 페이지 로딩 속도 향상
- **내용**: 오피스에서 Tiptap 에디터로 이미지를 업로드할 때, 백엔드에서 원본 이미지를 그대로 저장하는 대신 WebP 포맷으로 변환하고 리사이징하는 파이프라인을 구축하는 것을 제안합니다.

<!-- docs/01-current/architecture/admin-domain-separation-strategy.md -->

# 도메인 분리 전략 및 향후 과제 영향 분석 (Domain Separation Strategy & Impact Analysis)

이 문서는 공개 사이트(`maumtalk.win`)와 관리자 서비스(`office.maumtalk.win`)를 물리적인 도메인으로 분리하기 위한 전략과, 이 변화가 향후 프로젝트 로드맵에 미칠 영향을 분석합니다.

---

## 1. 도메인 분리 작업 계획 (계층별)

### [A] 빌드 및 엔트리 레이어 (Frontend Build)
*   **엔트리 포인트 이원화**: `index.html` (Public 전용)과 `admin.html` (Admin 전용)으로 분리.
*   **Vite MPA 설정**: 한 번의 빌드 명령으로 두 종류의 HTML과 각각 최적화된 JS 번들을 생성하도록 `vite.config.js` 수정.
*   **의존성 트리 청소**: 공개 사이트용 진입점에서는 관리자 테마, 에디터 라이브러리, 세션 관리 Hook 등을 완전히 제거하여 메인 번들 크기를 최소화.

### [B] 아키텍처 및 라우팅 레이어 (Application Logic)
*   **공개용/관리자용 전용 App Component**: 현재의 `App.jsx`와 `AppScreen.jsx`를 `PublicApp.jsx`와 `AdminApp.jsx`로 분리하여 각 도메인에 필요한 기능만 포함.
*   **라우터 격리**: URL 경로 정의(`router.js`)를 도메인별로 분할하여 서로의 경로가 섞이지 않게 조치.

### [C] 인프라 및 배포 레이어 (Deployment)
*   **Nginx 서버 블록 분리**: `Host` 헤더에 따라 다른 파일을 서빙하도록 설정 (`index.html` vs `admin.html`).
*   **CORS 및 CSP 정책**: 관리자 전용 도메인에 대해 더 강력한 보안 정책(Content Security Policy) 적용.

### [D] 외부 API 및 설정 레이어 (External APIs)
*   **API 콘솔 화이트리스트 갱신**: `maumtalk.win` 및 `office.maumtalk.win` 도메인을 Kakao Maps 및 T Map 개발자 콘솔에 각각 등록.
*   **Referrer-Policy 명시**: `index.html`과 `admin.html` 헤더에 `<meta name="referrer" content="no-referrer-when-downgrade" />`를 추가하여 호출 출처를 SDK 서버가 신뢰할 수 있도록 보장.
*   **환경 변수 격리**: 빌드 단계에서 공개 사이트용 번들에 관리자용 민감 정보가 포함되지 않도록 환경 변수 참조 범위를 엄격히 분리.

---

## 2. 향후 구현 과제에 미치는 영향 분석 (Impact Analysis)

### [✔️] 긍정적 영향 (Benefits)

1.  **Next.js 전환 가속화**: 
    - 공개 사이트만 Next.js로 옮기는 작업을 **관리자 코드의 복잡성과 관계없이** 독립적으로 수행할 수 있습니다. 
    - 관리자 센터는 현재의 Vite/CSR 방식을 유지해도 무관하므로 리소스 분배가 효율적입니다.
2.  **공개 사이트 SEO 최적화**: 
    - 세션 체크나 관리자 전용 로직이 사라지면서 TBT(Total Blocking Time)가 0에 수렴하게 되며, 이는 검색 엔진 순위에 결정적인 이점을 제공합니다.
3.  **보안 계층의 명확화**: 
    - "관리자"라는 영역이 도메인 단위로 격리되어, 관련 API 및 인증 정책을 더 엄격하게 관리할 수 있습니다.

### [⚠️] 주의 및 고려 필요 사항 (Challenges)

1.  **공통 컴포넌트 관리 (Shared Components)**: 
    - 버튼, 레이아웃 프레임 등 공유 컴포넌트가 관리자 전용 라이브러리(Tiptap 등)를 **간접적으로 참조**하지 않도록 엄격한 'Shared' 라이브러리 경계를 유지해야 합니다.
2.  **백엔드 CORS 및 인증**: 
    - 백엔드에서 두 개의 Origin(`maumtalk.win`, `office.maumtalk.win`)을 모두 허용해야 합니다. 
    - 공개 사이트는 로그인이 필요 없지만, 관리자 도메인에서의 API 호출은 여전히 견고한 세션 관리가 필요합니다.
3.  **로컬 개발 환경 경험 변화**: 
    - 개발자가 로컬에서 두 도메인을 동시에 테스트하려면 `hosts` 파일 수정이나 Vite의 다중 포트 활용 등 이전보다 조금 더 복잡한 설정이 필요할 수 있습니다.

---

## 3. 결론

도메인 분리는 **"공개 사이트의 극단적인 가벼움"**과 **"관리자 시스템의 견고한 격리"**를 동시에 달성할 수 있는 최선의 선택입니다. 특히 장기 목표인 **Next.js로의 부분적 하이브리드 전환**을 위한 전제 조건으로서 매우 높은 전략적 가치를 가집니다.

작업 착수 시, 공통 컴포넌트의 종속성 정리부터 시작하여 점진적으로 엔트리를 분리하는 것을 권장합니다.

# 번들 최적화 트러블슈팅 기록 (Bundle Optimization Troubleshooting)

이 문서는 `feature/bundle-optimization` 브랜치에서 관리자 번들 격리 및 지도 로딩 최적화를 시도하며 발견한 문제점과 기술적 분석 내용을 기록합니다. 차후 새로운 브랜치에서 재작업 시 참고 자료로 활용합니다.

## 1. 관리자 번들 유출 (Admin Bundle Leakage)

### 문제 현상
공개 페이지(Home) 로드 시, 관리자 전용 라이브러리인 Tiptap 에디터 번들(`vendor-admin-editor.js`, 약 389kB)이 `modulepreload`에 의해 강제로 다운로드됨.

### 원인 분석
1.  **Vite 6 / Rolldown의 공격적인 Preloading**:
    *   `React.lazy`를 컴포넌트 최상단에 선언할 경우, 번들러의 정적 분석기가 이를 감지하여 브라우저 실행 시점에 관련 의존성을 미리 가져오려고 시도함.
    *   `build.modulePreload: false` 설정만으로는 런타임 자바스크립트에 삽입된 동적 임포트 호출(Initiator: `index.js`)을 막기에 부족했음.
2.  **`manualChunks`와의 충돌**:
    *   특정 라이브러리(`@tiptap`)를 명명된 청크(`vendor-admin-editor`)로 묶었을 때, 메인 번들에서 이 청크를 참조하는 경로가 하나라도 존재하면 번들러가 이를 핵심 의존성으로 간주하여 우선순위를 높임.
3.  **배럴 파일(Barrel Files)의 부작용**:
    *   `src/admin/ui/index.jsx`에서 모든 UI 구성 요소를 내보낼 경우, 단 하나의 컴포넌트만 불러와도 에디터와 같은 무거운 라이브러리가 함께 레이어에 엮이는 현상 확인.

### 향후 대책
*   `React.lazy`를 최상단이 아닌, 특정 조건(예: `route.section === 'admin'`)에서만 임포트되도록 별도의 **Deferred Loader** 패턴을 적용하여 정적 분석을 회피해야 함.
*   관리자 도메인과 공개 도메인의 진입점(Entry Point)을 물리적으로 더 엄격하게 분리.

---

## 2. Kakao 지도 로드 실패 (ERR_BLOCKED_BY_ORB)

### 문제 현상
Nginx(포트 8080) 환경에서 카카오 지도 SDK(`sdk.js`) 로드 시 `net::ERR_BLOCKED_BY_ORB` 에러와 함께 지도가 표시되지 않음.

### 원인 분석
1.  **환경별 동작 차이**:
    *   `localhost:5173` (Vite Dev Server): 정상 작동.
    *   `localhost:8080` (Nginx Production Build): 로드 실패.
2.  **ORB (Opaque Response Blocking) 발생 원인**:
    *   브라우저가 SDK 응답을 유효한 자바스크립트로 인식하지 못하거나(MIME 타입 불일치), 보안 정책에 의해 차단함.
    *   카카오 API 센터에 등록된 "사이트 도메인"에 `http://localhost:8080`이 누락되었거나, 번들링 과정에서 `Referer` 헤더가 비정상적으로 전달되었을 가능성.
3.  **시도된 조치 및 결과**:
    *   `Referrer-Policy` 추가: 효과 미미.
    *   `modulePreload` 원복: 효과 미미.

### 향후 대책
*   카카오 개발자 콘솔의 도메인 등록 설정을 재점검하고, `localhost:8080`이 명시적으로 포함되어 있는지 확인 필요.
*   빌드 결과물(`dist/`) 내에서 환경 변수가 올바르게 주입되어 `appkey`가 정확히 전달되는지 재검증.

---

## 3. 요약 및 권장 사항

현재 브랜치는 여러 차례의 실험적 코드가 섞여 있어 구조가 복잡해진 상태입니다. 위 문제들을 근본적으로 해결하기 위해 다음을 권장합니다.

1.  현재 브랜치의 성과(배럴 파일 정리 등)를 기록으로 남기고 **폐기**.
2.  `develop` 브랜치에서 새 브랜치를 생성하여 **처음부터 다시 시작**.
3.  새 브랜치에서는 **지도 로딩 정상화**를 최우선 순위로 잡고, 이후 **관리자 번들 격리**를 단계적으로 적용.

# 저사양 기기 및 네트워크 최적화 전략 (Performance & Optimization Strategy)

## 1. 개요 (Overview)
AA Korea 서비스는 고령자 및 다양한 사양의 기기를 사용하는 사용자를 포함합니다. 모든 사용자에게 쾌적한 경험을 제공하기 위해, 기기 사양과 네트워크 환경에 따라 UI의 복잡도를 동적으로 조절하는 전략을 채택합니다.

## 2. 핵심 개념: Rich UI 모드 (`is-rich-ui`)
애플리케이션의 최상위 요소(`:root`)에 `.is-rich-ui` 클래스를 부여하여 고사양/저사양 모드를 구분합니다.

- **Low-End Mode (Default)**: 성능 최우선. 리소스 사용을 최소화하여 즉각적인 정보 전달에 집중.
- **Rich UI Mode**: 시각적 완성도 최우선. 고해상도 그래픽, 웹폰트, 화려한 애니메이션 등을 제공.

## 3. 세부 최적화 전략

### 3.1 서체 (Typography)
- **Low-End**: 시스템 서체 스택(system-ui)만 사용하여 추가적인 네트워크 다운로드와 렌더링 부하를 제거합니다.
- **Rich UI**: 브랜드 정체성을 위한 웹폰트(예: Noto Sans KR)를 로드하고 우선 적용합니다.
- **구현 방법**:
  ```css
  :root { --font-body: system-ui, ...; }
  :root.is-rich-ui { --font-body: "Noto Sans KR", system-ui, ...; }
  ```

### 3.2 지도 로딩 (Map Loading)
지도는 네트워크와 메모리를 가장 많이 소모하는 요소 중 하나입니다.
- **Low-End**: `GroupDetailModal` 등에서 지도를 자동으로 로드하지 않습니다. 대신 '지도 보기' 버튼과 위치 정보(주소)를 먼저 보여줍니다.
- **Rich UI**: 상세 팝업 오픈 시 지도를 즉시 로드하고 인터랙티브한 기능을 제공합니다.
- **구현 아이디어**: 저사양 모드에서는 정적 지도 이미지(Static Image)를 활용하는 방안도 검토합니다.

### 3.3 시각 효과 (Visual Effects)
- **Low-End**: `backdrop-filter` (Blur), 복잡한 그라데이션, 무거운 애니메이션을 비활성화합니다.
- **구현 방법**:
  ```css
  :root:not(.is-rich-ui) * {
    backdrop-filter: none !important;
    animation: none !important;
  }
  ```

## 4. 모드 판별 로직 (Detection Logic)

### 4.1 자동 판별 (Automatic)
브라우저 API를 활용하여 하드웨어 성능을 추정합니다.
- **Memory**: `navigator.deviceMemory` (예: 4GB 미만이면 저사양)
- **CPU**: `navigator.hardwareConcurrency` (예: 4코어 미만이면 저사양)
- **Network**: `navigator.connection.effectiveType` (예: 3g 이하이면 저사양)

### 4.2 수동 설정 (Manual Preference)
사용자가 설정 페이지에서 직접 '저사양 모드'를 켜고 끌 수 있는 옵션을 제공하여 로컬 스토리지에 저장합니다.

## 5. 기대 효과
- LCP(Largest Contentful Paint) 시간 단축
- 저사양 기기에서의 브라우저 크래시 예방
- 데이터 소모량 절감 및 배터리 효율 향상

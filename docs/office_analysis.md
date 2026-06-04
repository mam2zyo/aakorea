# 오피스(관리자용) 분석 보고서

## 1. 보안 분석

### [Warning] 세션 관리 노출 위험
- **현황**: 애플리케이션은 세션 쿠키(`withCredentials: true`)를 사용합니다.
- **위험**: 백엔드 설정이 적절하더라도, 프론트엔드에서 세션 정보를 로그에 남기거나 안전하지 않은 리다이렉트를 처리할 때 노출될 수 있습니다.
- **권장사항**: 백엔드/역방향 프록시에서 `Strict-Transport-Security` 및 적절한 쿠키 플래그(`HttpOnly`, `Secure`, `SameSite=Lax/Strict`)가 강제되고 있는지 확인하십시오.

---

## 2. 성능 분석

### [Medium] 리치 텍스트 에디터 번들 크기
- **위치**: `RichTextEditor.tsx` (Tiptap 사용)
- **문제점**: Tiptap과 관련 확장 기능들은 용량이 꽤 큽니다.
- **권장사항**: 대시보드 초기 로딩 시 에디터가 바로 필요하지 않다면 `React.lazy`를 사용하여 에디터 컴포넌트를 지연 로딩하십시오.

### [Low] 자산(Asset) 로딩 방식
- **현황**: 컴포넌트 내부에서 커스텀 CSS 파일을 직접 임포트합니다 (예: `AttachmentField.css`).
- **개선안**: Vite가 이를 잘 처리해주지만, 컴포넌트 수가 많아질 경우 전역 네임스페이스 오염을 방지하기 위해 CSS Modules 사용을 고려해 보십시오.

---

## 3. 버그 가능성 및 리팩토링

### [Refactoring] 파일 확장자 혼용 (JSX vs TSX)
- **위치**: `src/features/groups/components/`
- **문제점**: `CreateGroupWizard.jsx`, `EditGroupSheet.jsx` 등 여러 파일이 `.jsx`를 사용 중인 반면, 일부는 `.tsx`를 사용합니다.
- **권장사항**: 모든 파일을 `.tsx`로 표준화하여 TypeScript의 장점을 최대한 활용하십시오. 특히 복잡한 폼 로직이 있는 "Create Group Wizard"에서 유용합니다.

### [Refactoring] 컴포넌트 일관성
- **현황**: `shared/components/ui`의 UI 컴포넌트들이 커스텀 로직과 CSS가 섞여 있습니다.
- **개선안**: 대규모 폼(예: `CreateGroupWizard.jsx`)에서 반복되는 코드를 줄이기 위해 `react-hook-form` 같은 라이브러리를 도입하여 폼 필드 패턴을 일관성 있게 유지하십시오.

### [Bug] Prop 타입 안정성 부족
- **현황**: `.jsx` 파일에서는 JSDoc을 사용하지 않는 한 프롭(Prop) 타입이 엄격하게 체크되지 않습니다.
- **위험**: 복잡한 컴포넌트에서 잘못된 타입의 프롭을 전달할 경우 런타임 에러가 발생할 수 있습니다.
- **권장사항**: `.tsx`로 마이그레이션하면 이 문제가 해결됩니다.

### [Refactoring] 상태 관리 (State Management)
- **위치**: `src/features/groups/store/`
- **현황**: 여러 시트(Sheet)와 모달 간에 상태가 정확히 동기화되고 있는지 확인이 필요합니다.
- **개선안**: 모달에서 그룹 정보를 수정했을 때, 전체 페이지 새로고침 없이 목록 뷰가 즉시 업데이트되도록 상태 동기화 로직을 점검하십시오.

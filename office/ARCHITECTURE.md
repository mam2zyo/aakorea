# Office 프론트엔드 아키텍처

React 19 + TypeScript + Vite 기반의 운영자 관리 대시보드입니다.

## 디렉토리 구조

```
src/
├── main.tsx              # 앱 진입점
├── App.tsx               # 라우터 설정 + ProtectedRoute
│
├── api/                  # API 클라이언트 레이어
│   ├── request.ts        # Axios 인스턴스 및 에러 처리
│   ├── index.ts          # 전체 API 인스턴스 집약 내보내기
│   ├── auth.ts           # 인증 API
│   ├── groups.ts         # 그룹 API
│   ├── users.ts          # 사용자 API
│   ├── content.ts        # 콘텐츠 페이지 API
│   ├── districts.ts      # 지역연합 API
│   ├── assets.ts         # 에셋 API
│   ├── attachments.ts    # 첨부파일 API
│   ├── meetings.ts       # 모임 API
│   ├── groupContacts.ts  # 그룹 연락처 API
│   ├── formErrors.ts     # 폼 에러 헬퍼
│   └── types.ts          # API 공통 타입
│
├── components/           # 전역 공용 컴포넌트
│   ├── AccountSettingsModal.jsx
│   ├── AddressSearchField.jsx
│   ├── AuditLogDetailModal.tsx
│   └── ui/               # 범용 UI 기본 컴포넌트
│       ├── AttachmentField.jsx
│       ├── Field.tsx
│       ├── RichTextEditor.jsx
│       └── index.jsx
│
├── constants/            # 상수 및 열거형
│   ├── auth.ts           # 역할(OfficeRole), 권한(OfficePermission) 상수
│   └── options.ts        # 요일, 모임 유형 등 선택지 옵션
│
├── hooks/                # 전역 공용 커스텀 훅 (현재 비어 있음)
│
├── layouts/              # 페이지 레이아웃 컴포넌트
│   └── MainLayout.tsx    # 사이드바 + 헤더를 포함한 메인 레이아웃
│
├── pages/                # 페이지 컴포넌트
│   ├── OfficeLoginPage.tsx
│   ├── OfficeRegisterPage.tsx
│   ├── OfficeOverviewPage.tsx
│   ├── OfficePendingApprovalPage.jsx
│   ├── OfficeAccountPage.jsx
│   ├── UserManagementPage.tsx
│   ├── ContentManagementPage.jsx
│   ├── NoticePage.tsx
│   ├── DistrictManagementPage.tsx
│   ├── GroupListPage.jsx       # Container 컴포넌트 (비즈니스 로직)
│   ├── GroupListPresenter.jsx  # Presenter 컴포넌트 (순수 UI)
│   ├── GroupEditorPresenter.jsx
│   ├── AuditLogPage.tsx
│   ├── reducer.js              # GroupListPage 전용 useReducer 상태
│   ├── utils.ts                # GroupListPage 전용 유틸리티
│   ├── hooks/
│   │   └── useGroupEditor.js   # 그룹 편집 훅
│   └── components/             # 그룹 관련 모달 및 시트
│       ├── CreateGroupWizard.jsx
│       ├── EditGroupSheet.jsx
│       ├── GroupBasicsModal.jsx
│       ├── GroupContactModal.jsx
│       ├── GroupMeetingFormModal.jsx
│       └── MeetingCoordinateBackfillPanel.jsx
│
├── providers/            # React Context Provider
│   ├── AuthContext.tsx   # 인증 상태 관리 + useAuth() 훅
│   └── ThemeContext.tsx  # 다크모드 테마 관리
│
├── types/                # TypeScript 타입 정의
│   └── auth.ts           # UserSession, UNAUTHENTICATED_SESSION
│
└── utils/                # 전역 공용 유틸리티 함수
    ├── address.ts        # 주소 관련 유틸
    ├── auth.ts           # 인증 관련 유틸
    ├── phone.ts          # 전화번호 관련 유틸
    └── index.ts          # 공용 유틸 내보내기
```

## 주요 패턴

### API 레이어
`api/` 디렉토리는 도메인별 클래스로 분리됩니다. 모든 API 인스턴스는 `api/index.ts` 하나에서 export하므로, 페이지에서는 항상 `@/api`에서 import합니다.

```ts
// ✅ 권장
import { groupApi, districtApi } from '@/api';

// ❌ 금지
import { OfficeGroupApi } from '@/api/groups';
```

### 인증 (Auth)
`AuthProvider`를 통해 세션 상태를 전역 관리합니다. `useAuth()` 훅은 `@/providers/AuthContext`에서 직접 가져옵니다.

```ts
import { useAuth } from '@/providers/AuthContext';
```

### Container / Presenter 패턴
데이터와 로직이 복잡한 페이지는 두 레이어로 분리합니다:

- **Container** (`GroupListPage`): API 호출, 상태 관리, 이벤트 핸들러
- **Presenter** (`GroupListPresenter`, `GroupEditorPresenter`): props를 받아 UI만 렌더링

### 상태 관리
복잡한 로컬 상태는 `useReducer`를 사용합니다. 그룹 관리 상태는 `pages/reducer.js`에 정의되어 있습니다.

## 라우팅

| 경로 | 컴포넌트 | 보호 |
|------|----------|------|
| `/office/login` | `OfficeLoginPage` | ❌ |
| `/office/register` | `OfficeRegisterPage` | ❌ |
| `/office/pending` | `OfficePendingApprovalPage` | ❌ |
| `/office` | `OfficeOverviewPage` | ✅ |
| `/office/groups` | `GroupListPage` | ✅ |
| `/office/users` | `UserManagementPage` | ✅ |
| `/office/content-pages` | `ContentManagementPage` | ✅ |
| `/office/notices` | `NoticePage` | ✅ |
| `/office/districts` | `DistrictManagementPage` | ✅ |
| `/office/audit-logs` | `AuditLogPage` | ✅ |
| `/office/account` | `OfficeAccountPage` | ✅ |

## 향후 개선 방향

현재 구조는 기능이 늘어남에 따라 `pages/`가 비대해지는 한계가 있습니다. 중장기적으로는 **Feature-Sliced Design** 패턴으로 전환을 검토합니다:

```
features/
├── auth/         # AuthProvider + useAuth + 인증 관련 페이지
├── groups/       # GroupListPage + reducer + utils + 컴포넌트 통합
├── content/
├── notices/
├── districts/
├── users/
└── audit/
```

추가로, 현재 `.jsx` / `.js`로 남아 있는 파일들의 TypeScript 마이그레이션을 기능 단위로 순차 진행할 예정입니다.

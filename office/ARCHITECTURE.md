# Office 프론트엔드 아키텍처

React 19 + TypeScript + Vite 기반의 운영자 관리 대시보드입니다.

## 디렉토리 구조

FSD(Feature-Sliced Design) 패턴을 변형하여 적용한 구조입니다.

```
src/
├── main.tsx              # 앱 진입점
├── App.tsx               # 최상위 App 컴포넌트 (Router 및 Provider 설정)
├── index.css             # 기본 CSS 파일
│
├── assets/               # 전역 스타일 및 에셋
│   └── styles/           # 테마, 토큰, 레이아웃 등 공통 스타일 (.css)
│
├── features/             # 도메인/기능별 컴포넌트 및 로직 (Feature 레이어)
│   ├── audit/            # 감사 로그 관련 (AuditLogPage, AuditLogDetailModal)
│   ├── auth/             # 인증 및 가입 (로그인, 회원가입, 대기 페이지, AuthContext, AuthProvider)
│   ├── content/          # 콘텐츠 페이지 관리 (ContentManagementPage)
│   ├── dashboard/        # 대시보드 (OfficeOverviewPage)
│   ├── districts/        # 지역연합 관리 (DistrictManagementPage)
│   ├── groups/           # 그룹 관리 (목록, 편집 시트, 생성 위자드, reducer, utils, hooks 등)
│   ├── notices/          # 공지사항 관리 (NoticePage)
│   └── users/            # 사용자 및 계정 관리 (UserManagementPage, OfficeAccountPage)
│
├── layouts/              # 공통 페이지 레이아웃 컴포넌트
│   └── MainLayout.tsx    # 사이드바 + 헤더를 포함한 메인 레이아웃
│
├── providers/            # 전역 Context Provider
│   └── ThemeContext.ts / ThemeProvider.tsx # 테마 상태 관리
│
├── router/               # 라우팅 관련 로직
│   ├── ProtectedRoute.tsx # 권한 및 인증 보호 라우트
│   └── callbacks.ts      # 라우트 콜백 (성공/에러 메시지 처리 등)
│
└── shared/               # 여러 피처에서 재사용하는 공통 모듈 (Shared 레이어)
    ├── api/              # API 클라이언트 레이어 (Axios 인스턴스 및 API 정의)
    ├── components/       # 공통 UI 컴포넌트 (ui/ RichTextEditor, AttachmentField 등)
    ├── constants/        # 공통 상수 (역할/권한 auth.ts, 공통 옵션 options.ts)
    ├── types/            # 공통 TypeScript 타입 정의 (auth.ts 등)
    └── utils/            # 공통 유틸리티 함수 (주소, 인증, 전화번호 등)
```

## 주요 패턴

### API 레이어
`shared/api/` 디렉토리는 도메인별 클래스로 분리됩니다. 모든 API 인스턴스는 `shared/api/index.ts` 하나에서 export하므로, 피처 영역에서는 항상 `@/shared/api`에서 import합니다.

```ts
// ✅ 권장
import { groupApi, districtApi } from '@/shared/api';

// ❌ 금지
import { OfficeGroupApi } from '@/shared/api/groups';
```

### 인증 (Auth)
`AuthProvider`를 통해 세션 상태를 전역 관리합니다. `useAuth()` 훅은 `@/features/auth/AuthContext`에서 가져옵니다.

```ts
import { useAuth } from '@/features/auth/AuthContext';
```

### Container / Presenter 패턴
데이터와 로직이 복잡한 일부 피처 페이지는 두 레이어로 분리하여 관리합니다:

- **Container** (`GroupListPage`): API 호출, 상태 관리, 이벤트 핸들러
- **Presenter** (`GroupListPresenter`, `GroupEditorPresenter`): props를 받아 UI만 렌더링

### 상태 관리
복잡한 피처 단위의 상태는 `useReducer`를 사용하여 관리합니다. (예: 그룹 관리 상태는 `features/groups/store/groupReducer.ts`에 정의)

## 라우팅

| 경로 | 컴포넌트 | 보호 | 비고 |
|------|----------|------|------|
| `/office/login` | `OfficeLoginPage` | ❌ | |
| `/office/register` | `OfficeRegisterPage` | ❌ | |
| `/office/pending` | `OfficePendingApprovalPage` | ❌ | |
| `/office` | `HomeRedirect` | ✅ | 로그인 후 권한에 맞는 첫 화면으로 리다이렉트 |
| `/office/tools` | `OfficeOverviewPage` | ✅ | |
| `/office/groups` | `GroupListPage` | ✅ | |
| `/office/groups/:groupId` | `GroupListPage` | ✅ | 특정 그룹 상세/편집 |
| `/office/users` | `UserManagementPage` | ✅ | |
| `/office/content-pages` | `ContentManagementPage` | ✅ | |
| `/office/notices` | `NoticePage` | ✅ | |
| `/office/districts` | `DistrictManagementPage` | ✅ | |
| `/office/audit-logs` | `AuditLogPage` | ✅ | |
| `/office/account` | `OfficeAccountPage` | ✅ | |

## 향후 개선 방향

- **TypeScript 마이그레이션**: 현재 일부 남아 있는 `.js`/`.jsx` 파일들을 피처 단위로 순차 마이그레이션 진행 예정입니다.


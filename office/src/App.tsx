import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { useAuth } from '@/features/auth/AuthContext';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { useOfficeTheme } from '@/providers/ThemeContext';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { createRouteCallbacks } from '@/router/callbacks';
import type { LoginCredentials } from '@/shared/types/auth';

// 페이지 컴포넌트
import { OfficeLoginPage } from '@/features/auth/OfficeLoginPage';
import { OfficeRegisterPage } from '@/features/auth/OfficeRegisterPage';
import { OfficeOverviewPage } from '@/features/dashboard/OfficeOverviewPage';
import { OfficePendingApprovalPage } from '@/features/auth/OfficePendingApprovalPage';
import { UserManagementPage } from '@/features/users/UserManagementPage';
import { ContentManagementPage } from '@/features/content/ContentManagementPage';
import { NoticePage } from '@/features/notices/NoticePage';
import { DistrictManagementPage } from '@/features/districts/DistrictManagementPage';
import { GroupListPage } from '@/features/groups/GroupListPage';
import { AuditLogPage } from '@/features/audit/AuditLogPage';
import { OfficeAccountPage } from '@/features/users/OfficeAccountPage';

// ── Provider 계층 ─────────────────────────────────────────
// AuthProvider, ThemeProvider, Router를 감싸는 최상위 컴포넌트.
// useAuth()는 이 컴포넌트 안에서 직접 호출하지 않는다.
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemeWrapper />
      </ThemeProvider>
    </AuthProvider>
  );
}

// ThemeProvider 내부에서 resolvedTheme를 읽어 data-theme 속성으로 바인딩
function ThemeWrapper() {
  const { resolvedTheme } = useOfficeTheme();
  return (
    <div className="office-theme" data-theme={resolvedTheme}>
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

// ── GroupListPage 래퍼 ────────────────────────────────────
// URL 파라미터(:groupId)를 읽어 editorGroupId로 변환.
// GroupListPage의 onNavigate(/admin/groups/...)를 /office/groups/...로 매핑.
function GroupRoute() {
  const { groupId } = useParams<{ groupId?: string }>();
  const navigate = useNavigate();
  const { onSuccess, onError } = createRouteCallbacks();
  const editorId = groupId ? parseInt(groupId, 10) : null;

  const handleNavigate = (path: string) => {
    // 레거시 JSX가 /admin/groups/* 경로를 사용 → /office/groups/*로 매핑
    navigate(path.replace('/admin/groups', '/office/groups'));
  };

  return (
    <GroupListPage
      onError={onError}
      onSuccess={onSuccess}
      editorGroupId={Number.isFinite(editorId) ? editorId : null}
      onNavigate={handleNavigate}
    />
  );
}

// ── 홈 리다이렉트 ──────────────────────────────────────────
// /office 접근 시 권한에 맞는 첫 화면으로 보냄
function HomeRedirect() {
  const { getHomePath } = useAuth();
  return <Navigate to={getHomePath()} replace />;
}

// AuthProvider 하위에 있으므로 useAuth() 호출이 안전하다.
function AppRoutes() {
  const { session, sessionChecked, checkSession, login, logout, getHomePath } = useAuth();
  const navigate = useNavigate();
  const { onSuccess, onError } = createRouteCallbacks();
  const { resolvedTheme, themePreference, systemTheme, setThemePreference } = useOfficeTheme();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!sessionChecked) {
    return <div className="loading-screen" data-surface="office">인증 상태 확인 중...</div>;
  }

  // OfficeLoginPage의 onLogin(credentials, redirectPath) 시그니처에 맞게 래핑.
  const handleLogin = async (credentials: LoginCredentials, redirectPath?: string) => {
    try {
      const authStatus = await login(credentials);
      // redirectPath가 '/office'인 경우(기본값) 권한별 홈 경로(getHomePath)를 우선 사용합니다.
      const target = (redirectPath && redirectPath !== '/office') ? redirectPath : getHomePath();
      navigate(target, { replace: true });
      return authStatus;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // OfficeLoginPage에서 캐치할 수 있도록 다시 던짐
    }
  };

  return (
    <Routes>
      {/* 공용 페이지 */}
      <Route path="/office/login" element={
        <OfficeLoginPage session={session} sessionChecked={sessionChecked} onLogin={handleLogin} />
      } />
      <Route path="/office/register" element={<OfficeRegisterPage />} />
      <Route path="/office/pending" element={<OfficePendingApprovalPage session={session} onLogout={logout} />} />

      {/* 보호된 운영 페이지 (MainLayout 적용) */}
      <Route path="/office" element={<ProtectedRoute session={session}><HomeRedirect /></ProtectedRoute>} />
      <Route path="/office/tools" element={<ProtectedRoute session={session}><MainLayout><OfficeOverviewPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/users" element={<ProtectedRoute session={session}><MainLayout><UserManagementPage onError={onError} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/groups" element={<ProtectedRoute session={session}><MainLayout><GroupRoute /></MainLayout></ProtectedRoute>} />
      <Route path="/office/groups/:groupId" element={<ProtectedRoute session={session}><MainLayout><GroupRoute /></MainLayout></ProtectedRoute>} />
      <Route path="/office/content-pages" element={<ProtectedRoute session={session}><MainLayout><ContentManagementPage onError={onError} onSuccess={onSuccess} onNavigate={(path: string) => navigate(path)} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/notices" element={<ProtectedRoute session={session}><MainLayout><NoticePage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/districts" element={<ProtectedRoute session={session}><MainLayout><DistrictManagementPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/audit-logs" element={<ProtectedRoute session={session}><MainLayout><AuditLogPage onError={onError} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/account" element={<ProtectedRoute session={session}><MainLayout><OfficeAccountPage resolvedTheme={resolvedTheme} themePreference={themePreference} systemTheme={systemTheme} onThemePreferenceChange={setThemePreference} /></MainLayout></ProtectedRoute>} />

      {/* 기본 경로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/office" replace />} />
      <Route path="*" element={<Navigate to="/office" replace />} />
    </Routes>
  );
}

export default App;

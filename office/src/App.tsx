import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';
import { ThemeProvider } from '@/providers/ThemeContext';
import { MainLayout } from '@/layouts/MainLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { createRouteCallbacks } from '@/router/callbacks';

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
        <div className="office-theme" data-surface="office">
          <Router>
            <AppRoutes />
          </Router>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

// ── 라우터 계층 ───────────────────────────────────────────
// AuthProvider 하위에 있으므로 useAuth() 호출이 안전하다.
function AppRoutes() {
  const { session, sessionChecked, checkSession, login, getHomePath } = useAuth();
  const navigate = useNavigate();
  const { onSuccess, onError } = createRouteCallbacks();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (!sessionChecked) {
    return <div className="loading-screen" data-surface="office">인증 상태 확인 중...</div>;
  }

  // OfficeLoginPage의 onLogin(credentials, redirectPath) 시그니처에 맞게 래핑.
  const handleLogin = async (credentials: any, redirectPath?: string) => {
    try {
      const authStatus = await login(credentials);
      navigate(redirectPath ?? getHomePath(), { replace: true });
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
      <Route path="/office/pending" element={<OfficePendingApprovalPage session={session} />} />

      {/* 보호된 운영 페이지 (MainLayout 적용) */}
      <Route path="/office" element={<ProtectedRoute session={session}><MainLayout><OfficeOverviewPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/users" element={<ProtectedRoute session={session}><MainLayout><UserManagementPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/groups" element={<ProtectedRoute session={session}><MainLayout><GroupListPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/content-pages" element={<ProtectedRoute session={session}><MainLayout><ContentManagementPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/notices" element={<ProtectedRoute session={session}><MainLayout><NoticePage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/districts" element={<ProtectedRoute session={session}><MainLayout><DistrictManagementPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/audit-logs" element={<ProtectedRoute session={session}><MainLayout><AuditLogPage onError={onError} /></MainLayout></ProtectedRoute>} />
      <Route path="/office/account" element={<ProtectedRoute session={session}><MainLayout><OfficeAccountPage onError={onError} onSuccess={onSuccess} /></MainLayout></ProtectedRoute>} />

      {/* 기본 경로 리다이렉트 */}
      <Route path="/" element={<Navigate to="/office" replace />} />
      <Route path="*" element={<Navigate to="/office" replace />} />
    </Routes>
  );
}

export default App;

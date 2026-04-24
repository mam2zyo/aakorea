import { useState, useCallback, type ReactNode } from 'react';
import { authApi } from '@/shared/api';
import type { UserSession, LoginCredentials } from '@/shared/types/auth';
import { UNAUTHENTICATED_SESSION } from '@/shared/types/auth';
import { OfficeRole, UserStatus, OfficePermission } from '@/shared/constants/auth';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession>(UNAUTHENTICATED_SESSION);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const authStatus = await authApi.me() as unknown as UserSession;
      setSession(authStatus);
    } catch (error) {
      const err = error as { status?: number; response?: { status?: number } };
      if (err?.status === 401 || err?.response?.status === 401) {
        setSession(UNAUTHENTICATED_SESSION);
      } else {
        console.error("Session check failed:", error);
      }
    } finally {
      setSessionChecked(true);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      const authStatus = await authApi.login(credentials) as unknown as UserSession;
      setSession(authStatus);
      return authStatus;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch {
      // 로그아웃 중 401(인증 필요) 에러가 나는 것은 이미 세션이 없다는 의미이므로 
      // 무시하고 로컬 세션을 클리어합니다.
      console.warn('Logout requested but session was already invalid or expired.');
    } finally {
      setSession(UNAUTHENTICATED_SESSION);
      setLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    if (!session.authenticated || session.status !== UserStatus.ACTIVE) return false;
    // 시스템 관리자는 모든 권한을 가집니다.
    if (session.role === OfficeRole.SYSTEM_ADMIN) return true;
    return session.permissions.includes(permission);
  };

  const isSystemAdmin = session.role === OfficeRole.SYSTEM_ADMIN;
  const isPendingApproval = session.status === UserStatus.PENDING_APPROVAL;

  const getHomePath = () => {
    if (!session.authenticated) return '/office/login';
    if (isPendingApproval) return '/office/pending';
    if (hasPermission(OfficePermission.GROUP_MANAGE)) return '/office/groups';
    if (hasPermission(OfficePermission.USER_MANAGE)) return '/office/users';
    return '/office/account';
  };

  const value = {
    session,
    loading,
    sessionChecked,
    checkSession,
    login,
    logout,
    hasPermission,
    isSystemAdmin,
    isPendingApproval,
    getHomePath
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

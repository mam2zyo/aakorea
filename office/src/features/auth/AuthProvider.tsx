import { useState, useCallback, type ReactNode } from 'react';
import { authApi } from '@/shared/api';
import type { UserSession, LoginCredentials } from '@/shared/types/auth';
import { UNAUTHENTICATED_SESSION } from '@/shared/types/auth';
import { OfficeRole, UserStatus } from '@/shared/constants/auth';
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
      setSession(UNAUTHENTICATED_SESSION);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return session.authenticated && 
           session.status === UserStatus.ACTIVE && 
           session.permissions.includes(permission);
  };

  const isSystemAdmin = session.role === OfficeRole.SYSTEM_ADMIN;
  const isPendingApproval = session.status === UserStatus.PENDING_APPROVAL;

  const getHomePath = () => {
    if (!session.authenticated) return '/office/login';
    if (isPendingApproval) return '/office/pending';
    if (hasPermission('GROUP_MANAGE')) return '/office/groups';
    if (hasPermission('USER_MANAGE')) return '/office/users';
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

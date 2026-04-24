import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { authApi } from '@/shared/api';
import type { UserSession } from '@/shared/types/auth';
import { UNAUTHENTICATED_SESSION } from '@/shared/types/auth';
import { OfficeRole, UserStatus } from '@/shared/constants/auth';

interface AuthContextType {
  session: UserSession;
  loading: boolean;
  sessionChecked: boolean;
  checkSession: () => Promise<void>;
  login: (credentials: any) => Promise<UserSession>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isSystemAdmin: boolean;
  isPendingApproval: boolean;
  getHomePath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession>(UNAUTHENTICATED_SESSION);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const authStatus = await authApi.me();
      setSession(authStatus);
    } catch (error: any) {
      // 401 Unauthorized는 비로그인 상태를 의미하므로 에러 로그를 남기지 않고 세션만 초기화
      if (error?.status === 401 || error?.response?.status === 401) {
        setSession(UNAUTHENTICATED_SESSION);
      } else {
        console.error("Session check failed:", error);
      }
    } finally {
      setSessionChecked(true);
    }
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const authStatus = await authApi.login(credentials);
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('AuthContext is undefined. Check if useAuth is called within AuthProvider.');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/** @deprecated useAuth()를 직접 사용하세요. */
export const useAuthContext = useAuth;

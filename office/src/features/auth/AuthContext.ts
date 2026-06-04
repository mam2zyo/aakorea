import { createContext, useContext } from 'react';
import type { UserSession, LoginCredentials } from '@/shared/types/auth';

export interface AuthContextType {
  session: UserSession;
  loading: boolean;
  sessionChecked: boolean;
  checkSession: () => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<UserSession>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isSystemAdmin: boolean;
  isPendingApproval: boolean;
  getHomePath: () => string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/** @deprecated useAuth()를 직접 사용하세요. */
export const useAuthContext = useAuth;

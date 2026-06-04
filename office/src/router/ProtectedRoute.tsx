import { Navigate } from 'react-router-dom';
import type { UserSession } from '@/shared/types/auth';

interface ProtectedRouteProps {
  session: UserSession;
  children: React.ReactNode;
}

export function ProtectedRoute({ session, children }: ProtectedRouteProps) {
  if (!session.authenticated) {
    return <Navigate to="/office/login" replace />;
  }
  return <>{children}</>;
}

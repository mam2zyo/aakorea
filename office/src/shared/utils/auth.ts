import { UserStatus } from '@/shared/constants/auth';

export function hasPermission(session: any, permission: string) {
  return Boolean(
    session?.authenticated && 
    session.status === UserStatus.ACTIVE && 
    Array.isArray(session.permissions) && 
    session.permissions.includes(permission)
  );
}

export function isPendingApproval(session: any) {
  return Boolean(session?.authenticated && session.status === UserStatus.PENDING_APPROVAL);
}

export function canManageOfficeUsers(session: any) {
  // 기존 staff.manage 권한을 USER_MANAGE로 체크하거나 원래 키로 체크
  return hasPermission(session, 'staff.manage') || hasPermission(session, 'manager.manage');
}

export const ADMIN_ROLE = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
}

export const ADMIN_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
}

export const ADMIN_PERMISSION = {
  SELF_PREFERENCES_MANAGE: 'self.preferences.manage',
  DISTRICT_MANAGE: 'district.manage',
  GROUP_MANAGE: 'group.manage',
  NOTICE_MANAGE: 'notice.manage',
  CONTENT_PAGE_MANAGE: 'content_page.manage',
  CONTENT_PUBLISH: 'content.publish',
  PUBLIC_THEME_MANAGE: 'public_theme.manage',
  PUBLIC_THEME_PUBLISH: 'public_theme.publish',
  OPERATIONS_IMPORT_MANAGE: 'operations.import.manage',
  OPERATIONS_COORDINATE_BACKFILL_MANAGE: 'operations.coordinate_backfill.manage',
  AUDIT_VIEW: 'audit.view',
  STAFF_MANAGE: 'staff.manage',
  MANAGER_MANAGE: 'manager.manage',
  STATS_VIEW: 'stats.view',
  MENU_MANAGE: 'menu.manage',
}

export function hasPermission(session, permission) {
  return Boolean(
    session?.authenticated
      && !isPendingApproval(session)
      && Array.isArray(session.permissions)
      && session.permissions.includes(permission),
  )
}

export function isSystemAdmin(session) {
  return Boolean(session?.authenticated && session.role === ADMIN_ROLE.SYSTEM_ADMIN)
}

export function isPendingApproval(session) {
  return Boolean(session?.authenticated && session.status === ADMIN_STATUS.PENDING_APPROVAL)
}

export function canManageAdminUsers(session) {
  return hasPermission(session, ADMIN_PERMISSION.STAFF_MANAGE)
    || hasPermission(session, ADMIN_PERMISSION.MANAGER_MANAGE)
}

export function canAccessOperationsTools(session) {
  return hasPermission(session, ADMIN_PERMISSION.OPERATIONS_IMPORT_MANAGE)
    || hasPermission(session, ADMIN_PERMISSION.OPERATIONS_COORDINATE_BACKFILL_MANAGE)
}

export function canAccessAdminRoute(session, routeName) {
  if (routeName === 'admin-login' || routeName === 'admin-register' || routeName === 'not-found') {
    return true
  }

  if (routeName === 'admin-root') {
    return Boolean(session?.authenticated)
  }

  if (routeName === 'admin-pending') {
    return isPendingApproval(session)
  }

  if (!session?.authenticated || isPendingApproval(session)) {
    return false
  }

  switch (routeName) {
    case 'admin-account':
      return hasPermission(session, ADMIN_PERMISSION.SELF_PREFERENCES_MANAGE)
    case 'admin-admin-users':
      return canManageAdminUsers(session)
    case 'admin-districts':
      return hasPermission(session, ADMIN_PERMISSION.DISTRICT_MANAGE)
    case 'admin-groups':
      return hasPermission(session, ADMIN_PERMISSION.GROUP_MANAGE)
    case 'admin-notices':
      return hasPermission(session, ADMIN_PERMISSION.NOTICE_MANAGE)
    case 'admin-content-pages':
      return hasPermission(session, ADMIN_PERMISSION.CONTENT_PAGE_MANAGE)
    case 'admin-public-theme':
      return hasPermission(session, ADMIN_PERMISSION.PUBLIC_THEME_MANAGE)
    case 'admin-overview':
      return canAccessOperationsTools(session)
    case 'admin-audit-logs':
      return hasPermission(session, ADMIN_PERMISSION.AUDIT_VIEW)
    default:
      return true
  }
}

export function resolveAdminHomePath(session) {
  if (!session?.authenticated) {
    return '/admin/login'
  }

  if (isPendingApproval(session)) {
    return '/admin/pending'
  }

  const orderedCandidates = [
    ['admin-groups', '/admin/groups'],
    ['admin-districts', '/admin/districts'],
    ['admin-notices', '/admin/notices'],
    ['admin-content-pages', '/admin/content-pages'],
    ['admin-admin-users', '/admin/admin-users'],
    ['admin-public-theme', '/admin/public-theme'],
    ['admin-overview', '/admin/overview'],
    ['admin-account', '/admin/account'],
  ]

  const accessibleCandidate = orderedCandidates.find(([routeName]) =>
    canAccessAdminRoute(session, routeName),
  )

  return accessibleCandidate?.[1] ?? '/admin/account'
}

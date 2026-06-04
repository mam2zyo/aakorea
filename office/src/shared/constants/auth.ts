export const OfficeRole = {
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',
  MANAGER: 'MANAGER',
  STAFF: 'STAFF',
} as const;

export const UserStatus = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export const OfficePermission = {
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
  USER_MANAGE: 'staff.manage', // staff.manage -> USER_MANAGE로 의미상 매핑
  MANAGER_MANAGE: 'manager.manage',
  STATS_VIEW: 'stats.view',
  MENU_MANAGE: 'menu.manage',
} as const;

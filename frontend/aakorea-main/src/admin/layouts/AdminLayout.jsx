import {
  ADMIN_PERMISSION,
  canAccessOperationsTools,
  canManageAdminUsers,
  hasPermission,
  resolveAdminHomePath,
} from '../app/adminAuthorization'

const ADMIN_NAV_GROUPS = [
  [
    {
      label: "그룹 관리",
      href: "/admin/groups",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.GROUP_MANAGE),
      match: (path) =>
        path === "/admin/groups" || path.startsWith("/admin/groups/"),
    },
    {
      label: "지역연합 관리",
      href: "/admin/districts",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.DISTRICT_MANAGE),
      match: (path) => path === "/admin/districts",
    },
    {
      label: "온라인 모임 관리",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.GROUP_MANAGE),
      status: "준비 중",
    },
    {
      label: "제12단계 운동 관리",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.GROUP_MANAGE),
      status: "준비 중",
    },
  ],
  [
    {
      label: "공지 관리",
      href: "/admin/notices",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.NOTICE_MANAGE),
      match: (path) => path === "/admin/notices",
    },
    {
      label: "안내 페이지",
      href: "/admin/content-pages",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.CONTENT_PAGE_MANAGE),
      match: (path) => path === "/admin/content-pages",
    },
    {
      label: "공개 사이트 테마",
      href: "/admin/public-theme",
      canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.PUBLIC_THEME_MANAGE),
      match: (path) => path === "/admin/public-theme",
    },
    {
      label: "운영자 관리",
      href: "/admin/admin-users",
      canAccess: (session) => canManageAdminUsers(session),
      match: (path) => path === "/admin/admin-users",
    },
  ],
  [
    {
      label: "테스트 도구",
      href: "/admin/overview",
      canAccess: (session) => canAccessOperationsTools(session),
      match: (path) => path === "/admin/overview",
    },
  ],
];

const ADMIN_UTILITY_ITEM = {
  label: "계정 설정",
  href: "/admin/account",
  canAccess: (session) => hasPermission(session, ADMIN_PERMISSION.SELF_PREFERENCES_MANAGE),
  match: (path) => path === "/admin/account",
};

function AdminNavLink({ active, children, href, onNavigate }) {
  return (
    <a
      className={`admin-nav-link${active ? " admin-nav-link--active" : ""}`}
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onNavigate(href);
      }}
    >
      {children}
    </a>
  );
}

export function AdminLayout({
  children,
  currentPath,
  onLogout,
  onNavigate,
  session,
  theme,
}) {
  const themeLabel = {
    dark: '다크',
    light: '라이트',
    system: '시스템',
  }[theme.themePreference]
  const adminHomePath = resolveAdminHomePath(session)
  const visibleNavGroups = ADMIN_NAV_GROUPS
    .map((group) => group.filter((item) => item.canAccess?.(session) ?? true))
    .filter((group) => group.length > 0)
  const displayName = session.displayName ?? session.email ?? session.username ?? '비인증'

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <button
            className="brand-button"
            type="button"
            onClick={() => onNavigate(adminHomePath)}
          >
            AAKorea Admin
          </button>
        </div>

        <nav className="admin-sidebar__nav" aria-label="관리자 메뉴">
          {session.authenticated ? (
            <>
              {visibleNavGroups.map((group, index) => (
                <div
                  key={group.map((item) => item.label).join("-")}
                  className="admin-nav-group"
                >
                  {index > 0 ? (
                    <div className="admin-nav-divider" aria-hidden="true" />
                  ) : null}
                  <div className="admin-nav-list">
                    {group.map((item) =>
                      item.href ? (
                        <AdminNavLink
                          key={item.href}
                          active={item.match(currentPath)}
                          href={item.href}
                          onNavigate={onNavigate}
                        >
                          {item.label}
                        </AdminNavLink>
                      ) : (
                        <span
                          key={item.label}
                          className="admin-nav-link admin-nav-link--disabled"
                        >
                          <span className="admin-nav-link__label">
                            {item.label}
                          </span>
                          {item.status ? (
                            <span className="admin-nav-link__status">
                              {item.status}
                            </span>
                          ) : null}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="admin-nav-group">
              <div className="admin-nav-list">
                <span className="admin-nav-link admin-nav-link--disabled">
                  로그인 후 운영 메뉴를 사용할 수 있습니다.
                </span>
              </div>
            </div>
          )}
        </nav>

        <div className="admin-sidebar__utility">
          <div className="admin-nav-divider" aria-hidden="true" />
          <span className="shell-badge">
            {session.authenticated ? displayName : "비인증"}
          </span>
          <span className="shell-badge shell-badge--muted">
            테마 {themeLabel}
          </span>
          {session.authenticated && ADMIN_UTILITY_ITEM.canAccess(session) ? (
            <AdminNavLink
              active={ADMIN_UTILITY_ITEM.match(currentPath)}
              href={ADMIN_UTILITY_ITEM.href}
              onNavigate={onNavigate}
            >
              {ADMIN_UTILITY_ITEM.label}
            </AdminNavLink>
          ) : null}
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-main__bar">
          <div className="admin-main__heading">
            <p className="eyebrow">AAKorea Admin</p>
            <h1>관리자 페이지</h1>
          </div>

          {session.authenticated ? (
            <div className="admin-main__actions">
              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={() => void onLogout("/admin/login")}
              >
                로그아웃
              </button>
            </div>
          ) : null}
        </header>

        <div className="admin-main__content">
          <main className="page-stack page-stack--admin">{children}</main>
        </div>
      </div>
    </div>
  );
}

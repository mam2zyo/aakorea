const ADMIN_NAV_GROUPS = [
  [
    {
      label: "그룹 관리",
      href: "/admin/groups",
      match: (path) =>
        path === "/admin/groups" || path.startsWith("/admin/groups/"),
    },
    {
      label: "지역연합 관리",
      href: "/admin/districts",
      match: (path) => path === "/admin/districts",
    },
    {
      label: "온라인 모임 관리",
      status: "준비 중",
    },
    {
      label: "제12단계 운동 관리",
      status: "준비 중",
    },
  ],
  [
    {
      label: "공지 관리",
      href: "/admin/notices",
      match: (path) => path === "/admin/notices",
    },
    {
      label: "안내 페이지",
      href: "/admin/content-pages",
      match: (path) => path === "/admin/content-pages",
    },
  ],
  [
    {
      label: "테스트 도구",
      href: "/admin/overview",
      match: (path) => path === "/admin/overview",
    },
  ],
];

const ADMIN_UTILITY_ITEM = {
  label: "계정 설정",
  href: "/admin/account",
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
  flash,
  onLogout,
  onNavigate,
  session,
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <button
            className="brand-button"
            type="button"
            onClick={() => onNavigate("/admin/groups")}
          >
            AAKorea Admin
          </button>
        </div>

        <nav className="admin-sidebar__nav" aria-label="관리자 메뉴">
          {session.authenticated ? (
            <>
              {ADMIN_NAV_GROUPS.map((group, index) => (
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
            {session.authenticated ? session.username : "비인증"}
          </span>
          {session.authenticated ? (
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
          {flash ? (
            <div className={`status-banner status-banner--${flash.tone}`}>
              {flash.message}
            </div>
          ) : null}

          <main className="page-stack page-stack--admin">{children}</main>
        </div>
      </div>
    </div>
  );
}

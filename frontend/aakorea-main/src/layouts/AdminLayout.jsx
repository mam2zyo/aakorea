function AdminNavLink({ active, children, href, onNavigate }) {
  return (
    <a
      className={`nav-link${active ? ' nav-link--active' : ''}`}
      href={href}
      onClick={(event) => {
        event.preventDefault()
        onNavigate(href)
      }}
    >
      {children}
    </a>
  )
}

export function AdminLayout({
  children,
  currentPath,
  flash,
  onLogout,
  onNavigate,
  session,
}) {
  const isGroupsRoute = currentPath === '/admin/groups' || currentPath.startsWith('/admin/groups/')

  return (
    <div className="app-shell">
      <header className="shell-bar shell-bar--admin">
        <div className="shell-bar__identity">
          <button
            className="brand-button"
            type="button"
            onClick={() => onNavigate('/admin/groups')}
          >
            AAKorea Admin
          </button>
          <span className="shell-badge">
            {session.authenticated ? session.username : '비인증'}
          </span>
        </div>

        <nav className="shell-nav">
          <AdminNavLink
            active={currentPath === '/admin/districts'}
            href="/admin/districts"
            onNavigate={onNavigate}
          >
            District 관리
          </AdminNavLink>
          <AdminNavLink
            active={isGroupsRoute}
            href="/admin/groups"
            onNavigate={onNavigate}
          >
            Group 관리
          </AdminNavLink>
        </nav>

        <div className="shell-bar__actions">
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={() => onNavigate('/')}
          >
            공개 홈
          </button>
          {session.authenticated ? (
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={() => void onLogout('/admin/login')}
            >
              로그아웃
            </button>
          ) : null}
        </div>
      </header>

      {flash ? (
        <div className={`status-banner status-banner--${flash.tone}`}>
          {flash.message}
        </div>
      ) : null}

      <main className="page-stack">{children}</main>
    </div>
  )
}

function NavLink({ active, children, href, onNavigate }) {
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

export function PublicLayout({ children, currentPath, flash, onNavigate, session }) {
  return (
    <div className="app-shell">
      <header className="shell-bar">
        <button
          className="brand-button"
          type="button"
          onClick={() => onNavigate('/')}
        >
          AAKorea Main
        </button>

        <nav className="shell-nav">
          <NavLink active={currentPath === '/'} href="/" onNavigate={onNavigate}>
            홈
          </NavLink>
          <NavLink
            active={currentPath === '/content-pages/first-visitor-guide'}
            href="/content-pages/first-visitor-guide"
            onNavigate={onNavigate}
          >
            처음 안내
          </NavLink>
          <NavLink
            active={currentPath === '/meetings'}
            href="/meetings"
            onNavigate={onNavigate}
          >
            모임 찾기
          </NavLink>
          <NavLink
            active={currentPath === '/notices' || currentPath.startsWith('/notices/')}
            href="/notices"
            onNavigate={onNavigate}
          >
            공지
          </NavLink>
        </nav>

        <div className="shell-bar__actions">
          {session.authenticated ? (
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={() => onNavigate('/admin/groups')}
            >
              운영 이동
            </button>
          ) : (
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={() => onNavigate('/admin/login')}
            >
              운영 로그인
            </button>
          )}
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

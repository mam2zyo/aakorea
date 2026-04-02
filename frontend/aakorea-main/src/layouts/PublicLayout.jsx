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

export function PublicLayout({ children, currentPath, flash, onNavigate }) {
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

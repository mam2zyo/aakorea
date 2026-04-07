import { applyPublicThemePreview } from '../app/publicTheme'

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

export function PublicLayout({ children, currentPath, onNavigate, theme }) {
  const previewAwarePath = (path) => applyPublicThemePreview(path, theme)

  return (
    <div className="app-shell">
      <header className="shell-bar">
        <button
          className="brand-button"
          type="button"
          onClick={() => onNavigate(previewAwarePath('/'))}
        >
          AAKorea Main
        </button>

        <nav className="shell-nav">
          {theme.isPreview ? (
            <span className="public-theme-preview">
              테마 미리보기 · {theme.label}
            </span>
          ) : null}
          <NavLink active={currentPath === '/'} href={previewAwarePath('/')} onNavigate={onNavigate}>
            홈
          </NavLink>
          <NavLink
            active={currentPath === '/content-pages/first-visitor-guide'}
            href={previewAwarePath('/content-pages/first-visitor-guide')}
            onNavigate={onNavigate}
          >
            처음 안내
          </NavLink>
          <NavLink
            active={currentPath === '/meetings' || currentPath.startsWith('/groups/')}
            href={previewAwarePath('/meetings')}
            onNavigate={onNavigate}
          >
            모임 찾기
          </NavLink>
          <NavLink
            active={currentPath === '/notices' || currentPath.startsWith('/notices/')}
            href={previewAwarePath('/notices')}
            onNavigate={onNavigate}
          >
            공지
          </NavLink>
        </nav>
      </header>

      <main className="page-stack">{children}</main>
    </div>
  )
}

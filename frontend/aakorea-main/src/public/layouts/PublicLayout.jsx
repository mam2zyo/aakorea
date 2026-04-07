import { applyPublicThemePreview } from '../app/publicTheme'
import { PublicFooter } from '../components/PublicFooter'

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
        <div className="shell-main-row">
          <button
            className="brand-lockup"
            type="button"
            onClick={() => onNavigate(previewAwarePath('/'))}
          >
            <span className="brand-mark" aria-hidden="true">AA</span>
            <span className="brand-copy">
              <strong>AAKorea Main</strong>
              <span>공식 안내 포털</span>
            </span>
          </button>

          <div className="shell-main-actions">
            {theme.isPreview ? (
              <span className="public-theme-preview">
                테마 미리보기 · {theme.label}
              </span>
            ) : null}
            <nav className="shell-nav">
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
          </div>
        </div>
      </header>

      <main className="page-stack">{children}</main>
      <PublicFooter />
    </div>
  )
}

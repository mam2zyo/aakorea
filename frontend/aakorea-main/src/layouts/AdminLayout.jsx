const ADMIN_NAV_SECTIONS = [
  {
    label: '운영 데이터',
    items: [
      {
        label: 'Group 관리',
        href: '/admin/groups',
        match: (path) => path === '/admin/groups' || path.startsWith('/admin/groups/'),
      },
      {
        label: 'District 관리',
        href: '/admin/districts',
        match: (path) => path === '/admin/districts',
      },
    ],
  },
  {
    label: '공개 콘텐츠',
    items: [
      {
        label: '안내 페이지',
        href: '/admin/content-pages',
        match: (path) => path === '/admin/content-pages',
      },
      {
        label: '공지 관리',
        href: '/admin/notices',
        match: (path) => path === '/admin/notices',
      },
    ],
  },
]

const UPCOMING_ADMIN_ITEMS = ['온라인 모임 관리', '제12단계 운동 관리']

function AdminNavLink({ active, children, href, onNavigate }) {
  return (
    <a
      className={`admin-nav-link${active ? ' admin-nav-link--active' : ''}`}
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

function findCurrentAdminTitle(currentPath) {
  const matchedItem = ADMIN_NAV_SECTIONS.flatMap((section) => section.items)
    .find((item) => item.match(currentPath))

  return matchedItem?.label ?? '운영 메뉴'
}

export function AdminLayout({
  children,
  currentPath,
  flash,
  onLogout,
  onNavigate,
  session,
}) {
  const currentTitle = findCurrentAdminTitle(currentPath)

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <button
            className="brand-button"
            type="button"
            onClick={() => onNavigate('/admin/groups')}
          >
            AAKorea Admin
          </button>
          <p className="admin-sidebar__description">
            로그인하면 바로 정렬된 관리 목록으로 진입하는 운영 콘솔입니다.
          </p>
        </div>

        <div className="admin-sidebar__identity">
          <span className="shell-badge">
            {session.authenticated ? session.username : '비인증'}
          </span>
        </div>

        <nav className="admin-sidebar__nav" aria-label="관리자 메뉴">
          {ADMIN_NAV_SECTIONS.map((section) => (
            <div key={section.label} className="admin-nav-section">
              <p className="admin-nav-section__label">{section.label}</p>
              <div className="admin-nav-list">
                {section.items.map((item) => (
                  <AdminNavLink
                    key={item.href}
                    active={item.match(currentPath)}
                    href={item.href}
                    onNavigate={onNavigate}
                  >
                    {item.label}
                  </AdminNavLink>
                ))}
              </div>
            </div>
          ))}

          <div className="admin-nav-section">
            <p className="admin-nav-section__label">추가 예정</p>
            <div className="admin-nav-list">
              {UPCOMING_ADMIN_ITEMS.map((item) => (
                <span key={item} className="admin-nav-link admin-nav-link--disabled">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-main__bar">
          <div className="admin-main__heading">
            <p className="eyebrow">Admin Console</p>
            <h1>{currentTitle}</h1>
          </div>

          <div className="admin-main__actions">
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
  )
}

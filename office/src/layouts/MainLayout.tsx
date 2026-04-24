import React from 'react'

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthContext';
import { OfficePermission } from '@/constants/auth';

interface NavItem {
  label: string;
  href?: string;
  permission?: string;
  status?: string;
}

const NAV_GROUPS: NavItem[][] = [
  [
    { label: '그룹 관리', href: '/office/groups', permission: OfficePermission.GROUP_MANAGE },
    { label: '지역연합 관리', href: '/office/districts', permission: OfficePermission.DISTRICT_MANAGE },
    { label: '온라인 모임 관리', status: '준비 중' },
  ],
  [
    { label: '공지 관리', href: '/office/notices', permission: OfficePermission.NOTICE_MANAGE },
    { label: '안내 페이지', href: '/office/content-pages', permission: OfficePermission.CONTENT_PAGE_MANAGE },
  ],
  [
    { label: '운영자 관리', href: '/office/users', permission: OfficePermission.USER_MANAGE },
    { label: '활동 로그', href: '/office/audit-logs', permission: OfficePermission.AUDIT_VIEW },
  ],
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { session, logout, hasPermission, getHomePath } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/office/login');
  };

  const filteredGroups = NAV_GROUPS.map(group =>
    group.filter(item => !item.permission || hasPermission(item.permission))
  ).filter(group => group.length > 0);

  return (
    <div className="admin-theme admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <button
            className="brand-button"
            type="button"
            onClick={() => navigate(getHomePath())}
          >
            AAKorea Office
          </button>
        </div>

        <nav className="admin-sidebar__nav" aria-label="메뉴">
          {session.authenticated ? (
            filteredGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="admin-nav-group">
                {groupIndex > 0 && <div className="admin-nav-divider" />}
                <div className="admin-nav-list">
                  {group.map((item, itemIndex) => (
                    item.href ? (
                      <NavLink
                        key={itemIndex}
                        to={item.href}
                        className={({ isActive }) =>
                          `admin-nav-link${isActive ? ' admin-nav-link--active' : ''}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <span key={itemIndex} className="admin-nav-link admin-nav-link--disabled">
                        <span className="admin-nav-link__label">{item.label}</span>
                        {item.status && <span className="admin-nav-link__status">{item.status}</span>}
                      </span>
                    )
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="admin-nav-group">
              <div className="admin-nav-list">
                <span className="admin-nav-link admin-nav-link--disabled">
                  로그인이 필요합니다.
                </span>
              </div>
            </div>
          )}
        </nav>

        <div className="admin-sidebar__utility">
          <div className="admin-nav-divider" />
          {session.authenticated && (
            <NavLink
              to="/office/account"
              className={({ isActive }) =>
                `admin-nav-link${isActive ? ' admin-nav-link--active' : ''}`
              }
            >
              계정 설정
            </NavLink>
          )}
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-main__bar">
          <div className="admin-main__heading">
            <p className="eyebrow">AAKorea Office</p>
            <h1>관리 서비스</h1>
          </div>

          {session.authenticated && (
            <div className="admin-main__actions">
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                {session.displayName}님
              </span>
              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          )}
        </header>

        <div className="admin-main__content">
          <main className="page-stack">{children}</main>
        </div>
      </div>
    </div>
  );
}

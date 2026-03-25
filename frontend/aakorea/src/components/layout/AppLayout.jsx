import { Link, NavLink, useLocation } from "react-router-dom";
import { PUBLIC_NAV_ITEMS } from "../../data/publicContent";

export default function AppLayout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const navigationItems = isAdminRoute
    ? [...PUBLIC_NAV_ITEMS, { to: "/admin", label: "관리자" }]
    : PUBLIC_NAV_ITEMS;

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:gap-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <Link to="/" className="text-lg font-semibold tracking-tight">
                AA Korea
              </Link>
              <p className="text-sm text-slate-500">
                공개 안내 콘텐츠와 모임 찾기 흐름을 우선 제공하는 MVP
              </p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                  end={item.to === "/"}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="aa-theme">
      <header className="aa-glass-header border-b border-[color:var(--aa-line)]">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[color:var(--aa-line-strong)] bg-white/60 text-sm font-semibold text-[color:var(--aa-primary)]">
                A.A.
              </div>
              <div className="space-y-1">
                <Link
                  to="/"
                  className="block text-xl font-semibold tracking-tight aa-heading"
                >
                  AA Korea
                </Link>
                <p className="aa-eyebrow">Alcoholics Anonymous Korea</p>
                <p className="max-w-2xl text-sm leading-6 aa-copy">
                  익명성과 자발성, 회복의 메시지를 해치지 않으면서 처음 찾아온
                  분이 모임 안내까지 자연스럽게 이어질 수 있도록 구성한 기본
                  안내 영역입니다.
                </p>
              </div>
            </div>

            <Link to="/admin" className="aa-button-secondary self-start lg:self-auto">
              관리자
            </Link>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `aa-nav-link text-sm font-medium ${
                    isActive ? "aa-nav-link-active" : ""
                  }`
                }
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

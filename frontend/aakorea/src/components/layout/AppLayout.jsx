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
            </div>
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
              </div>
            </div>

            <Link
              to="/admin"
              className="aa-button-secondary self-start lg:self-auto"
            >
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

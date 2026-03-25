import { Link, NavLink, Outlet } from "react-router-dom";
import { PUBLIC_NAV_ITEMS } from "../../domains/basic/content/public-content";
import SiteFooter from "../../shared/layout/SiteFooter";

export default function PublicShell() {
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

            <div className="flex flex-wrap gap-2">
              <Link to="/me" className="aa-button-secondary">
                멤버 공간
              </Link>
              <Link to="/admin" className="aa-button-secondary">
                관리자
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-2">
            {PUBLIC_NAV_ITEMS.map((item) => (
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
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}

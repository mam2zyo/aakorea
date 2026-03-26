import { Link, NavLink, Outlet } from "react-router-dom";

const userLinks = [{ to: "/me", label: "내 공간" }];

export default function UserShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                User
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                내 공간
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                공통 로그인과 계정 정보를 다루는 사용자 영역입니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                공개 화면으로 이동
              </Link>
              <Link
                to="/admin"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                관리자 포털
              </Link>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {userLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

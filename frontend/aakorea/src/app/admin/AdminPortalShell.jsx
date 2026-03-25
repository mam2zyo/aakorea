import { Link, NavLink, Outlet } from "react-router-dom";

const adminDomains = [
  {
    to: "/admin/service/groups",
    label: "Service 운영",
    description: "조직, 그룹, 공지, 공개 콘텐츠",
  },
  {
    to: "/admin/store/overview",
    label: "Store 운영",
    description: "상품, 재고, 주문 관리 준비",
  },
  {
    to: "/admin/heart/overview",
    label: "Heart 운영",
    description: "구독, 발송, 아카이브 관리 준비",
  },
];

export default function AdminPortalShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Admin Portal
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                관리자 포털
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                관리자 포털은 하나의 진입면으로 유지하되, 실제 운영 화면은
                `service`, `store`, `heart` 도메인별로 분리합니다.
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
                to="/me"
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                멤버 공간
              </Link>
            </div>
          </div>

          <nav className="grid gap-3 md:grid-cols-3">
            {adminDomains.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-2xl border px-4 py-4 transition-colors ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`
                }
              >
                <div className="font-semibold">{item.label}</div>
                <div className="mt-1 text-xs text-inherit/80">
                  {item.description}
                </div>
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

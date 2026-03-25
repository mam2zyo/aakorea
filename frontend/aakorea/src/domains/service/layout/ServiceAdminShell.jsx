import { NavLink, Outlet } from "react-router-dom";

const serviceMenus = [
  {
    to: "/admin/service/districts",
    label: "지역연합 관리",
    description: "연합 생성, 수정, 삭제",
  },
  {
    to: "/admin/service/groups",
    label: "그룹 관리",
    description: "그룹, GSR, 모임, 공지",
  },
];

function getNavClassName(isActive) {
  const baseClassName = "rounded-2xl border px-4 py-3 transition-colors ";

  if (isActive) {
    return `${baseClassName} border-blue-200 bg-blue-50 text-blue-700`;
  }

  return `${baseClassName} border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50`;
}

export default function ServiceAdminShell() {
  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="space-y-3">
        {serviceMenus.map((menu) => (
          <NavLink
            key={menu.to}
            to={menu.to}
            className={({ isActive }) => getNavClassName(isActive)}
          >
            <div className="font-semibold">{menu.label}</div>
            <div className="mt-1 text-xs text-inherit/80">{menu.description}</div>
          </NavLink>
        ))}
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  );
}

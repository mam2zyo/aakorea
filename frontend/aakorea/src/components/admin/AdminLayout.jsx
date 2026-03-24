import { Link, NavLink } from 'react-router-dom'

const adminMenus = [
  {
    to: '/admin/districts',
    label: '지역연합 관리',
    description: '연합 생성, 수정, 삭제',
    available: true,
  },
  {
    to: '/admin/groups',
    label: '그룹 관리',
    description: '그룹 생성, 수정, 삭제',
    available: true,
  },
  {
    to: '/admin/gsrs',
    label: 'GSR 관리',
    description: 'GSR 생성, 수정, 삭제',
    available: true,
  },
  {
    to: '/admin/users',
    label: '운영자 관리',
    description: '추가 예정',
    available: false,
  },
]

function getNavClassName(isActive, available) {
  const baseClassName =
    'rounded-2xl border px-4 py-3 transition-colors '

  if (!available) {
    return `${baseClassName} cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400`
  }

  if (isActive) {
    return `${baseClassName} border-blue-200 bg-blue-50 text-blue-700`
  }

  return `${baseClassName} border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50`
}

export default function AdminLayout({ title, description, children }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              관리자 콘솔
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            사용자 화면으로 이동
          </Link>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {adminMenus.map((menu) =>
            menu.available ? (
              <NavLink
                key={menu.to}
                to={menu.to}
                className={({ isActive }) => getNavClassName(isActive, menu.available)}
              >
                <div className="font-semibold">{menu.label}</div>
                <div className="mt-1 text-xs text-inherit/80">{menu.description}</div>
              </NavLink>
            ) : (
              <div key={menu.to} className={getNavClassName(false, menu.available)}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{menu.label}</div>
                    <div className="mt-1 text-xs text-inherit/80">{menu.description}</div>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-500">
                    Soon
                  </span>
                </div>
              </div>
            ),
          )}
        </aside>

        <section>{children}</section>
      </div>
    </div>
  )
}

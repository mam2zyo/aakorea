import { Link, Outlet } from "react-router-dom";

export default function HeartShell() {
  return (
    <div className="min-h-screen bg-rose-50/40 text-slate-900">
      <header className="border-b border-rose-100 bg-white/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-700">
                Heart
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                월간지 구독
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                구독 수명주기와 발송 이력을 위한 별도 도메인 영역입니다.
              </p>
            </div>
            <Link
              to="/"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              공개 화면으로 이동
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

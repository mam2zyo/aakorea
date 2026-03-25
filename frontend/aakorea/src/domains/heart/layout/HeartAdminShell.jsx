import { Outlet } from "react-router-dom";

export default function HeartAdminShell() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Heart 운영 영역</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          구독, 발송, 디지털 아카이브 관리는 heart 도메인 안에서 별도 운영
          영역으로 준비합니다.
        </p>
      </div>
      <Outlet />
    </section>
  );
}

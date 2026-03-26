import { Outlet } from "react-router-dom";

export default function StoreAdminShell() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Store 운영 영역</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          상품, 재고, 주문 관리는 `service`에 흡수하지 않고 store 도메인 안에서
          운영하도록 준비합니다.
        </p>
      </div>
      <Outlet />
    </section>
  );
}

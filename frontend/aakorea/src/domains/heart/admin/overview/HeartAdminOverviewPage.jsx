export default function HeartAdminOverviewPage() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Heart 관리자 구조</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        이 영역은 향후 구독 관리, 발송 이력, 발행본/아카이브 운영 화면을 위한
        독립 route group과 shell의 자리입니다.
      </p>
    </article>
  );
}

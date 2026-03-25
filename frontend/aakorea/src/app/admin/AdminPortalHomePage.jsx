import { Link } from "react-router-dom";

const cards = [
  {
    title: "Service 운영",
    description:
      "지역연합, 그룹, 모임, 공지와 공개 콘텐츠 운영을 담당하는 현재 활성 영역입니다.",
    to: "/admin/service/groups",
    actionLabel: "Service로 이동",
  },
  {
    title: "Store 운영",
    description:
      "상품 입력, 재고 관리, 주문 운영을 위한 별도 도메인 영역을 준비합니다.",
    to: "/admin/store/overview",
    actionLabel: "Store 구조 보기",
  },
  {
    title: "Heart 운영",
    description:
      "월간지 구독, 발송 이력, 디지털 아카이브를 위한 별도 도메인 영역을 준비합니다.",
    to: "/admin/heart/overview",
    actionLabel: "Heart 구조 보기",
  },
];

export default function AdminPortalHomePage() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          도메인별 운영 구조
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          문서에서 정리한 방향처럼, 관리자 포털은 하나로 유지하되 실제 기능
          구현과 권한 판단은 도메인별 화면으로 나눕니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {card.description}
            </p>
            <Link
              to={card.to}
              className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              {card.actionLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

const overviewCards = [
  {
    title: "공통 로그인",
    description:
      "현재 인증 기능은 준비 중이지만, 이 영역은 향후 OIDC/OAuth2 기반 로그인과 내부 세션 연결의 진입점이 됩니다.",
  },
  {
    title: "주소록",
    description:
      "배송지 마스터는 member 도메인에 남기고, 주문/구독은 각 도메인이 스냅샷으로 보존하는 구조를 전제로 합니다.",
  },
  {
    title: "주문/구독 요약",
    description:
      "마이페이지는 store와 heart의 데이터를 조회 조합해 보여줄 수 있지만, 소유권은 각 도메인에 남습니다.",
  },
];

export default function MemberHomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">멤버 공간 구조</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          현재는 공통 멤버 영역을 위한 프론트 구조만 먼저 분리했습니다. 실제
          로그인, 주소록 편집, 주문/구독 집계는 이후 단계에서 이 영역 아래에
          확장할 수 있습니다.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {overviewCards.map((card) => (
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
          </article>
        ))}
      </div>
    </div>
  );
}

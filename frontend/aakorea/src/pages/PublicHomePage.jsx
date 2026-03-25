import { Link } from "react-router-dom";
import { PUBLIC_PAGE_LIST } from "../data/publicContent";

const meetingTypeCards = [
  {
    title: "공개모임",
    description: "알코올중독자 본인이나 가족, 또는 중독 문제에 관심이 있는 누구나 참석할 수 있는 공개모임",
  },
  {
    title: "비공개모임",
    description: "술을 끊기를 바라는 알코올중독자 본인만 참석할 수 있는 비공개모임",
  },
];

const quickSteps = [
  "처음 오신 분들께에서 A.A.가 어떤 공동체인지 먼저 살펴봅니다.",
  "첫 참석 가이드와 FAQ로 부담을 낮춘 뒤 공개모임부터 확인합니다.",
  "모임 검색과 그룹 상세에서 장소, 공지, 정기 일정까지 차분히 다시 확인합니다.",
];

const audienceCards = [
  {
    title: "술 문제로 고민하는 분",
    description: "지금 당장 결심을 강요하지 않고, 회복 경험을 나누는 공동체가 어떤 곳인지 먼저 이해할 수 있도록 안내합니다.",
  },
  {
    title: "가족과 가까운 사람",
    description: "A.A.가 어떤 역할을 하는지, 함께 정보를 살펴볼 때 무엇을 먼저 보면 좋은지 간결하게 정리했습니다.",
  },
  {
    title: "전문가와 기관 관계자",
    description: "치료를 대신하지 않으면서도 동료 회복의 기반이 어떻게 작동하는지 설명하는 기본 자료로 활용할 수 있습니다.",
  },
];

export default function PublicHomePage() {
  return (
    <div className="space-y-8 lg:space-y-10">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_360px]">
        <article className="aa-card overflow-hidden px-6 py-8 lg:px-8 lg:py-10">
          <p className="aa-eyebrow">Alcoholics Anonymous</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight aa-heading lg:text-5xl">
            술 문제로 고민하고 있다면, 익명 속에서 회복의 가능성을 먼저
            살펴보세요.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 aa-copy lg:text-base">
            A.A.는 술을 멈추고 싶거나 자신의 음주를 돌아보고 싶은 사람을 위한
            동료 공동체입니다. 처음 오신 분을 위한 안내, A.A. 소개, 첫 참석
            가이드, 모임 검색을 한 흐름으로 정리했습니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/meetings" className="aa-button-primary">
              가까운 모임 찾기
            </Link>
            <Link to="/welcome" className="aa-button-secondary">
              처음 오신 분들께
            </Link>
          </div>
        </article>

        <aside className="aa-card-dark p-6">
          <div className="space-y-2">
            <span className="aa-tag">Ready for a first meeting?</span>
            <h2 className="text-2xl font-semibold">처음이라면 이렇게 살펴보세요.</h2>
            <p className="text-sm leading-6 text-white/80">
              바로 참석을 결정하지 않아도 됩니다. 정보를 먼저 확인하고,
              공개모임부터 천천히 살펴보는 흐름을 추천합니다.
            </p>
          </div>

          <ol className="mt-6 space-y-3 text-sm leading-6 text-white/90">
            {quickSteps.map((step, index) => (
              <li key={step} className="aa-step-card flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/10 text-xs font-semibold">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PUBLIC_PAGE_LIST.map((page) => (
          <article key={page.key} className="aa-card p-5">
            <p className="aa-eyebrow">{page.eyebrow}</p>
            <h2 className="mt-3 text-lg font-semibold aa-heading">{page.title}</h2>
            <p className="mt-2 text-sm leading-6 aa-copy">{page.summary}</p>
            <Link
              to={page.path}
              className="mt-5 inline-flex items-center text-sm font-semibold aa-inline-link"
            >
              자세히 보기
            </Link>
          </article>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <article className="aa-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="aa-eyebrow">Meeting Types</p>
              <h2 className="mt-2 text-2xl font-semibold aa-heading">
                모임 형태를 먼저 이해하면 선택이 쉬워집니다.
              </h2>
            </div>
            <Link to="/guide" className="aa-button-secondary">
              첫 참석 가이드
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {meetingTypeCards.map((card) => (
              <div key={card.title} className="aa-card-soft p-4">
                <div className="text-sm font-semibold aa-heading">{card.title}</div>
                <p className="mt-1 text-sm leading-6 aa-copy">{card.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="aa-card p-6">
          <p className="aa-eyebrow">Who This Helps</p>
          <h2 className="mt-2 text-2xl font-semibold aa-heading">
            누구를 위한 기본 안내인가요?
          </h2>
          <div className="mt-5 space-y-3">
            {audienceCards.map((card) => (
              <div key={card.title} className="aa-note px-4 py-4">
                <h3 className="text-sm font-semibold aa-heading">{card.title}</h3>
                <p className="mt-1 text-sm leading-6 aa-copy">{card.description}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

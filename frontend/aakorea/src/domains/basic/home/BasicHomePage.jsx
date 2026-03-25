import { useState } from "react";
import { Link } from "react-router-dom";

const audiencePanels = {
  newcomer: {
    label: "처음 오신 분",
    prompt: "술 문제로 도움을 찾고 있어요",
    title: "지금 가장 중요한 것은 부담을 줄이고 첫 행동을 쉽게 만드는 일입니다.",
    description:
      "A.A.가 어떤 모임인지, 첫 방문 전에 무엇을 확인하면 좋은지, 그리고 모임에서 어떤 분위기를 기대할 수 있는지 한 번에 살펴볼 수 있도록 구성했습니다.",
    primaryAction: { label: "가까운 모임 찾기", to: "/meetings" },
    secondaryAction: { label: "처음 오신 분께", to: "/welcome" },
    resources: [
      { label: "첫 모임 가이드", to: "/guide" },
      { label: "자주 묻는 질문", to: "/faq" },
      { label: "A.A. 소개", to: "/about" },
    ],
  },
  family: {
    label: "가족/지인",
    prompt: "가까운 사람의 음주 문제를 이해하고 싶어요",
    title: "도움을 강요하기보다, 먼저 이해할 수 있는 정보가 필요할 때가 있습니다.",
    description:
      "가족과 지인이 A.A.를 이해할 때 특히 필요한 안내를 우선 배치했습니다. 공개 모임과 기본 소개 자료를 먼저 살펴보는 흐름을 추천합니다.",
    primaryAction: { label: "A.A. 소개 보기", to: "/about" },
    secondaryAction: { label: "공개 모임 찾기", to: "/meetings" },
    resources: [
      { label: "처음 오신 분께", to: "/welcome" },
      { label: "첫 모임 가이드", to: "/guide" },
      { label: "GSO 안내", to: "/gso" },
    ],
  },
  professional: {
    label: "전문가",
    prompt: "내담자나 대상자에게 A.A.를 안내하고 싶어요",
    title: "전문가에게는 정확하고 간결한 소개, 그리고 연결 경로가 중요합니다.",
    description:
      "A.A.가 어떤 역할을 하고 무엇을 대신하지 않는지, 공개 안내 자료와 지역 연결 창구를 중심으로 빠르게 확인할 수 있게 구성했습니다.",
    primaryAction: { label: "GSO 안내 보기", to: "/gso" },
    secondaryAction: { label: "A.A. 소개 보기", to: "/about" },
    resources: [
      { label: "공개 모임 찾기", to: "/meetings" },
      { label: "FAQ 확인", to: "/faq" },
      { label: "첫 모임 가이드", to: "/guide" },
    ],
  },
};

const firstMeetingSteps = [
  "오늘 열리는 모임을 먼저 찾습니다.",
  "장소와 공지, 공개 모임 여부를 확인합니다.",
  "부담이 적은 일정부터 천천히 참석해 봅니다.",
];

const learnMoreLinks = [
  { label: "A.A. 소개", to: "/about" },
  { label: "처음 오신 분께", to: "/welcome" },
  { label: "첫 모임 가이드", to: "/guide" },
  { label: "GSO 안내", to: "/gso" },
];

const recommendedLinks = [
  { label: "가까운 모임 찾기", to: "/meetings" },
  { label: "자주 묻는 질문", to: "/faq" },
  { label: "사이트 운영 정책", to: "/gso#site-policy" },
  { label: "연락처와 문의 안내", to: "/gso#contact-info" },
];

export default function BasicHomePage() {
  const [activeAudience, setActiveAudience] = useState("newcomer");
  const panel = audiencePanels[activeAudience];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <article className="aa-hero px-6 py-8 lg:px-8 lg:py-10">
          <div className="relative z-[1] max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
              Alcoholics Anonymous Korea
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-6xl">
              술 문제로 힘들다면,
              <br />
              혼자 해결하지 않아도 됩니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/84">
              A.A.는 한 사람이 다른 사람의 회복을 돕는 단순한 프로그램 위에
              세워진 공동체입니다. 처음 방문 전 안내, 모임 검색, A.A. 소개를
              가장 먼저 만날 수 있도록 정리했습니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/meetings" className="aa-button-accent">
                가까운 모임 찾기
              </Link>
              <Link to="/welcome" className="aa-button-ghost-light">
                처음 오신 분께
              </Link>
            </div>
          </div>
        </article>

        <aside className="aa-card p-6">
          <span className="aa-chip">First Action</span>
          <h2 className="mt-4 text-2xl font-semibold aa-heading">
            첫 행동을 작고 명확하게 시작하세요
          </h2>
          <p className="mt-3 text-sm leading-7 aa-copy">
            처음부터 모든 것을 결정할 필요는 없습니다. 정보 확인, 공개 모임
            찾기, 첫 방문 준비처럼 부담이 적은 단계부터 시작하면 됩니다.
          </p>

          <ol className="mt-5 space-y-3">
            {firstMeetingSteps.map((step, index) => (
              <li key={step} className="aa-card-soft flex gap-3 px-4 py-4">
                <span className="aa-chip h-8 w-8 shrink-0 rounded-full p-0">
                  {index + 1}
                </span>
                <span className="text-sm leading-6 aa-heading">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-5">
            <Link to="/guide" className="aa-button-primary">
              첫 모임 가이드 보기
            </Link>
          </div>
        </aside>
      </section>

      <section className="aa-notice-band px-5 py-5 lg:px-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm leading-7 lg:text-base">
            <strong>방문 전 확인 안내:</strong> 모임 장소와 공지 사항은 변경될 수
            있으니, 참석 전 검색 결과와 그룹 상세의 최신 안내를 꼭 확인해
            주세요.
          </div>
          <Link to="/meetings" className="text-sm font-semibold text-[#4a3216]">
            모임 검색으로 이동
          </Link>
        </div>
      </section>

      <section className="aa-card overflow-hidden">
        <div className="border-b border-[color:var(--aa-line)] px-6 py-6 lg:px-8">
          <p className="aa-eyebrow">I Am...</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.entries(audiencePanels).map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveAudience(key)}
                className={`rounded-full border px-4 py-3 text-sm font-semibold transition ${
                  activeAudience === key
                    ? "border-[color:var(--aa-primary)] bg-[color:var(--aa-primary)] text-white"
                    : "border-[color:var(--aa-line)] bg-white text-[color:var(--aa-text)]"
                }`}
              >
                {value.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8">
          <article className="space-y-5">
            <div>
              <p className="aa-eyebrow">{panel.prompt}</p>
              <h2 className="mt-3 text-3xl font-semibold aa-heading">
                {panel.title}
              </h2>
              <p className="mt-4 text-sm leading-7 aa-copy lg:text-base">
                {panel.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to={panel.primaryAction.to} className="aa-button-primary">
                {panel.primaryAction.label}
              </Link>
              <Link to={panel.secondaryAction.to} className="aa-button-secondary">
                {panel.secondaryAction.label}
              </Link>
            </div>
          </article>

          <aside className="aa-card-soft p-5">
            <h3 className="text-xl font-semibold aa-heading">추천 바로가기</h3>
            <div className="aa-resource-list mt-4">
              {panel.resources.map((item) => (
                <Link key={item.to} to={item.to} className="aa-resource-link">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs aa-copy">보기</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article className="aa-card overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
            <div className="p-6 lg:p-8">
              <p className="aa-eyebrow">First Meeting</p>
              <h2 className="mt-3 text-3xl font-semibold aa-heading">
                첫 모임은 결심을 증명하는 자리가 아니라,
                <br />
                회복의 문을 확인하는 시간이어도 됩니다.
              </h2>
              <p className="mt-4 text-sm leading-7 aa-copy lg:text-base">
                처음에는 듣기만 하거나 조용히 머물러도 괜찮습니다. 모임마다
                분위기가 다를 수 있으니, 자신에게 맞는 흐름을 찾는 과정으로
                생각해도 충분합니다.
              </p>
            </div>
            <div className="aa-card-dark flex flex-col justify-center p-6 lg:p-8">
              <span className="aa-tag w-fit">Ready for a first meeting?</span>
              <h3 className="mt-4 text-3xl font-semibold text-white">
                공개 모임부터
                <br />
                천천히 시작해 보세요
              </h3>
              <p className="mt-4 text-sm leading-7 text-white/82">
                참석 전 장소와 공지를 다시 확인하고, 첫 방문 안내를 먼저 읽으면
                부담을 크게 줄일 수 있습니다.
              </p>
              <div className="mt-6">
                <Link to="/guide" className="aa-button-accent">
                  첫 모임 가이드
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="aa-card p-6">
          <h2 className="text-2xl font-semibold aa-heading">A.A. 더 알아보기</h2>
          <div className="aa-resource-list mt-5">
            {learnMoreLinks.map((item) => (
              <Link key={item.to} to={item.to} className="aa-resource-link">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs aa-copy">이동</span>
              </Link>
            ))}
          </div>
        </article>

        <article className="aa-card p-6">
          <h2 className="text-2xl font-semibold aa-heading">추천 자료와 연결</h2>
          <div className="aa-resource-list mt-5">
            {recommendedLinks.map((item) => (
              <Link key={item.to} to={item.to} className="aa-resource-link">
                <span className="font-medium">{item.label}</span>
                <span className="text-xs aa-copy">확인</span>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="aa-band px-6 py-7 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
              Join others on the road to recovery
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">
              혼자 결정하지 않아도 됩니다.
              <br />
              가까운 모임과 기본 안내부터 살펴보세요.
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <Link to="/meetings" className="aa-button-accent">
              가까운 모임 찾기
            </Link>
            <Link to="/welcome" className="aa-button-ghost-light">
              처음 오신 분께
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

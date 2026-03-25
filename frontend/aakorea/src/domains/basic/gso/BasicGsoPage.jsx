import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const contactDetails = [
  {
    label: "주소",
    value: "서울 영등포구 영신로 10길 6, 정우빌딩 5층",
  },
  {
    label: "대표 전화",
    value: "02-833-0311 / 02-774-3797",
  },
  {
    label: "팩스",
    value: "02-833-0422",
  },
  {
    label: "이메일",
    value: "aakoreagso@gmail.com",
    href: "mailto:aakoreagso@gmail.com",
  },
  {
    label: "교통 안내",
    value: "영등포역 또는 인근 대중교통을 이용해 접근할 수 있습니다.",
  },
  {
    label: "방문 전 확인",
    value: "운영 시간과 방문 가능 여부는 공지 또는 사무국 안내를 먼저 확인해 주세요.",
  },
];

const gsoServices = [
  {
    title: "그룹과 지역의 문의 응대",
    description:
      "전화, 이메일, 문서 요청 등 기본 문의에 답하고 필요한 안내 자료를 연결합니다.",
  },
  {
    title: "새로운 그룹과 서비스 연결 지원",
    description:
      "처음 그룹을 시작하거나 지역 서비스 구조를 이해하려는 분들에게 기본 절차와 자료를 제공합니다.",
  },
  {
    title: "공개 안내 자료 정리",
    description:
      "처음 방문자, 가족, 전문가가 참고할 수 있는 공개 안내를 정리하고 최신화합니다.",
  },
  {
    title: "문헌 및 자료 안내",
    description:
      "A.A. 소개 자료, 서비스 자료, 공지성 자료를 필요한 곳에 연결하고 배포 흐름을 관리합니다.",
  },
  {
    title: "행사와 공지 관리",
    description:
      "연합 차원의 회의, 행사, 공지 사항을 정리해 사이트와 공개 채널에 반영합니다.",
  },
  {
    title: "기록 보존과 운영 지원",
    description:
      "연합의 주요 기록과 운영 문서를 보존하고 필요한 시점에 참고할 수 있도록 관리합니다.",
  },
];

const policyItems = [
  "이 페이지는 A.A. 한국연합사무국의 공개 안내를 제공하기 위한 목적에 집중합니다.",
  "개인의 회복 경험과 익명성은 존중되며, 공개 영역에서는 개인 식별 정보를 최소화합니다.",
  "모임 시간, 장소, 공지 정보는 현장 사정에 따라 바뀔 수 있으므로 최신 공지를 우선 확인해 주세요.",
  "긴급 상황이나 전문 상담이 필요한 경우에는 해당 전문 기관과 연결하는 것이 우선입니다.",
];

const quickLinks = [
  { label: "연락처 바로 보기", href: "#contact-info" },
  { label: "사이트 운영 정책", href: "#site-policy" },
  { label: "가까운 모임 찾기", to: "/meetings" },
  { label: "A.A. 소개", to: "/about" },
];

export default function BasicGsoPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const elementId = location.hash.replace("#", "");
    const scrollTarget = document.getElementById(elementId);

    if (!scrollTarget) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.hash]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="aa-hero px-6 py-8 lg:px-8 lg:py-10">
        <div className="relative z-[1] max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
            General Service Office
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
            A.A. 한국연합사무국 안내
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/84">
            연락처와 위치 정보, 기본 서비스 역할, 사이트 운영 원칙을 한곳에
            모았습니다. 처음 문의하거나 연합 차원의 공개 안내를 찾을 때 가장
            먼저 확인할 수 있는 기본 페이지입니다.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="mailto:aakoreagso@gmail.com" className="aa-button-accent">
              이메일 문의
            </a>
            <Link to="/meetings" className="aa-button-ghost-light">
              모임 찾기
            </Link>
          </div>
        </div>
      </section>

      <section className="aa-notice-band px-5 py-5 lg:px-6">
        <div className="text-sm leading-7 lg:text-base">
          <strong>방문 안내:</strong> 사무국 방문 전에는 운영 시간과 방문 가능
          여부를 먼저 확인해 주세요. 현장 운영은 일정에 따라 달라질 수
          있습니다.
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <article id="contact-info" className="aa-card p-6 scroll-mt-28">
            <div>
              <p className="aa-eyebrow">Contact</p>
              <h2 className="mt-2 text-2xl font-semibold aa-heading">
                연락처 및 위치 정보
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {contactDetails.map((item) => (
                <div key={item.label} className="aa-card-soft px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] aa-copy">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-2 block text-sm leading-6 aa-heading"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-2 text-sm leading-6 aa-heading">
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>

          <article className="aa-card p-6">
            <div>
              <p className="aa-eyebrow">Service</p>
              <h2 className="mt-2 text-2xl font-semibold aa-heading">
                사무국이 하는 일
              </h2>
            </div>
            <ol className="mt-5 space-y-3">
              {gsoServices.map((service, index) => (
                <li key={service.title} className="aa-card-soft px-4 py-4">
                  <div className="flex items-start gap-3">
                    <span className="aa-chip mt-0.5 shrink-0">{index + 1}</span>
                    <div>
                      <h3 className="text-sm font-semibold aa-heading">
                        {service.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 aa-copy">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article id="site-policy" className="aa-card p-6 scroll-mt-28">
            <div>
              <p className="aa-eyebrow">Policy</p>
              <h2 className="mt-2 text-2xl font-semibold aa-heading">
                사이트 운영 정책
              </h2>
            </div>
            <ul className="mt-5 space-y-3">
              {policyItems.map((item) => (
                <li
                  key={item}
                  className="aa-card-soft px-4 py-4 text-sm leading-6 aa-heading"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <aside className="space-y-4">
          <section className="aa-card-dark p-5">
            <span className="aa-tag w-fit">Quick Support</span>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              사무국 안내가 필요할 때
              <br />
              가장 먼저 확인할 내용
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/82">
              연락처, 운영 공지, 공개 안내 자료를 우선 확인하고, 이후 필요한
              모임 연결이나 문의를 이어가면 좋습니다.
            </p>
          </section>

          <section className="aa-card p-5">
            <h2 className="text-xl font-semibold aa-heading">빠른 링크</h2>
            <div className="aa-resource-list mt-4">
              {quickLinks.map((item) =>
                item.to ? (
                  <Link key={item.label} to={item.to} className="aa-resource-link">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs aa-copy">이동</span>
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="aa-resource-link"
                  >
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs aa-copy">보기</span>
                  </a>
                ),
              )}
            </div>
          </section>
        </aside>
      </section>

      <section className="aa-band px-6 py-7 lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
              Join others on the road to recovery
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white lg:text-4xl">
              공개 안내를 읽은 뒤에는,
              <br />
              가까운 모임과 첫 방문 가이드를 이어서 확인해 보세요.
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">
            <Link to="/meetings" className="aa-button-accent">
              가까운 모임 찾기
            </Link>
            <Link to="/guide" className="aa-button-ghost-light">
              첫 모임 가이드
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

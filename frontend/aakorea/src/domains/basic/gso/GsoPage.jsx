import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const contactDetails = [
  {
    label: "주소",
    value: "서울시 영등포구 영신로20길 6, 정우빌딩 5층",
  },
  {
    label: "전화",
    value: "02) 833-0311, 02) 774-3797",
  },
  {
    label: "팩스",
    value: "02) 833-0422",
  },
  {
    label: "이메일",
    value: "aakoreagso@gmail.com",
    href: "mailto:aakoreagso@gmail.com",
  },
  {
    label: "오시는 길",
    value: "영등포역 1번 출구, 정우빌딩",
  },
  {
    label: "지번 주소",
    value: "서울 영등포구 영등포동 618-188",
  },
];

const gsoServices = [
  {
    title: "그룹의 문제점을 함께 해결합니다.",
    description:
      "전화나 서신 등으로 그룹의 문제점들과 해결책들을 나누며, 이런 일을 하는 방법으로서 A.A.의 주소록과 한국연합 봉사자 모임에서 결정된 사항들이 포함됩니다.",
  },
  {
    title: "새로운 그룹을 돕는 특별지원책",
    description:
      "새로운 그룹과 서신, 전화, 이메일 등으로 긴밀히 연락을 하고 무료 도서 제공 등 기타 모임 진행 시 필요한 자료들을 지원합니다.",
  },
  {
    title: "해외의 A.A.",
    description:
      "A.A.는 전 세계에 걸쳐 각 나라의 언어와 문화가 다름에도 불구하고 급속히 퍼져 나가고 있습니다. 국내에 거주하는 외국인이나 해외에 있는 자국의 멤버들에게 각국의 도서(한국어판, 영어판, 일어판 등)로 도움을 주고 모임 장소나 필요한 기타 자료 등을 전해 줍니다.",
  },
  {
    title: "나홀로 멤버와 국제주의자들이 자기 검토하는 것을 돕습니다.",
    description:
      "아직 그룹이 없는 지역의 멤버에게 새로운 모임을 결성할 수 있도록 그들과 긴밀히 연락을 하고, 비록 적은 수이지만 오지의 멤버와 원양선원 등에게 책자나 서신, 테이프 등으로 도움을 줍니다.",
  },
  {
    title: "출판이 인가된 책과 소책자들",
    description:
      "문헌은 A.A. 12단계 운동의 생명선이 되어왔습니다. 출판 인가된 책자들을 편집, 출판, 배포하는 일은 사무국의 봉사활동 중 가장 생명력 있는 것으로 남아 있습니다. 새로운 책자의 발간과 그 외의 시청각 자료의 개발도 추진하고 있습니다.",
  },
  {
    title: "공공안내",
    description:
      "신문, 방송 등과 관계를 갖는 것은 A.A.의 중요한 일입니다. 사무국은 이들에게 우리의 일을 전체적으로 설명하고 책임을 집니다. 지역적인 필요성이 생기면 책임이 그 지역 대표봉사자에게로 옮겨집니다.",
  },
  {
    title: "익명이 깨지는 경우",
    description:
      "A.A. 멤버의 익명이 대중 매체에서 깨졌을 때의 경험에 따라 사무국은 익명이 깨진 사건이 일어난 지역의 대표에게 이 정보를 보내고, 대표가 1) 대중 매체 수준에서 우리의 익명의 전통에 관해서 그 멤버에게 상기시킬 것인지 혹은 2) 사무국이 그 멤버에게 편지를 쓰는 것이 좋은지 어떻게 할 것인가를 함께 검토합니다. 전통은 대부분 조심성이 없든지 아니면 무시되는 가운데 어기게 됩니다. 그리고 전통을 상기시키는 사람들은 더 많은 전통이 깨지는데도 외면을 하곤 합니다.",
  },
  {
    title: "전문가 집단과 협력하는 일",
    description:
      "최근 들어 알코올중독 치료, 지원 전문가 집단이 매우 활동적입니다. A.A.는 그 전통을 위배하지 않는 범위 안에서 그들에게 A.A.에 대해 안내하고, 그들과 유대를 가질 필요가 있습니다.",
  },
  {
    title: "중앙 사무국(G.S.O 뉴욕)과의 의견 교환",
    description:
      "사무실 직원들은 공동의 문제점들과 해결책을 나누기 위해 서로 연락 활동을 합니다.",
  },
  {
    title: "자립",
    description:
      "A.A.가 성장하고 새로운 봉사활동이 추가되므로 사무국은 정기적인 경제적 지원이 요구됩니다. 안정된 사무국의 운영을 위해 그룹과 개인 멤버들에게 A.A.의 자립 원칙을 지켜줄 것을 장려합니다.",
  },
  {
    title: "정기총회",
    description:
      "정기총회는 매년 2월에 열리는 전국봉사자 모임으로 1년 동안의 주요 활동 계획에 대한 의견을 나누는 모임입니다. 또한 매 2년마다 새로운 연합봉사자들을 선출하는 모임이기도 합니다. 사무국은 총회의 진행이 원활하고 차질 없이 진행되도록 준비를 하고 새로운 의견이 지속적으로 논의될 수 있도록 봉사합니다.",
  },
  {
    title: "지역 공개모임",
    description:
      "A.A.한국연합 사무국은 지역 공개모임이 원활히 진행될 수 있도록 지역 봉사자들과 공개모임 프로그램에 대한 의견을 나누고, 공개모임 시 필요한 자료를 지원합니다.",
  },
  {
    title: "국제 컨벤션",
    description:
      "격년마다 열리는 국제 행사인 컨벤션의 준비, 예산 집행, 결산 등 제반 업무를 수행하는 컨벤션 준비위원회의 활동을 지원합니다.",
  },
  {
    title: "A.A. 역사 기록물 보존, 관리",
    description:
      "초창기의 왕래 서신, 회의 기록, 초기 도서 등 한국 A.A.의 모든 기록물들을 영구적으로 보존할 수 있도록 관리합니다.",
  },
];

const policyItems = [
  "이 사이트는 A.A.한국연합 사무국의 기본 연락처와 공공 안내 정보를 제공하는 목적에 집중합니다.",
  "개인 회복 경험과 익명성은 존중되어야 하며, 공개 영역에서 개인 식별 정보는 최소화합니다.",
  "모임 시간과 장소, 프로그램 운영 정보는 지역 사정에 따라 변경될 수 있으므로 최신 공지와 상세 정보를 함께 확인하도록 안내합니다.",
  "문의 응답은 운영 여건에 따라 시간이 걸릴 수 있으며, 응급 상황이나 의료 상담은 전문기관을 이용해야 합니다.",
];

export default function GsoPage() {
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
      <section className="aa-card px-6 py-8 lg:px-8 lg:py-10">
        <p className="aa-eyebrow">General Service Office</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight aa-heading lg:text-4xl">
          A.A.한국연합 사무국 안내
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 aa-copy lg:text-base">
          A.A.한국연합 사무국의 연락처, 위치 정보, 그리고 정기적으로 제공되는
          봉사 내용을 현재 사이트의 흐름에 맞게 정리했습니다. 예전 사이트의
          `About G.S.O.` 안내를 그대로 잇되, 필요한 내용을 더 빠르게 찾을 수
          있도록 재구성했습니다.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="mailto:aakoreagso@gmail.com" className="aa-button-secondary">
            이메일 문의
          </a>
          <Link to="/meetings" className="aa-button-primary">
            모임 찾기
          </Link>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <article id="contact-info" className="aa-card p-6 scroll-mt-28">
            <h2 className="text-xl font-semibold aa-heading">
              연락처 및 위치 정보
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contactDetails.map((item) => (
                <div key={item.label} className="aa-card-soft px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] aa-copy">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="mt-2 block text-sm leading-6 aa-heading aa-footer-link"
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
            <h2 className="text-xl font-semibold aa-heading">
              A.A.한국연합 사무국의 봉사 내용
            </h2>
            <p className="mt-3 text-sm leading-7 aa-copy lg:text-base">
              A.A.한국연합 사무국에서 어떤 일들이 이루어지는지 궁금한 분들을
              위해, 정기적으로 제공되는 주요 서비스를 정리했습니다.
            </p>
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
            <h2 className="text-xl font-semibold aa-heading">
              사이트 운영정책
            </h2>
            <ul className="mt-4 space-y-3">
              {policyItems.map((item) => (
                <li
                  key={item}
                  className="aa-card-soft px-4 py-3 text-sm leading-6 aa-heading"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";

const resourcePills = [
  { to: "/welcome", label: "처음 오신 분께" },
  { to: "/meetings", label: "모임 찾기" },
  { to: "/events", label: "소식·행사" },
  { to: "/resources", label: "자료실" },
  { to: "/library", label: "도서·문헌 소개" },
];

const footerLinks = [
  { to: "/about", label: "A.A. 소개" },
  { to: "/events", label: "소식·행사" },
  { to: "/resources", label: "자료실" },
  { to: "/library", label: "도서·문헌 소개" },
  { to: "/store", label: "스토어" },
  { to: "/gso#contact-info", label: "연락처" },
];

const officialChannels = [
  {
    href: "https://blog.naver.com/aakorea_official",
    label: "네이버 블로그",
  },
  {
    href: "https://www.youtube.com/@aakorea1935",
    label: "YouTube",
  },
];

export default function BasicSiteFooter() {
  return (
    <footer className="mt-14 bg-[color:var(--aa-primary)] text-white">
      <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
                Alcoholics Anonymous Korea
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">
                Alcoholics
                <br />
                Anonymous
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/82 lg:text-base">
                A.A. 한국연합사무국의 공개 안내 영역입니다. 처음 도움을 찾는
                분과 가족, 전문가, 기존 멤버가 필요한 정보를 빠르게 찾을 수
                있도록 구성했습니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {resourcePills.map((item) => (
                <Link key={item.to} to={item.to} className="aa-footer-pill">
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/16 bg-white/8 p-6 backdrop-blur-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
              Contact
            </p>
            <div className="mt-5 space-y-4 text-sm leading-6 text-white/88">
              <div>
                <div className="font-semibold text-white">이메일</div>
                <a href="mailto:aakoreagso@gmail.com" className="aa-footer-link">
                  aakoreagso@gmail.com
                </a>
              </div>
              <div>
                <div className="font-semibold text-white">대표 전화</div>
                <div>02-833-0311 / 02-774-3797</div>
              </div>
              <div>
                <div className="font-semibold text-white">주소</div>
                <div>서울 영등포구 영신로 10길 6, 정우빌딩 5층</div>
              </div>
              <div>
                <div className="font-semibold text-white">안내</div>
                <div>
                  운영 시간과 방문 가능 여부는 공지 및 사무국 안내를 먼저
                  확인해 주세요.
                </div>
              </div>
              <div>
                <div className="font-semibold text-white">공식 채널</div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2">
                  {officialChannels.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="aa-footer-link"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/16 pt-6 text-sm text-white/78">
          {footerLinks.map((item) => (
            <Link key={item.to} to={item.to} className="aa-footer-link">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-6 text-sm leading-7 text-white/64">
          Alcoholics Anonymous와 관련 표기는 각 권리자 정책에 따라 보호될 수
          있습니다. 본 서비스는 A.A. 한국연합사무국의 공개 안내를 위한
          프론트엔드 시안입니다.
        </div>
      </div>
    </footer>
  );
}

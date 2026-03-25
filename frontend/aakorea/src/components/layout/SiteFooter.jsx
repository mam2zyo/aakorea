import { Link } from "react-router-dom";

const contactItems = [
  {
    label: "주소",
    value: "서울특별시 영등포구 영신로20길 6, 정우빌딩 5층",
  },
  {
    label: "전화",
    value: "02-774-3797, 02-833-0311",
  },
  {
    label: "문자메시지",
    value: "010-2587-3797",
    href: "sms:01025873797",
  },
  {
    label: "이메일",
    value: "aakoreagso@gmail.com",
    href: "mailto:aakoreagso@gmail.com",
  },
];

const footerLinks = [
  { to: "/gso", label: "About G.S.O." },
  { to: "/gso#site-policy", label: "사이트 운영정책" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-[color:var(--aa-line)] bg-[rgba(255,251,245,0.72)]">
      <div className="mx-auto grid max-w-[1180px] gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_320px] lg:px-8 lg:py-10">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h2 className="text-base font-semibold aa-heading">
              에이에이한국연합
            </h2>
            <span className="aa-chip aa-chip-warm">
              사업자등록번호 107-82-69892
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {contactItems.map((item) => (
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
        </section>

        <aside className="aa-card p-5 lg:p-6">
          <p className="aa-eyebrow">Service Info</p>
          <div className="mt-5 space-y-3">
            {footerLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="aa-link-tile text-sm font-medium aa-heading"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </footer>
  );
}

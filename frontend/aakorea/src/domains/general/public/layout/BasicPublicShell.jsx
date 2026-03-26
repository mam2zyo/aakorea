import { Link, NavLink, Outlet } from "react-router-dom";
import { BASIC_PUBLIC_NAV_ITEMS } from "../content/basic-public-content";
import BasicSiteFooter from "./BasicSiteFooter";

const utilityLinks = [
  { to: "/gso#contact-info", label: "사무국 안내" },
  {
    href: "https://blog.naver.com/aakorea_official",
    label: "공식 블로그",
  },
  {
    href: "https://www.youtube.com/@aakorea1935",
    label: "YouTube",
  },
];

function UtilityLink({ item }) {
  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="aa-utility-link aa-focusable"
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.to} className="aa-utility-link aa-focusable">
      {item.label}
    </Link>
  );
}

export default function BasicPublicShell() {
  return (
    <div className="aa-theme">
      <header className="aa-site-header">
        <div className="aa-utility-bar">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6 lg:px-8">
            <div className="font-medium text-white/90">
              Alcoholics Anonymous Korea
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {utilityLinks.map((item) => (
                <UtilityLink key={item.to ?? item.href} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <Link to="/" className="aa-focusable flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-base font-semibold text-white">
                A.A.
              </div>
              <div>
                <div className="text-2xl font-semibold tracking-tight text-white lg:text-3xl">
                  AA Korea
                </div>
                <p className="mt-1 text-sm text-white/78">
                  회복과 안내를 위한 공식 서비스 포털
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-2 xl:flex-1 xl:justify-center">
              {BASIC_PUBLIC_NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `aa-nav-link aa-focusable text-sm font-medium ${
                      isActive ? "aa-nav-link-active" : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              <Link to="/meetings" className="aa-button-accent">
                지금 모임 찾기
              </Link>
              <Link to="/store" className="aa-button-ghost-light">
                스토어
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Outlet />
      </main>
      <BasicSiteFooter />
    </div>
  );
}

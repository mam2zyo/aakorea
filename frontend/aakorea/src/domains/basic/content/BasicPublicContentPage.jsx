import { Link, Navigate } from "react-router-dom";
import {
  BASIC_PUBLIC_PAGES,
  BASIC_PUBLIC_PAGE_LIST,
} from "./basic-public-content";

const STATIC_PAGE_LINKS = {
  gso: {
    key: "gso",
    path: "/gso",
    title: "사무국 안내",
    summary: "연락처, 운영 정책, 안내 자료 요청 경로를 확인합니다.",
  },
  meetings: {
    key: "meetings",
    path: "/meetings",
    title: "모임 찾기",
    summary: "지역과 요일을 기준으로 현재 열리는 모임을 찾습니다.",
  },
  store: {
    key: "store",
    path: "/store",
    title: "스토어",
    summary: "판매 가능한 문헌과 주문 흐름은 별도 도메인에서 확인합니다.",
  },
};

function ActionButton({ action }) {
  if (action.href) {
    return (
      <a
        href={action.href}
        target="_blank"
        rel="noreferrer"
        className={
          action.tone === "primary"
            ? "aa-button-primary"
            : "aa-button-secondary"
        }
      >
        {action.label}
      </a>
    );
  }

  return (
    <Link
      to={action.to}
      className={
        action.tone === "primary" ? "aa-button-primary" : "aa-button-secondary"
      }
    >
      {action.label}
    </Link>
  );
}

function FeatureLinkCard({ item }) {
  const content = (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] aa-copy">
        바로 가기
      </p>
      <h2 className="mt-3 text-lg font-semibold aa-heading">{item.label}</h2>
      <p className="mt-3 text-sm leading-6 aa-copy">{item.description}</p>
    </>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="aa-card p-5"
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={item.to} className="aa-card p-5">
      {content}
    </Link>
  );
}

function BulletItem({ bullet }) {
  if (typeof bullet === "string") {
    return (
      <li className="aa-card-soft px-4 py-4 text-sm leading-6 aa-heading">
        {bullet}
      </li>
    );
  }

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-semibold aa-heading lg:text-base">
          {bullet.label}
        </span>
        {bullet.href ? (
          <span className="shrink-0 text-xs font-medium aa-copy">새 창</span>
        ) : bullet.to ? (
          <span className="shrink-0 text-xs font-medium aa-copy">이동</span>
        ) : null}
      </div>
      {bullet.description ? (
        <p className="mt-2 text-sm leading-6 aa-copy">{bullet.description}</p>
      ) : null}
    </>
  );

  if (bullet.href) {
    return (
      <li className="aa-card-soft px-4 py-4">
        <a href={bullet.href} target="_blank" rel="noreferrer" className="block">
          {content}
        </a>
      </li>
    );
  }

  if (bullet.to) {
    return (
      <li className="aa-card-soft px-4 py-4">
        <Link to={bullet.to} className="block">
          {content}
        </Link>
      </li>
    );
  }

  return <li className="aa-card-soft px-4 py-4">{content}</li>;
}

export default function BasicPublicContentPage({ pageKey }) {
  const page = BASIC_PUBLIC_PAGES[pageKey];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const relatedPages = page.relatedKeys?.length
    ? page.relatedKeys
        .map(
          (key) =>
            BASIC_PUBLIC_PAGE_LIST.find((item) => item.key === key) ??
            STATIC_PAGE_LINKS[key],
        )
        .filter(Boolean)
    : BASIC_PUBLIC_PAGE_LIST.filter((item) => item.key !== page.key).slice(0, 4);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="aa-hero px-6 py-8 lg:px-8 lg:py-10">
        <div className="relative z-[1] max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/72">
            {page.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white lg:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-white/84">
            {page.summary}
          </p>
          {page.ctas?.length ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {page.ctas.map((action) => (
                <ActionButton key={action.to ?? action.href} action={action} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {page.featuredLinks?.length ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {page.featuredLinks.map((item) => (
            <FeatureLinkCard key={item.to ?? item.href} item={item} />
          ))}
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {page.sections.map((section) => (
            <article key={section.title} className="aa-card p-6 lg:p-7">
              <h2 className="text-2xl font-semibold aa-heading">
                {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-4 text-sm leading-7 aa-copy lg:text-base"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets?.length ? (
                <ul className="mt-5 space-y-3">
                  {section.bullets.map((bullet) => (
                    <BulletItem
                      key={
                        typeof bullet === "string"
                          ? bullet
                          : bullet.to ??
                            bullet.href ??
                            bullet.label ??
                            bullet.description
                      }
                      bullet={bullet}
                    />
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>

        <aside className="space-y-4">
          <section className="aa-card p-5">
            <h2 className="text-xl font-semibold aa-heading">다음으로 살펴보기</h2>
            <div className="aa-resource-list mt-4">
              {relatedPages.map((item) => (
                <Link key={item.path} to={item.path} className="aa-resource-link">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-xs aa-copy">이동</span>
                </Link>
              ))}
            </div>
          </section>

          {page.faqs?.length ? (
            <section className="aa-card p-5">
              <h2 className="text-xl font-semibold aa-heading">자주 묻는 질문</h2>
              <div className="mt-4 space-y-3">
                {page.faqs.map((faq) => (
                  <article key={faq.question} className="aa-card-soft p-4">
                    <h3 className="text-sm font-semibold aa-heading">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-6 aa-copy">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="aa-card-dark p-5">
            <span className="aa-tag w-fit">Need help now?</span>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              가장 먼저 할 일은
              <br />
              가까운 모임과 기본 안내를 확인하는 것입니다.
            </h2>
            <div className="mt-5 flex flex-col gap-3">
              <Link to="/meetings" className="aa-button-accent">
                모임 찾기
              </Link>
              <Link to="/guide" className="aa-button-ghost-light">
                첫 모임 가이드
              </Link>
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}

import { Link, Navigate } from "react-router-dom";
import {
  BASIC_PUBLIC_PAGES,
  BASIC_PUBLIC_PAGE_LIST,
} from "./basic-public-content";

function ActionButton({ action }) {
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

export default function BasicPublicContentPage({ pageKey }) {
  const page = BASIC_PUBLIC_PAGES[pageKey];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  const relatedPages = BASIC_PUBLIC_PAGE_LIST.filter(
    (item) => item.key !== page.key,
  ).slice(0, 4);

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
                <ActionButton key={action.to} action={action} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

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
                    <li
                      key={bullet}
                      className="aa-card-soft px-4 py-4 text-sm leading-6 aa-heading"
                    >
                      {bullet}
                    </li>
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
                <Link key={item.to} to={item.to} className="aa-resource-link">
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

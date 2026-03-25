import { Link, Navigate } from "react-router-dom";
import { PUBLIC_PAGES } from "../data/publicContent";

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

export default function PublicContentPage({ pageKey }) {
  const page = PUBLIC_PAGES[pageKey];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="aa-card px-6 py-8 lg:px-8 lg:py-10">
        <p className="aa-eyebrow">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight aa-heading lg:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 aa-copy lg:text-base">
          {page.summary}
        </p>
        {page.ctas?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {page.ctas.map((action) => (
              <ActionButton key={action.to} action={action} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {page.sections.map((section) => (
            <article
              key={section.title}
              className="aa-card p-6"
            >
              <h2 className="text-xl font-semibold aa-heading">
                {section.title}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-sm leading-7 aa-copy lg:text-base"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-4 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="aa-card-soft px-4 py-3 text-sm leading-6 aa-heading"
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
            <h2 className="text-base font-semibold aa-heading">
              다음 단계 추천
            </h2>
            <div className="mt-4 space-y-3">
              <Link
                to="/meetings"
                className="aa-link-tile text-sm font-medium aa-heading"
              >
                가까운 모임 찾아보기
              </Link>
              <Link
                to="/guide"
                className="aa-link-tile text-sm font-medium aa-heading"
              >
                첫 참석 가이드 보기
              </Link>
              <Link
                to="/faq"
                className="aa-link-tile text-sm font-medium aa-heading"
              >
                FAQ와 점검 질문 보기
              </Link>
            </div>
          </section>

          {page.faqs?.length ? (
            <section className="aa-card p-5">
              <h2 className="text-base font-semibold aa-heading">
                자주 묻는 질문
              </h2>
              <div className="mt-4 space-y-3">
                {page.faqs.map((faq) => (
                  <article
                    key={faq.question}
                    className="aa-card-soft p-4"
                  >
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
        </aside>
      </section>
    </div>
  );
}

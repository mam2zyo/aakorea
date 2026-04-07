export function PageSection({ label, title, description, children }) {
  return (
    <section className="panel">
      <div className="panel__header">
        <p className="eyebrow">{label}</p>
        <h2>{title}</h2>
        <p className="panel__description">{description}</p>
      </div>
      {children}
    </section>
  )
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside,
  actions,
}) {
  return (
    <section className="page-intro">
      <div className="page-intro__copy">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-intro__title">{title}</h1>
        <p className="page-intro__description">{description}</p>
        {actions ? <div className="button-row">{actions}</div> : null}
      </div>
      {aside ? <aside className="page-intro__aside">{aside}</aside> : null}
    </section>
  )
}

export function Field({ label, className = '', error, children }) {
  return (
    <label className={`field${error ? ' field--invalid' : ''} ${className}`.trim()}>
      <span className="field__label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}

export function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

export function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

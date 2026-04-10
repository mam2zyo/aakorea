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

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}) {
  return (
    <section className="admin-page-header">
      <div className="admin-page-header__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="admin-page-header__title">{title}</h1>
        {description ? (
          <p className="admin-page-header__description">{description}</p>
        ) : null}
      </div>
      {actions || meta ? (
        <div className="admin-page-header__side">
          {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
          {meta ? <div className="admin-page-header__meta">{meta}</div> : null}
        </div>
      ) : null}
    </section>
  )
}

export function Field({ label, className = '', error, as: Component = 'label', children }) {
  return (
    <Component className={`field${error ? ' field--invalid' : ''} ${className}`.trim()}>
      <span className="field__label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </Component>
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

export * from './RichTextEditor'

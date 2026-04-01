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
        <p className="eyebrow">{eyebrow}</p>
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

export function Field({ label, className = '', error, children }) {
  return (
    <label className={`field${error ? ' field--invalid' : ''} ${className}`.trim()}>
      <span className="field__label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
    </label>
  )
}

export function ToggleField({ checked, label, onChange }) {
  return (
    <label className="toggle-field">
      <input checked={checked} type="checkbox" onChange={onChange} />
      <span>{label}</span>
    </label>
  )
}

export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <div className="section-header">
      <h3>{title}</h3>
      {actionLabel && onAction ? (
        <button
          className="ghost-button ghost-button--small"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

export function EntityList({
  actionLabel = '편집',
  emptyDescription,
  emptyTitle,
  items,
  onAction,
  renderItem,
}) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="entity-list">
      {items.map((item) => (
        <div key={item.id} className="entity-item">
          {renderItem(item)}
          {onAction ? (
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={() => onAction(item)}
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      ))}
    </div>
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

export function StatusPill({ active }) {
  return (
    <span
      className={`status-pill ${
        active ? 'status-pill--active' : 'status-pill--inactive'
      }`}
    >
      {active ? '활성' : '비활성'}
    </span>
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

export function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

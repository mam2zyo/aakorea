import { ReactNode } from 'react';

interface PageSectionProps {
  label?: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function PageSection({ label, title, description, children }: PageSectionProps) {
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

interface OfficePageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  meta?: ReactNode;
}

export function OfficePageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
}: OfficePageHeaderProps) {
  return (
    <section className="office-page-header">
      <div className="office-page-header__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="office-page-header__title">{title}</h1>
        {description ? (
          <p className="office-page-header__description">{description}</p>
        ) : null}
      </div>
      {actions || meta ? (
        <div className="office-page-header__side">
          {actions ? <div className="office-page-header__actions">{actions}</div> : null}
          {meta ? <div className="office-page-header__meta">{meta}</div> : null}
        </div>
      ) : null}
    </section>
  )
}

export { OfficePageHeader as PageHeader };

interface FieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  description?: string;
}

export function Field({ label, children, error, description }: FieldProps) {
  return (
    <div className="office-field">
      <span className="field__label">{label}</span>
      {children}
      {error ? <span className="field__error">{error}</span> : null}
      {description ? <p className="field__description">{description}</p> : null}
    </div>
  )
}

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  )
}

interface DetailItemProps {
  label: string;
  value: ReactNode;
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="detail-item">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export { RichTextEditor } from './RichTextEditor'
export { AttachmentField } from './AttachmentField'

import React from 'react';

interface FieldProps {
  label?: string;
  children: React.ReactNode;
  error?: string | null;
  description?: string;
  className?: string;
}

export function Field({ label, children, error, description, className = '' }: FieldProps) {
  return (
    <div className={`office-field ${className} ${error ? 'office-field--error' : ''}`}>
      {label && <label className="office-field__label">{label}</label>}
      <div className="office-field__content">
        {children}
        {error && <div className="office-field__error-message">{error}</div>}
        {description && <div className="office-field__description">{description}</div>}
      </div>
    </div>
  );
}

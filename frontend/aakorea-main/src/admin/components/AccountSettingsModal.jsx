import { Field } from '../ui'

const THEME_LABELS = {
  dark: '다크',
  light: '라이트',
  system: '시스템',
}

export function AccountSettingsModal({
  isOpen,
  onClose,
  resolvedTheme,
  themePreference,
  onThemePreferenceChange,
  session,
}) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="admin-overlay" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="admin-overlay__dialog admin-overlay__dialog--submodal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-group-modal__header admin-group-modal__header--submodal">
          <div className="admin-overlay__heading">
            <h2>계정 설정</h2>
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={onClose}
          >
            닫기
          </button>
        </header>

        <div className="admin-group-modal__body">
          <div className="admin-group-modal__panel">
            <section className="admin-user-editor__section">
              <div className="admin-user-editor__identity-card">
                <div className="admin-user-editor__identity-grid">
                  <div className="detail-item">
                    <dt>계정 정보</dt>
                    <dd>{session?.displayName || session?.email || '정보 없음'}</dd>
                  </div>
                </div>
              </div>

              <div className="admin-group-modal__panel" style={{ marginTop: 'var(--space-4)' }}>
                <Field label="운영 콘솔 테마">
                  <select
                    className="admin-input admin-input--select"
                    value={themePreference}
                    onChange={(e) => onThemePreferenceChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text)',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      appearance: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="system">시스템 설정</option>
                    <option value="light">라이트 모드</option>
                    <option value="dark">다크 모드</option>
                  </select>
                </Field>
                <p className="section-note" style={{ fontSize: '0.84rem' }}>
                  테마 설정은 브라우저 로컬 저장소에 보관됩니다. (실제 적용: {THEME_LABELS[resolvedTheme]})
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}

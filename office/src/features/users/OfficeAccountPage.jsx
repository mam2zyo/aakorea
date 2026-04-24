import { PageHeader, PageSection } from '@/components/ui'

const THEME_OPTIONS = [
  {
    value: 'system',
    label: '시스템',
    description: '운영체제 설정을 따라갑니다.',
  },
  {
    value: 'light',
    label: '라이트',
    description: '밝은 운영 화면으로 고정합니다.',
  },
  {
    value: 'dark',
    label: '다크',
    description: '어두운 운영 화면으로 고정합니다.',
  },
]

const THEME_LABELS = {
  dark: '다크',
  light: '라이트',
  system: '시스템',
}

export function OfficeAccountPage({
  resolvedTheme,
  systemTheme,
  themePreference,
  onThemePreferenceChange,
}) {
  return (
    <div className="office-flat-page">
      <PageHeader
        title="계정 설정"
        description="현재는 브라우저 단위의 개인 설정만 제공합니다. 운영 API나 계정 설정 저장과는 아직 분리된 상태입니다."
      />

      <PageSection
        label="Appearance"
        title="운영 콘솔 테마"
        description="라이트, 다크, 시스템 모드를 선택할 수 있습니다. 선택값은 현재 브라우저의 로컬 저장소에만 보관됩니다."
      >
        <div className="theme-choice-list" role="list" aria-label="운영 콘솔 테마 선택">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              aria-pressed={themePreference === option.value}
              className={`ghost-button theme-choice-button${
                themePreference === option.value ? ' theme-choice-button--active' : ''
              }`}
              type="button"
              onClick={() => onThemePreferenceChange(option.value)}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        <div className="theme-choice-meta">
          <p className="section-note">
            현재 선택: {THEME_LABELS[themePreference]} · 실제 적용: {THEME_LABELS[resolvedTheme]}
          </p>
          {themePreference === 'system' ? (
            <p className="section-note">
              시스템 감지 결과: {THEME_LABELS[systemTheme]}
            </p>
          ) : null}
        </div>
      </PageSection>
    </div>
  )
}

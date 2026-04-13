import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  AdminPageHeader,
  DetailItem,
  EmptyState,
  PageSection,
} from '@/admin/ui'
import { adminSiteThemeApi } from '@/shared/api'
import {
  applyPublicThemePreview,
  getPublicTheme,
  listPublicThemes,
} from '@/public/app/publicTheme'

const PUBLIC_THEME_OPTIONS = listPublicThemes()

export function AdminPublicThemePage({
  onError,
  onNavigate,
  onSuccess,
  publicThemeState,
}) {
  const [themeState, setThemeState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [draftSavingThemeId, setDraftSavingThemeId] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const [rollingBack, setRollingBack] = useState(false)

  async function loadThemeState() {
    setLoading(true)

    try {
      const data = await adminSiteThemeApi.getPublicThemeState()
      setThemeState(data)
      publicThemeState.setActiveThemeId(data.activeThemeId)
    } catch (error) {
      setThemeState(null)
      onError(error, '공개 사이트 테마 설정을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadThemeStateEffect = useEffectEvent(() => {
    void loadThemeState()
  })

  useEffect(() => {
    loadThemeStateEffect()
  }, [])

  async function handleSaveDraft(themeId) {
    if (!themeId || draftSavingThemeId || publishing || rollingBack) {
      return
    }

    setDraftSavingThemeId(themeId)

    try {
      const data = await adminSiteThemeApi.savePublicThemeDraft({ themeId })
      setThemeState(data)
      onSuccess(`${getPublicTheme(themeId).label} 테마를 드래프트로 저장했습니다.`)
    } catch (error) {
      onError(error, '드래프트 테마를 저장하지 못했습니다.')
    } finally {
      setDraftSavingThemeId(null)
    }
  }

  async function handlePublish() {
    if (!themeState || publishing || rollingBack) {
      return
    }

    setPublishing(true)

    try {
      const data = await adminSiteThemeApi.publishPublicTheme()
      setThemeState(data)
      publicThemeState.setActiveThemeId(data.activeThemeId)
      onSuccess(`${getPublicTheme(data.activeThemeId).label} 테마를 공개 사이트에 반영했습니다.`)
    } catch (error) {
      onError(error, '공개 사이트 테마를 게시하지 못했습니다.')
    } finally {
      setPublishing(false)
    }
  }

  async function handleRollback() {
    if (!themeState || publishing || rollingBack) {
      return
    }

    setRollingBack(true)

    try {
      const data = await adminSiteThemeApi.rollbackPublicTheme()
      setThemeState(data)
      publicThemeState.setActiveThemeId(data.activeThemeId)
      onSuccess(`${getPublicTheme(data.activeThemeId).label} 테마로 롤백했습니다.`)
    } catch (error) {
      onError(error, '공개 사이트 테마를 롤백하지 못했습니다.')
    } finally {
      setRollingBack(false)
    }
  }

  const previewPath = useMemo(() => {
    if (!themeState) {
      return '/'
    }

    return applyPublicThemePreview('/', {
      isPreview: themeState.draftThemeId !== themeState.activeThemeId,
      themeId: themeState.draftThemeId,
    })
  }, [themeState])

  const activeTheme = themeState ? getPublicTheme(themeState.activeThemeId) : null
  const draftTheme = themeState ? getPublicTheme(themeState.draftThemeId) : null
  const previousTheme = themeState?.previousThemeId
    ? getPublicTheme(themeState.previousThemeId)
    : null

  return (
    <div className="admin-flat-page">
      <AdminPageHeader
        title="공개 사이트 테마"
        description="공개 사이트의 디자인 테마를 관리합니다. 드래프트를 미리보고 게시하거나 이전 버전으로 롤백할 수 있습니다."
      />

      {loading && !themeState ? (
        <section className="panel">
          <div className="section-note">테마 설정을 불러오는 중입니다...</div>
        </section>
      ) : null}

      {!loading && !themeState ? (
        <EmptyState
          title="테마 설정을 불러오지 못했습니다."
          description="네트워크 연결을 확인하거나 잠시 후 다시 시도해 주세요."
        />
      ) : null}

      {themeState ? (
        <div className="admin-theme-dashboard">
          {/* Left Column: Live Status & Actions */}
          <aside className="admin-theme-dashboard__side">
            <section className="admin-theme-status-card">
              <header className="admin-theme-status-card__header">
                <span className="eyebrow">LIVE STATUS</span>
                <h3>현재 공개 중인 상태</h3>
              </header>

              <dl className="detail-grid">
                <DetailItem
                  label="라이브 테마"
                  value={activeTheme?.label ?? themeState.activeThemeId}
                />
                <DetailItem
                  label="마지막 게시"
                  value={formatDateTimeLabel(themeState.publishedAt)}
                />
              </dl>

              <div className="button-row" style={{ marginTop: 'var(--space-6)' }}>
                <button
                  className="ghost-button ghost-button--small"
                  type="button"
                  onClick={() => onNavigate('/')}
                >
                  라이브 홈 열기
                </button>
              </div>
            </section>

            <section className="admin-workflow-card">
              <header className="admin-theme-status-card__header">
                <span className="eyebrow">PUBLICATION</span>
                <h3>공개 및 배포 도구</h3>
              </header>

              {themeState.hasUnpublishedDraft ? (
                <div className="admin-form-note" style={{ fontSize: '0.88rem', marginBottom: 'var(--space-2)' }}>
                  드래프트가 현재 라이브와 다릅니다. 미리보기 후 게시할 수 있습니다.
                </div>
              ) : null}

              <div className="button-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <button
                  className="primary-button"
                  disabled={!themeState.hasUnpublishedDraft || publishing || rollingBack}
                  type="button"
                  onClick={() => void handlePublish()}
                >
                  {publishing ? '게시 중...' : '드래프트 게시'}
                </button>

                <button
                  className="ghost-button"
                  disabled={publishing || rollingBack}
                  type="button"
                  onClick={() => onNavigate(previewPath)}
                >
                  {themeState.hasUnpublishedDraft ? '드래프트 미리보기' : '라이브 미리보기'}
                </button>

                {themeState.previousThemeId ? (
                  <button
                    className="ghost-button ghost-button--danger"
                    disabled={!themeState.previousThemeId || publishing || rollingBack}
                    type="button"
                    onClick={() => void handleRollback()}
                  >
                    {rollingBack ? '롤백 중...' : '직전 테마로 롤백'}
                  </button>
                ) : null}
              </div>
            </section>
          </aside>

          {/* Right Column: Theme Library */}
          <main className="admin-theme-dashboard__main">
            <PageSection
              label="THEME LIBRARY"
              title="사이트 테마 라이브러리"
              description="공개 사이트에 적용할 테마를 선택하세요. 선택 시 드래프트로 즉시 저장됩니다."
            >
              <div className="admin-theme-choice-grid">
                {PUBLIC_THEME_OPTIONS.map((option) => {
                  const isLive = themeState.activeThemeId === option.themeId
                  const isDraft = themeState.draftThemeId === option.themeId

                  return (
                    <button
                      key={option.themeId}
                      aria-pressed={isDraft}
                      className={`ghost-button theme-choice-button${
                        isDraft ? ' theme-choice-button--active' : ''
                      }`}
                      disabled={draftSavingThemeId === option.themeId || publishing || rollingBack}
                      type="button"
                      onClick={() => void handleSaveDraft(option.themeId)}
                    >
                      <div className="theme-choice-button__badge">
                        {isLive ? (
                          <span className="status-pill status-pill--active" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                            LIVE
                          </span>
                        ) : isDraft ? (
                          <span className="status-pill status-pill--inactive" style={{ fontSize: '0.68rem', padding: '0.2rem 0.5rem' }}>
                            DRAFT
                          </span>
                        ) : null}
                      </div>
                      <strong>{option.label}</strong>
                      <span style={{ fontSize: '0.88rem' }}>{option.description}</span>
                    </button>
                  )
                })}
              </div>
            </PageSection>
          </main>
        </div>
      ) : null}
    </div>
  )
}

function formatDateTimeLabel(value) {
  if (!value) {
    return '기록 없음'
  }

  return value.replace('T', ' ').slice(0, 16)
}

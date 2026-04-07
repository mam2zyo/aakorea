import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  AdminPageHeader,
  DetailItem,
  EmptyState,
  PageSection,
} from '../../admin/ui'
import { adminSiteThemeApi } from '../../lib/api'
import {
  applyPublicThemePreview,
  getPublicTheme,
  listPublicThemes,
} from '../../public/app/publicTheme'

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
        description="공개 화면의 활성 테마와 드래프트 테마를 분리해 관리합니다. 지금은 코드에 포함된 preset theme id를 기준으로 draft, publish, rollback만 제공합니다."
      />

      <PageSection
        label="Published Theme"
        title="현재 공개 중인 테마 상태"
        description="활성 테마, 드래프트, 마지막 롤백 대상 여부를 한 번에 확인할 수 있습니다."
      >
        {loading ? <div className="section-note">공개 사이트 테마 설정을 불러오는 중입니다...</div> : null}

        {!loading && !themeState ? (
          <EmptyState
            title="테마 설정을 아직 표시하지 못했습니다."
            description="잠시 후 다시 시도하거나 새로고침해 주세요."
          />
        ) : null}

        {themeState ? (
          <>
            <div className="button-row button-row--compact">
              <span className="status-pill status-pill--active">
                활성 {activeTheme?.label ?? themeState.activeThemeId}
              </span>
              <span className={`status-pill${
                themeState.hasUnpublishedDraft ? ' status-pill--inactive' : ' status-pill--active'
              }`}
              >
                드래프트 {draftTheme?.label ?? themeState.draftThemeId}
              </span>
              {previousTheme ? (
                <span className="shell-badge shell-badge--muted">
                  롤백 대상 {previousTheme.label}
                </span>
              ) : (
                <span className="shell-badge shell-badge--muted">
                  롤백 대상 없음
                </span>
              )}
            </div>

            <dl className="detail-grid">
              <DetailItem
                label="활성 테마"
                value={activeTheme?.label ?? themeState.activeThemeId}
              />
              <DetailItem
                label="드래프트"
                value={draftTheme?.label ?? themeState.draftThemeId}
              />
              <DetailItem
                label="이전 활성 테마"
                value={previousTheme?.label ?? '없음'}
              />
              <DetailItem
                label="마지막 게시 시각"
                value={formatDateTimeLabel(themeState.publishedAt)}
              />
              <DetailItem
                label="마지막 수정 시각"
                value={formatDateTimeLabel(themeState.updatedAt)}
              />
            </dl>
          </>
        ) : null}
      </PageSection>

      <PageSection
        label="Draft Theme"
        title="드래프트를 바꾸고 public 화면에서 미리보기"
        description="드래프트를 저장한 뒤, 필요하면 공개 홈으로 이동해 즉시 미리보기하고 게시할 수 있습니다."
      >
        {themeState ? (
          <>
            <div className="theme-choice-list" role="list" aria-label="공개 사이트 테마 선택">
              {PUBLIC_THEME_OPTIONS.map((option) => (
                <button
                  key={option.themeId}
                  aria-pressed={themeState.draftThemeId === option.themeId}
                  className={`ghost-button theme-choice-button${
                    themeState.draftThemeId === option.themeId ? ' theme-choice-button--active' : ''
                  }`}
                  disabled={draftSavingThemeId === option.themeId || publishing || rollingBack}
                  type="button"
                  onClick={() => void handleSaveDraft(option.themeId)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>

            <div className="theme-choice-meta">
              <p className="section-note">
                현재 active theme cache: {getPublicTheme(publicThemeState.activeThemeId).label}
              </p>
              <p className="section-note">
                {themeState.hasUnpublishedDraft
                  ? '드래프트가 현재 공개 테마와 다릅니다. 미리보기 후 게시할 수 있습니다.'
                  : '드래프트와 현재 공개 테마가 동일합니다.'}
              </p>
            </div>

            <div className="button-row">
              <button
                className="ghost-button"
                disabled={publishing || rollingBack}
                type="button"
                onClick={() => onNavigate(previewPath)}
              >
                {themeState.hasUnpublishedDraft ? '공개 홈에서 드래프트 미리보기' : '현재 공개 홈 열기'}
              </button>
              <button
                className="primary-button"
                disabled={!themeState.hasUnpublishedDraft || publishing || rollingBack}
                type="button"
                onClick={() => void handlePublish()}
              >
                {publishing ? '게시 중...' : '드래프트 게시'}
              </button>
              <button
                className="ghost-button ghost-button--danger"
                disabled={!themeState.previousThemeId || publishing || rollingBack}
                type="button"
                onClick={() => void handleRollback()}
              >
                {rollingBack ? '롤백 중...' : '직전 테마로 롤백'}
              </button>
            </div>
          </>
        ) : null}
      </PageSection>
    </div>
  )
}

function formatDateTimeLabel(value) {
  if (!value) {
    return '기록 없음'
  }

  return value.replace('T', ' ').slice(0, 16)
}

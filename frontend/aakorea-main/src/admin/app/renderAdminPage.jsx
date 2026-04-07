import { EmptyState, PageSection } from '../ui'
import { AdminAccountPage } from '../../pages/admin/AdminAccountPage'
import { AdminLoginPage } from '../../pages/admin/AdminLoginPage'
import { AdminOverviewPage } from '../../pages/admin/AdminOverviewPage'
import { AdminPublicThemePage } from '../../pages/admin/AdminPublicThemePage'
import { ContentPageAdminPage } from '../../pages/admin/ContentPageAdminPage'
import { DistrictAdminPage } from '../../pages/admin/DistrictAdminPage'
import { GroupListPage } from '../../pages/admin/GroupListPage'
import { NoticeAdminPage } from '../../pages/admin/NoticeAdminPage'
import { DEFAULT_ADMIN_PATH } from '../../app/router'

export function renderAdminPage({
  authPending,
  onError,
  onLogin,
  onNavigate,
  onSuccess,
  publicThemeState,
  route,
  session,
  sessionChecked,
  theme,
}) {
  switch (route.name) {
    case 'admin-login':
      return (
        <AdminLoginPage
          authPending={authPending}
          onLogin={onLogin}
          redirectPath={route.redirectPath}
          session={session}
          sessionChecked={sessionChecked}
        />
      )
    case 'admin-root':
      return (
        <PageSection
          label="Admin Console"
          title="운영 기본 화면으로 이동하는 중입니다."
          description="운영 콘솔 기본 경로로 정리해 이동합니다."
        >
          <EmptyState
            title="기본 관리자 화면을 여는 중입니다."
            description="잠시 후 그룹 관리 화면으로 이어집니다."
          />
        </PageSection>
      )
    case 'admin-overview':
      return (
        <AdminOverviewPage
          onError={onError}
          onSuccess={onSuccess}
        />
      )
    case 'admin-account':
      return (
        <AdminAccountPage
          resolvedTheme={theme.resolvedTheme}
          systemTheme={theme.systemTheme}
          themePreference={theme.themePreference}
          onThemePreferenceChange={theme.setThemePreference}
        />
      )
    case 'admin-public-theme':
      return (
        <AdminPublicThemePage
          onError={onError}
          onNavigate={onNavigate}
          onSuccess={onSuccess}
          publicThemeState={publicThemeState}
        />
      )
    case 'admin-districts':
      return (
        <DistrictAdminPage
          onError={onError}
          onSuccess={onSuccess}
        />
      )
    case 'admin-groups':
      return (
        <GroupListPage
          editorGroupId={route.groupId}
          onError={onError}
          onNavigate={onNavigate}
          onSuccess={onSuccess}
        />
      )
    case 'admin-content-pages':
      return (
        <ContentPageAdminPage
          onError={onError}
          onNavigate={onNavigate}
          onSuccess={onSuccess}
        />
      )
    case 'admin-notices':
      return (
        <NoticeAdminPage
          onError={onError}
          onNavigate={onNavigate}
          onSuccess={onSuccess}
        />
      )
    default:
      return (
        <PageSection
          label="Not Found"
          title="요청한 화면을 찾지 못했습니다."
          description="운영 콘솔 안에서 사용할 수 없는 경로입니다."
        >
          <EmptyState
            title="존재하지 않는 경로입니다."
            description="운영 기본 화면으로 돌아가 계속 작업해 주세요."
          />
          <div className="button-row">
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate(DEFAULT_ADMIN_PATH)}
            >
              운영 기본 화면으로 이동
            </button>
          </div>
        </PageSection>
      )
  }
}

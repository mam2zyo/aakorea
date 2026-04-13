import { canAccessAdminRoute, resolveAdminHomePath } from './adminAuthorization'
import { EmptyState, PageSection } from '../ui'
import { AdminAccountPage } from '../pages/AdminAccountPage'
import { AdminLoginPage } from '../pages/AdminLoginPage'
import { AdminPendingApprovalPage } from '../pages/AdminPendingApprovalPage'
import { AdminRegisterPage } from '../pages/AdminRegisterPage'
import { AdminOverviewPage } from '../pages/AdminOverviewPage'
import { AdminPublicThemePage } from '../pages/AdminPublicThemePage'
import { AdminUsersPage } from '../pages/AdminUsersPage'
import { ContentPageAdminPage } from '../pages/ContentPageAdminPage'
import { DistrictAdminPage } from '../pages/DistrictAdminPage'
import { GroupListPage } from '../pages/GroupListPage'
import { NoticeAdminPage } from '../pages/NoticeAdminPage'

export function renderAdminPage({
  authPending,
  onError,
  onLogin,
  onNavigate,
  onLogout,
  onRegister,
  onSuccess,
  publicThemeState,
  route,
  session,
  sessionChecked,
  theme,
}) {
  const fallbackAdminPath = resolveAdminHomePath(session)

  if (
    session.authenticated
    && route.name !== 'admin-login'
    && route.name !== 'admin-root'
    && !canAccessAdminRoute(session, route.name)
  ) {
    return (
      <PageSection
        label="Access Restricted"
        title="이 메뉴에 접근할 권한이 없습니다."
        description="계정에 부여된 역할과 permission 범위 안에서만 운영 기능을 사용할 수 있습니다."
      >
        <EmptyState
          title="권한이 없는 화면입니다."
          description="다른 운영 메뉴로 이동하거나 System Admin 또는 Manager에게 권한 부여를 요청해 주세요."
        />
        <div className="button-row">
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate(fallbackAdminPath)}
          >
            사용 가능한 운영 화면으로 이동
          </button>
        </div>
      </PageSection>
    )
  }

  switch (route.name) {
    case 'admin-login':
      return (
        <AdminLoginPage
          authPending={authPending}
          onLogin={onLogin}
          onNavigate={onNavigate}
          redirectPath={route.redirectPath}
          session={session}
          sessionChecked={sessionChecked}
        />
      )
    case 'admin-register':
      return (
        <AdminRegisterPage
          authPending={authPending}
          onNavigate={onNavigate}
          onError={onError}
          onRegister={onRegister}
          session={session}
          sessionChecked={sessionChecked}
        />
      )
    case 'admin-pending':
      return (
        <AdminPendingApprovalPage
          onLogout={onLogout}
          session={session}
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
    case 'admin-admin-users':
      return (
        <AdminUsersPage
          onError={onError}
          onSuccess={onSuccess}
          session={session}
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
          session={session}
        />
      )
    case 'admin-notices':
      return (
        <NoticeAdminPage
          onError={onError}
          onNavigate={onNavigate}
          onSuccess={onSuccess}
          session={session}
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
              onClick={() => onNavigate(fallbackAdminPath)}
            >
              운영 기본 화면으로 이동
            </button>
          </div>
        </PageSection>
      )
  }
}

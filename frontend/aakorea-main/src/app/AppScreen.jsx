import { useEffect, useEffectEvent } from 'react'
import { EmptyState, PageSection } from '../components/ui'
import { AdminLayout } from '../layouts/AdminLayout'
import { PublicLayout } from '../layouts/PublicLayout'
import { AdminAccountPage } from '../pages/admin/AdminAccountPage'
import { AdminLoginPage } from '../pages/admin/AdminLoginPage'
import { AdminOverviewPage } from '../pages/admin/AdminOverviewPage'
import { ContentPageAdminPage } from '../pages/admin/ContentPageAdminPage'
import { DistrictAdminPage } from '../pages/admin/DistrictAdminPage'
import { GroupEditorPage } from '../pages/admin/GroupEditorPage'
import { GroupListPage } from '../pages/admin/GroupListPage'
import { NoticeAdminPage } from '../pages/admin/NoticeAdminPage'
import { ContentPageViewPage } from '../pages/public/ContentPageViewPage'
import { HomePage } from '../pages/public/HomePage'
import { MeetingSearchPage } from '../pages/public/MeetingSearchPage'
import { NoticePage } from '../pages/public/NoticePage'
import {
  buildAdminLoginPath,
  DEFAULT_ADMIN_PATH,
  requiresAdminSession,
} from './router'
import { navigate } from './router'

export function AppScreen({
  authPending,
  flash,
  onError,
  onLogin,
  onLogout,
  onNavigate,
  onSuccess,
  route,
  session,
  sessionChecked,
}) {
  const syncRouteAccess = useEffectEvent(() => {
    if (!sessionChecked) {
      return
    }

    if (route.name === 'admin-root') {
      navigate(DEFAULT_ADMIN_PATH, { replace: true })
      return
    }

    if (requiresAdminSession(route) && !session.authenticated) {
      navigate(buildAdminLoginPath(route.currentPath), { replace: true })
      return
    }

    if (route.name === 'admin-login' && session.authenticated) {
      navigate(DEFAULT_ADMIN_PATH, { replace: true })
    }
  })

  useEffect(() => {
    syncRouteAccess()
  }, [route.currentPath, route.name, session.authenticated, sessionChecked])

  const page = renderPage({
    authPending,
    onError,
    onLogin,
    onNavigate,
    onSuccess,
    route,
    session,
    sessionChecked,
  })

  const isProtectedAdminRoute = requiresAdminSession(route)
  const isLoginScreen = route.name === 'admin-login'
  const inlineFlash = isLoginScreen ? flash : null
  const floatingFlash = !isLoginScreen && flash
    ? renderFlash(flash, { floating: true })
    : null

  if (isLoginScreen) {
    return (
      <div className="admin-auth-shell">
        <main className="admin-auth-main">
          {inlineFlash ? renderFlash(inlineFlash) : null}
          {page}
        </main>
      </div>
    )
  }

  if (route.section === 'admin') {
    const content = isProtectedAdminRoute && (!sessionChecked || !session.authenticated)
      ? (
        <PageSection
          label="Admin Access"
          title={sessionChecked ? '로그인 화면으로 이동하는 중입니다.' : '운영 세션을 확인하는 중입니다.'}
          description="세션 기반 인증 상태를 확인한 뒤 운영 화면을 표시합니다."
        >
          <EmptyState
            title={sessionChecked ? '운영 로그인이 필요합니다.' : '세션 상태를 확인하고 있습니다.'}
            description={
              sessionChecked
                ? '잠시 후 로그인 화면으로 이동합니다.'
                : '인증 확인이 끝나면 자동으로 다음 화면으로 이어집니다.'
            }
          />
        </PageSection>
      )
      : page

    return (
      <>
        {floatingFlash}
        <AdminLayout
          currentPath={route.currentPath}
          flash={inlineFlash}
          onLogout={onLogout}
          onNavigate={onNavigate}
          session={session}
        >
          {content}
        </AdminLayout>
      </>
    )
  }

  return (
    <>
      {floatingFlash}
      <PublicLayout
        currentPath={route.currentPath}
        flash={inlineFlash}
        onNavigate={onNavigate}
      >
        {page}
      </PublicLayout>
    </>
  )
}

function renderFlash(flash, { floating = false } = {}) {
  return (
    <div
      aria-live={flash.tone === 'error' ? 'assertive' : 'polite'}
      className={`status-banner status-banner--${flash.tone}${
        floating ? ' status-banner--floating' : ''
      }`}
      role={flash.tone === 'error' ? 'alert' : 'status'}
    >
      {flash.message}
    </div>
  )
}

function renderPage({
  authPending,
  onError,
  onLogin,
  onNavigate,
  onSuccess,
  route,
  session,
  sessionChecked,
}) {
  switch (route.name) {
    case 'home':
      return <HomePage onNavigate={onNavigate} />
    case 'meetings':
      return (
        <MeetingSearchPage
          dayOfWeek={route.dayOfWeek}
          groupId={route.groupId}
          meetingId={route.meetingId}
          onError={onError}
          onNavigate={onNavigate}
          province={route.province}
        />
      )
    case 'notices':
      return (
        <NoticePage
          noticeId={route.noticeId}
          onError={onError}
          onNavigate={onNavigate}
        />
      )
    case 'content-page':
      return (
        <ContentPageViewPage
          onError={onError}
          onNavigate={onNavigate}
          pageKey={route.pageKey}
        />
      )
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
            description="잠시 후 Group 관리 화면으로 이어집니다."
          />
        </PageSection>
      )
    case 'admin-overview':
      return <AdminOverviewPage />
    case 'admin-account':
      return <AdminAccountPage />
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
          onError={onError}
          onNavigate={onNavigate}
          onSuccess={onSuccess}
        />
      )
    case 'admin-group-editor':
      return (
        <GroupEditorPage
          groupId={route.groupId}
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
    default: {
      const isAdminRoute = route.section === 'admin'
      const fallbackPath = isAdminRoute ? DEFAULT_ADMIN_PATH : '/'

      return (
        <PageSection
          label="Not Found"
          title="요청한 화면을 찾지 못했습니다."
          description={
            isAdminRoute
              ? '운영 콘솔 안에서 사용할 수 없는 경로입니다.'
              : '입력한 주소를 다시 확인해 주세요.'
          }
        >
          <EmptyState
            title="존재하지 않는 경로입니다."
            description={
              isAdminRoute
                ? '운영 기본 화면으로 돌아가 계속 작업해 주세요.'
                : '홈 또는 운영 기본 화면으로 다시 이동해 주세요.'
            }
          />
          <div className="button-row">
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate(fallbackPath)}
            >
              {isAdminRoute ? '운영 기본 화면으로 이동' : '공개 홈으로 이동'}
            </button>
          </div>
        </PageSection>
      )
    }
  }
}

import { useEffect, useEffectEvent, useState } from 'react'
import './App.css'
import {
  buildAdminLoginPath,
  DEFAULT_ADMIN_PATH,
  navigate,
  requiresAdminSession,
  sanitizeAdminRedirect,
  useAppRoute,
} from './app/router'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { DistrictAdminPage } from './pages/admin/DistrictAdminPage'
import { GroupEditorPage } from './pages/admin/GroupEditorPage'
import { GroupListPage } from './pages/admin/GroupListPage'
import { ContentPageAdminPage } from './pages/admin/ContentPageAdminPage'
import { NoticeAdminPage } from './pages/admin/NoticeAdminPage'
import { ContentPageViewPage } from './pages/public/ContentPageViewPage'
import { HomePage } from './pages/public/HomePage'
import { MeetingSearchPage } from './pages/public/MeetingSearchPage'
import { NoticePage } from './pages/public/NoticePage'
import { ApiError, authApi } from './lib/api'
import { EmptyState, PageSection } from './components/ui'

const EMPTY_SESSION = { authenticated: false, username: '' }

function App() {
  const route = useAppRoute()

  const [flash, setFlash] = useState(null)
  const [session, setSession] = useState(EMPTY_SESSION)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [authPending, setAuthPending] = useState(false)

  async function loadSession(quiet = false) {
    try {
      const data = await authApi.me()
      setSession({
        authenticated: data.authenticated,
        username: data.username,
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setSession(EMPTY_SESSION)
      } else {
        setSession(EMPTY_SESSION)
        if (!quiet) {
          showError(error, '운영 세션을 확인하지 못했습니다.')
        }
      }
    } finally {
      setSessionChecked(true)
    }
  }

  async function handleLogin(credentials, redirectPath = DEFAULT_ADMIN_PATH) {
    setAuthPending(true)

    try {
      const data = await authApi.login(credentials)
      setSession({
        authenticated: data.authenticated,
        username: data.username,
      })
      setSessionChecked(true)
      showSuccess(`${data.username} 계정으로 로그인했습니다.`)
      navigate(sanitizeAdminRedirect(redirectPath), { replace: true })
    } catch (error) {
      showError(error, '로그인에 실패했습니다.')
    } finally {
      setAuthPending(false)
    }
  }

  async function handleLogout(targetPath = '/admin/login') {
    setAuthPending(true)

    try {
      await authApi.logout()
      setSession(EMPTY_SESSION)
      setSessionChecked(true)
      showSuccess('운영 세션을 종료했습니다.')
      navigate(targetPath, { replace: true })
    } catch (error) {
      showError(error, '로그아웃에 실패했습니다.')
    } finally {
      setAuthPending(false)
    }
  }

  function showSuccess(message) {
    setFlash({ tone: 'success', message })
  }

  function showError(error, fallbackMessage) {
    setFlash({
      tone: 'error',
      message: resolveErrorMessage(error, fallbackMessage),
    })
  }

  const loadSessionEffect = useEffectEvent((quiet) => {
    void loadSession(quiet)
  })

  useEffect(() => {
    loadSessionEffect(true)
  }, [])

  useEffect(() => {
    if (!flash) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => setFlash(null), 4200)
    return () => window.clearTimeout(timeoutId)
  }, [flash])

  useEffect(() => {
    if (!sessionChecked) {
      return
    }

    if (route.kind === 'admin-root') {
      const targetPath = session.authenticated
        ? DEFAULT_ADMIN_PATH
        : buildAdminLoginPath(DEFAULT_ADMIN_PATH)
      navigate(targetPath, { replace: true })
      return
    }

    if (requiresAdminSession(route.kind) && !session.authenticated) {
      navigate(buildAdminLoginPath(route.pathname), { replace: true })
      return
    }

    if (route.kind === 'admin-login' && session.authenticated) {
      navigate(sanitizeAdminRedirect(route.redirectPath), { replace: true })
    }
  }, [route, session.authenticated, sessionChecked])

  if (route.kind === 'home') {
    return (
      <PublicLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
      >
        <HomePage session={session} onNavigate={navigate} />
      </PublicLayout>
    )
  }

  if (route.kind === 'meetings') {
    return (
      <PublicLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
      >
        <MeetingSearchPage onError={showError} onNavigate={navigate} />
      </PublicLayout>
    )
  }

  if (route.kind === 'content-page') {
    return (
      <PublicLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
      >
        <ContentPageViewPage
          onError={showError}
          onNavigate={navigate}
          pageKey={route.pageKey}
        />
      </PublicLayout>
    )
  }

  if (route.kind === 'notices' || route.kind === 'notice-detail') {
    return (
      <PublicLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
      >
        <NoticePage
          noticeId={route.kind === 'notice-detail' ? route.noticeId : null}
          onError={showError}
          onNavigate={navigate}
        />
      </PublicLayout>
    )
  }

  if (route.kind === 'admin-login') {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <AdminLoginPage
          authPending={authPending}
          onLogin={handleLogin}
          redirectPath={route.redirectPath}
          session={session}
          sessionChecked={sessionChecked}
        />
      </AdminLayout>
    )
  }

  if (requiresAdminSession(route.kind) && (!sessionChecked || !session.authenticated)) {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <PageSection
          label="Admin"
          title={sessionChecked ? '로그인 화면으로 이동 중입니다.' : '운영 세션을 확인하고 있습니다.'}
          description="인증이 필요한 운영 화면입니다."
        >
          <EmptyState
            title="운영 인증이 필요합니다."
            description="세션 상태를 확인한 뒤 로그인 경로로 안내합니다."
          />
        </PageSection>
      </AdminLayout>
    )
  }

  if (route.kind === 'admin-districts') {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <DistrictAdminPage onError={showError} onSuccess={showSuccess} />
      </AdminLayout>
    )
  }

  if (route.kind === 'admin-groups') {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <GroupListPage
          onError={showError}
          onNavigate={navigate}
          onSuccess={showSuccess}
        />
      </AdminLayout>
    )
  }

  if (route.kind === 'admin-group-editor') {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <GroupEditorPage
          groupId={route.groupId}
          onError={showError}
          onNavigate={navigate}
          onSuccess={showSuccess}
        />
      </AdminLayout>
    )
  }

  if (route.kind === 'admin-content-pages') {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <ContentPageAdminPage
          onError={showError}
          onNavigate={navigate}
          onSuccess={showSuccess}
        />
      </AdminLayout>
    )
  }

  if (route.kind === 'admin-notices') {
    return (
      <AdminLayout
        currentPath={route.pathname}
        flash={flash}
        session={session}
        onNavigate={navigate}
        onLogout={handleLogout}
      >
        <NoticeAdminPage
          onError={showError}
          onNavigate={navigate}
          onSuccess={showSuccess}
        />
      </AdminLayout>
    )
  }

  return (
    <PublicLayout
      currentPath={route.pathname}
      flash={flash}
      session={session}
      onNavigate={navigate}
    >
      <PageSection
        label="Not Found"
        title="요청한 화면을 찾지 못했습니다."
        description="현재 프론트엔드는 공개 홈, 안내 페이지, 공지, 모임 찾기와 운영 관리 화면을 연결하고 있습니다."
      >
        <EmptyState
          title="경로가 아직 준비되지 않았습니다."
          description="홈 화면 또는 모임 찾기 화면으로 이동해 주세요."
        />
      </PageSection>
    </PublicLayout>
  )
}

export default App

function resolveErrorMessage(error, fallbackMessage) {
  if (error instanceof ApiError) {
    const fieldMessages = error.fields ? Object.values(error.fields) : []
    return fieldMessages[0] ?? error.message ?? fallbackMessage
  }

  if (error instanceof Error && error.message) {
    return `${fallbackMessage} 백엔드 연결 상태를 확인해 주세요.`
  }

  return fallbackMessage
}

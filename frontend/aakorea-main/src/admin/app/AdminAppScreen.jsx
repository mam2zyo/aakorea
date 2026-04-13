import { useLayoutEffect } from 'react'
import {
  applyDocumentTheme,
  resolveAdminDocumentState,
} from '@/shared/utils/themeDocument'
import { AdminLayout } from '../layouts/AdminLayout'
import { EmptyState, PageSection } from '../ui'

export function AdminAppScreen({
  currentPath,
  flash,
  isStandaloneAdminScreen,
  onLogout,
  onNavigate,
  page,
  requiresSession,
  session,
  sessionChecked,
  theme,
}) {
  useLayoutEffect(() => {
    applyDocumentTheme(document.documentElement, resolveAdminDocumentState({
      systemTheme: theme.systemTheme,
      themePreference: theme.themePreference,
    }))
  }, [theme.resolvedTheme, theme.systemTheme, theme.themePreference])

  if (isStandaloneAdminScreen) {
    return (
      <div
        className="admin-auth-shell admin-theme"
        data-surface="admin"
        data-theme={theme.resolvedTheme}
        data-theme-preference={theme.themePreference}
      >
        <main className="admin-auth-main">
          {flash ? <FlashBanner flash={flash} /> : null}
          {page}
        </main>
      </div>
    )
  }

  const content = requiresSession && (!sessionChecked || !session.authenticated)
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
    <div
      className="admin-theme"
      data-surface="admin"
      data-theme={theme.resolvedTheme}
      data-theme-preference={theme.themePreference}
    >
      {flash ? <FlashBanner flash={flash} floating /> : null}
      <AdminLayout
        currentPath={currentPath}
        onLogout={onLogout}
        onNavigate={onNavigate}
        session={session}
        theme={theme}
      >
        {content}
      </AdminLayout>
    </div>
  )
}

function FlashBanner({ flash, floating = false }) {
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

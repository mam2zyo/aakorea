import { useEffect, useEffectEvent } from 'react'
import '../styles/index.css'
import { useAdminSession } from './providers/useAdminSession'
import { useFlashState } from '@/shared/hooks/useFlashState'
import { navigate, useAppRoute } from './router'
import { AdminAppScreen } from './AdminAppScreen'
import { resolveAdminHomePath } from './adminAuthorization'
import { renderAdminPage } from './renderAdminPage'
import { useAdminTheme } from './useAdminTheme'
import { usePublicSiteTheme } from '@/public/app/usePublicSiteTheme'
import {
  buildAdminLoginPath,
  requiresAdminSession,
} from './router'

import { AdminThemeProvider } from './providers/AdminThemeContext'

export function AdminApp() {
  const route = useAppRoute()
  const { flash, showError, showSuccess } = useFlashState()
  const { authPending, handleLogin, handleRegister, handleLogout, session, sessionChecked } =
    useAdminSession(route, {
      onError: showError,
      onSuccess: showSuccess,
    })
  const publicThemeState = usePublicSiteTheme()

  const syncRouteAccess = useEffectEvent(() => {
    const adminHomePath = resolveAdminHomePath(session)

    if (!sessionChecked) {
      return
    }

    if (requiresAdminSession(route) && !session.authenticated) {
      navigate(buildAdminLoginPath(route.currentPath), { replace: true })
      return
    }

    if (session.authenticated && session.status === 'PENDING_APPROVAL') {
      if (route.name !== 'admin-pending' && route.name !== 'admin-root') {
        navigate('/admin/pending', { replace: true })
        return
      }
    }

    if (session.authenticated && session.status !== 'PENDING_APPROVAL' && route.name === 'admin-pending') {
      navigate(adminHomePath, { replace: true })
      return
    }

    if (route.name === 'admin-root' && session.authenticated) {
      navigate(adminHomePath, { replace: true })
      return
    }

    if ((route.name === 'admin-login' || route.name === 'admin-register') && session.authenticated) {
      navigate(adminHomePath, { replace: true })
    }
  })

  useEffect(() => {
    syncRouteAccess()
  }, [route.currentPath, route.name, session.authenticated, session.status, sessionChecked])

  const adminTheme = useAdminTheme()
  const isProtectedAdminRoute = requiresAdminSession(route)
  const isStandaloneAdminScreen = route.name === 'admin-login'
    || route.name === 'admin-register'
    || route.name === 'admin-pending'

  return (
    <AdminThemeProvider value={adminTheme}>
      <AdminAppScreen
        currentPath={route.currentPath}
        flash={flash}
        isStandaloneAdminScreen={isStandaloneAdminScreen}
        onLogout={handleLogout}
        onNavigate={navigate}
        page={renderAdminPage({
          authPending,
          onError: showError,
          onLogin: handleLogin,
          onRegister: handleRegister,
          onNavigate: navigate,
          onLogout: handleLogout,
          onSuccess: showSuccess,
          publicThemeState,
          route,
          session,
          sessionChecked,
          theme: adminTheme,
        })}
        requiresSession={isProtectedAdminRoute}
        session={session}
        sessionChecked={sessionChecked}
        theme={adminTheme}
      />
    </AdminThemeProvider>
  )
}

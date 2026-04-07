import { useEffect, useEffectEvent } from 'react'
import { AdminAppScreen } from '../admin/app/AdminAppScreen'
import { renderAdminPage } from '../admin/app/renderAdminPage'
import { useAdminTheme } from '../admin/app/useAdminTheme'
import {
  applyPublicThemePreview,
  resolvePublicTheme,
} from '../public/app/publicTheme'
import { PublicAppScreen } from '../public/app/PublicAppScreen'
import { renderPublicPage } from '../public/app/renderPublicPage'
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
  publicThemeState,
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

  const adminTheme = useAdminTheme()
  const publicTheme = resolvePublicTheme(route.search, {
    activeThemeId: publicThemeState.activeThemeId,
  })
  const publicOnNavigate = (to) => onNavigate(applyPublicThemePreview(to, publicTheme))
  const isProtectedAdminRoute = requiresAdminSession(route)
  const isLoginScreen = route.name === 'admin-login'

  if (route.section === 'admin') {
    return (
      <AdminAppScreen
        currentPath={route.currentPath}
        flash={flash}
        isLoginScreen={isLoginScreen}
        onLogout={onLogout}
        onNavigate={onNavigate}
        page={renderAdminPage({
          authPending,
          onError,
          onLogin,
          onNavigate,
          onSuccess,
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
    )
  }

  return (
    <PublicAppScreen
      currentPath={route.currentPath}
      flash={flash}
      onNavigate={publicOnNavigate}
      page={renderPublicPage({
        onError,
        onNavigate: publicOnNavigate,
        route,
      })}
      theme={publicTheme}
    />
  )
}

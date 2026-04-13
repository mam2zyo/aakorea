import { useEffect, useEffectEvent } from 'react'
import { AdminAppScreen } from '../admin/app/AdminAppScreen'
import { resolveAdminHomePath } from '../admin/app/adminAuthorization'
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
  requiresAdminSession,
} from './router'
import { navigate } from './router'

export function AppScreen({
  authPending,
  flash,
  onError,
  onLogin,
  onRegister,
  onLogout,
  onNavigate,
  onSuccess,
  publicThemeState,
  route,
  session,
  sessionChecked,
}) {
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
  const publicTheme = resolvePublicTheme(route.search, {
    activeThemeId: publicThemeState.activeThemeId,
  })
  const publicOnNavigate = (to) => onNavigate(applyPublicThemePreview(to, publicTheme))
  const isProtectedAdminRoute = requiresAdminSession(route)
  const isStandaloneAdminScreen = route.name === 'admin-login'
    || route.name === 'admin-register'
    || route.name === 'admin-pending'

  if (route.section === 'admin') {
    return (
      <AdminAppScreen
        currentPath={route.currentPath}
        flash={flash}
        isStandaloneAdminScreen={isStandaloneAdminScreen}
        onLogout={onLogout}
        onNavigate={onNavigate}
        page={renderAdminPage({
          authPending,
          onError,
          onLogin,
          onRegister,
          onNavigate,
          onLogout,
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

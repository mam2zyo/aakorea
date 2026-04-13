import './public/styles/index.css'
import './admin/styles/index.css'
import { AppScreen } from './app/AppScreen'
import { navigate, useAppRoute } from './app/router'
import { useAdminSession } from './app/providers/useAdminSession'
import { useFlashState } from './app/providers/useFlashState'
import { usePublicSiteTheme } from './public/app/usePublicSiteTheme'

function App() {
  const route = useAppRoute()
  const { flash, showError, showSuccess } = useFlashState()
  const { authPending, handleLogin, handleRegister, handleLogout, session, sessionChecked } =
    useAdminSession(route, {
      onError: showError,
      onSuccess: showSuccess,
    })
  const publicThemeState = usePublicSiteTheme()

  return (
    <AppScreen
      authPending={authPending}
      flash={flash}
      onError={showError}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onLogout={handleLogout}
      onNavigate={navigate}
      onSuccess={showSuccess}
      publicThemeState={publicThemeState}
      route={route}
      session={session}
      sessionChecked={sessionChecked}
    />
  )
}

export default App

import './App.css'
import { AppScreen } from './app/AppScreen'
import { navigate, useAppRoute } from './app/router'
import { useAdminSession } from './app/providers/useAdminSession'
import { useFlashState } from './app/providers/useFlashState'

function App() {
  const route = useAppRoute()
  const { flash, showError, showSuccess } = useFlashState()
  const { authPending, handleLogin, handleLogout, session, sessionChecked } =
    useAdminSession(route, {
      onError: showError,
    })

  return (
    <AppScreen
      authPending={authPending}
      flash={flash}
      onError={showError}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onNavigate={navigate}
      onSuccess={showSuccess}
      route={route}
      session={session}
      sessionChecked={sessionChecked}
    />
  )
}

export default App

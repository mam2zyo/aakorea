import '../styles/index.css'
import { useFlashState } from '@/shared/hooks/useFlashState'
import { navigate, useAppRoute } from './router'
import { PublicAppScreen } from './PublicAppScreen'
import {
  applyPublicThemePreview,
  resolvePublicTheme,
} from './publicTheme'
import { renderPublicPage } from './renderPublicPage'
import { usePublicSiteTheme } from './usePublicSiteTheme'

export function PublicApp() {
  const route = useAppRoute()
  const { flash, showError, showSuccess } = useFlashState()
  const publicThemeState = usePublicSiteTheme()

  const publicTheme = resolvePublicTheme(route.search, {
    activeThemeId: publicThemeState.activeThemeId,
  })

  const publicOnNavigate = (to) => navigate(applyPublicThemePreview(to, publicTheme))

  return (
    <PublicAppScreen
      currentPath={route.currentPath}
      flash={flash}
      onNavigate={publicOnNavigate}
      page={renderPublicPage({
        onError: showError,
        onNavigate: publicOnNavigate,
        route,
      })}
      theme={publicTheme}
    />
  )
}

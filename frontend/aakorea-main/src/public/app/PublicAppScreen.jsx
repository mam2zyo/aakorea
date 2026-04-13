import { useLayoutEffect } from 'react'
import {
  applyDocumentTheme,
  resolvePublicDocumentState,
} from '@/shared/utils/themeDocument'
import { PublicLayout } from '../layouts/PublicLayout'

export function PublicAppScreen({ currentPath, flash, onNavigate, page, theme }) {
  useLayoutEffect(() => {
    applyDocumentTheme(document.documentElement, resolvePublicDocumentState({
      activeThemeId: theme.activeThemeId,
      search: theme.isPreview ? `?themePreview=${theme.themeId}` : '',
    }))
  }, [theme.activeThemeId, theme.isPreview, theme.themeId])

  return (
    <div
      className="public-theme"
      data-surface="public"
      data-theme={theme.themeId}
      data-theme-preview={theme.isPreview ? 'true' : undefined}
    >
      {flash ? <FlashBanner flash={flash} floating /> : null}
      <PublicLayout
        currentPath={currentPath}
        onNavigate={onNavigate}
        theme={theme}
      >
        {page}
      </PublicLayout>
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

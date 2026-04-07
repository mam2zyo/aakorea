import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usePublicSiteTheme } from '../../src/public/app/usePublicSiteTheme.js'
import { PUBLIC_ACTIVE_THEME_STORAGE_KEY } from '../../src/app/themeDocument.js'

function ThemeHarness() {
  const themeState = usePublicSiteTheme()

  return (
    <div>
      <span data-testid="active-theme">{themeState.activeThemeId}</span>
      <span data-testid="theme-loaded">{String(themeState.activeThemeLoaded)}</span>
    </div>
  )
}

describe('usePublicSiteTheme', () => {
  it('reads the bootstrapped active theme before the API responds', async () => {
    document.documentElement.dataset.publicActiveTheme = 'harbor'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({
        data: {
          activeThemeId: 'harbor',
        },
      }),
    }))

    render(<ThemeHarness />)

    expect(screen.getByTestId('active-theme').textContent).toBe('harbor')
    await waitFor(() => expect(screen.getByTestId('theme-loaded').textContent).toBe('true'))
    expect(window.localStorage.getItem(PUBLIC_ACTIVE_THEME_STORAGE_KEY)).toBe('harbor')
  })

  it('falls back to the default theme when the API request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      text: async () => JSON.stringify({
        error: {
          code: 'NOT_FOUND',
          message: 'not found',
        },
      }),
    }))

    render(<ThemeHarness />)

    await waitFor(() => expect(screen.getByTestId('theme-loaded').textContent).toBe('true'))
    expect(screen.getByTestId('active-theme').textContent).toBe('classic')
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useAdminTheme } from '../../src/admin/app/useAdminTheme.js'
import { ADMIN_THEME_STORAGE_KEY } from '../../src/app/themeDocument.js'

function ThemeHarness() {
  const theme = useAdminTheme()

  return (
    <div>
      <span data-testid="resolved-theme">{theme.resolvedTheme}</span>
      <span data-testid="system-theme">{theme.systemTheme}</span>
      <span data-testid="theme-preference">{theme.themePreference}</span>
      <button type="button" onClick={() => theme.setThemePreference('dark')}>
        다크로 전환
      </button>
    </div>
  )
}

function mockMatchMedia(matches) {
  vi.stubGlobal('matchMedia', vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    matches,
    media: '(prefers-color-scheme: dark)',
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })))
}

describe('useAdminTheme', () => {
  it('reads the stored theme preference and resolves the effective theme', () => {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, 'dark')
    mockMatchMedia(false)

    render(<ThemeHarness />)

    expect(screen.getByTestId('theme-preference').textContent).toBe('dark')
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
    expect(screen.getByTestId('system-theme').textContent).toBe('light')
  })

  it('persists the next preference to localStorage', () => {
    window.localStorage.setItem(ADMIN_THEME_STORAGE_KEY, 'system')
    mockMatchMedia(false)

    render(<ThemeHarness />)
    fireEvent.click(screen.getByRole('button', { name: '다크로 전환' }))

    expect(screen.getByTestId('theme-preference').textContent).toBe('dark')
    expect(window.localStorage.getItem(ADMIN_THEME_STORAGE_KEY)).toBe('dark')
  })
})

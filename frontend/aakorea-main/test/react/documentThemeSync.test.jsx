import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AdminAppScreen } from '../../src/admin/app/AdminAppScreen.jsx'
import { PublicAppScreen } from '../../src/public/app/PublicAppScreen.jsx'

describe('document theme sync', () => {
  it('writes admin theme metadata to the document root', () => {
    render(
      <AdminAppScreen
        currentPath="/admin/login"
        flash={null}
        isLoginScreen
        onLogout={vi.fn()}
        onNavigate={vi.fn()}
        page={<div>admin</div>}
        requiresSession={false}
        session={{ authenticated: false, username: '' }}
        sessionChecked
        theme={{
          resolvedTheme: 'dark',
          setThemePreference: vi.fn(),
          systemTheme: 'light',
          themePreference: 'dark',
        }}
      />,
    )

    expect(document.documentElement.dataset.routeSurface).toBe('admin')
    expect(document.documentElement.dataset.adminTheme).toBe('dark')
    expect(document.documentElement.dataset.adminThemePreference).toBe('dark')
    expect(document.documentElement.dataset.publicTheme).toBeUndefined()
    expect(document.documentElement.style.getPropertyValue('--boot-body-background')).toContain('#0f151c')
  })

  it('writes public theme metadata to the document root', () => {
    render(
      <PublicAppScreen
        currentPath="/"
        flash={null}
        onNavigate={vi.fn()}
        page={<div>public</div>}
        theme={{
          activeThemeId: 'classic',
          isPreview: true,
          label: 'Harbor',
          themeId: 'harbor',
        }}
      />,
    )

    expect(document.documentElement.dataset.routeSurface).toBe('public')
    expect(document.documentElement.dataset.publicTheme).toBe('harbor')
    expect(document.documentElement.dataset.adminTheme).toBeUndefined()
    expect(document.documentElement.dataset.adminThemePreference).toBeUndefined()
    expect(document.documentElement.style.getPropertyValue('--boot-body-background')).toContain('#eef7f7')
  })
})

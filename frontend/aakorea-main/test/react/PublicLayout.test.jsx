import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { PublicLayout } from '../../src/public/layouts/PublicLayout.jsx'

describe('PublicLayout', () => {
  it('keeps preview theme params on public navigation links', () => {
    const onNavigate = vi.fn()

    render(
      <PublicLayout
        currentPath="/"
        onNavigate={onNavigate}
        theme={{
          activeThemeId: 'classic',
          isPreview: true,
          label: 'Harbor',
          themeId: 'harbor',
        }}
      >
        <div>content</div>
      </PublicLayout>,
    )

    expect(screen.getByText('테마 미리보기 · Harbor')).toBeTruthy()

    const meetingsLink = screen.getByRole('link', { name: '모임 찾기' })
    expect(meetingsLink.getAttribute('href')).toBe('/meetings?themePreview=harbor')

    fireEvent.click(meetingsLink)

    expect(onNavigate).toHaveBeenCalledWith('/meetings?themePreview=harbor')
  })
})

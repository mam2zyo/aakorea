import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { HomePage } from '../../src/pages/public/HomePage.jsx'

function mockNoticeResponse() {
  return {
    ok: true,
    text: async () => JSON.stringify({
      data: [
        {
          id: 7,
          publishedAt: '2026-04-07T09:00:00',
          title: '사무국 운영 시간 변경 안내',
        },
      ],
    }),
  }
}

describe('HomePage', () => {
  it('switches the audience guidance panel without losing the main actions', async () => {
    const onNavigate = vi.fn()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockNoticeResponse()))

    render(<HomePage onNavigate={onNavigate} />)

    await waitFor(() => {
      expect(screen.getAllByText('사무국 운영 시간 변경 안내').length).toBeGreaterThan(0)
    })

    fireEvent.click(screen.getByRole('button', { name: '가족/지인' }))

    expect(screen.getByText('가족이나 지인이라면 정보와 흐름을 먼저 살펴보세요.')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '운영 공지 보기' }))

    expect(onNavigate).toHaveBeenCalledWith('/notices')
  })
})

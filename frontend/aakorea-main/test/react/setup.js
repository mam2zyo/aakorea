import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  window.localStorage.clear()

  document.documentElement.removeAttribute('data-route-surface')
  document.documentElement.removeAttribute('data-admin-theme')
  document.documentElement.removeAttribute('data-admin-theme-preference')
  document.documentElement.removeAttribute('data-public-theme')
  document.documentElement.removeAttribute('data-public-active-theme')
  document.documentElement.style.removeProperty('--boot-body-background')
  document.documentElement.style.removeProperty('--boot-body-color')
  document.documentElement.style.colorScheme = ''
})

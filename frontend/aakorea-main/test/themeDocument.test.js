import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ADMIN_THEME_STORAGE_KEY,
  PUBLIC_ACTIVE_THEME_STORAGE_KEY,
  applyDocumentTheme,
  isAdminRoutePath,
  resolveAdminDocumentState,
  resolveDocumentThemeState,
  resolvePublicDocumentState,
} from '../src/app/themeDocument.js'

function createRootMock() {
  const attributes = new Map()
  const styleValues = new Map()

  return {
    dataset: {},
    removeAttribute(name) {
      attributes.delete(name)
      if (name.startsWith('data-')) {
        const dataKey = name
          .slice(5)
          .split('-')
          .map((segment, index) => (index === 0 ? segment : `${segment[0].toUpperCase()}${segment.slice(1)}`))
          .join('')
        delete this.dataset[dataKey]
      }
    },
    setAttribute(name, value) {
      attributes.set(name, value)
    },
    style: {
      colorScheme: '',
      getPropertyValue(name) {
        return styleValues.get(name) ?? ''
      },
      setProperty(name, value) {
        styleValues.set(name, value)
      },
    },
  }
}

test('isAdminRoutePath recognizes admin routes only', () => {
  assert.equal(isAdminRoutePath('/admin'), true)
  assert.equal(isAdminRoutePath('/admin/groups'), true)
  assert.equal(isAdminRoutePath('/'), false)
  assert.equal(isAdminRoutePath('/meetings'), false)
})

test('resolveAdminDocumentState honors stored preference and system theme', () => {
  const darkState = resolveAdminDocumentState({
    systemTheme: 'dark',
    themePreference: 'system',
  })
  const lightFallbackState = resolveAdminDocumentState({
    systemTheme: 'light',
    themePreference: 'invalid',
  })

  assert.equal(darkState.adminTheme, 'dark')
  assert.equal(darkState.adminThemePreference, 'system')
  assert.equal(darkState.colorScheme, 'dark')
  assert.equal(lightFallbackState.adminTheme, 'light')
  assert.equal(lightFallbackState.adminThemePreference, 'system')
})

test('resolvePublicDocumentState reflects preview themes while keeping active theme metadata', () => {
  const state = resolvePublicDocumentState({
    activeThemeId: 'classic',
    search: '?themePreview=harbor',
  })

  assert.equal(state.publicTheme.themeId, 'harbor')
  assert.equal(state.publicTheme.activeThemeId, 'classic')
  assert.equal(state.publicTheme.isPreview, true)
  assert.equal(state.colorScheme, 'light')
})

test('resolveDocumentThemeState switches between admin and public surfaces', () => {
  const adminState = resolveDocumentThemeState({
    pathname: '/admin/account',
    systemTheme: 'dark',
    themePreference: 'system',
  })
  const publicState = resolveDocumentThemeState({
    pathname: '/meetings',
    search: '?themePreview=harbor',
  })

  assert.equal(adminState.routeSurface, 'admin')
  assert.equal(adminState.adminTheme, 'dark')
  assert.equal(publicState.routeSurface, 'public')
  assert.equal(publicState.publicTheme.themeId, 'harbor')
})

test('applyDocumentTheme writes admin metadata to the root element', () => {
  const root = createRootMock()
  root.dataset.publicTheme = 'classic'
  const documentState = resolveAdminDocumentState({
    systemTheme: 'dark',
    themePreference: 'system',
  })

  applyDocumentTheme(root, documentState)

  assert.equal(root.dataset.routeSurface, 'admin')
  assert.equal(root.dataset.adminTheme, 'dark')
  assert.equal(root.dataset.adminThemePreference, 'system')
  assert.equal(root.dataset.publicTheme, undefined)
  assert.equal(root.style.getPropertyValue('--boot-body-background'), documentState.theme.background)
  assert.equal(root.style.getPropertyValue('--boot-body-color'), documentState.theme.color)
  assert.equal(root.style.colorScheme, 'dark')
})

test('applyDocumentTheme writes public metadata to the root element', () => {
  const root = createRootMock()
  root.dataset.adminTheme = 'dark'
  root.dataset.adminThemePreference = 'system'
  const documentState = resolvePublicDocumentState({
    activeThemeId: 'classic',
    search: '?themePreview=harbor',
  })

  applyDocumentTheme(root, documentState)

  assert.equal(root.dataset.routeSurface, 'public')
  assert.equal(root.dataset.publicActiveTheme, 'classic')
  assert.equal(root.dataset.publicTheme, 'harbor')
  assert.equal(root.dataset.adminTheme, undefined)
  assert.equal(root.dataset.adminThemePreference, undefined)
  assert.equal(root.style.getPropertyValue('--boot-body-background'), documentState.theme.background)
  assert.equal(root.style.getPropertyValue('--boot-body-color'), documentState.theme.color)
  assert.equal(root.style.colorScheme, 'light')
})

test('admin theme storage key stays stable for bootstrap and React sync', () => {
  assert.equal(ADMIN_THEME_STORAGE_KEY, 'aakorea-admin-theme-preference')
})

test('public active theme storage key stays stable for bootstrap and API sync', () => {
  assert.equal(PUBLIC_ACTIVE_THEME_STORAGE_KEY, 'aakorea-public-active-theme')
})

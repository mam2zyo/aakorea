import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_PUBLIC_THEME_ID,
  PUBLIC_THEME_PREVIEW_PARAM,
  applyPublicThemePreview,
  getPublicTheme,
  listPublicThemes,
  resolvePublicTheme,
} from '../src/public/app/publicTheme.js'

test('public theme registry exposes the supported themes', () => {
  const themes = listPublicThemes()

  assert.ok(Array.isArray(themes))
  assert.deepEqual(
    themes.map((theme) => theme.themeId),
    [DEFAULT_PUBLIC_THEME_ID, 'harbor'],
  )
  assert.equal(getPublicTheme('harbor').label, 'Harbor')
})

test('resolvePublicTheme returns the default public theme when preview is absent', () => {
  const theme = resolvePublicTheme('')

  assert.equal(theme.themeId, DEFAULT_PUBLIC_THEME_ID)
  assert.equal(theme.activeThemeId, DEFAULT_PUBLIC_THEME_ID)
  assert.equal(theme.isPreview, false)
})

test('resolvePublicTheme returns preview metadata when a valid preview theme is requested', () => {
  const theme = resolvePublicTheme(`?${PUBLIC_THEME_PREVIEW_PARAM}=harbor`)

  assert.equal(theme.themeId, 'harbor')
  assert.equal(theme.activeThemeId, DEFAULT_PUBLIC_THEME_ID)
  assert.equal(theme.isPreview, true)
})

test('resolvePublicTheme can represent a future published active theme without preview mode', () => {
  const theme = resolvePublicTheme('', { activeThemeId: 'harbor' })

  assert.equal(theme.themeId, 'harbor')
  assert.equal(theme.activeThemeId, 'harbor')
  assert.equal(theme.isPreview, false)
})

test('applyPublicThemePreview appends the preview theme to public paths', () => {
  const previewTheme = resolvePublicTheme(`?${PUBLIC_THEME_PREVIEW_PARAM}=harbor`)

  assert.equal(
    applyPublicThemePreview('/meetings?province=SEOUL', previewTheme),
    '/meetings?province=SEOUL&themePreview=harbor',
  )
  assert.equal(
    applyPublicThemePreview('/notices#top', previewTheme),
    '/notices?themePreview=harbor#top',
  )
})

test('applyPublicThemePreview removes preview params for non-preview themes and skips admin paths', () => {
  const defaultTheme = resolvePublicTheme('')
  const previewTheme = resolvePublicTheme(`?${PUBLIC_THEME_PREVIEW_PARAM}=harbor`)

  assert.equal(
    applyPublicThemePreview('/meetings?themePreview=harbor&province=SEOUL', defaultTheme),
    '/meetings?province=SEOUL',
  )
  assert.equal(
    applyPublicThemePreview('/admin/groups?themePreview=harbor', previewTheme),
    '/admin/groups?themePreview=harbor',
  )
})

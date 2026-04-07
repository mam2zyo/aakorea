import {
  DEFAULT_PUBLIC_THEME_ID,
  resolvePublicTheme,
} from '../public/app/publicTheme.js'

export const ADMIN_THEME_STORAGE_KEY = 'aakorea-admin-theme-preference'
export const PUBLIC_ACTIVE_THEME_STORAGE_KEY = 'aakorea-public-active-theme'
export const DEFAULT_ADMIN_THEME_PREFERENCE = 'system'
export const VALID_ADMIN_THEME_PREFERENCES = new Set(['system', 'light', 'dark'])

export const ADMIN_DOCUMENT_THEMES = Object.freeze({
  dark: Object.freeze({
    background:
      'radial-gradient(circle at top left, rgba(63, 169, 120, 0.16), transparent 30%), linear-gradient(180deg, #0f151c 0%, #121a23 100%)',
    color: '#edf3f7',
    colorScheme: 'dark',
  }),
  light: Object.freeze({
    background:
      'radial-gradient(circle at top left, rgba(44, 106, 75, 0.08), transparent 28%), linear-gradient(180deg, #f6f1e6 0%, #f2ece1 100%)',
    color: '#241d16',
    colorScheme: 'light',
  }),
})

export const PUBLIC_DOCUMENT_THEMES = Object.freeze({
  classic: Object.freeze({
    background:
      'radial-gradient(circle at top left, rgba(255, 255, 255, 0.72), transparent 30%), linear-gradient(180deg, #f7f2e8 0%, #efe4d2 100%)',
    color: '#241d16',
    colorScheme: 'light',
  }),
  harbor: Object.freeze({
    background:
      'radial-gradient(circle at top left, rgba(255, 255, 255, 0.78), transparent 28%), linear-gradient(180deg, #eef7f7 0%, #d8eaeb 100%)',
    color: '#1f2c33',
    colorScheme: 'light',
  }),
})

export function isAdminRoutePath(pathname = '') {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

export function normalizeAdminThemePreference(themePreference) {
  return VALID_ADMIN_THEME_PREFERENCES.has(themePreference)
    ? themePreference
    : DEFAULT_ADMIN_THEME_PREFERENCE
}

export function normalizeSystemTheme(systemTheme) {
  return systemTheme === 'dark' ? 'dark' : 'light'
}

export function resolveAdminDocumentState({
  systemTheme = 'light',
  themePreference = DEFAULT_ADMIN_THEME_PREFERENCE,
}) {
  const normalizedPreference = normalizeAdminThemePreference(themePreference)
  const normalizedSystemTheme = normalizeSystemTheme(systemTheme)
  const resolvedTheme = normalizedPreference === 'system'
    ? normalizedSystemTheme
    : normalizedPreference

  return {
    adminTheme: resolvedTheme,
    adminThemePreference: normalizedPreference,
    colorScheme: ADMIN_DOCUMENT_THEMES[resolvedTheme].colorScheme,
    routeSurface: 'admin',
    theme: ADMIN_DOCUMENT_THEMES[resolvedTheme],
  }
}

export function resolvePublicDocumentState({
  activeThemeId = DEFAULT_PUBLIC_THEME_ID,
  search = '',
}) {
  const publicTheme = resolvePublicTheme(search, { activeThemeId })
  const documentTheme = PUBLIC_DOCUMENT_THEMES[publicTheme.themeId]
    ?? PUBLIC_DOCUMENT_THEMES[DEFAULT_PUBLIC_THEME_ID]

  return {
    colorScheme: documentTheme.colorScheme,
    publicTheme,
    routeSurface: 'public',
    theme: documentTheme,
  }
}

export function resolveDocumentThemeState({
  activePublicThemeId = DEFAULT_PUBLIC_THEME_ID,
  pathname = '/',
  search = '',
  systemTheme = 'light',
  themePreference = DEFAULT_ADMIN_THEME_PREFERENCE,
}) {
  if (isAdminRoutePath(pathname)) {
    return resolveAdminDocumentState({ systemTheme, themePreference })
  }

  return resolvePublicDocumentState({ activeThemeId: activePublicThemeId, search })
}

export function applyDocumentTheme(root, documentState) {
  if (!root || !documentState?.theme) {
    return
  }

  root.dataset.routeSurface = documentState.routeSurface
  root.style.setProperty('--boot-body-background', documentState.theme.background)
  root.style.setProperty('--boot-body-color', documentState.theme.color)
  root.style.colorScheme = documentState.colorScheme

  if (documentState.routeSurface === 'admin') {
    root.dataset.adminTheme = documentState.adminTheme
    root.dataset.adminThemePreference = documentState.adminThemePreference
    root.removeAttribute('data-public-theme')
    root.removeAttribute('data-public-active-theme')
    return
  }

  root.dataset.publicActiveTheme = documentState.publicTheme.activeThemeId
  root.dataset.publicTheme = documentState.publicTheme.themeId
  root.removeAttribute('data-admin-theme')
  root.removeAttribute('data-admin-theme-preference')
}

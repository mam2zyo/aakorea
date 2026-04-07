export const DEFAULT_PUBLIC_THEME_ID = 'classic'
export const PUBLIC_THEME_PREVIEW_PARAM = 'themePreview'

export const PUBLIC_THEME_REGISTRY = Object.freeze([
  Object.freeze({
    themeId: 'classic',
    label: '기본형',
    description: '현재 공개 사이트의 기본 look and feel입니다.',
  }),
  Object.freeze({
    themeId: 'harbor',
    label: 'Harbor',
    description: '차분한 청록 계열과 밝은 바탕을 쓰는 대안 테마입니다.',
  }),
  Object.freeze({
    themeId: 'breeze',
    label: 'Breeze',
    description: '부드러운 블루 계열 바탕에 선명한 CTA 대비를 주는 테마입니다.',
  }),
])

const PUBLIC_THEME_MAP = new Map(
  PUBLIC_THEME_REGISTRY.map((theme) => [theme.themeId, theme]),
)

export function isPublicThemeId(themeId) {
  return PUBLIC_THEME_MAP.has(themeId)
}

export function getPublicTheme(themeId) {
  if (isPublicThemeId(themeId)) {
    return PUBLIC_THEME_MAP.get(themeId)
  }

  return PUBLIC_THEME_MAP.get(DEFAULT_PUBLIC_THEME_ID)
}

export function listPublicThemes() {
  return PUBLIC_THEME_REGISTRY
}

export function resolvePublicTheme(search = '', options = {}) {
  const params = new URLSearchParams(search)
  const previewThemeId = params.get(PUBLIC_THEME_PREVIEW_PARAM)
  const activeThemeId = isPublicThemeId(options.activeThemeId)
    ? options.activeThemeId
    : DEFAULT_PUBLIC_THEME_ID
  const activeTheme = getPublicTheme(activeThemeId)

  if (isPublicThemeId(previewThemeId)) {
    const previewTheme = getPublicTheme(previewThemeId)
    return {
      ...previewTheme,
      activeThemeId,
      isPreview: previewTheme.themeId !== activeThemeId,
    }
  }

  return {
    ...activeTheme,
    activeThemeId,
    isPreview: false,
  }
}

export function applyPublicThemePreview(path, theme) {
  if (typeof path !== 'string' || path === '') {
    return path
  }

  if (!path.startsWith('/') || path.startsWith('/admin')) {
    return path
  }

  const hashIndex = path.indexOf('#')
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : ''
  const pathWithoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path
  const searchIndex = pathWithoutHash.indexOf('?')
  const pathname = searchIndex >= 0 ? pathWithoutHash.slice(0, searchIndex) : pathWithoutHash
  const search = searchIndex >= 0 ? pathWithoutHash.slice(searchIndex + 1) : ''
  const params = new URLSearchParams(search)

  if (theme?.isPreview && isPublicThemeId(theme.themeId)) {
    params.set(PUBLIC_THEME_PREVIEW_PARAM, theme.themeId)
  } else {
    params.delete(PUBLIC_THEME_PREVIEW_PARAM)
  }

  const nextSearch = params.toString()
  return `${pathname}${nextSearch ? `?${nextSearch}` : ''}${hash}`
}

export const DEFAULT_ADMIN_PATH = '/admin/groups'

export function parseRoute(pathname, search = '') {
  const params = new URLSearchParams(search)
  const normalizedPath = normalizePath(pathname)

  if (normalizedPath === '/') {
    return createRoute('home', normalizedPath, { section: 'public' })
  }

  if (normalizedPath === '/meetings') {
    return createRoute('meetings', normalizedPath, {
      section: 'public',
      province: params.get('province') ?? '',
      dayOfWeek: params.get('dayOfWeek') ?? '',
      meetingId: params.get('meetingId') ?? '',
    })
  }

  if (normalizedPath === '/notices') {
    return createRoute('notices', normalizedPath, { section: 'public', noticeId: null })
  }

  const noticeMatch = normalizedPath.match(/^\/notices\/(\d+)$/)
  if (noticeMatch) {
    return createRoute('notices', normalizedPath, {
      section: 'public',
      noticeId: Number(noticeMatch[1]),
    })
  }

  const contentPageMatch = normalizedPath.match(/^\/content-pages\/([^/]+)$/)
  if (contentPageMatch) {
    return createRoute('content-page', normalizedPath, {
      section: 'public',
      pageKey: decodeURIComponent(contentPageMatch[1]),
    })
  }

  if (normalizedPath === '/admin/login') {
    return createRoute('admin-login', normalizedPath, {
      section: 'admin',
      redirectPath: sanitizeAdminRedirect(params.get('redirect')),
    })
  }

  if (normalizedPath === '/admin/districts') {
    return createRoute('admin-districts', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/groups') {
    return createRoute('admin-groups', normalizedPath, { section: 'admin', groupId: null })
  }

  const adminGroupMatch = normalizedPath.match(/^\/admin\/groups\/(\d+)$/)
  if (adminGroupMatch) {
    return createRoute('admin-group-editor', normalizedPath, {
      section: 'admin',
      groupId: Number(adminGroupMatch[1]),
    })
  }

  if (normalizedPath === '/admin/content-pages') {
    return createRoute('admin-content-pages', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/notices') {
    return createRoute('admin-notices', normalizedPath, { section: 'admin' })
  }

  return createRoute('not-found', normalizedPath, { section: 'public' })
}

export function requiresAdminSession(route) {
  return route.section === 'admin' && route.name !== 'admin-login'
}

export function sanitizeAdminRedirect(value) {
  if (!value || !value.startsWith('/admin') || value.startsWith('/admin/login')) {
    return DEFAULT_ADMIN_PATH
  }

  return value
}

export function buildAdminLoginPath(redirectPath = DEFAULT_ADMIN_PATH) {
  const normalizedRedirect = sanitizeAdminRedirect(redirectPath)
  if (normalizedRedirect === DEFAULT_ADMIN_PATH) {
    return '/admin/login'
  }

  const params = new URLSearchParams({ redirect: normalizedRedirect })
  return `/admin/login?${params.toString()}`
}

function normalizePath(pathname) {
  if (!pathname || pathname === '') {
    return '/'
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

function createRoute(name, currentPath, extra = {}) {
  return {
    name,
    currentPath,
    ...extra,
  }
}

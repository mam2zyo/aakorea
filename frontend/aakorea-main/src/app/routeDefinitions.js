export const DEFAULT_ADMIN_PATH = '/admin/groups'
const IS_DEV = Boolean(import.meta.env?.DEV)

export function parseRoute(pathname, search = '') {
  const params = new URLSearchParams(search)
  const normalizedPath = normalizePath(pathname)
  const create = (name, currentPath, extra = {}) => createRoute(name, currentPath, {
    search,
    ...extra,
  })

  if (normalizedPath === '/') {
    return create('home', normalizedPath, { section: 'public' })
  }

  if (normalizedPath === '/meetings') {
    return create('meetings', normalizedPath, {
      section: 'public',
      groupId: optionalNumber(params.get('groupId')),
      meetingId: optionalNumber(params.get('meetingId')),
    })
  }

  if (IS_DEV && normalizedPath === '/__preview/meeting-focus') {
    return create('meeting-focus-preview', normalizedPath, {
      section: 'public',
    })
  }

  const groupMatch = normalizedPath.match(/^\/groups\/(\d+)$/)
  if (groupMatch) {
    return create('meetings', normalizedPath, {
      section: 'public',
      groupId: Number(groupMatch[1]),
      meetingId: optionalNumber(params.get('meetingId')),
    })
  }

  if (normalizedPath === '/notices') {
    return create('notices', normalizedPath, { section: 'public', noticeId: null })
  }

  const noticeMatch = normalizedPath.match(/^\/notices\/(\d+)$/)
  if (noticeMatch) {
    return create('notices', normalizedPath, {
      section: 'public',
      noticeId: Number(noticeMatch[1]),
    })
  }

  const contentPageMatch = normalizedPath.match(/^\/content-pages\/([^/]+)$/)
  if (contentPageMatch) {
    return create('content-page', normalizedPath, {
      section: 'public',
      pageKey: decodeURIComponent(contentPageMatch[1]),
    })
  }

  if (normalizedPath === '/admin/login') {
    return create('admin-login', normalizedPath, {
      section: 'admin',
      redirectPath: sanitizeAdminRedirect(params.get('redirect')),
    })
  }

  if (normalizedPath === '/admin/register') {
    return create('admin-register', normalizedPath, {
      section: 'admin',
    })
  }

  if (normalizedPath === '/admin/pending') {
    return create('admin-pending', normalizedPath, {
      section: 'admin',
    })
  }

  if (normalizedPath === '/admin') {
    return create('admin-root', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/districts') {
    return create('admin-districts', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/overview') {
    return create('admin-overview', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/account') {
    return create('admin-account', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/admin-users') {
    return create('admin-admin-users', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/public-theme') {
    return create('admin-public-theme', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/groups') {
    return create('admin-groups', normalizedPath, { section: 'admin', groupId: null })
  }

  const adminGroupMatch = normalizedPath.match(/^\/admin\/groups\/(\d+)$/)
  if (adminGroupMatch) {
    return create('admin-groups', normalizedPath, {
      section: 'admin',
      groupId: Number(adminGroupMatch[1]),
    })
  }

  if (normalizedPath === '/admin/content-pages') {
    return create('admin-content-pages', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath === '/admin/notices') {
    return create('admin-notices', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath.startsWith('/admin')) {
    return create('not-found', normalizedPath, { section: 'admin' })
  }

  return create('not-found', normalizedPath, { section: 'public' })
}

export function requiresAdminSession(route) {
  return route.section === 'admin'
    && route.name !== 'admin-login'
    && route.name !== 'admin-register'
}

export function sanitizeAdminRedirect(value) {
  if (value === '/admin') {
    return DEFAULT_ADMIN_PATH
  }

  if (
    !value
    || !value.startsWith('/admin')
    || value.startsWith('/admin/login')
    || value.startsWith('/admin/register')
  ) {
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

export function buildAdminRegisterPath() {
  return '/admin/register'
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

function optionalNumber(value) {
  if (!value) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function optionalInteger(value) {
  if (!value) {
    return null
  }

  const parsedValue = Number.parseInt(value, 10)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function optionalFloat(value) {
  if (!value) {
    return null
  }

  const parsedValue = Number.parseFloat(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

import {
  createRoute,
  normalizePath,
} from '@/shared/app/routerLogic'

export const DEFAULT_ADMIN_PATH = '/admin/groups'

export function parseAdminRoute(pathname, search = '') {
  const params = new URLSearchParams(search)
  const normalizedPath = normalizePath(pathname)
  const create = (name, currentPath, extra = {}) => createRoute(name, currentPath, {
    search,
    ...extra,
  })

  // Admin routes only
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

  if (normalizedPath === '/admin/audit-logs') {
    return create('admin-audit-logs', normalizedPath, { section: 'admin' })
  }

  if (normalizedPath.startsWith('/admin')) {
    return create('not-found', normalizedPath, { section: 'admin' })
  }

  // Not found (but conceptually should be handled by the router if it's admin-only)
  return create('not-found', normalizedPath, { section: 'admin' })
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

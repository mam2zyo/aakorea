import { useEffect, useState } from 'react'

export const DEFAULT_ADMIN_PATH = '/admin/groups'

function readLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  }
}

export function navigate(to, options = {}) {
  const currentPath = `${window.location.pathname}${window.location.search}`
  if (currentPath === to) {
    window.scrollTo({ top: 0, left: 0 })
    return
  }

  const method = options.replace ? 'replaceState' : 'pushState'
  window.history[method]({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo({ top: 0, left: 0 })
}

export function sanitizeAdminRedirect(pathname) {
  if (!pathname || !pathname.startsWith('/admin/')) {
    return DEFAULT_ADMIN_PATH
  }

  if (pathname === '/admin/login' || pathname === '/admin') {
    return DEFAULT_ADMIN_PATH
  }

  return pathname
}

export function buildAdminLoginPath(redirectPath) {
  const params = new URLSearchParams({
    redirect: sanitizeAdminRedirect(redirectPath),
  })

  return `/admin/login?${params.toString()}`
}

export function requiresAdminSession(kind) {
  return (
    kind === 'admin-districts' ||
    kind === 'admin-groups' ||
    kind === 'admin-group-editor' ||
    kind === 'admin-content-pages' ||
    kind === 'admin-notices'
  )
}

export function useAppRoute() {
  const [location, setLocation] = useState(() => readLocation())

  useEffect(() => {
    function handleLocationChange() {
      setLocation(readLocation())
    }

    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, [])

  return parseRoute(location.pathname, location.search)
}

function parseRoute(pathname, search) {
  const normalizedPath =
    pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

  const searchParams = new URLSearchParams(search)
  const segments = normalizedPath.split('/').filter(Boolean)

  if (normalizedPath === '/') {
    return {
      kind: 'home',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/meetings') {
    return {
      kind: 'meetings',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/notices') {
    return {
      kind: 'notices',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/admin') {
    return {
      kind: 'admin-root',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/admin/login') {
    return {
      kind: 'admin-login',
      pathname: normalizedPath,
      redirectPath: searchParams.get('redirect') ?? DEFAULT_ADMIN_PATH,
    }
  }

  if (normalizedPath === '/admin/districts') {
    return {
      kind: 'admin-districts',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/admin/groups') {
    return {
      kind: 'admin-groups',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/admin/content-pages') {
    return {
      kind: 'admin-content-pages',
      pathname: normalizedPath,
    }
  }

  if (normalizedPath === '/admin/notices') {
    return {
      kind: 'admin-notices',
      pathname: normalizedPath,
    }
  }

  if (segments.length === 2 && segments[0] === 'content-pages') {
    return {
      kind: 'content-page',
      pathname: normalizedPath,
      pageKey: decodeURIComponent(segments[1]),
    }
  }

  if (segments.length === 2 && segments[0] === 'notices') {
    const noticeId = Number(segments[1])

    if (Number.isInteger(noticeId) && noticeId > 0) {
      return {
        kind: 'notice-detail',
        pathname: normalizedPath,
        noticeId,
      }
    }
  }

  if (segments.length === 3 && segments[0] === 'admin' && segments[1] === 'groups') {
    const groupId = Number(segments[2])

    if (Number.isInteger(groupId) && groupId > 0) {
      return {
        kind: 'admin-group-editor',
        pathname: normalizedPath,
        groupId,
      }
    }
  }

  return {
    kind: 'not-found',
    pathname: normalizedPath,
  }
}

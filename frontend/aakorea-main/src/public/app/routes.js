import {
  createRoute,
  normalizePath,
  optionalNumber,
} from '@/shared/app/routerLogic'

const IS_DEV = Boolean(import.meta.env?.DEV)

export function parsePublicRoute(pathname, search = '') {
  const params = new URLSearchParams(search)
  const normalizedPath = normalizePath(pathname)
  const create = (name, currentPath, extra = {}) => createRoute(name, currentPath, {
    search,
    ...extra,
  })

  // Public routes only
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

  return create('not-found', normalizedPath, { section: 'public' })
}

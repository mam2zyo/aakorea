import { useEffect, useState } from 'react'
import {
  parseRoute,
} from './routeDefinitions'

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

export {
  buildAdminRegisterPath,
  buildAdminLoginPath,
  DEFAULT_ADMIN_PATH,
  parseRoute,
  requiresAdminSession,
  sanitizeAdminRedirect,
} from './routeDefinitions'

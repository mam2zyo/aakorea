export function normalizePath(pathname) {
  if (!pathname || pathname === '') {
    return '/'
  }

  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }

  return pathname
}

export function createRoute(name, currentPath, extra = {}) {
  return {
    name,
    currentPath,
    ...extra,
  }
}

export function optionalNumber(value) {
  if (!value) {
    return null
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

export function optionalInteger(value) {
  if (!value) {
    return null
  }

  const parsedValue = Number.parseInt(value, 10)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

export function optionalFloat(value) {
  if (!value) {
    return null
  }

  const parsedValue = Number.parseFloat(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

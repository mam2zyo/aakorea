import { SEARCH_PROVINCE_OPTIONS } from '@/shared/lib/options'

export const DEFAULT_PROVINCE = SEARCH_PROVINCE_OPTIONS[0]?.value ?? 'all'
export const MEETING_SEARCH_MODE = {
  REGION: 'region',
  NEARBY: 'nearby',
}
export const DEFAULT_NEARBY_RADIUS_KM = 100
export const MAX_NEARBY_RADIUS_KM = 100
export const NEARBY_RADIUS_STEPS = [100]

const TMAP_APP_KEY = import.meta.env?.VITE_TMAP_APP_KEY?.trim() ?? ''

export function buildMeetingsPath(groupId = null, meetingId = null) {
  const searchParams = new URLSearchParams()

  if (Number.isFinite(groupId)) {
    searchParams.set('groupId', String(groupId))
  }

  if (Number.isFinite(meetingId)) {
    searchParams.set('meetingId', String(meetingId))
  }

  const query = searchParams.toString()
  return query ? `/meetings?${query}` : '/meetings'
}

export function readMeetingSearchMode(value) {
  return value === MEETING_SEARCH_MODE.NEARBY
    ? MEETING_SEARCH_MODE.NEARBY
    : MEETING_SEARCH_MODE.REGION
}

export function normalizeNearbyRadius(value) {
  if (!Number.isFinite(value)) {
    return DEFAULT_NEARBY_RADIUS_KM
  }

  const roundedValue = Math.round(value)
  if (roundedValue < 1) {
    return DEFAULT_NEARBY_RADIUS_KM
  }

  return Math.min(roundedValue, MAX_NEARBY_RADIUS_KM)
}

export function buildNearbyRadiusSteps(initialRadiusKm) {
  const normalizedRadiusKm = normalizeNearbyRadius(initialRadiusKm)
  const nextSteps = NEARBY_RADIUS_STEPS.filter((radiusKm) => radiusKm >= normalizedRadiusKm)

  if (nextSteps.length > 0) {
    return nextSteps
  }

  return [MAX_NEARBY_RADIUS_KM]
}

export function formatDistanceLabel(distanceKm) {
  if (!Number.isFinite(distanceKm)) {
    return ''
  }

  if (distanceKm < 1) {
    return `${Math.max(100, Math.round(distanceKm * 1000))}m`
  }

  return `${distanceKm.toFixed(1)}km`
}

export function buildKakaoMapUrl(locationName, latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const label = encodeURIComponent(locationName || 'AA 모임 장소')
  return `https://map.kakao.com/link/map/${label},${latitude},${longitude}`
}

export function buildKakaoMapAppUrl(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return `kakaomap://look?p=${latitude},${longitude}`
}

export function buildKakaoMapMobileWebUrl(latitude, longitude) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return `http://m.map.kakao.com/scheme/look?p=${latitude},${longitude}`
}

export function shouldOpenKakaoMapAppFirst(userAgent = '') {
  return /android|iphone|ipad|ipod/i.test(userAgent)
}

export function buildKakaoMapInstallUrl(userAgent = '') {
  if (/android/i.test(userAgent)) {
    return 'https://play.google.com/store/apps/details?id=net.daum.android.map'
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'https://apps.apple.com/us/app/304608425'
  }

  return null
}

export function openKakaoMapWithFallback(event, latitude, longitude, onFallbackNeeded) {
  if (
    typeof window === 'undefined'
    || typeof document === 'undefined'
    || !shouldOpenKakaoMapAppFirst(window.navigator?.userAgent)
  ) {
    return
  }

  const appUrl = buildKakaoMapAppUrl(latitude, longitude)
  const mobileWebUrl = buildKakaoMapMobileWebUrl(latitude, longitude)
  const installUrl = buildKakaoMapInstallUrl(window.navigator?.userAgent)
  if (!appUrl) {
    return
  }

  event.preventDefault()

  let fallbackPending = true
  let fallbackTimeoutId = null
  const startTime = Date.now()

  function cleanup() {
    fallbackPending = false

    if (fallbackTimeoutId !== null) {
      window.clearTimeout(fallbackTimeoutId)
      fallbackTimeoutId = null
    }

    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('pagehide', handlePageHide)
    window.removeEventListener('blur', handleBlur)
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      cleanup()
    }
  }

  function handlePageHide() {
    cleanup()
  }

  function handleBlur() {
    cleanup()
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('pagehide', handlePageHide, { once: true })
  window.addEventListener('blur', handleBlur, { once: true })

  fallbackTimeoutId = window.setTimeout(() => {
    if (!fallbackPending) {
      return
    }

    const elapsed = Date.now() - startTime
    // If more than 1500ms has passed for a 900ms timeout, the browser was likely suspended
    // because the Kakao Map app opened successfully.
    if (elapsed > 1500) {
      cleanup()
      return
    }

    cleanup()
    onFallbackNeeded?.({
      installUrl,
      mobileWebUrl,
    })
  }, 900)

  window.location.assign(appUrl)
}

export function buildTmapRouteUrl(locationName, latitude, longitude) {
  if (!TMAP_APP_KEY || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const params = new URLSearchParams({
    appKey: TMAP_APP_KEY,
    lat: String(latitude),
    lon: String(longitude),
    name: locationName || 'AA 모임 장소',
  })

  return `https://apis.openapi.sk.com/tmap/app/routes?${params.toString()}`
}

export function hasGroupNotice(groupDetails) {
  return typeof groupDetails?.notice === 'string' && groupDetails.notice.trim()
}

export function readGroupNotice(groupDetails) {
  if (hasGroupNotice(groupDetails)) {
    return groupDetails.notice.trim()
  }

  return '등록된 그룹 공지가 없습니다.'
}

const EARTH_RADIUS_KM = 6371.01

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!Number.isFinite(lat1) || !Number.isFinite(lon1) || !Number.isFinite(lat2) || !Number.isFinite(lon2)) {
    return null
  }

  const toRad = (value) => (value * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return EARTH_RADIUS_KM * c
}

export function roundDistanceKm(distanceKm) {
  if (!Number.isFinite(distanceKm)) {
    return null
  }
  return Math.round(distanceKm * 10) / 10
}

const DAY_ORDER = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7,
}

export function sortMeetings(meetings, searchMode = MEETING_SEARCH_MODE.REGION) {
  if (searchMode === MEETING_SEARCH_MODE.NEARBY) {
    return [...meetings].sort((a, b) => {
      // 1. Distance (ASC)
      const distA = a.distanceKm ?? Infinity
      const distB = b.distanceKm ?? Infinity
      if (distA !== distB) return distA - distB

      // 2. DayOfWeek (MONDAY -> SUNDAY)
      const dayA = DAY_ORDER[a.dayOfWeek] || 0
      const dayB = DAY_ORDER[b.dayOfWeek] || 0
      if (dayA !== dayB) return dayA - dayB

      // 3. StartTime (ASC)
      if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime)

      // 4. ID (ASC)
      return a.id - b.id
    })
  }

  return [...meetings].sort((a, b) => {
    // 1. DayOfWeek
    const dayA = DAY_ORDER[a.dayOfWeek] || 0
    const dayB = DAY_ORDER[b.dayOfWeek] || 0
    if (dayA !== dayB) return dayA - dayB

    // 2. StartTime
    if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime)

    // 3. ID
    return a.id - b.id
  })
}

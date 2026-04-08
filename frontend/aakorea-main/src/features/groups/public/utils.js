import { PROVINCE_OPTIONS } from '../../../lib/options.js'

export const DEFAULT_PROVINCE = PROVINCE_OPTIONS[0]?.value ?? 'seoul'
export const MEETING_SEARCH_MODE = {
  REGION: 'region',
  NEARBY: 'nearby',
}
export const DEFAULT_NEARBY_RADIUS_KM = 5
export const MAX_NEARBY_RADIUS_KM = 50
export const NEARBY_RADIUS_STEPS = [5, 10, 20, 30, 50]

const TMAP_APP_KEY = import.meta.env?.VITE_TMAP_APP_KEY?.trim() ?? ''

export function buildMeetingsPath(filters, groupId = null, meetingId = null) {
  const searchParams = new URLSearchParams()

  const searchMode = readMeetingSearchMode(filters?.searchMode)

  if (searchMode === MEETING_SEARCH_MODE.NEARBY) {
    searchParams.set('searchMode', MEETING_SEARCH_MODE.NEARBY)

    if (Number.isFinite(filters?.latitude)) {
      searchParams.set('latitude', String(filters.latitude))
    }
    if (Number.isFinite(filters?.longitude)) {
      searchParams.set('longitude', String(filters.longitude))
    }
    if (Number.isFinite(filters?.radiusKm)) {
      searchParams.set('radiusKm', String(filters.radiusKm))
    }
  } else if (filters?.province) {
    searchParams.set('province', filters.province)
  }

  if (filters?.dayOfWeek) {
    searchParams.set('dayOfWeek', filters.dayOfWeek)
  }

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

export function shouldOpenKakaoMapAppFirst(userAgent = '') {
  return /android|iphone|ipad|ipod/i.test(userAgent)
}

export function openKakaoMapWithFallback(event, latitude, longitude) {
  if (typeof window === 'undefined' || !shouldOpenKakaoMapAppFirst(window.navigator?.userAgent)) {
    return
  }

  const appUrl = buildKakaoMapAppUrl(latitude, longitude)
  if (!appUrl) {
    return
  }

  event.preventDefault()
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

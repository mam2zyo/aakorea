import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { ApiError } from '../../../../../shared/lib/request'
import { publicDistrictApi, publicGroupApi, publicMeetingApi } from '../../../../../lib/api'
import {
  buildMeetingsPath,
  calculateDistanceKm,
  DEFAULT_NEARBY_RADIUS_KM,
  DEFAULT_PROVINCE,
  MEETING_SEARCH_MODE,
  roundDistanceKm,
  sortMeetings,
} from '../utils'

// 검색 상태 상수
export const SEARCH_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  REGION_ACTIVE: 'region_active',
  NEARBY_ACTIVE: 'nearby_active',
}

const EMPTY_FILTERS = {
  dayOfWeek: '',
  type: '',
  districtId: '',
  keyword: '',
}

export function useMeetingSearch({ groupId, meetingId, onError }) {
  // ── 검색 상태 머신 ──────────────────────────────────────────
  const [searchState, setSearchState] = useState(SEARCH_STATE.IDLE)

  // ── 선택된 지역 (드롭다운 값, 버튼 클릭 전까지는 UI 상태만) ─
  const [province, setProvince] = useState(DEFAULT_PROVINCE)

  // ── 위치 정보 (내 주변 찾기 성공 시 저장) ─────────────────
  const [nearbyLocation, setNearbyLocation] = useState(null)

  // ── 캐시: 백엔드 응답 원본 데이터 ────────────────────────
  const [rawMeetings, setRawMeetings] = useState([])

  // ── 상세 필터 (클라이언트 사이드만) ──────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS)

  // ── 지역 연합 목록 ──────────────────────────────────────
  const [districts, setDistricts] = useState([])

  // ── 모임 상세 다이얼로그 ────────────────────────────────
  const [groupDetails, setGroupDetails] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [missingGroup, setMissingGroup] = useState(false)

  const activeGroupId = Number.isFinite(groupId) ? groupId : null
  const isDialogOpen = activeGroupId !== null

  const isLoading = searchState === SEARCH_STATE.LOADING
  const isRegionActive = searchState === SEARCH_STATE.REGION_ACTIVE
  const isNearbyActive = searchState === SEARCH_STATE.NEARBY_ACTIVE
  const hasResults = isRegionActive || isNearbyActive

  // ── 지역연합 로드 (마운트 시 1회) ─────────────────────────
  useEffect(() => {
    async function loadDistricts() {
      try {
        const result = await publicDistrictApi.getDistricts()
        setDistricts(result)
      } catch (error) {
        console.error('Failed to load districts:', error)
      }
    }
    void loadDistricts()
  }, [])

  // ── 지역 검색 ─────────────────────────────────────────────
  async function handleRegionSearch() {
    setSearchState(SEARCH_STATE.LOADING)
    try {
      const result = await publicMeetingApi.getMeetings({ province })
      setRawMeetings(result)
      setFilters(EMPTY_FILTERS)
      setSearchState(SEARCH_STATE.REGION_ACTIVE)
    } catch (error) {
      setSearchState(SEARCH_STATE.IDLE)
      onError(error, '모임 목록을 불러오지 못했습니다.')
    }
  }

  // ── 내 주변 찾기 ───────────────────────────────────────────
  async function handleNearbySearch() {
    setSearchState(SEARCH_STATE.LOADING)
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false,
        })
      })

      const { latitude, longitude } = position.coords
      const result = await publicMeetingApi.getMeetings({
        latitude,
        longitude,
        radiusKm: DEFAULT_NEARBY_RADIUS_KM,
      })

      setNearbyLocation({ latitude, longitude })
      setRawMeetings(result)
      setFilters(EMPTY_FILTERS)
      setSearchState(SEARCH_STATE.NEARBY_ACTIVE)
    } catch (error) {
      setSearchState(SEARCH_STATE.IDLE)
      if (error?.code === 1) {
        // GeolocationPositionError.PERMISSION_DENIED
        onError(error, '위치 접근 권한이 필요합니다. 브라우저 설정에서 권한을 허용해 주세요.')
      } else {
        onError(error, '현재 위치를 확인하거나 모임을 불러오지 못했습니다.')
      }
    }
  }

  // ── 검색 초기화 ────────────────────────────────────────────
  function handleReset() {
    setRawMeetings([])
    setNearbyLocation(null)
    setFilters(EMPTY_FILTERS)
    setSearchState(SEARCH_STATE.IDLE)
  }

  // ── 실시간 클라이언트 필터링 ──────────────────────────────
  const meetings = useMemo(() => {
    if (rawMeetings.length === 0) return []

    let result = rawMeetings.map(m => {
      let distanceKm = null
      if (isNearbyActive && nearbyLocation) {
        const raw = calculateDistanceKm(nearbyLocation.latitude, nearbyLocation.longitude, m.latitude, m.longitude)
        distanceKm = raw != null ? roundDistanceKm(raw) : null
      }
      return { ...m, distanceKm }
    })

    result = result.filter(m => {
      if (filters.dayOfWeek && m.dayOfWeek !== filters.dayOfWeek) return false
      if (filters.type && m.type !== filters.type) return false
      if (filters.districtId) {
        // districtId가 null/undefined인 경우 필터에서 제외
        if (m.districtId == null) return false
        if (String(m.districtId) !== String(filters.districtId)) return false
      }
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase()
        const groupName = m.groupName?.toLowerCase() ?? ''
        const locationDetail = m.locationDetail?.toLowerCase() ?? ''
        if (!groupName.includes(kw) && !locationDetail.includes(kw)) return false
      }
      return true
    })

    return sortMeetings(result, isNearbyActive ? MEETING_SEARCH_MODE.NEARBY : MEETING_SEARCH_MODE.REGION)
  }, [rawMeetings, filters, isNearbyActive, nearbyLocation])

  // ── 다이얼로그 관련 ────────────────────────────────────────
  async function loadGroupDetails(targetGroupId) {
    if (!Number.isFinite(targetGroupId)) {
      setGroupDetails(null)
      setMissingGroup(false)
      return
    }
    setDetailLoading(true)
    try {
      const detail = await publicGroupApi.getGroup(targetGroupId)
      setGroupDetails(detail)
      setMissingGroup(false)
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setMissingGroup(true)
        return
      }
      onError(error, '선택한 그룹 정보를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadGroupDetailsEffect = useEffectEvent((targetGroupId) => {
    void loadGroupDetails(targetGroupId)
  })

  useEffect(() => {
    loadGroupDetailsEffect(activeGroupId)
  }, [activeGroupId])

  const selectedMeeting = useMemo(() => {
    if (!groupDetails) return null
    if (Number.isFinite(meetingId)) {
      const found = groupDetails.meetings.find(m => m.id === meetingId)
      if (found) return found
    }
    return groupDetails.meetings[0] ?? null
  }, [groupDetails, meetingId])

  const closePath = useMemo(() => buildMeetingsPath(), [])
  const selectedSearchMeetingId = selectedMeeting?.id ?? meetingId ?? null

  return {
    // 상태
    searchState,
    isLoading,
    isRegionActive,
    isNearbyActive,
    hasResults,
    // 지역 선택
    province,
    setProvince,
    // 상세 필터
    filters,
    setFilters,
    // 검색 결과
    meetings,
    districts,
    // 액션
    handleRegionSearch,
    handleNearbySearch,
    handleReset,
    // 다이얼로그
    closePath,
    detailLoading,
    groupDetails,
    isDialogOpen,
    missingGroup,
    selectedMeeting,
    selectedSearchMeetingId,
  }
}

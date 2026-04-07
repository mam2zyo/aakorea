import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { ApiError } from '../../../../shared/lib/request'
import { publicGroupApi, publicMeetingApi } from '../../../../lib/api'
import {
  buildMeetingsPath,
  buildNearbyRadiusSteps,
  DEFAULT_NEARBY_RADIUS_KM,
  DEFAULT_PROVINCE,
  MEETING_SEARCH_MODE,
  normalizeNearbyRadius,
  readMeetingSearchMode,
} from '../utils'

function createSearchFilters({
  dayOfWeek,
  latitude,
  longitude,
  province,
  radiusKm,
  searchMode,
}) {
  const normalizedSearchMode = readMeetingSearchMode(searchMode)

  return {
    province: province || DEFAULT_PROVINCE,
    dayOfWeek: dayOfWeek || '',
    searchMode: normalizedSearchMode,
    latitude: normalizedSearchMode === MEETING_SEARCH_MODE.NEARBY && Number.isFinite(latitude)
      ? latitude
      : null,
    longitude: normalizedSearchMode === MEETING_SEARCH_MODE.NEARBY && Number.isFinite(longitude)
      ? longitude
      : null,
    radiusKm: normalizedSearchMode === MEETING_SEARCH_MODE.NEARBY
      ? normalizeNearbyRadius(radiusKm)
      : DEFAULT_NEARBY_RADIUS_KM,
  }
}

export function useMeetingSearch({
  dayOfWeek,
  groupId,
  latitude,
  longitude,
  meetingId,
  onError,
  province,
  radiusKm,
  searchMode,
}) {
  const routeFilters = useMemo(() => createSearchFilters({
    dayOfWeek,
    latitude,
    longitude,
    province,
    radiusKm,
    searchMode,
  }), [dayOfWeek, latitude, longitude, province, radiusKm, searchMode])
  const [filters, setFilters] = useState(routeFilters)
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchMeta, setSearchMeta] = useState({
    appliedRadiusKm: null,
    mode: routeFilters.searchMode,
  })
  const [groupDetails, setGroupDetails] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [missingGroup, setMissingGroup] = useState(false)

  const activeGroupId = Number.isFinite(groupId) ? groupId : null
  const isDialogOpen = activeGroupId !== null

  useEffect(() => {
    setFilters(routeFilters)
  }, [routeFilters])

  async function loadMeetings(activeFilters) {
    setLoading(true)

    try {
      if (activeFilters.searchMode === MEETING_SEARCH_MODE.NEARBY) {
        const radiusSteps = buildNearbyRadiusSteps(activeFilters.radiusKm)
        let appliedRadiusKm = radiusSteps.at(-1) ?? activeFilters.radiusKm
        let summaries = []

        for (const candidateRadiusKm of radiusSteps) {
          const candidateSummaries = await publicMeetingApi.getMeetings({
            dayOfWeek: activeFilters.dayOfWeek,
            latitude: activeFilters.latitude,
            longitude: activeFilters.longitude,
            radiusKm: candidateRadiusKm,
          })

          summaries = candidateSummaries
          appliedRadiusKm = candidateRadiusKm

          if (candidateSummaries.length >= 20 || candidateRadiusKm >= 50) {
            break
          }
        }

        setMeetings(summaries)
        setSearchMeta({
          appliedRadiusKm,
          mode: MEETING_SEARCH_MODE.NEARBY,
        })
        if (activeFilters.radiusKm !== appliedRadiusKm) {
          setFilters((previous) => {
            if (
              previous.searchMode !== MEETING_SEARCH_MODE.NEARBY
              || previous.latitude !== activeFilters.latitude
              || previous.longitude !== activeFilters.longitude
            ) {
              return previous
            }

            return {
              ...previous,
              radiusKm: appliedRadiusKm,
            }
          })
        }
        return
      }

      const summaries = await publicMeetingApi.getMeetings({
        province: activeFilters.province || DEFAULT_PROVINCE,
        dayOfWeek: activeFilters.dayOfWeek,
      })

      setMeetings(summaries)
      setSearchMeta({
        appliedRadiusKm: null,
        mode: MEETING_SEARCH_MODE.REGION,
      })
    } catch (error) {
      setMeetings([])
      onError(error, '공개 모임 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadMeetingsEffect = useEffectEvent((activeFilters) => {
    void loadMeetings(activeFilters)
  })

  useEffect(() => {
    loadMeetingsEffect(routeFilters)
  }, [routeFilters])

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
      setGroupDetails(null)

      if (error instanceof ApiError && error.status === 404) {
        setMissingGroup(true)
        return
      }

      onError(error, '선택한 Group 정보를 불러오지 못했습니다.')
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
    if (!groupDetails) {
      return null
    }

    if (Number.isFinite(meetingId)) {
      const focusedMeeting = groupDetails.meetings.find((meeting) => meeting.id === meetingId)
      if (focusedMeeting) {
        return focusedMeeting
      }
    }

    return groupDetails.meetings[0] ?? null
  }, [groupDetails, meetingId])

  const activeFilters = useMemo(() => {
    if (routeFilters.searchMode !== MEETING_SEARCH_MODE.NEARBY) {
      return routeFilters
    }

    return {
      ...routeFilters,
      radiusKm: searchMeta.appliedRadiusKm ?? routeFilters.radiusKm,
    }
  }, [routeFilters, searchMeta.appliedRadiusKm])

  const closePath = useMemo(
    () => buildMeetingsPath(activeFilters),
    [activeFilters],
  )
  const selectedSearchMeetingId = selectedMeeting?.id ?? meetingId ?? null

  return {
    activeFilters,
    closePath,
    detailLoading,
    filters,
    groupDetails,
    isDialogOpen,
    loading,
    meetings,
    missingGroup,
    searchMeta,
    selectedMeeting,
    selectedSearchMeetingId,
    setFilters,
  }
}

import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import { ApiError } from '../../../../shared/lib/request'
import { publicGroupApi, publicMeetingApi } from '../../../../lib/api'
import { DEFAULT_PROVINCE, buildMeetingsPath } from '../utils'

export function useMeetingSearch({
  dayOfWeek,
  groupId,
  meetingId,
  onError,
  province,
}) {
  const [filters, setFilters] = useState({
    province: province || DEFAULT_PROVINCE,
    dayOfWeek: dayOfWeek || '',
  })
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(false)
  const [groupDetails, setGroupDetails] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [missingGroup, setMissingGroup] = useState(false)

  const activeGroupId = Number.isFinite(groupId) ? groupId : null
  const isDialogOpen = activeGroupId !== null

  useEffect(() => {
    setFilters({
      province: province || DEFAULT_PROVINCE,
      dayOfWeek: dayOfWeek || '',
    })
  }, [dayOfWeek, province])

  async function loadMeetings() {
    setLoading(true)

    try {
      const summaries = await publicMeetingApi.getMeetings({
        province: filters.province || DEFAULT_PROVINCE,
        dayOfWeek: filters.dayOfWeek,
      })

      setMeetings(summaries)
    } catch (error) {
      setMeetings([])
      onError(error, '공개 모임 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadMeetingsEffect = useEffectEvent(() => {
    void loadMeetings()
  })

  useEffect(() => {
    loadMeetingsEffect()
  }, [filters.dayOfWeek, filters.province])

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

  const closePath = useMemo(
    () => buildMeetingsPath({ dayOfWeek: filters.dayOfWeek, province: filters.province }),
    [filters.dayOfWeek, filters.province],
  )
  const selectedSearchMeetingId = selectedMeeting?.id ?? meetingId ?? null

  return {
    closePath,
    detailLoading,
    filters,
    groupDetails,
    isDialogOpen,
    loading,
    meetings,
    missingGroup,
    selectedMeeting,
    selectedSearchMeetingId,
    setFilters,
    loadMeetings,
  }
}

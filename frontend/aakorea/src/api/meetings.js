import { apiFetch } from './client'

export function fetchMeetings({ province, dayOfWeek, meetingType }) {
  const params = new URLSearchParams()

  if (province) params.set('province', province)
  if (dayOfWeek) params.set('dayOfWeek', dayOfWeek)
  if (meetingType) params.set('meetingType', meetingType)

  return apiFetch(`/api/meetings/search?${params.toString()}`)
}

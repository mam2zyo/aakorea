import { apiFetch } from './client'

export function fetchMeetings({ province, dayOfWeek }) {
  const params = new URLSearchParams()

  if (province) params.set('province', province)
  if (dayOfWeek) params.set('dayOfWeek', dayOfWeek)

  return apiFetch(`/api/meetings/search?${params.toString()}`)
}
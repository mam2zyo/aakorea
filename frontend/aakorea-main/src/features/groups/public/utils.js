import { PROVINCE_OPTIONS } from '../../../lib/options'

export const DEFAULT_PROVINCE = PROVINCE_OPTIONS[0]?.value ?? 'seoul'

export function buildMeetingsPath(filters, groupId = null, meetingId = null) {
  const searchParams = new URLSearchParams()

  if (filters.province) {
    searchParams.set('province', filters.province)
  }

  if (filters.dayOfWeek) {
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

export function hasGroupNotice(groupDetails) {
  return typeof groupDetails?.notice === 'string' && groupDetails.notice.trim()
}

export function readGroupNotice(groupDetails) {
  if (hasGroupNotice(groupDetails)) {
    return groupDetails.notice.trim()
  }

  return '등록된 그룹 공지가 없습니다.'
}

import { DAY_OF_WEEKS, PROVINCES } from './constants'

const provinceMap = Object.fromEntries(
  PROVINCES.map((item) => [item.value, item.label]),
)

const dayOfWeekMap = Object.fromEntries(
  DAY_OF_WEEKS.map((item) => [item.value, item.label]),
)

const meetingTypeMap = {
  OPEN: '공개',
  CLOSED: '비공개',
  MIX: '혼합',
}

const meetingStatusMap = {
  ACTIVE: '진행',
  SUSPENDED: '잠정중단',
}

const noticeTypeMap = {
  GENERAL: '일반',
  URGENT: '긴급',
}

export function formatProvince(value) {
  return provinceMap[value] || value || '-'
}

export function formatDayOfWeek(value) {
  return dayOfWeekMap[value] || value || '-'
}

export function formatMeetingType(value) {
  return meetingTypeMap[value] || value || '-'
}

export function formatMeetingStatus(value) {
  return meetingStatusMap[value] || value || '-'
}

export function formatNoticeType(value) {
  return noticeTypeMap[value] || value || value || '-'
}

export function formatTime(value) {
  if (!value) return '-'
  return String(value).slice(0, 5)
}

export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(date)
}

export function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

export function formatAddress(place) {
  if (!place) return '-'
  return [place.roadAddress, place.detailAddress].filter(Boolean).join(' ')
}
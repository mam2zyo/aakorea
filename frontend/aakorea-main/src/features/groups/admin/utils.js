import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '../../../lib/options'

const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export const GROUP_SORT_MODES = {
  district: '지역연합/이름순',
  name: '이름순',
}

export function sortGroups(groups, districts, sortMode) {
  return [...groups].sort((left, right) => {
    if (sortMode === 'name') {
      const nameCompare = textCollator.compare(left.name, right.name)
      if (nameCompare !== 0) {
        return nameCompare
      }
    }

    const districtCompare = textCollator.compare(
      districtNameFor(left.districtId, districts),
      districtNameFor(right.districtId, districts),
    )
    if (districtCompare !== 0) {
      return districtCompare
    }

    const nameCompare = textCollator.compare(left.name, right.name)
    if (nameCompare !== 0) {
      return nameCompare
    }

    return left.id - right.id
  })
}

export function districtNameFor(districtId, districts) {
  return districts.find((district) => district.id === districtId)?.name ?? `지역연합 #${districtId}`
}

export function createEmptyCreateForm() {
  return {
    phone: '',
    email: '',
    districtId: '',
    postalDetailAddress: '',
    postalCode: '',
    postalRecipient: '',
    postalRoadAddress: '',
    name: '',
    meetings: [],
  }
}

export function createEmptyCreateMeeting() {
  return {
    locationAddress: '',
    locationDetail: '',
    contactPhoneOverride: '',
    dayOfWeek: DAY_OF_WEEK_OPTIONS[0]?.value ?? 'MONDAY',
    startTime: '19:00',
    type: MEETING_TYPE_OPTIONS[0]?.value ?? 'OPEN',
  }
}

export function createClosedEditor() {
  return {
    open: false,
    source: 'local',
    groupId: null,
  }
}

export function toPostalContactPayload(form) {
  if (
    !form.postalRecipient &&
    !form.postalCode &&
    !form.postalRoadAddress &&
    !form.postalDetailAddress
  ) {
    return null
  }

  return {
    recipient: form.postalRecipient,
    postalCode: form.postalCode,
    roadAddress: form.postalRoadAddress,
    detailAddress: form.postalDetailAddress,
  }
}

export function hasCreateBasicsErrors(fieldErrors) {
  return Object.keys(fieldErrors).some((field) => [
    'districtId',
    'name',
    'phone',
    'email',
    'postalRecipient',
    'postalCode',
    'postalRoadAddress',
    'postalDetailAddress',
  ].includes(field))
}

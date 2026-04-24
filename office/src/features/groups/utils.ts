import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '@/shared/constants/options'
import type { CreateForm, EditorState, Group, District, PostalContactForm } from './types'

const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export const GROUP_SORT_MODES = {
  'name-asc': '이름 순',
  'name-desc': '이름 역순',
}

export type GroupSortMode = keyof typeof GROUP_SORT_MODES

export function sortGroups(groups: Group[], districts: District[], sortMode: GroupSortMode) {
  return [...groups].sort((left, right) => {
    const nameCompare = textCollator.compare(left.name, right.name)
    const factor = sortMode === 'name-desc' ? -1 : 1

    if (nameCompare !== 0) {
      return nameCompare * factor
    }

    // 이름이 같을 경우 지역연합순 (보조 정렬)
    const districtCompare = textCollator.compare(
      districtNameFor(left.districtId, districts),
      districtNameFor(right.districtId, districts),
    )
    if (districtCompare !== 0) {
      return districtCompare
    }

    return left.id - right.id
  })
}

export function districtNameFor(districtId: number, districts: District[]) {
  return districts.find((district) => district.id === districtId)?.name ?? `지역연합 #${districtId}`
}

export function createEmptyCreateForm(): CreateForm {
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

export function createClosedEditor(): EditorState {
  return {
    open: false,
    source: 'local',
    groupId: null,
  }
}

export function toPostalContactPayload(form: PostalContactForm) {
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

export function hasCreateBasicsErrors(fieldErrors: Record<string, string>) {
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

export function validateCreateBasics(form: CreateForm) {
  const errors: Record<string, string> = {}

  if (!form.name?.trim()) {
    errors.name = '그룹 이름을 입력해 주세요.'
  }

  if (!form.districtId) {
    errors.districtId = '지역연합을 선택해 주세요.'
  }

  if (!form.phone?.trim()) {
    errors.phone = '대표 연락처를 입력해 주세요.'
  }

  return errors
}

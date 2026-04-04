import { useEffect, useEffectEvent, useState } from 'react'
import { getApiFieldErrors, omitFieldErrors } from '../../../../lib/formErrors'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
} from '../../../../lib/options'
import {
  adminDistrictApi,
  adminGroupApi,
  adminMeetingApi,
} from '../../../../lib/api'

const EMPTY_GROUP_FORM = {
  districtId: '',
  name: '',
}

const EMPTY_CONTACT_FORM = {
  id: null,
  phone: '',
}

const EMPTY_MEETING_FORM = {
  id: null,
  province: PROVINCE_OPTIONS[0]?.value ?? 'seoul',
  locationName: '',
  locationAddress: '',
  dayOfWeek: DAY_OF_WEEK_OPTIONS[0]?.value ?? 'MONDAY',
  startTime: '19:00',
  type: MEETING_TYPE_OPTIONS[0]?.value ?? 'OPEN',
  active: true,
}

export function useGroupWorkspace({ groupId, onError, onGroupSaved, onSuccess }) {
  const numericGroupId = Number(groupId)

  const [districts, setDistricts] = useState([])
  const [groupData, setGroupData] = useState(null)
  const [groupContacts, setGroupContacts] = useState([])
  const [meetings, setMeetings] = useState([])
  const [groupForm, setGroupForm] = useState(EMPTY_GROUP_FORM)
  const [contactForm, setContactForm] = useState(EMPTY_CONTACT_FORM)
  const [meetingForm, setMeetingForm] = useState(EMPTY_MEETING_FORM)
  const [groupErrors, setGroupErrors] = useState({})
  const [contactErrors, setContactErrors] = useState({})
  const [meetingErrors, setMeetingErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [missingGroup, setMissingGroup] = useState(false)

  async function loadWorkspace() {
    if (!Number.isFinite(numericGroupId)) {
      setMissingGroup(true)
      return
    }

    setLoading(true)

    try {
      const [districtData, groups, contactData, meetingData] = await Promise.all([
        adminDistrictApi.getDistricts(),
        adminGroupApi.getGroups(),
        adminGroupApi.getGroupContacts(numericGroupId),
        adminMeetingApi.getMeetings({ groupId: numericGroupId }),
      ])

      const targetGroup = groups.find((item) => item.id === numericGroupId) ?? null

      setDistricts(districtData)
      setGroupContacts(contactData)
      setMeetings(meetingData)
      setGroupData(targetGroup)
      setMissingGroup(!targetGroup)

      if (targetGroup) {
        setGroupForm(toGroupForm(targetGroup))
      }

      setContactForm(contactData[0] ? toContactForm(contactData[0]) : EMPTY_CONTACT_FORM)
      setMeetingForm(meetingData[0] ? toMeetingForm(meetingData[0]) : EMPTY_MEETING_FORM)
    } catch (error) {
      onError(error, '그룹 편집 정보를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadWorkspaceEffect = useEffectEvent(() => {
    void loadWorkspace()
  })

  useEffect(() => {
    loadWorkspaceEffect()
  }, [numericGroupId])

  async function saveGroup() {
    if (!groupData) {
      return false
    }

    try {
      const updatedGroup = await adminGroupApi.updateGroup(groupData.id, {
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
      })

      onGroupSaved?.(updatedGroup)
      setGroupData(updatedGroup)
      setGroupForm(toGroupForm(updatedGroup))
      setGroupErrors({})
      onSuccess('그룹 기본 정보를 저장했습니다.')
      return true
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setGroupErrors(fieldErrors)
        return false
      }

      setGroupErrors({})
      onError(error, '그룹 기본 정보 저장에 실패했습니다.')
      return false
    }
  }

  async function saveContact() {
    try {
      const savedContact = contactForm.id
        ? await adminGroupApi.updateGroupContact(contactForm.id, {
          phone: contactForm.phone,
        })
        : await adminGroupApi.createGroupContact({
          groupId: numericGroupId,
          phone: contactForm.phone,
        })

      setContactErrors({})
      setContactForm(toContactForm(savedContact))
      setGroupContacts((previous) =>
        mergeById(previous, savedContact).sort((left, right) => left.id - right.id),
      )
      onSuccess(contactForm.id ? '연락처를 수정했습니다.' : '연락처를 추가했습니다.')
      return true
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setContactErrors(fieldErrors)
        return false
      }

      setContactErrors({})
      onError(error, '연락처 저장에 실패했습니다.')
      return false
    }
  }

  async function saveMeeting() {
    try {
      const payload = {
        groupId: numericGroupId,
        province: meetingForm.province,
        locationName: meetingForm.locationName,
        locationAddress: meetingForm.locationAddress,
        dayOfWeek: meetingForm.dayOfWeek,
        startTime: meetingForm.startTime,
        type: meetingForm.type,
        active: meetingForm.active,
      }

      const savedMeeting = meetingForm.id
        ? await adminMeetingApi.updateMeeting(meetingForm.id, payload)
        : await adminMeetingApi.createMeeting(payload)

      setMeetingErrors({})
      setMeetingForm(toMeetingForm(savedMeeting))
      setMeetings((previous) =>
        mergeById(previous, savedMeeting).sort((left, right) => left.id - right.id),
      )
      onSuccess(meetingForm.id ? '모임을 수정했습니다.' : '모임을 추가했습니다.')
      return true
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setMeetingErrors(fieldErrors)
        return false
      }

      setMeetingErrors({})
      onError(error, '모임 저장에 실패했습니다.')
      return false
    }
  }

  async function deleteMeeting(meetingId) {
    try {
      await adminMeetingApi.deleteMeeting(meetingId)
      const remainingMeetings = meetings.filter((meeting) => meeting.id !== meetingId)

      setMeetings(remainingMeetings)
      if (meetingForm.id === meetingId) {
        setMeetingForm(remainingMeetings[0] ? toMeetingForm(remainingMeetings[0]) : EMPTY_MEETING_FORM)
      }
      setMeetingErrors({})
      onSuccess('모임을 삭제했습니다.')
      return true
    } catch (error) {
      onError(error, '모임 삭제에 실패했습니다.')
      return false
    }
  }

  function startNewContact() {
    setContactForm(EMPTY_CONTACT_FORM)
    setContactErrors({})
  }

  function startEditContact(contact) {
    setContactForm({
      id: contact.id,
      phone: contact.phone,
    })
    setContactErrors({})
  }

  function startNewMeeting() {
    const sourceMeeting = hasMeetingLocation(meetingForm)
      ? meetingForm
      : meetings[0] ?? { province: meetingForm.province }

    setMeetingForm(createMeetingFormDefaults(sourceMeeting))
    setMeetingErrors({})
  }

  function startEditMeeting(meeting) {
    setMeetingForm({
      id: meeting.id,
      province: meeting.province,
      locationName: meeting.locationName ?? '',
      locationAddress: meeting.locationAddress ?? '',
      dayOfWeek: meeting.dayOfWeek,
      startTime: meeting.startTime,
      type: meeting.type,
      active: meeting.active,
    })
    setMeetingErrors({})
  }

  function updateGroupField(field, value) {
    setGroupForm((previous) => ({
      ...previous,
      [field]: value,
    }))
    setGroupErrors((previous) => omitFieldErrors(previous, field))
  }

  function updateContactField(field, value) {
    setContactForm((previous) => ({
      ...previous,
      [field]: value,
    }))
    setContactErrors((previous) => omitFieldErrors(previous, field))
  }

  function updateMeetingField(field, value) {
    setMeetingForm((previous) => ({
      ...previous,
      [field]: value,
    }))
    setMeetingErrors((previous) => omitFieldErrors(previous, field))
  }

  function updateMeetingActive(active) {
    setMeetingForm((previous) => ({
      ...previous,
      active,
    }))
  }

  function resetGroupForm() {
    if (groupData) {
      setGroupForm(toGroupForm(groupData))
    }
    setGroupErrors({})
  }

  function districtLabel(districtId) {
    return districts.find((district) => district.id === districtId)?.name ?? null
  }

  return {
    districts,
    groupData,
    groupContacts,
    meetings,
    groupForm,
    contactForm,
    meetingForm,
    groupErrors,
    contactErrors,
    meetingErrors,
    loading,
    missingGroup,
    saveGroup,
    saveContact,
    saveMeeting,
    deleteMeeting,
    startNewContact,
    startEditContact,
    startNewMeeting,
    startEditMeeting,
    updateGroupField,
    updateContactField,
    updateMeetingField,
    updateMeetingActive,
    resetGroupForm,
    districtLabel,
  }
}

function toGroupForm(group) {
  return {
    districtId: String(group.districtId),
    name: group.name ?? '',
  }
}

function toContactForm(contact) {
  return {
    id: contact.id,
    phone: contact.phone ?? '',
  }
}

function toMeetingForm(meeting) {
  return {
    id: meeting.id,
    province: meeting.province ?? EMPTY_MEETING_FORM.province,
    locationName: meeting.locationName ?? '',
    locationAddress: meeting.locationAddress ?? '',
    dayOfWeek: meeting.dayOfWeek ?? EMPTY_MEETING_FORM.dayOfWeek,
    startTime: meeting.startTime ?? EMPTY_MEETING_FORM.startTime,
    type: meeting.type ?? EMPTY_MEETING_FORM.type,
    active: meeting.active ?? EMPTY_MEETING_FORM.active,
  }
}

function createMeetingFormDefaults(source = {}) {
  return {
    ...EMPTY_MEETING_FORM,
    province: source.province ?? EMPTY_MEETING_FORM.province,
    locationName: source.locationName ?? '',
    locationAddress: source.locationAddress ?? '',
  }
}

function hasMeetingLocation(meeting) {
  return Boolean(meeting.locationName || meeting.locationAddress)
}

function mergeById(items, savedItem) {
  const existingIndex = items.findIndex((item) => item.id === savedItem.id)
  if (existingIndex === -1) {
    return [...items, savedItem]
  }

  const nextItems = [...items]
  nextItems[existingIndex] = savedItem
  return nextItems
}

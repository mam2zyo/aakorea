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
  locationName: '',
  locationAddress: '',
  introduction: '',
  notice: '',
  changeSummary: '',
}

const EMPTY_CONTACT_FORM = {
  id: null,
  phone: '',
}

const EMPTY_MEETING_FORM = {
  id: null,
  province: PROVINCE_OPTIONS[0]?.value ?? 'seoul',
  dayOfWeek: DAY_OF_WEEK_OPTIONS[0]?.value ?? 'MONDAY',
  startTime: '19:00',
  type: MEETING_TYPE_OPTIONS[0]?.value ?? 'OPEN',
  meetingPlaceNote: '',
  active: true,
}

export function useGroupWorkspace({ groupId, onError, onSuccess }) {
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
    } catch (error) {
      onError(error, 'Group 작업공간을 불러오지 못했습니다.')
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
      return
    }

    try {
      const updatedGroup = await adminGroupApi.updateGroup(groupData.id, {
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
        locationName: groupForm.locationName,
        locationAddress: groupForm.locationAddress,
        introduction: groupForm.introduction,
        notice: groupForm.notice,
        changeSummary: groupForm.changeSummary,
      })

      setGroupData(updatedGroup)
      setGroupForm(toGroupForm(updatedGroup))
      setGroupErrors({})
      onSuccess('Group 기본 정보를 저장했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setGroupErrors(fieldErrors)
        return
      }

      setGroupErrors({})
      onError(error, 'Group 기본 정보 저장에 실패했습니다.')
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
      setContactForm(EMPTY_CONTACT_FORM)
      setGroupContacts((previous) =>
        mergeById(previous, savedContact).sort((left, right) => left.id - right.id),
      )
      onSuccess(contactForm.id ? '연락처를 수정했습니다.' : '연락처를 추가했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setContactErrors(fieldErrors)
        return
      }

      setContactErrors({})
      onError(error, '연락처 저장에 실패했습니다.')
    }
  }

  async function saveMeeting() {
    try {
      const payload = {
        groupId: numericGroupId,
        province: meetingForm.province,
        dayOfWeek: meetingForm.dayOfWeek,
        startTime: meetingForm.startTime,
        type: meetingForm.type,
        meetingPlaceNote: meetingForm.meetingPlaceNote,
        active: meetingForm.active,
      }

      const savedMeeting = meetingForm.id
        ? await adminMeetingApi.updateMeeting(meetingForm.id, payload)
        : await adminMeetingApi.createMeeting(payload)

      setMeetingErrors({})
      setMeetingForm({
        ...EMPTY_MEETING_FORM,
        province: meetingForm.province,
      })
      setMeetings((previous) =>
        mergeById(previous, savedMeeting).sort((left, right) => left.id - right.id),
      )
      onSuccess(meetingForm.id ? '모임을 수정했습니다.' : '모임을 추가했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setMeetingErrors(fieldErrors)
        return
      }

      setMeetingErrors({})
      onError(error, '모임 저장에 실패했습니다.')
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
    setMeetingForm({
      ...EMPTY_MEETING_FORM,
      province: meetingForm.province,
    })
    setMeetingErrors({})
  }

  function startEditMeeting(meeting) {
    setMeetingForm({
      id: meeting.id,
      province: meeting.province,
      dayOfWeek: meeting.dayOfWeek,
      startTime: meeting.startTime,
      type: meeting.type,
      meetingPlaceNote: meeting.meetingPlaceNote ?? '',
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
    startNewContact,
    startEditContact,
    startNewMeeting,
    startEditMeeting,
    updateGroupField,
    updateContactField,
    updateMeetingField,
    updateMeetingActive,
    districtLabel,
  }
}

function toGroupForm(group) {
  return {
    districtId: String(group.districtId),
    name: group.name ?? '',
    locationName: group.locationName ?? '',
    locationAddress: group.locationAddress ?? '',
    introduction: group.introduction ?? '',
    notice: group.notice ?? '',
    changeSummary: group.changeSummary ?? '',
  }
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

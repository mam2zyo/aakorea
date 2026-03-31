import { useEffect, useEffectEvent, useState } from 'react'
import {
  EntityList,
  Field,
  PageIntro,
  PageSection,
  SectionHeader,
  StatCard,
  StatusPill,
  ToggleField,
  EmptyState,
} from '../../components/ui'
import { adminMeetingApi, adminOrgApi } from '../../lib/api'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
} from '../../lib/options'
import { ensureSelectValue, lookupLabel } from '../../lib/view'

const EMPTY_GROUP_FORM = { districtId: '', name: '' }
const EMPTY_CONTACT_FORM = { id: null, phone: '' }
const EMPTY_MEETING_FORM = {
  id: null,
  province: 'seoul',
  dayOfWeek: 'MONDAY',
  startTime: '19:30',
  type: 'OPEN',
  locationName: '',
  locationAddress: '',
  active: true,
}

export function GroupEditorPage({ groupId, onError, onNavigate, onSuccess }) {
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

  async function loadGroupWorkspace() {
    setLoading(true)

    try {
      const [districtData, groupDataList, groupContactData, meetingData] =
        await Promise.all([
          adminOrgApi.getDistricts(),
          adminOrgApi.getGroups(),
          adminOrgApi.getGroupContacts({ groupId }),
          adminMeetingApi.getMeetings({ groupId }),
        ])

      const currentGroup = groupDataList.find((group) => group.id === groupId)

      setDistricts(districtData)
      setGroupContacts(groupContactData)
      setMeetings(meetingData)

      if (!currentGroup) {
        setMissingGroup(true)
        setGroupData(null)
        return
      }

      setMissingGroup(false)
      setGroupData(currentGroup)
      setGroupErrors({})
      setContactErrors({})
      setMeetingErrors({})
      setGroupForm({
        districtId: String(currentGroup.districtId),
        name: currentGroup.name,
      })
    } catch (error) {
      onError(error, 'Group 작업공간을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadGroupWorkspaceEffect = useEffectEvent(() => {
    void loadGroupWorkspace()
  })

  useEffect(() => {
    loadGroupWorkspaceEffect()
  }, [groupId])

  useEffect(() => {
    setGroupForm((previous) => ensureSelectValue(previous, 'districtId', districts))
  }, [districts])

  if (missingGroup) {
    return (
      <PageSection
        label="Group Editor"
        title="요청한 Group을 찾지 못했습니다."
        description="목록에서 다시 Group을 선택해 주세요."
      >
        <EmptyState
          title="Group 데이터가 없습니다."
          description="Group 목록 화면으로 돌아가 다시 선택해 주세요."
        />
        <div className="button-row">
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate('/admin/groups')}
          >
            Group 목록으로 이동
          </button>
        </div>
      </PageSection>
    )
  }

  return (
    <>
      <PageIntro
        eyebrow="Group Workspace"
        title={groupData ? `${groupData.name} 작업공간` : 'Group 작업공간'}
        description="Group 기본 정보, 연락처, 모임 정보를 한 화면에서 이어서 수정합니다. 실제 운영 입력 단위가 Group에 모이도록 구성했습니다."
        actions={
          <button
            className="ghost-button"
            type="button"
            onClick={() => onNavigate('/admin/groups')}
          >
            Group 목록으로 돌아가기
          </button>
        }
        aside={
          <div className="stats-grid stats-grid--compact">
            <StatCard
              label="소속 District"
              value={
                districtDataLabel(districts, groupData?.districtId) ??
                (groupData ? `#${groupData.districtId}` : '-')
              }
            />
            <StatCard label="연락처" value={groupContacts.length} />
            <StatCard label="모임" value={meetings.length} />
          </div>
        }
      />

      <PageSection
        label="Group Editor"
        title="Group 중심으로 공개 운영 정보를 관리합니다."
        description="GroupContact와 Meeting은 모두 Group에 종속된 정보이므로 최상위 별도 화면보다 여기서 함께 다루는 것이 자연스럽습니다."
      >
        {loading ? <div className="section-note">Group 작업공간을 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
          <section className="editor-card">
            <SectionHeader title="Group 기본 정보" />

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveGroup()
              }}
            >
              <Field
                label="District"
                error={readFieldError(groupErrors, 'districtId')}
              >
                <select
                  value={groupForm.districtId}
                  onChange={(event) => {
                    setGroupForm((previous) => ({
                      ...previous,
                      districtId: event.target.value,
                    }))
                    setGroupErrors((previous) =>
                      omitFieldErrors(previous, 'districtId'),
                    )
                  }}
                >
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Group 이름" error={readFieldError(groupErrors, 'name')}>
                <input
                  value={groupForm.name}
                  onChange={(event) => {
                    setGroupForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                    setGroupErrors((previous) => omitFieldErrors(previous, 'name'))
                  }}
                />
              </Field>

              <div className="button-row button-row--compact">
                <button className="primary-button" type="submit">
                  Group 저장
                </button>
              </div>
            </form>
          </section>

          <section className="editor-card">
            <SectionHeader
              title="GroupContact"
              actionLabel="새 연락처"
              onAction={() => {
                setContactForm(EMPTY_CONTACT_FORM)
                setContactErrors({})
              }}
            />

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveContact()
              }}
            >
              <Field label="전화번호" error={readFieldError(contactErrors, 'phone')}>
                <input
                  placeholder="02-1234-5678"
                  value={contactForm.phone}
                  onChange={(event) => {
                    setContactForm((previous) => ({
                      ...previous,
                      phone: event.target.value,
                    }))
                    setContactErrors((previous) => omitFieldErrors(previous, 'phone'))
                  }}
                />
              </Field>

              <div className="button-row button-row--compact">
                <button className="primary-button" type="submit">
                  {contactForm.id ? '연락처 수정' : '연락처 생성'}
                </button>
              </div>
            </form>

            <EntityList
              emptyTitle="연락처가 없습니다."
              emptyDescription="공개 상세에서 전화번호가 보이려면 GroupContact가 필요합니다."
              items={groupContacts}
              onAction={(contact) =>
                {
                  setContactForm({
                    id: contact.id,
                    phone: contact.phone,
                  })
                  setContactErrors({})
                }
              }
              renderItem={(contact) => (
                <div className="entity-item__body">
                  <strong>{contact.phone}</strong>
                  <span className="entity-item__meta">현재 Group에 연결된 연락처</span>
                </div>
              )}
            />
          </section>

          <section className="editor-card editor-card--wide">
            <SectionHeader
              title="Meeting"
              actionLabel="새 모임"
              onAction={() => {
                setMeetingForm(EMPTY_MEETING_FORM)
                setMeetingErrors({})
              }}
            />

            <form
              className="field-grid field-grid--meeting"
              onSubmit={(event) => {
                event.preventDefault()
                void saveMeeting()
              }}
            >
              <Field
                label="Province"
                error={readFieldError(meetingErrors, 'province')}
              >
                <select
                  value={meetingForm.province}
                  onChange={(event) => {
                    setMeetingForm((previous) => ({
                      ...previous,
                      province: event.target.value,
                    }))
                    setMeetingErrors((previous) =>
                      omitFieldErrors(previous, 'province'),
                    )
                  }}
                >
                  {PROVINCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="요일"
                error={readFieldError(meetingErrors, 'dayOfWeek')}
              >
                <select
                  value={meetingForm.dayOfWeek}
                  onChange={(event) => {
                    setMeetingForm((previous) => ({
                      ...previous,
                      dayOfWeek: event.target.value,
                    }))
                    setMeetingErrors((previous) =>
                      omitFieldErrors(previous, 'dayOfWeek'),
                    )
                  }}
                >
                  {DAY_OF_WEEK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="시작 시각"
                error={readFieldError(meetingErrors, 'startTime')}
              >
                <input
                  placeholder="19:30"
                  value={meetingForm.startTime}
                  onChange={(event) => {
                    setMeetingForm((previous) => ({
                      ...previous,
                      startTime: event.target.value,
                    }))
                    setMeetingErrors((previous) =>
                      omitFieldErrors(previous, 'startTime'),
                    )
                  }}
                />
              </Field>

              <Field
                label="공개 유형"
                error={readFieldError(meetingErrors, 'type')}
              >
                <select
                  value={meetingForm.type}
                  onChange={(event) => {
                    setMeetingForm((previous) => ({
                      ...previous,
                      type: event.target.value,
                    }))
                    setMeetingErrors((previous) => omitFieldErrors(previous, 'type'))
                  }}
                >
                  {MEETING_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="장소명"
                error={readFieldError(meetingErrors, 'location.name')}
              >
                <input
                  value={meetingForm.locationName}
                  onChange={(event) => {
                    setMeetingForm((previous) => ({
                      ...previous,
                      locationName: event.target.value,
                    }))
                    setMeetingErrors((previous) =>
                      omitFieldErrors(previous, 'location.name'),
                    )
                  }}
                />
              </Field>

              <Field
                label="주소"
                error={readFieldError(meetingErrors, 'location.address')}
              >
                <input
                  value={meetingForm.locationAddress}
                  onChange={(event) => {
                    setMeetingForm((previous) => ({
                      ...previous,
                      locationAddress: event.target.value,
                    }))
                    setMeetingErrors((previous) =>
                      omitFieldErrors(previous, 'location.address'),
                    )
                  }}
                />
              </Field>

              <ToggleField
                checked={meetingForm.active}
                label="활성 상태로 저장"
                onChange={(event) =>
                  setMeetingForm((previous) => ({
                    ...previous,
                    active: event.target.checked,
                  }))
                }
              />

              <div className="button-row button-row--compact">
                <button className="primary-button" type="submit">
                  {meetingForm.id ? '모임 수정' : '모임 생성'}
                </button>
              </div>
            </form>

            <EntityList
              emptyTitle="Meeting이 없습니다."
              emptyDescription="공개 모임 조회에 노출할 모임을 현재 Group에 연결해 주세요."
              items={meetings}
              onAction={(meeting) =>
                {
                  setMeetingForm({
                    id: meeting.id,
                    province: meeting.province,
                    dayOfWeek: meeting.dayOfWeek,
                    startTime: meeting.startTime,
                    type: meeting.type,
                    locationName: meeting.location.name,
                    locationAddress: meeting.location.address,
                    active: meeting.active,
                  })
                  setMeetingErrors({})
                }
              }
              renderItem={(meeting) => (
                <div className="entity-item__body">
                  <strong>
                    {lookupLabel(PROVINCE_OPTIONS, meeting.province)} /{' '}
                    {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)}
                  </strong>
                  <span className="entity-item__meta">
                    {meeting.startTime} · {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                  </span>
                  <span className="entity-item__meta">{meeting.location.name}</span>
                  <StatusPill active={meeting.active} />
                </div>
              )}
            />
          </section>
        </div>
      </PageSection>
    </>
  )

  async function saveGroup() {
    try {
      await adminOrgApi.updateGroup(groupId, {
        districtId: Number(groupForm.districtId),
        name: groupForm.name,
      })
      setGroupErrors({})
      onSuccess('Group 기본 정보를 저장했습니다.')
      await loadGroupWorkspace()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setGroupErrors(fieldErrors)
        return
      }

      setGroupErrors({})
      onError(error, 'Group 저장에 실패했습니다.')
    }
  }

  async function saveContact() {
    try {
      if (contactForm.id) {
        await adminOrgApi.updateGroupContact(contactForm.id, {
          phone: contactForm.phone,
        })
        onSuccess('GroupContact를 수정했습니다.')
      } else {
        await adminOrgApi.createGroupContact({
          groupId,
          phone: contactForm.phone,
        })
        onSuccess('GroupContact를 생성했습니다.')
      }

      setContactErrors({})
      setContactForm(EMPTY_CONTACT_FORM)
      await loadGroupWorkspace()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setContactErrors(fieldErrors)
        return
      }

      setContactErrors({})
      onError(error, 'GroupContact 저장에 실패했습니다.')
    }
  }

  async function saveMeeting() {
    const payload = {
      groupId,
      province: meetingForm.province,
      dayOfWeek: meetingForm.dayOfWeek,
      startTime: meetingForm.startTime,
      type: meetingForm.type,
      location: {
        name: meetingForm.locationName,
        address: meetingForm.locationAddress,
      },
      active: meetingForm.active,
    }

    try {
      if (meetingForm.id) {
        await adminMeetingApi.updateMeeting(meetingForm.id, payload)
        onSuccess('Meeting을 수정했습니다.')
      } else {
        await adminMeetingApi.createMeeting(payload)
        onSuccess('Meeting을 생성했습니다.')
      }

      setMeetingErrors({})
      setMeetingForm(EMPTY_MEETING_FORM)
      await loadGroupWorkspace()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setMeetingErrors(fieldErrors)
        return
      }

      setMeetingErrors({})
      onError(error, 'Meeting 저장에 실패했습니다.')
    }
  }

  function districtDataLabel(items, districtIdValue) {
    return items.find((district) => district.id === districtIdValue)?.name ?? null
  }
}

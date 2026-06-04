import { useMemo, useState } from 'react'
import { EmptyState } from '@/shared/components/ui'
import { formatPostalContact } from '@/shared/utils/address'
import {
  DAY_OF_WEEK_OPTIONS,
} from '@/shared/constants/options'
import { lookupLabel } from '@/shared/utils'
import { useGroupEditor } from '@/features/groups/hooks/useGroupEditor'
import { GroupBasicsModal } from './GroupBasicsModal'
import { GroupContactModal } from './GroupContactModal'
import { GroupMeetingFormModal } from './GroupMeetingFormModal'

export function EditGroupSheet({
  group,
  onError,
  onGroupSaved,
  onClose,
  onSuccess,
  sortedDistricts,
}) {
  const {
    groupContacts,
    meetings,
    groupForm,
    contactForm,
    meetingForm,
    groupErrors,
    contactErrors,
    meetingErrors,
    loading,
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
  } = useGroupEditor({
    group,
    onError,
    onGroupSaved,
    onSuccess,
  })
  const [editingMeetingId, setEditingMeetingId] = useState(null)
  const [showGroupEditModal, setShowGroupEditModal] = useState(false)
  const [showContactEditModal, setShowContactEditModal] = useState(false)
  const [showMeetingEditModal, setShowMeetingEditModal] = useState(false)
  const [showCreateMeetingModal, setShowCreateMeetingModal] = useState(false)
  const [returnMeeting, setReturnMeeting] = useState(null)
  const selectedContact = groupContacts[0] ?? null
  const districtName = useMemo(
    () => sortedDistricts.find((district) => district.id === Number(groupForm.districtId))?.name || '-',
    [groupForm.districtId, sortedDistricts],
  )

  if (!group) {
    return (
      <EmptyState
        title="요청한 그룹을 찾지 못했습니다."
        description="목록에서 다시 그룹을 선택해 주세요."
      />
    )
  }

  return (
    <section className="office-group-edit-sheet">
      {loading ? <div className="section-note">그룹 정보를 불러오는 중입니다...</div> : null}

      <header className="office-group-edit-sheet__header">
        <h2 className="office-group-edit-sheet__title">{group.name || '그룹 수정'}</h2>

        <div className="office-group-edit-sheet__header-actions">
          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={() => void handleApplyAndClose()}
          >
            적용하고 닫기
          </button>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </header>

      <section className="office-group-edit-sheet__section">
        <div className="office-group-edit-sheet__section-head">
          <h3>기본 정보</h3>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={openGroupEditModal}
          >
            수정
          </button>
        </div>

        <div className="office-group-edit-sheet__rows">
          <div className="office-group-edit-sheet__rowline">
            <span className="office-group-edit-sheet__rowlabel">그룹 이름</span>
            <div className="office-group-edit-sheet__rowcontrol">
              <span className="office-group-edit-sheet__rowvalue">{groupForm.name || '-'}</span>
            </div>
          </div>

          <div className="office-group-edit-sheet__rowline">
            <span className="office-group-edit-sheet__rowlabel">지역연합</span>
            <div className="office-group-edit-sheet__rowcontrol">
              <span className="office-group-edit-sheet__rowvalue">{districtName}</span>
            </div>
          </div>

          <div className="office-group-edit-sheet__rowline">
            <span className="office-group-edit-sheet__rowlabel">그룹 공지</span>
            <div className="office-group-edit-sheet__rowcontrol office-group-edit-sheet__rowcontrol--wide">
              <span className="office-group-edit-sheet__rowvalue">{groupForm.notice || '-'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="office-group-edit-sheet__section">
        <div className="office-group-edit-sheet__section-head">
          <h3>연락처</h3>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={openContactEditModal}
          >
            수정
          </button>
        </div>

        <div className="office-group-edit-sheet__rows">
          <div className="office-group-edit-sheet__rowline">
            <span className="office-group-edit-sheet__rowlabel">전화번호</span>
            <div className="office-group-edit-sheet__rowcontrol">
              <span className="office-group-edit-sheet__rowvalue">{contactForm.phone || '-'}</span>
            </div>
          </div>

          <div className="office-group-edit-sheet__rowline">
            <span className="office-group-edit-sheet__rowlabel">이메일</span>
            <div className="office-group-edit-sheet__rowcontrol">
              <span className="office-group-edit-sheet__rowvalue">{selectedContact?.email || '-'}</span>
            </div>
          </div>

          <div className="office-group-edit-sheet__rowline">
            <span className="office-group-edit-sheet__rowlabel">우편수신주소</span>
            <div className="office-group-edit-sheet__rowcontrol office-group-edit-sheet__rowcontrol--wide">
              <span className="office-group-edit-sheet__rowvalue">{formatPostalContact(selectedContact?.postalContact)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="office-group-edit-sheet__section office-group-edit-sheet__section--meetings">
        <div className="office-group-edit-sheet__section-head">
          <h3>모임 정보</h3>

          <div className="office-group-edit-sheet__section-actions">
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={openCreateMeetingModal}
            >
              새 모임 추가
            </button>
          </div>
        </div>

        {meetings.length > 0 ? (
          <div className="office-group-edit-sheet__meeting-list">
            {meetings.map((meeting) => (
              <article key={meeting.id} className="office-group-edit-sheet__meeting-item">
                <div className="office-group-edit-sheet__meeting-summary">
                  <strong>
                    {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                  </strong>
                  <span>{meeting.locationDetail || '상세 위치 미입력'}</span>
                </div>

                <div className="office-group-edit-sheet__meeting-meta-actions">
                  <button
                    className="ghost-button ghost-button--small"
                    type="button"
                    onClick={() => openMeetingEditModal(meeting)}
                  >
                    수정
                  </button>
                  <button
                    className="ghost-button ghost-button--danger ghost-button--small"
                    type="button"
                    onClick={() => void handleDeleteMeeting(meeting)}
                  >
                    삭제
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {meetings.length === 0 ? (
          <div className="section-note">등록된 모임이 없습니다. `새 모임 추가`로 첫 모임을 등록해 주세요.</div>
        ) : null}
      </section>

      {showGroupEditModal ? (
        <GroupBasicsModal
          errors={groupErrors}
          form={groupForm}
          sortedDistricts={sortedDistricts}
          onCancel={handleCancelGroupEdit}
          onFieldChange={updateGroupField}
          onSubmit={handleSaveGroup}
        />
      ) : null}

      {showContactEditModal ? (
        <GroupContactModal
          errors={contactErrors}
          form={contactForm}
          onCancel={handleCancelContactEdit}
          onFieldChange={updateContactField}
          onSubmit={handleSaveContact}
        />
      ) : null}

      {showCreateMeetingModal ? (
        <GroupMeetingFormModal
          errors={meetingErrors}
          form={meetingForm}
          onCancel={handleCancelCreateMeeting}
          onFieldChange={updateMeetingField}
          onSubmit={handleCreateMeeting}
          submitLabel="추가"
          title="새 모임 추가"
        />
      ) : null}

      {showMeetingEditModal ? (
        <GroupMeetingFormModal
          errors={meetingErrors}
          form={meetingForm}
          onCancel={handleCancelMeetingEdit}
          onFieldChange={updateMeetingField}
          onSubmit={handleSaveMeeting}
          onToggleActive={() => updateMeetingActive(!meetingForm.active)}
          showActiveToggle
          submitLabel="저장"
          title="모임 수정"
        />
      ) : null}
    </section>
  )

  function openGroupEditModal() {
    resetGroupForm()
    setShowGroupEditModal(true)
  }

  function openContactEditModal() {
    if (selectedContact) {
      startEditContact(selectedContact)
    } else {
      startNewContact()
    }
    setShowContactEditModal(true)
  }

  async function handleSaveGroup() {
    const success = await saveGroup()
    if (success) {
      setShowGroupEditModal(false)
    }
  }

  function handleCancelGroupEdit() {
    resetGroupForm()
    setShowGroupEditModal(false)
  }

  async function handleSaveContact() {
    const success = await saveContact()
    if (success) {
      setShowContactEditModal(false)
    }
  }

  function handleCancelContactEdit() {
    setShowContactEditModal(false)
  }

  async function handleSaveMeeting() {
    const success = await saveMeeting()
    if (success) {
      setShowMeetingEditModal(false)
      setEditingMeetingId(null)
    }
  }

  function handleCancelMeetingEdit() {
    if (editingMeetingId) {
      const targetMeeting = meetings.find((meeting) => meeting.id === editingMeetingId)
      if (targetMeeting) {
        startEditMeeting(targetMeeting)
      }
    }
    setShowMeetingEditModal(false)
    setEditingMeetingId(null)
  }

  function openCreateMeetingModal() {
    const activeMeeting = editingMeetingId
      ? meetings.find((meeting) => meeting.id === editingMeetingId) ?? null
      : null

    setReturnMeeting(activeMeeting)
    startNewMeeting()
    setShowCreateMeetingModal(true)
    setEditingMeetingId(null)
  }

  async function handleCreateMeeting() {
    const success = await saveMeeting()
    if (!success) {
      return
    }

    setShowCreateMeetingModal(false)
    setReturnMeeting(null)
  }

  function handleCancelCreateMeeting() {
    if (returnMeeting) {
      startEditMeeting(returnMeeting)
      setEditingMeetingId(returnMeeting.id)
    }
    setShowCreateMeetingModal(false)
    setReturnMeeting(null)
  }

  function openMeetingEditModal(meeting) {
    startEditMeeting(meeting)
    setEditingMeetingId(meeting.id)
    setShowMeetingEditModal(true)
  }

  async function handleDeleteMeeting(meeting) {
    const meetingLabel = `${lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} ${meeting.startTime}`
    const locationLabel = meeting.locationDetail || '상세 위치 미입력'
    const confirmed = window.confirm(`"${meetingLabel} · ${locationLabel}" 모임을 삭제하시겠습니까?`)

    if (!confirmed) {
      return
    }

    const success = await deleteMeeting(meeting.id)
    if (!success) {
      return
    }

    if (editingMeetingId === meeting.id) {
      setShowMeetingEditModal(false)
      setEditingMeetingId(null)
    }

    if (returnMeeting?.id === meeting.id) {
      setReturnMeeting(null)
    }
  }

  async function handleApplyAndClose() {
    let success = true

    if (showGroupEditModal) {
      success = await saveGroup()
      if (success) {
        setShowGroupEditModal(false)
      }
    } else if (showContactEditModal) {
      success = await saveContact()
      if (success) {
        setShowContactEditModal(false)
      }
    } else if (showMeetingEditModal) {
      success = await saveMeeting()
      if (success) {
        setShowMeetingEditModal(false)
        setEditingMeetingId(null)
      }
    }

    if (success) {
      onClose()
    }
  }
}

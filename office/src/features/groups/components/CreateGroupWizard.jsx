import { useState } from 'react'
import { AddressSearchField } from '@/components/AddressSearchField'
import { Field } from '@/components/ui'
import { omitFieldErrors, readFieldError } from '@/api'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '@/constants/options'
import { normalizePhoneFieldValue } from '@/utils/phone'
import { lookupLabel } from '@/utils'
import { createEmptyCreateMeeting } from '../utils'
import { GroupMeetingFormModal } from './GroupMeetingFormModal'

export function CreateGroupWizard({
  createErrors,
  createForm,
  createStep,
  saving,
  sortedDistricts,
  onFieldChange,
  onNext,
  onPrevious,
  onResetPostalContactInfo,
  onSubmit,
}) {
  const [meetingDraft, setMeetingDraft] = useState(() => createEmptyCreateMeeting())
  const [meetingDraftErrors, setMeetingDraftErrors] = useState({})
  const [editingMeetingIndex, setEditingMeetingIndex] = useState(null)
  const [showMeetingModal, setShowMeetingModal] = useState(false)
  const hasPostalContactInfo = Boolean(
    createForm.postalRecipient ||
      createForm.postalRoadAddress ||
      createForm.postalCode ||
      createForm.postalDetailAddress,
  )
  const meetings = createForm.meetings ?? []
  const meetingListError = readFieldError(createErrors, 'meetings')
  const isEditingMeeting = Number.isInteger(editingMeetingIndex)

  function openNewMeetingModal() {
    const previousMeeting = meetings[meetings.length - 1]
    setMeetingDraft(createNextMeetingDraft(previousMeeting))
    setMeetingDraftErrors({})
    setEditingMeetingIndex(null)
    setShowMeetingModal(true)
  }

  function openEditMeetingModal(index) {
    const targetMeeting = meetings[index]
    if (!targetMeeting) {
      return
    }

    setMeetingDraft({ ...createEmptyCreateMeeting(), ...targetMeeting })
    setMeetingDraftErrors({})
    setEditingMeetingIndex(index)
    setShowMeetingModal(true)
  }

  function closeMeetingModal() {
    setMeetingDraft(createEmptyCreateMeeting())
    setMeetingDraftErrors({})
    setEditingMeetingIndex(null)
    setShowMeetingModal(false)
  }

  function updateMeetingDraftField(field, value) {
    const nextValue = normalizePhoneFieldValue(field, value)

    setMeetingDraft((previous) => ({
      ...previous,
      [field]: nextValue,
    }))
    setMeetingDraftErrors((previous) => omitFieldErrors(previous, field))
  }

  function saveMeetingDraft() {
    const normalizedMeeting = normalizeMeetingDraft(meetingDraft)
    const nextErrors = validateMeetingDraft(normalizedMeeting)

    if (Object.keys(nextErrors).length > 0) {
      setMeetingDraftErrors(nextErrors)
      return
    }

    const nextMeetings = isEditingMeeting
      ? meetings.map((meeting, index) => (index === editingMeetingIndex ? normalizedMeeting : meeting))
      : [...meetings, normalizedMeeting]

    onFieldChange('meetings', nextMeetings)
    closeMeetingModal()
  }

  function deleteMeeting(index) {
    const targetMeeting = meetings[index]
    if (!targetMeeting) {
      return
    }

    const meetingLabel = `${lookupLabel(DAY_OF_WEEK_OPTIONS, targetMeeting.dayOfWeek)} ${targetMeeting.startTime}`
    const locationLabel = targetMeeting.locationDetail || '상세 위치 미입력'
    const confirmed = window.confirm(`"${meetingLabel} · ${locationLabel}" 모임을 삭제하시겠습니까?`)

    if (!confirmed) {
      return
    }

    onFieldChange(
      'meetings',
      meetings.filter((_, meetingIndex) => meetingIndex !== index),
    )
  }

  return (
    <section className="admin-group-wizard">
      {createStep === 1 ? (
        <form
          className="admin-group-wizard__form"
          onSubmit={(event) => {
            event.preventDefault()
            void onNext()
          }}
        >
          <div className="admin-group-wizard__grid admin-group-wizard__grid--intro">
            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="그룹 이름"
              error={readFieldError(createErrors, 'name')}
            >
              <input
                placeholder="예: 소망"
                value={createForm.name}
                onChange={(event) => onFieldChange('name', event.target.value)}
              />
            </Field>

            <Field
              className="admin-group-wizard__field admin-group-wizard__field--compact"
              label="지역연합"
              error={readFieldError(createErrors, 'districtId')}
            >
              <select
                value={createForm.districtId}
                onChange={(event) => onFieldChange('districtId', event.target.value)}
              >
                {sortedDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="admin-group-wizard__section">
            <Field label="대표 연락처" error={readFieldError(createErrors, 'phone')}>
              <input
                inputMode="numeric"
                maxLength={13}
                placeholder="010-1234-5678"
                value={createForm.phone}
                onChange={(event) => onFieldChange('phone', event.target.value)}
              />
            </Field>

            <Field label="이메일 (선택)">
              <input
                placeholder="example@email.com"
                value={createForm.email}
                onChange={(event) => onFieldChange('email', event.target.value)}
              />
            </Field>
          </div>

          <section className="admin-group-wizard__section admin-group-wizard__section--mailing">
            <div className="admin-group-wizard__section-head">
              <div>
                <span className="field__label admin-group-wizard__section-title">
                  우편물 수령 정보 (선택)
                </span>
                <p>GSO 우편물을 실제로 받는 경우에만 입력해 주세요.</p>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                disabled={!hasPostalContactInfo}
                onClick={onResetPostalContactInfo}
              >
                초기화
              </button>
            </div>

            <div className="admin-group-wizard__field admin-group-wizard__field--wide postal-contact-card">
              <div className="admin-group-wizard__grid postal-contact-card__grid">
                <Field
                  className="admin-group-wizard__field admin-group-wizard__field--wide"
                  label="수령인"
                >
                  <input
                    value={createForm.postalRecipient}
                    onChange={(event) => onFieldChange('postalRecipient', event.target.value)}
                  />
                </Field>

                <AddressSearchField
                  addressLabel="도로명 주소"
                  addressValue={createForm.postalRoadAddress}
                  onAddressChange={(value) => onFieldChange('postalRoadAddress', value)}
                  onAddressSelected={({ postalCode, address }) => {
                    onFieldChange('postalCode', postalCode)
                    onFieldChange('postalRoadAddress', address)
                  }}
                />

                <div className="postal-contact-card__meta">
                  <Field label="상세 주소">
                    <input
                      value={createForm.postalDetailAddress}
                      onChange={(event) => onFieldChange('postalDetailAddress', event.target.value)}
                    />
                  </Field>

                  <Field label="우편번호" error={readFieldError(createErrors, 'postalCode')}>
                    <input
                      className="address-search-field__value address-search-field__value--disabled"
                      disabled
                      value={createForm.postalCode}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </section>

          <div className="admin-group-wizard__actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? '저장 중...' : '다음'}
            </button>
          </div>
        </form>
      ) : (
        <div className="admin-group-wizard__form">
          <section className="admin-group-wizard__section admin-group-wizard__section--meetings">
            <div className="admin-group-wizard__section-head">
              <div>
                <strong>모임 등록</strong>
                <p>모임 추가 버튼을 눌러 등록해 주세요.</p>
              </div>

              <button
                className="ghost-button ghost-button--small address-search-field__action admin-group-wizard__meeting-add"
                type="button"
                onClick={openNewMeetingModal}
              >
                모임 추가
              </button>
            </div>

            {meetingListError ? <span className="field__error">{meetingListError}</span> : null}

            {meetings.length > 0 ? (
              <div className="admin-group-wizard__meeting-list">
                {meetings.map((meeting, index) => (
                  <article
                    key={`${meeting.dayOfWeek}-${meeting.startTime}-${meeting.locationAddress}-${index}`}
                    className="admin-group-wizard__meeting-item"
                  >
                    <div className="admin-group-wizard__meeting-summary">
                      <strong>
                        {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                        {' · '}
                        {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                      </strong>
                      <span className="admin-group-wizard__meeting-location">
                        {meeting.locationDetail || '상세 위치 미입력'}
                      </span>
                      <span className="admin-group-wizard__meeting-address">
                        {meeting.locationAddress || '주소 미선택'}
                      </span>
                      {meeting.contactPhoneOverride ? (
                        <span className="admin-group-wizard__meeting-contact">
                          모임별 연락처: {meeting.contactPhoneOverride}
                        </span>
                      ) : null}
                    </div>

                    <div className="admin-group-wizard__meeting-actions">
                      <button
                        className="ghost-button ghost-button--small"
                        type="button"
                        onClick={() => openEditMeetingModal(index)}
                      >
                        수정
                      </button>
                      <button
                        className="ghost-button ghost-button--danger ghost-button--small"
                        type="button"
                        onClick={() => deleteMeeting(index)}
                      >
                        삭제
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>

          {meetings.length === 0 ? (
            <div className="admin-group-wizard__meeting-empty">
              <strong>등록된 모임이 아직 없습니다.</strong>
            </div>
          ) : null}

          <div className="admin-group-wizard__actions admin-group-wizard__actions--split">
            <button
              className="ghost-button"
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onPrevious()
              }}
              disabled={saving}
            >
              이전
            </button>

            <button
              className="primary-button"
              type="button"
              onClick={() => void onSubmit()}
              disabled={saving || meetings.length === 0}
            >
              {saving ? '등록 중...' : '완료'}
            </button>
          </div>
        </div>
      )}

      {showMeetingModal ? (
        <GroupMeetingFormModal
          errors={meetingDraftErrors}
          form={meetingDraft}
          onCancel={closeMeetingModal}
          onFieldChange={updateMeetingDraftField}
          onSubmit={saveMeetingDraft}
          submitLabel={isEditingMeeting ? '저장' : '추가'}
          title={isEditingMeeting ? '모임 수정' : '새 모임 추가'}
        />
      ) : null}
    </section>
  )
}

function validateMeetingDraft(form) {
  const errors = {}
  if (!form.dayOfWeek) errors.dayOfWeek = '요일을 선택해 주세요.'
  if (!form.startTime) errors.startTime = '시작 시간을 입력해 주세요.'
  if (!form.type) errors.type = '모임 유형을 선택해 주세요.'
  if (!form.locationAddress) errors.locationAddress = '주소를 선택해 주세요.'
  if (!form.locationDetail) errors.locationDetail = '상세 위치를 입력해 주세요.'
  return errors
}

function normalizeMeetingDraft(form) {
  return {
    ...createEmptyCreateMeeting(),
    ...form,
    locationAddress: String(form.locationAddress ?? '').trim(),
    locationDetail: String(form.locationDetail ?? '').trim(),
    contactPhoneOverride: String(form.contactPhoneOverride ?? '').trim(),
  }
}

function createNextMeetingDraft(previousMeeting) {
  if (!previousMeeting) return createEmptyCreateMeeting()
  return {
    ...createEmptyCreateMeeting(),
    ...previousMeeting,
    dayOfWeek: createEmptyCreateMeeting().dayOfWeek,
  }
}

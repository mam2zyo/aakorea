import { AddressSearchField } from '../../../../components/AddressSearchField'
import { Field } from '../../../../components/ui'
import { readFieldError } from '../../../../lib/formErrors'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '../../../../lib/options'

export function GroupMeetingFormModal({
  errors,
  form,
  onCancel,
  onFieldChange,
  onSubmit,
  onToggleActive,
  showActiveToggle = false,
  submitLabel,
  title,
}) {
  return (
    <div className="admin-overlay admin-overlay--nested" role="presentation">
      <section
        aria-modal="true"
        className="admin-overlay__dialog admin-overlay__dialog--submodal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="admin-group-modal__header admin-group-modal__header--submodal">
          <div className="admin-overlay__heading">
            <h2>{title}</h2>
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={onCancel}
          >
            취소
          </button>
        </header>

        <div className="admin-group-modal__body">
          <form
            className="admin-group-wizard__form"
            onSubmit={(event) => {
              event.preventDefault()
              void onSubmit()
            }}
          >
            <div className="admin-group-wizard__grid admin-group-wizard__grid--meeting-meta">
              <Field label="요일" error={readFieldError(errors, 'dayOfWeek')}>
                <select
                  value={form.dayOfWeek}
                  onChange={(event) => onFieldChange('dayOfWeek', event.target.value)}
                >
                  {DAY_OF_WEEK_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="시작 시간" error={readFieldError(errors, 'startTime')}>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(event) => onFieldChange('startTime', event.target.value)}
                />
              </Field>

              <Field label="모임 유형" error={readFieldError(errors, 'type')}>
                <select
                  value={form.type}
                  onChange={(event) => onFieldChange('type', event.target.value)}
                >
                  {MEETING_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <AddressSearchField
              addressError={readFieldError(errors, 'locationAddress')}
              addressLabel="주소"
              addressValue={form.locationAddress}
              onAddressChange={(value) => onFieldChange('locationAddress', value)}
              onAddressSelected={({ address }) => onFieldChange('locationAddress', address)}
            />

            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="상세 위치"
              error={readFieldError(errors, 'locationDetail')}
            >
              <input
                placeholder="예: 교육관 3층, 정문 옆"
                value={form.locationDetail}
                onChange={(event) => onFieldChange('locationDetail', event.target.value)}
              />
            </Field>

            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="모임별 연락처 (선택)"
              error={readFieldError(errors, 'contactPhoneOverride')}
            >
              <input
                inputMode="numeric"
                maxLength={13}
                placeholder="비우면 그룹 대표 연락처를 사용합니다."
                value={form.contactPhoneOverride}
                onChange={(event) => onFieldChange('contactPhoneOverride', event.target.value)}
              />
            </Field>

            {showActiveToggle ? (
              <div className="admin-group-edit-sheet__status-toggle">
                <span className="admin-group-edit-sheet__status-label">모임 상태</span>

                <button
                  aria-checked={form.active}
                  className={`admin-group-edit-sheet__status-button${
                    form.active ? ' admin-group-edit-sheet__status-button--active' : ''
                  }`}
                  role="switch"
                  type="button"
                  onClick={onToggleActive}
                >
                  <span className="admin-group-edit-sheet__status-track">
                    <span className="admin-group-edit-sheet__status-thumb" />
                  </span>
                  <span className="admin-group-edit-sheet__status-text">
                    {form.active ? '공개 중' : '비공개'}
                  </span>
                </button>
              </div>
            ) : null}

            <div className="admin-group-wizard__actions">
              <button className="primary-button" type="submit">
                {submitLabel}
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={onCancel}
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

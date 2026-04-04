import { AddressSearchField } from '../../../../components/AddressSearchField'
import {
  EntityList,
  Field,
  SectionHeader,
  StatusPill,
  ToggleField,
} from '../../../../components/ui'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '../../../../lib/options'
import { readFieldError } from '../../../../lib/formErrors'
import { lookupLabel } from '../../../../lib/view'

export function GroupMeetingsCard({
  errors,
  form,
  meetings,
  onActiveChange,
  onEdit,
  onFieldChange,
  onStartNew,
  onSubmit,
}) {
  return (
    <section className="editor-card editor-card--wide">
      <SectionHeader
        title="모임 일정"
        actionLabel="새 모임"
        onAction={onStartNew}
      />

      <form
        className="field-grid"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <Field label="상세 위치" error={readFieldError(errors, 'locationDetail')}>
          <input
            value={form.locationDetail}
            onChange={(event) => onFieldChange('locationDetail', event.target.value)}
          />
        </Field>

        <AddressSearchField
          addressError={readFieldError(errors, 'locationAddress')}
          addressLabel="모임 주소"
          addressValue={form.locationAddress}
          onAddressChange={(value) => onFieldChange('locationAddress', value)}
          onAddressSelected={({ address }) => onFieldChange('locationAddress', address)}
        />

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

        <ToggleField
          checked={form.active}
          label="공개 활성 모임으로 유지"
          onChange={(event) => onActiveChange(event.target.checked)}
        />

        <div className="button-row button-row--compact">
          <button className="primary-button" type="submit">
            {form.id ? '모임 수정' : '모임 추가'}
          </button>
        </div>
      </form>

      <EntityList
        actionLabel="불러오기"
        emptyTitle="등록된 모임이 없습니다."
        emptyDescription="공개 사용자가 찾을 수 있도록 첫 모임 시간을 등록해 주세요."
        items={meetings}
        onAction={onEdit}
        renderItem={(meeting) => (
          <div className="entity-item__body">
            <strong>
              {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
            </strong>
            <span className="entity-item__meta">
              {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
            </span>
            <span className="entity-item__meta">
              {meeting.locationDetail || '상세 위치 미입력'}
            </span>
            <StatusPill active={meeting.active} />
          </div>
        )}
      />
    </section>
  )
}

import { Field, SectionHeader } from '../../../../components/ui'
import { readFieldError } from '../../../../lib/formErrors'

export function GroupBasicsCard({
  districts,
  errors,
  form,
  onFieldChange,
  onSubmit,
}) {
  return (
    <section className="editor-card editor-card--wide">
      <SectionHeader title="Group 기본 정보" />

      <form
        className="field-grid"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <Field label="District" error={readFieldError(errors, 'districtId')}>
          <select
            value={form.districtId}
            onChange={(event) => onFieldChange('districtId', event.target.value)}
          >
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Group 이름" error={readFieldError(errors, 'name')}>
          <input
            value={form.name}
            onChange={(event) => onFieldChange('name', event.target.value)}
          />
        </Field>

        <Field label="기본 장소명" error={readFieldError(errors, 'locationName')}>
          <input
            value={form.locationName}
            onChange={(event) => onFieldChange('locationName', event.target.value)}
          />
        </Field>

        <Field label="기본 주소" error={readFieldError(errors, 'locationAddress')}>
          <input
            value={form.locationAddress}
            onChange={(event) => onFieldChange('locationAddress', event.target.value)}
          />
        </Field>

        <Field label="소개" error={readFieldError(errors, 'introduction')}>
          <textarea
            rows={4}
            value={form.introduction}
            onChange={(event) => onFieldChange('introduction', event.target.value)}
          />
        </Field>

        <Field label="공지" error={readFieldError(errors, 'notice')}>
          <textarea
            rows={3}
            value={form.notice}
            onChange={(event) => onFieldChange('notice', event.target.value)}
          />
        </Field>

        <Field label="최근 변경 요약" error={readFieldError(errors, 'changeSummary')}>
          <textarea
            rows={3}
            value={form.changeSummary}
            onChange={(event) => onFieldChange('changeSummary', event.target.value)}
          />
        </Field>

        <div className="button-row button-row--compact">
          <button className="primary-button" type="submit">
            Group 기본 정보 저장
          </button>
        </div>
      </form>
    </section>
  )
}

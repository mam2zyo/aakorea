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
        <Field label="지역연합" error={readFieldError(errors, 'districtId')}>
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

        <div className="button-row button-row--compact">
          <button className="primary-button" type="submit">
            Group 기본 정보 저장
          </button>
        </div>
      </form>
    </section>
  )
}

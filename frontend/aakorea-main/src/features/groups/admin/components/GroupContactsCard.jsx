import { EntityList, Field, SectionHeader } from '../../../../components/ui'
import { readFieldError } from '../../../../lib/formErrors'

export function GroupContactsCard({
  contacts,
  errors,
  form,
  onEdit,
  onFieldChange,
  onStartNew,
  onSubmit,
}) {
  return (
    <section className="editor-card">
      <SectionHeader
        title="공개 연락처"
        actionLabel="새 연락처"
        onAction={onStartNew}
      />

      <form
        className="field-grid"
        onSubmit={(event) => {
          event.preventDefault()
          void onSubmit()
        }}
      >
        <Field label="전화번호" error={readFieldError(errors, 'phone')}>
          <input
            placeholder="02-1234-5678"
            value={form.phone}
            onChange={(event) => onFieldChange('phone', event.target.value)}
          />
        </Field>

        <div className="button-row button-row--compact">
          <button className="primary-button" type="submit">
            {form.id ? '연락처 수정' : '연락처 추가'}
          </button>
        </div>
      </form>

      <EntityList
        actionLabel="불러오기"
        emptyTitle="등록된 연락처가 없습니다."
        emptyDescription="모임 조회 후 바로 연락할 수 있도록 최소 한 개의 연락처를 등록해 주세요."
        items={contacts}
        onAction={onEdit}
        renderItem={(contact) => (
          <div className="entity-item__body">
            <strong>{contact.phone}</strong>
          </div>
        )}
      />
    </section>
  )
}

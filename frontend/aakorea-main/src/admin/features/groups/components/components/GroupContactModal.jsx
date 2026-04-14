import { AddressSearchField } from '../../../../components/AddressSearchField'
import { Field } from '../../../../ui'
import { readFieldError } from '@/shared/lib/formErrors'

export function GroupContactModal({
  errors,
  form,
  onCancel,
  onFieldChange,
  onSubmit,
}) {
  return (
    <div 
      className="admin-overlay admin-overlay--nested"
      onClick={onCancel}
    >
      <section
        aria-modal="true"
        className="admin-overlay__dialog admin-overlay__dialog--submodal"
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="admin-group-modal__header admin-group-modal__header--submodal">
          <div className="admin-overlay__heading">
            <h2>연락처 수정</h2>
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
            className="admin-group-edit-sheet__rows"
            onSubmit={(event) => {
              event.preventDefault()
              void onSubmit()
            }}
          >
            <div className="admin-group-edit-sheet__rowline">
              <label className="admin-group-edit-sheet__rowlabel" htmlFor="contact-modal-phone">
                전화번호
              </label>
              <div className="admin-group-edit-sheet__rowcontrol">
                <input
                  id="contact-modal-phone"
                  inputMode="numeric"
                  maxLength={13}
                  placeholder="010-1234-5678"
                  value={form.phone}
                  onChange={(event) => onFieldChange('phone', event.target.value)}
                />
                {readFieldError(errors, 'phone') ? (
                  <span className="field__error">{readFieldError(errors, 'phone')}</span>
                ) : null}
              </div>
            </div>

            <div className="admin-group-edit-sheet__rowline">
              <span className="admin-group-edit-sheet__rowlabel">이메일</span>
              <div className="admin-group-edit-sheet__rowcontrol">
                <input
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(event) => onFieldChange('email', event.target.value)}
                />
              </div>
            </div>

            <div className="admin-group-edit-sheet__rowline">
              <span className="admin-group-edit-sheet__rowlabel">우편수신정보 (선택)</span>
              <div className="admin-group-edit-sheet__rowcontrol admin-group-edit-sheet__rowcontrol--wide">
                <div className="postal-contact-card">
                  <div className="admin-group-wizard__grid postal-contact-card__grid">
                    <Field
                      className="admin-group-wizard__field admin-group-wizard__field--wide"
                      label="수령인"
                      error={readFieldError(errors, 'postalRecipient')}
                    >
                      <input
                        id="contact-modal-postal-recipient"
                        value={form.postalRecipient}
                        onChange={(event) => onFieldChange('postalRecipient', event.target.value)}
                      />
                    </Field>

                    <AddressSearchField
                      addressLabel="도로명 주소"
                      addressValue={form.postalRoadAddress}
                      onAddressChange={(value) => onFieldChange('postalRoadAddress', value)}
                      onAddressSelected={({ postalCode, address }) => {
                        onFieldChange('postalCode', postalCode)
                        onFieldChange('postalRoadAddress', address)
                      }}
                    />

                    <div className="postal-contact-card__meta">
                      <Field label="상세 주소">
                        <input
                          value={form.postalDetailAddress}
                          onChange={(event) => onFieldChange('postalDetailAddress', event.target.value)}
                        />
                      </Field>

                      <Field label="우편번호" error={readFieldError(errors, 'postalCode')}>
                        <input
                          className="address-search-field__value address-search-field__value--disabled"
                          disabled
                          value={form.postalCode}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-group-wizard__actions">
              <button className="primary-button" type="submit">
                저장
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

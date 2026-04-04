import { useState } from 'react'
import DaumPostcode from 'react-daum-postcode'
import { normalizeAddressSelection } from '../lib/address'
import { Field } from './ui'

export function AddressSearchField({
  addressError,
  addressLabel = '주소',
  addressPlaceholder = '',
  addressValue,
  onAddressChange,
  onAddressSelected,
  postalCodeError,
  postalCodeLabel = '우편번호',
  postalCodePlaceholder = '',
  postalCodeValue = null,
  onPostalCodeChange = null,
  searchButtonLabel = '주소 검색',
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const supportsPostalCode = typeof postalCodeValue === 'string' && onPostalCodeChange

  function handleComplete(data) {
    onAddressSelected?.(normalizeAddressSelection(data))
    setSearchOpen(false)
  }

  return (
    <>
      {supportsPostalCode ? (
        <div className="admin-group-wizard__postcode">
          <Field label={postalCodeLabel} error={postalCodeError}>
            <input
              placeholder={postalCodePlaceholder}
              value={postalCodeValue}
              onChange={(event) => onPostalCodeChange(event.target.value)}
            />
          </Field>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            {searchButtonLabel}
          </button>
        </div>
      ) : null}

      <div className="admin-group-wizard__address-row">
        <Field
          className="admin-group-wizard__field admin-group-wizard__field--wide"
          label={addressLabel}
          error={addressError}
        >
          <input
            placeholder={addressPlaceholder}
            value={addressValue}
            onChange={(event) => onAddressChange(event.target.value)}
          />
        </Field>

        {!supportsPostalCode ? (
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={() => setSearchOpen(true)}
          >
            {searchButtonLabel}
          </button>
        ) : null}
      </div>

      {searchOpen ? (
        <div className="admin-overlay" role="presentation" onClick={() => setSearchOpen(false)}>
          <section
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--submodal address-search-dialog"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="admin-group-modal__header admin-group-modal__header--submodal">
              <div className="admin-overlay__heading">
                <h2>{searchButtonLabel}</h2>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={() => setSearchOpen(false)}
              >
                닫기
              </button>
            </header>

            <div className="admin-group-modal__body address-search-dialog__body">
              <DaumPostcode
                autoClose
                height="460px"
                onComplete={handleComplete}
                width="100%"
              />
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

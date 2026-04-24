import { useState } from 'react'
import { Postcode as KakaoPostcode } from '@clroot/react-kakao-postcode'
import { Field } from '@/shared/components/ui/Field'
import { useOfficeThemeContext } from '@/providers/ThemeContext'
import { normalizeAddressSelection } from '@/shared/utils/address'

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
  allowManualEntry = false,
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { resolvedTheme } = useOfficeThemeContext()
  const supportsPostalCode = typeof postalCodeValue === 'string' && onPostalCodeChange

  function handleComplete(data) {
    onAddressSelected?.(normalizeAddressSelection(data))
    setSearchOpen(false)
  }

  function handleSearchOpen() {
    setSearchOpen(true)
  }

  const effectiveAddressPlaceholder =
    addressPlaceholder || '주소 검색 버튼으로 주소를 선택하거나 변경해 주세요.'

  const isDark = resolvedTheme === 'dark'
  const KAKAO_THEME = isDark
    ? {
        bgColor: '#252526',
        searchBgColor: '#252526',
        contentBgColor: '#252526',
        pageBgColor: '#252526',
        textColor: '#d4d4d4',
        queryTextColor: '#ffffff',
        postcodeTextColor: '#3794ff',
        emphTextColor: '#2aa198',
        outlineColor: '#3c3c3c',
      }
    : {
        bgColor: '#fdf6e3', // Solarized Base3
        searchBgColor: '#eee8d5', // Solarized Base2
        contentBgColor: '#fdf6e3',
        pageBgColor: '#fdf6e3',
        textColor: '#073642', // Solarized Base02
        queryTextColor: '#073642',
        postcodeTextColor: '#268bd2', // Solarized Blue
        emphTextColor: '#2aa198', // Solarized Cyan
        outlineColor: '#d4ccb8', // Solarized Border
      }

  const wrapperBackground = isDark ? '#252526' : '#fdf6e3'

  return (
    <>
      {supportsPostalCode ? (
        <div className="office-group-wizard__postcode">
          <Field label={postalCodeLabel} error={postalCodeError}>
            <input
              className={`address-search-field__value${
                allowManualEntry ? '' : ' address-search-field__value--disabled'
              }`}
              placeholder={postalCodePlaceholder}
              disabled={!allowManualEntry}
              value={postalCodeValue}
              onChange={(event) => onPostalCodeChange(event.target.value)}
            />
          </Field>
        </div>
      ) : null}

      <div className="office-group-wizard__field office-group-wizard__field--wide office-group-wizard__address-row">
        <Field
          className="office-group-wizard__field"
          label={addressLabel}
          error={addressError}
        >
          <input
            className={`address-search-field__value${
              allowManualEntry ? '' : ' address-search-field__value--disabled'
            }`}
            placeholder={effectiveAddressPlaceholder}
            disabled={!allowManualEntry}
            value={addressValue}
            onChange={(event) => onAddressChange(event.target.value)}
          />
        </Field>

        <button
          className="ghost-button ghost-button--small address-search-field__action"
          type="button"
          onClick={handleSearchOpen}
        >
          {searchButtonLabel}
        </button>
      </div>

      {searchOpen && (
        <div 
          className="office-overlay office-overlay--nested"
          onClick={() => setSearchOpen(false)}
        >
          <section
            aria-modal="true"
            className="office-overlay__dialog office-overlay__dialog--submodal address-search-dialog"
            role="dialog"
            style={{ width: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="office-group-modal__header office-group-modal__header--submodal">
              <div className="office-overlay__heading">
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

            <div
              className="office-group-modal__body address-search-dialog__body"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: wrapperBackground,
              }}
            >
              <KakaoPostcode
                autoClose
                onComplete={handleComplete}
                style={{ width: '100%', height: '450px' }}
                theme={KAKAO_THEME}
              />
            </div>
          </section>
        </div>
      )}
    </>
  )
}

import { AddressSearchField } from '../../../../components/AddressSearchField'
import { Field } from '../../../../components/ui'
import { readFieldError } from '../../../../lib/formErrors'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
} from '../../../../lib/options'
import { lookupLabel } from '../../../../lib/view'

export function CreateGroupWizard({
  createErrors,
  createForm,
  createStep,
  districtName,
  saving,
  sortedDistricts,
  onFieldChange,
  onNext,
  onPrevious,
  onSubmit,
  onTogglePostalContactInfo,
}) {
  const addressPreviewTitle = createForm.locationDetail || '지도 연동 예정'
  const addressPreviewText = createForm.locationAddress || '주소 검색 API 연결 후 이 영역에 지도가 표시됩니다.'

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

            <Field
              className="admin-group-wizard__field admin-group-wizard__field--wide"
              label="그룹 공지 (선택)"
              error={readFieldError(createErrors, 'notice')}
            >
              <textarea
                rows={4}
                maxLength={200}
                placeholder="예: 첫 방문자는 10분 전에 와 주세요."
                value={createForm.notice}
                onChange={(event) => onFieldChange('notice', event.target.value)}
              />
            </Field>
          </div>

          <div className="admin-group-wizard__section">
            <Field label="대표 연락처" error={readFieldError(createErrors, 'phone')}>
              <input
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
                <strong>우편물 수령 정보</strong>
                <p>GSO 우편물을 실제로 받는 경우에만 입력해 주세요.</p>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={onTogglePostalContactInfo}
              >
                {createForm.postalContactExpanded ? '접기' : '입력'}
              </button>
            </div>

            {createForm.postalContactExpanded ? (
              <div className="admin-group-wizard__grid">
                <Field label="수령인">
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
                  postalCodeValue={createForm.postalCode}
                  onPostalCodeChange={(value) => onFieldChange('postalCode', value)}
                />

                <Field className="admin-group-wizard__field admin-group-wizard__field--wide" label="상세 주소">
                  <input
                    value={createForm.postalDetailAddress}
                    onChange={(event) => onFieldChange('postalDetailAddress', event.target.value)}
                  />
                </Field>
              </div>
            ) : null}
          </section>

          <div className="admin-group-wizard__actions">
            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? '저장 중...' : '다음'}
            </button>
          </div>
        </form>
      ) : (
        <form
          className="admin-group-wizard__form"
          onSubmit={(event) => {
            event.preventDefault()
            void onSubmit()
          }}
        >
          <div className="admin-group-wizard__summary">
            <strong>{createForm.name || '새 그룹'}</strong>
            <span>{districtName}</span>
          </div>

          <div className="admin-group-wizard__grid admin-group-wizard__grid--meeting-meta">
            <Field label="요일" error={readFieldError(createErrors, 'dayOfWeek')}>
              <select
                value={createForm.dayOfWeek}
                onChange={(event) => onFieldChange('dayOfWeek', event.target.value)}
              >
                {DAY_OF_WEEK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="시작 시간" error={readFieldError(createErrors, 'startTime')}>
              <input
                type="time"
                value={createForm.startTime}
                onChange={(event) => onFieldChange('startTime', event.target.value)}
              />
            </Field>

            <Field label="모임 유형" error={readFieldError(createErrors, 'type')}>
              <select
                value={createForm.type}
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
            addressError={readFieldError(createErrors, 'locationAddress')}
            addressLabel="주소"
            addressValue={createForm.locationAddress}
            onAddressChange={(value) => onFieldChange('locationAddress', value)}
            onAddressSelected={({ address }) => onFieldChange('locationAddress', address)}
          />

          <Field
            className="admin-group-wizard__field admin-group-wizard__field--wide"
            label="상세 위치"
            error={readFieldError(createErrors, 'locationDetail')}
          >
            <input
              placeholder="예: 본당 지하 1층, 정문 왼편"
              value={createForm.locationDetail}
              onChange={(event) => onFieldChange('locationDetail', event.target.value)}
            />
          </Field>

          <Field
            className="admin-group-wizard__field admin-group-wizard__field--wide"
            label="모임별 연락처 (선택)"
            error={readFieldError(createErrors, 'contactPhoneOverride')}
          >
            <input
              placeholder="비우면 대표 연락처를 사용합니다."
              value={createForm.contactPhoneOverride}
              onChange={(event) => onFieldChange('contactPhoneOverride', event.target.value)}
            />
          </Field>

          <div className="admin-group-wizard__map-mock">
            <span className="admin-group-wizard__map-pin" aria-hidden="true" />
            <div className="admin-group-wizard__map-card">
              <strong>{addressPreviewTitle}</strong>
              <span>{addressPreviewText}</span>
            </div>
          </div>

          <div className="admin-group-wizard__meeting-preview">
            <strong>
              {lookupLabel(DAY_OF_WEEK_OPTIONS, createForm.dayOfWeek)} {createForm.startTime}
              {' · '}
              {lookupLabel(MEETING_TYPE_OPTIONS, createForm.type)}
            </strong>
            <span>{createForm.locationDetail || '상세 위치를 입력해 주세요.'}</span>
          </div>

          <div className="admin-group-wizard__actions admin-group-wizard__actions--split">
            <button className="ghost-button" type="button" onClick={onPrevious} disabled={saving}>
              이전
            </button>

            <button className="primary-button" type="submit" disabled={saving}>
              {saving ? '등록 중...' : '완료'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}

import { readFieldError } from '../../../../../lib/formErrors'

export function GroupBasicsModal({
  errors,
  form,
  sortedDistricts,
  onCancel,
  onFieldChange,
  onSubmit,
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
            <h2>기본 정보 수정</h2>
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
              <label className="admin-group-edit-sheet__rowlabel" htmlFor="group-modal-name">
                그룹 이름
              </label>
              <div className="admin-group-edit-sheet__rowcontrol">
                <input
                  id="group-modal-name"
                  value={form.name}
                  onChange={(event) => onFieldChange('name', event.target.value)}
                />
                {readFieldError(errors, 'name') ? (
                  <span className="field__error">{readFieldError(errors, 'name')}</span>
                ) : null}
              </div>
            </div>

            <div className="admin-group-edit-sheet__rowline">
              <label className="admin-group-edit-sheet__rowlabel" htmlFor="group-modal-district">
                지역연합
              </label>
              <div className="admin-group-edit-sheet__rowcontrol admin-group-edit-sheet__rowcontrol--compact">
                <select
                  id="group-modal-district"
                  value={form.districtId}
                  onChange={(event) => onFieldChange('districtId', event.target.value)}
                >
                  {sortedDistricts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {readFieldError(errors, 'districtId') ? (
                  <span className="field__error">{readFieldError(errors, 'districtId')}</span>
                ) : null}
              </div>
            </div>

            <div className="admin-group-edit-sheet__rowline">
              <label className="admin-group-edit-sheet__rowlabel" htmlFor="group-modal-notice">
                그룹 공지
              </label>
              <div className="admin-group-edit-sheet__rowcontrol admin-group-edit-sheet__rowcontrol--wide">
                <textarea
                  id="group-modal-notice"
                  rows={4}
                  maxLength={200}
                  placeholder="예: 첫 방문자는 10분 전에 와 주세요."
                  value={form.notice}
                  onChange={(event) => onFieldChange('notice', event.target.value)}
                />
                {readFieldError(errors, 'notice') ? (
                  <span className="field__error">{readFieldError(errors, 'notice')}</span>
                ) : null}
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

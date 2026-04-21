import { useRef, useState } from 'react'
import { DetailItem } from '../../../../ui'
import { adminMeetingImportApi } from '@/shared/api'

export function MeetingImportPanel({ onError, onSuccess }) {
  const [importHtmlText, setImportHtmlText] = useState('')
  const [importHtmlFileName, setImportHtmlFileName] = useState('')
  const [importResult, setImportResult] = useState(null)
  const [importValidationMessage, setImportValidationMessage] = useState('')
  const [applyingImport, setApplyingImport] = useState(false)
  const [resettingImportData, setResettingImportData] = useState(false)
  const importHtmlFileInputRef = useRef(null)

  const importBusy = applyingImport || resettingImportData

  return (
    <section className="editor-card admin-import-panel" aria-label="HTML 모임 데이터 import">
      <div className="section-header">
        <div>
          <h3>테스트용 HTML Import</h3>
          <p className="admin-form-note">
            운영현황에서만 쓰는 도구입니다. `meeting.html` 원본 HTML을 붙여넣거나 파일을 선택하여 
            DB에 즉시 반영합니다. 기존 데이터가 있다면 그룹명과 전화번호 기준으로 갱신됩니다.
          </p>
        </div>

        <div className="button-row button-row--compact">
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={openHtmlFilePicker}
            disabled={importBusy}
          >
            HTML 파일 선택
          </button>
          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={clearImportWorkspace}
            disabled={importBusy}
          >
            초기화
          </button>
          <button
            className="ghost-button ghost-button--danger ghost-button--small"
            type="button"
            onClick={() => void resetImportData()}
            disabled={importBusy}
          >
            {resettingImportData ? 'DB 초기화 중...' : '테스트 DB 초기화'}
          </button>
        </div>
      </div>

      <input
        ref={importHtmlFileInputRef}
        accept=".html,.htm,text/html"
        className="admin-import-panel__file-input"
        type="file"
        onChange={(event) => void handleImportHtmlFileSelected(event)}
      />

      <div className="admin-import-panel__body">
        <label className="field admin-import-panel__field">
          <span className="field__label">원본 HTML</span>
          <textarea
            className="admin-import-panel__textarea"
            placeholder={'<html>...</html>'}
            value={importHtmlText}
            onChange={handleImportHtmlChange}
            disabled={importBusy}
          />
        </label>

        <div className="admin-import-panel__toolbar">
          <div className="admin-import-panel__meta">
            <strong>{importHtmlFileName || '직접 붙여넣기 입력'}</strong>
            <span>HTML을 직접 분석하여 DB에 즉시 반영합니다.</span>
          </div>

          <div className="button-row button-row--compact">
            <button
              className="primary-button primary-button--small"
              type="button"
              onClick={() => void applyImportHtml()}
              disabled={importBusy || !importHtmlText.trim()}
            >
              {applyingImport ? 'DB 반영 중...' : 'DB에 즉시 반영'}
            </button>
          </div>
        </div>

        {importValidationMessage ? (
          <div className="status-banner status-banner--error">
            {importValidationMessage}
          </div>
        ) : null}

        {importResult ? (
          <div className="admin-import-panel__summary">
            <div className="detail-grid">
              <DetailItem label="원본 모임 수" value={`${importResult.sourceMeetingCount}개`} />
              <DetailItem label="처리된 그룹 수" value={`${importResult.importedGroupCount}개`} />
              <DetailItem label="생성된 그룹" value={`${importResult.createdGroupCount}개`} />
              <DetailItem label="갱신된 그룹" value={`${importResult.updatedGroupCount}개`} />
              <DetailItem label="생성된 모임" value={`${importResult.createdMeetingCount}개`} />
              <DetailItem label="갱신된 모임" value={`${importResult.updatedMeetingCount}개`} />
              <DetailItem
                label="검토 이슈"
                value={importResult.issues.length ? `${importResult.issues.length}건` : '없음'}
              />
            </div>

            {importResult.createdDistrictNames.length ? (
              <div className="content-note">
                <strong>새로 생성된 지역연합</strong>
                <p>{importResult.createdDistrictNames.join(', ')}</p>
              </div>
            ) : null}

            {importResult.issues.length ? (
              <div className="content-note">
                <strong>검토 이슈</strong>
                <div className="admin-import-panel__issue-list">
                  {importResult.issues.map((issue, index) => (
                    <p key={`${issue.code}-${issue.groupName}-${issue.dayOfWeek}-${issue.startTime}-${index}`}>
                      {formatImportIssue(issue)}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )

  function handleImportHtmlChange(event) {
    setImportHtmlText(event.target.value)
    setImportValidationMessage('')
  }

  function openHtmlFilePicker() {
    importHtmlFileInputRef.current?.click()
  }

  async function handleImportHtmlFileSelected(event) {
    const [file] = event.target.files ?? []
    if (!file) {
      return
    }

    try {
      const fileText = await file.text()
      setImportHtmlText(fileText)
      setImportHtmlFileName(file.name)
      setImportValidationMessage('')
      setImportResult(null)
    } catch (error) {
      onError(error, 'HTML 파일을 읽지 못했습니다.')
    } finally {
      event.target.value = ''
    }
  }

  function clearImportWorkspace() {
    setImportHtmlText('')
    setImportHtmlFileName('')
    setImportResult(null)
    setImportValidationMessage('')

    if (importHtmlFileInputRef.current) {
      importHtmlFileInputRef.current.value = ''
    }
  }

  async function applyImportHtml() {
    if (!importHtmlText.trim()) {
      setImportValidationMessage('원본 HTML을 붙여넣거나 파일을 선택해 주세요.')
      return
    }

    const confirmed = window.confirm(
      'HTML 데이터를 분석하여 DB에 즉시 반영하시겠습니까?\n이 작업은 되돌릴 수 없습니다.',
    )
    if (!confirmed) {
      return
    }

    setApplyingImport(true)

    try {
      const result = await adminMeetingImportApi.applyImportHtml({
        html: importHtmlText,
      })
      setImportResult(result)
      setImportValidationMessage('')
      onSuccess(
        `DB 반영이 완료되었습니다. 그룹 ${result.createdGroupCount}개 생성, ${result.updatedGroupCount}개 갱신.`,
      )
    } catch (error) {
      setImportResult(null)
      onError(error, 'DB 반영에 실패했습니다. HTML 형식을 확인해 주세요.')
    } finally {
      setApplyingImport(false)
    }
  }

  async function resetImportData() {
    const confirmed = window.confirm(
      '테스트용 import 데이터를 초기화하시겠습니까?\nmeetings, group_contacts, groups, districts 테이블 데이터가 모두 삭제됩니다.',
    )
    if (!confirmed) {
      return
    }

    setResettingImportData(true)

    try {
      const result = await adminMeetingImportApi.resetImportData()
      setImportResult(null)
      setImportValidationMessage('')
      onSuccess(
        `테스트 DB를 초기화했습니다. 지역연합 ${result.deletedDistrictCount}개, 그룹 ${result.deletedGroupCount}개, 연락처 ${result.deletedGroupContactCount}개, 모임 ${result.deletedMeetingCount}개를 삭제했습니다.`,
      )
    } catch (error) {
      onError(error, '테스트 DB 초기화에 실패했습니다.')
    } finally {
      setResettingImportData(false)
    }
  }
}

function formatImportIssue(issue) {
  const segments = [issue.severity, issue.code]
  if (issue.groupName) {
    segments.push(issue.groupName)
  }
  if (issue.dayOfWeek && issue.startTime) {
    segments.push(`${issue.dayOfWeek} ${issue.startTime}`)
  }

  return `${segments.join(' · ')} · ${issue.message}`
}

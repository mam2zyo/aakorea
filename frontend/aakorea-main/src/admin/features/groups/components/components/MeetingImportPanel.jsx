import { useRef, useState } from 'react'
import { DetailItem } from '../../../../ui'
import { adminMeetingImportApi } from '../../../../../lib/api'

const IMPORT_PREVIEW_GROUP_LIMIT = 5

export function MeetingImportPanel({ onError, onSuccess }) {
  const [importHtmlText, setImportHtmlText] = useState('')
  const [importHtmlFileName, setImportHtmlFileName] = useState('')
  const [importJsonText, setImportJsonText] = useState('')
  const [importFileName, setImportFileName] = useState('')
  const [importPreview, setImportPreview] = useState(null)
  const [importValidationMessage, setImportValidationMessage] = useState('')
  const [normalizingImport, setNormalizingImport] = useState(false)
  const [previewingImport, setPreviewingImport] = useState(false)
  const [applyingImport, setApplyingImport] = useState(false)
  const [resettingImportData, setResettingImportData] = useState(false)
  const importHtmlFileInputRef = useRef(null)
  const importFileInputRef = useRef(null)

  const importBusy = normalizingImport || previewingImport || applyingImport || resettingImportData
  const previewGroups = importPreview?.groups?.slice(0, IMPORT_PREVIEW_GROUP_LIMIT) ?? []

  return (
    <section className="editor-card admin-import-panel" aria-label="HTML 또는 정제 JSON import">
      <div className="section-header">
        <div>
          <h3>테스트용 HTML / 정제 JSON Import</h3>
          <p className="admin-form-note">
            운영현황에서만 쓰는 도구입니다. `meeting.html` 원본 HTML을 먼저 정제하거나, 이미 준비한 정제 JSON을
            바로 붙여넣어 미리보기로 검토한 뒤 DB에 반영합니다.
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
            onClick={openImportFilePicker}
            disabled={importBusy}
          >
            JSON 파일 선택
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

      <input
        ref={importFileInputRef}
        accept=".json,application/json"
        className="admin-import-panel__file-input"
        type="file"
        onChange={(event) => void handleImportFileSelected(event)}
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
            <span>원본 HTML을 정제 JSON으로 변환한 뒤 아래 preview/apply 흐름으로 이어집니다.</span>
          </div>

          <div className="button-row button-row--compact">
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={() => void normalizeImportHtml()}
              disabled={importBusy || !importHtmlText.trim()}
            >
              {normalizingImport ? 'HTML 정제 중...' : 'HTML 정제'}
            </button>
          </div>
        </div>

        <label className="field admin-import-panel__field">
          <span className="field__label">정제 JSON</span>
          <textarea
            className="admin-import-panel__textarea"
            placeholder={`{\n  "sourceMeetingCount": 270,\n  "issues": [],\n  "groups": []\n}`}
            value={importJsonText}
            onChange={handleImportJsonChange}
            disabled={importBusy}
          />
        </label>

        <div className="admin-import-panel__toolbar">
          <div className="admin-import-panel__meta">
            <strong>{importFileName || '직접 붙여넣기 입력'}</strong>
            <span>preview/apply는 이 정제 JSON만 사용합니다.</span>
          </div>

          <div className="button-row button-row--compact">
            <button
              className="ghost-button ghost-button--small"
              type="button"
              onClick={() => void previewImportJson()}
              disabled={importBusy || !importJsonText.trim()}
            >
              {previewingImport ? '미리보기 준비 중...' : '미리보기'}
            </button>
            <button
              className="primary-button primary-button--small"
              type="button"
              onClick={() => void applyImportJson()}
              disabled={importBusy || !importPreview}
            >
              {applyingImport ? '적용 중...' : '미리보기 결과 적용'}
            </button>
          </div>
        </div>

        {importValidationMessage ? (
          <div className="status-banner status-banner--error">
            {importValidationMessage}
          </div>
        ) : null}

        {importPreview ? (
          <div className="admin-import-panel__summary">
            <div className="detail-grid">
              <DetailItem label="원본 모임 수" value={`${importPreview.sourceMeetingCount}개`} />
              <DetailItem label="정제 그룹 수" value={`${importPreview.importedGroupCount}개`} />
              <DetailItem label="정제 모임 수" value={`${importPreview.importedMeetingCount}개`} />
              <DetailItem
                label="생성 예정 지역연합"
                value={importPreview.missingDistrictNames.length ? `${importPreview.missingDistrictNames.length}개` : '없음'}
              />
              <DetailItem
                label="검토 이슈"
                value={importPreview.issues.length ? `${importPreview.issues.length}건` : '없음'}
              />
            </div>

            {importPreview.missingDistrictNames.length ? (
              <div className="content-note">
                <strong>자동 생성 예정 지역연합</strong>
                <p>{importPreview.missingDistrictNames.join(', ')}</p>
              </div>
            ) : null}

            {importPreview.issues.length ? (
              <div className="content-note">
                <strong>검토 이슈</strong>
                <div className="admin-import-panel__issue-list">
                  {importPreview.issues.map((issue, index) => (
                    <p key={`${issue.code}-${issue.groupName}-${issue.dayOfWeek}-${issue.startTime}-${index}`}>
                      {formatImportIssue(issue)}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="content-note">
              <strong>미리보기 그룹 {previewGroups.length}개</strong>
              <div className="entity-list">
                {previewGroups.map((group) => (
                  <article
                    key={`${group.name}-${group.phone}-${group.districtName}`}
                    className="entity-item admin-import-panel__preview-item"
                  >
                    <div className="entity-item__body">
                      <strong>{group.name}</strong>
                      <span className="entity-item__meta">
                        {group.districtName} · {group.phone} · 모임 {group.meetingCount}개
                      </span>
                      {group.notice ? <span className="entity-item__meta">{group.notice}</span> : null}
                    </div>
                  </article>
                ))}
              </div>
              {importPreview.groups.length > IMPORT_PREVIEW_GROUP_LIMIT ? (
                <p className="section-note">
                  나머지 {importPreview.groups.length - IMPORT_PREVIEW_GROUP_LIMIT}개 그룹은 apply 전 preview 응답에서 계속 확인할 수 있습니다.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )

  function handleImportHtmlChange(event) {
    setImportHtmlText(event.target.value)
    setImportValidationMessage('')
  }

  function handleImportJsonChange(event) {
    setImportJsonText(event.target.value)
    setImportPreview(null)
    setImportValidationMessage('')
  }

  function openHtmlFilePicker() {
    importHtmlFileInputRef.current?.click()
  }

  function openImportFilePicker() {
    importFileInputRef.current?.click()
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
    } catch (error) {
      onError(error, 'HTML 파일을 읽지 못했습니다.')
    } finally {
      event.target.value = ''
    }
  }

  async function handleImportFileSelected(event) {
    const [file] = event.target.files ?? []
    if (!file) {
      return
    }

    try {
      const fileText = await file.text()
      setImportJsonText(fileText)
      setImportFileName(file.name)
      setImportPreview(null)
      setImportValidationMessage('')
    } catch (error) {
      onError(error, 'JSON 파일을 읽지 못했습니다.')
    } finally {
      event.target.value = ''
    }
  }

  function clearImportWorkspace() {
    setImportHtmlText('')
    setImportHtmlFileName('')
    setImportJsonText('')
    setImportFileName('')
    setImportPreview(null)
    setImportValidationMessage('')

    if (importHtmlFileInputRef.current) {
      importHtmlFileInputRef.current.value = ''
    }
    if (importFileInputRef.current) {
      importFileInputRef.current.value = ''
    }
  }

  async function normalizeImportHtml() {
    if (!importHtmlText.trim()) {
      setImportValidationMessage('원본 HTML을 붙여넣거나 파일을 선택해 주세요.')
      return
    }

    setNormalizingImport(true)

    try {
      const normalizedImport = await adminMeetingImportApi.normalizeImport({
        html: importHtmlText,
      })

      setImportJsonText(JSON.stringify(normalizedImport, null, 2))
      setImportFileName(importHtmlFileName ? `${importHtmlFileName} 정제 결과` : 'HTML 정제 결과')
      setImportPreview(null)
      setImportValidationMessage('')
      onSuccess(
        `원본 HTML을 정제했습니다. 원본 모임 ${normalizedImport.sourceMeetingCount}개, 그룹 ${normalizedImport.groups.length}개입니다.`,
      )
    } catch (error) {
      setImportPreview(null)
      onError(error, 'HTML 정제에 실패했습니다.')
    } finally {
      setNormalizingImport(false)
    }
  }

  function parseImportPayload() {
    if (!importJsonText.trim()) {
      setImportValidationMessage('정제 JSON을 붙여넣거나 파일을 선택해 주세요.')
      return null
    }

    try {
      const payload = JSON.parse(importJsonText)
      if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('최상위 JSON 객체가 필요합니다.')
      }
      if (!Array.isArray(payload.groups)) {
        throw new Error('`groups` 배열이 필요합니다.')
      }

      setImportValidationMessage('')
      return payload
    } catch (error) {
      setImportPreview(null)
      setImportValidationMessage(
        error instanceof Error && error.message
          ? `정제 JSON 파싱에 실패했습니다. ${error.message}`
          : '정제 JSON 파싱에 실패했습니다.',
      )
      return null
    }
  }

  async function previewImportJson() {
    const payload = parseImportPayload()
    if (!payload) {
      return
    }

    setPreviewingImport(true)

    try {
      const preview = await adminMeetingImportApi.previewImport(payload)
      setImportPreview(preview)
      setImportValidationMessage('')
    } catch (error) {
      setImportPreview(null)
      onError(error, '정제 JSON 미리보기에 실패했습니다.')
    } finally {
      setPreviewingImport(false)
    }
  }

  async function applyImportJson() {
    const payload = parseImportPayload()
    if (!payload) {
      return
    }

    const confirmed = window.confirm(
      `정제 JSON import를 적용하시겠습니까?\n그룹 ${importPreview?.importedGroupCount ?? payload.groups.length}개와 모임 ${importPreview?.importedMeetingCount ?? 0}개가 반영됩니다.`,
    )
    if (!confirmed) {
      return
    }

    setApplyingImport(true)

    try {
      const result = await adminMeetingImportApi.applyImport(payload)
      setImportPreview(null)
      onSuccess(
        `정제 JSON import를 적용했습니다. 그룹 ${result.createdGroupCount}개 생성, ${result.updatedGroupCount}개 갱신, 모임 ${result.createdMeetingCount}개 생성, ${result.updatedMeetingCount}개 갱신.`,
      )
    } catch (error) {
      onError(error, '정제 JSON import 적용에 실패했습니다.')
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
      setImportPreview(null)
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

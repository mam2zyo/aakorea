import { useEffect, useEffectEvent, useState } from 'react'
import { ADMIN_PERMISSION, hasPermission } from '@/admin/app/adminAuthorization'
import {
  AdminPageHeader,
  EmptyState,
  Field,
  RichTextEditor,
  AttachmentField,
} from '@/admin/ui'
import { adminContentApi } from '../features/content/api'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '@/shared/lib/formErrors'

const NOTICE_SORT_MODES = {
  recent: '최신순',
  title: '제목순',
}
const EMPTY_NOTICE_FORM = createEmptyNoticeForm()
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function NoticeAdminPage({ onError, onNavigate, onSuccess, session }) {
  const [notices, setNotices] = useState([])
  const [noticeForm, setNoticeForm] = useState(EMPTY_NOTICE_FORM)
  const [noticeErrors, setNoticeErrors] = useState({})
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('recent')

  async function loadNoticeWorkspace() {
    setLoading(true)

    try {
      const data = await adminContentApi.getNotices()
      setNotices(data)
    } catch (error) {
      onError(error, '공지 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadNoticeWorkspaceEffect = useEffectEvent(() => {
    void loadNoticeWorkspace()
  })

  useEffect(() => {
    loadNoticeWorkspaceEffect()
  }, [])

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
  const canPublish = hasPermission(session, ADMIN_PERMISSION.CONTENT_PUBLISH)
  const publishedContentLocked = !canPublish && (noticeForm.originalPublished || noticeForm.published)
  const formBusy = saving || deleting
  const formReadOnly = formBusy || publishedContentLocked
  const filteredNotices = sortNotices(
    notices.filter((notice) => notice.title.toLocaleLowerCase('ko').includes(normalizedQuery)),
    sortMode,
  )

  return (
    <div className="admin-flat-page">
      <AdminPageHeader title="공지 관리" />

      {loading ? <div className="section-note">공지 목록을 불러오는 중입니다...</div> : null}
      {detailLoading ? <div className="section-note">선택한 공지를 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search">
            <input
              aria-label="공지 검색"
              placeholder="공지 제목으로 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={toggleSortMode}
          >
            정렬: {NOTICE_SORT_MODES[sortMode]}
          </button>
        </div>

        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
          <span className="admin-directory-toolbar__count">
            총 {filteredNotices.length}개
          </span>

          <div className="admin-list-toolbar__divider" aria-hidden="true" />

          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={startCreatingNotice}
          >
            새 공지
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {notices.length === 0 ? (
          <EmptyState
            title="등록된 공지가 없습니다."
            description="첫 공지를 등록해 공개 사이트의 최신 소식을 준비해 주세요."
          />
        ) : filteredNotices.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="다른 제목으로 다시 검색해 주세요."
          />
        ) : (
          <div className="admin-table admin-table--notice" role="table" aria-label="공지 목록">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading" role="columnheader">번호</span>
              <span className="admin-table__heading" role="columnheader">제목</span>
              <span className="admin-table__heading" role="columnheader">게시 시각</span>
              <span className="admin-table__heading" role="columnheader">상태</span>
              <span className="admin-table__heading" role="columnheader">관리</span>
            </div>

            {filteredNotices.map((notice, index) => (
              <div
                key={notice.id}
                className={`admin-table__row admin-table__row--static${
                  editorOpen && noticeForm.id === notice.id ? ' admin-table__row--selected' : ''
                }`}
                role="row"
              >
                <span className="admin-table__cell admin-table__cell--index" data-label="번호">
                  {index + 1}
                </span>
                <span
                  className="admin-table__cell admin-table__cell--primary"
                  data-label="제목"
                >
                  <strong>{notice.title}</strong>
                </span>
                <span className="admin-table__cell" data-label="게시 시각">
                  {formatDateTimeLabel(notice.publishedAt)}
                </span>
                <span className="admin-table__cell" data-label="상태">
                  <span
                    className={`status-pill ${
                      notice.published ? 'status-pill--active' : 'status-pill--inactive'
                    }`}
                  >
                    {notice.published ? '게시' : '비게시'}
                  </span>
                </span>
                <span className="admin-table__cell admin-table__cell--action" data-label="관리">
                  <div className="admin-table__action-cluster">
                    <button
                      className="ghost-button ghost-button--small"
                      type="button"
                      onClick={() => void startEditingNotice(notice.id)}
                    >
                      수정
                    </button>
                    <button
                      className="ghost-button ghost-button--small ghost-button--danger"
                      type="button"
                      onClick={() => void deleteNoticeFromList(notice)}
                      disabled={deleting}
                    >
                      삭제
                    </button>
                  </div>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen ? (
        <div className="admin-overlay" role="presentation">
          <div
            aria-labelledby="notice-editor-title"
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--wide"
            role="dialog"
          >
            <div className="admin-overlay__header">
              <div className="admin-overlay__heading">
                <h2 id="notice-editor-title">{noticeForm.id ? '공지 수정' : '새 공지'}</h2>
                <p className="admin-form-note">
                  공지는 최신순 흐름으로 보여지며, 게시 상태일 때만 공개 페이지에서 바로 확인할 수 있습니다.
                </p>
                {!canPublish ? (
                  <p className="admin-form-note">
                    게시 상태 변경과 게시 중 공지 수정은 `content.publish` 권한이 필요합니다.
                  </p>
                ) : null}
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={closeEditor}
                disabled={formBusy}
              >
                닫기
              </button>
            </div>

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveNotice()
              }}
            >
              <Field label="제목" error={readFieldError(noticeErrors, 'title')}>
                <input
                  value={noticeForm.title}
                  disabled={formReadOnly}
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'title'))
                  }}
                />
              </Field>

              <Field as="div" label="본문" error={readFieldError(noticeErrors, 'bodyHtml')}>
                <RichTextEditor
                  valueHtml={noticeForm.bodyHtml}
                  valueJson={noticeForm.bodyJson}
                  disabled={formReadOnly}
                  onChange={({ html, json }) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      bodyHtml: html,
                      bodyJson: json,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'bodyHtml'))
                  }}
                />
              </Field>

              <Field label="게시 시각" error={readFieldError(noticeErrors, 'publishedAt')}>
                <input
                  type="datetime-local"
                  value={noticeForm.publishedAt}
                  disabled={formReadOnly || !canPublish}
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      publishedAt: event.target.value,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'publishedAt'))
                  }}
                />
              </Field>

              <Field label="첨부파일">
                <AttachmentField
                  attachments={noticeForm.attachments}
                  disabled={formReadOnly}
                  onChange={(newAttachments) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      attachments: newAttachments,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'attachments'))
                  }}
                />
              </Field>

              <label className="toggle-field">
                <input
                  checked={noticeForm.published}
                  disabled={formReadOnly || !canPublish}
                  type="checkbox"
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      published: event.target.checked,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'publishedAt'))
                  }}
                />
                <span>게시 상태로 저장</span>
              </label>

              <div className="button-row button-row--compact">
                {noticeForm.id ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => onNavigate(`/notices/${noticeForm.id}`)}
                    disabled={formBusy}
                  >
                    공개 미리 보기
                  </button>
                ) : null}

                <button className="primary-button" type="submit" disabled={formReadOnly}>
                  {saving ? '저장 중...' : noticeForm.id ? '공지 저장' : '공지 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )

  function toggleSortMode() {
    setSortMode((previous) => (previous === 'recent' ? 'title' : 'recent'))
  }

  function startCreatingNotice() {
    setNoticeForm(createEmptyNoticeForm())
    setNoticeErrors({})
    setEditorOpen(true)
  }

  async function startEditingNotice(noticeId) {
    setDetailLoading(true)

    try {
      const data = await adminContentApi.getNotice(noticeId)
      setNoticeForm({
        id: data.id,
        title: data.title,
        bodyHtml: data.bodyHtml,
        bodyJson: data.bodyJson,
        originalPublished: data.published,
        published: data.published,
        publishedAt: toInputDateTimeValue(data.publishedAt),
        attachments: data.attachments || [],
      })
      setNoticeErrors({})
      setEditorOpen(true)
    } catch (error) {
      onError(error, '공지 상세를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  function closeEditor() {
    if (saving || deleting) {
      return
    }

    setEditorOpen(false)
    setNoticeForm(EMPTY_NOTICE_FORM)
    setNoticeErrors({})
  }

  async function saveNotice() {
    setSaving(true)

    try {
      const payload = {
        title: noticeForm.title,
        bodyHtml: noticeForm.bodyHtml,
        bodyJson: noticeForm.bodyJson,
        published: noticeForm.published,
        publishedAt: noticeForm.published ? toApiDateTimeValue(noticeForm.publishedAt) : null,
        attachmentIds: noticeForm.attachments.map((a) => a.id),
      }

      await (noticeForm.id
        ? adminContentApi.updateNotice(noticeForm.id, payload)
        : adminContentApi.createNotice(payload))

      await loadNoticeWorkspace()
      setSearchQuery('')
      setEditorOpen(false)
      setNoticeForm(EMPTY_NOTICE_FORM)
      setNoticeErrors({})
      onSuccess(noticeForm.id ? '공지를 수정했습니다.' : '공지를 생성했습니다.')
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setNoticeErrors(fieldErrors)
        return
      }

      setNoticeErrors({})
      onError(error, noticeForm.id ? '공지 수정에 실패했습니다.' : '공지 생성에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteNoticeFromList(notice) {
    if (!notice) {
      return
    }

    const confirmed = window.confirm(`"${notice.title}" 공지와 연결된 모든 자식 요소(첨부파일, 본문 삽입 이미지 등)를 함께 삭제하시겠습니까?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      await adminContentApi.deleteNotice(notice.id)

      await loadNoticeWorkspace()

      if (editorOpen && noticeForm.id === notice.id) {
        setEditorOpen(false)
        setNoticeForm(EMPTY_NOTICE_FORM)
        setNoticeErrors({})
      }

      onSuccess('공지를 삭제했습니다.')
    } catch (error) {
      onError(error, '공지 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }
}

function sortNotices(notices, sortMode) {
  return [...notices].sort((left, right) => {
    if (sortMode === 'title') {
      const titleCompare = textCollator.compare(left.title, right.title)
      if (titleCompare !== 0) {
        return titleCompare
      }
    }

    const leftPublishedAt = left.publishedAt ?? ''
    const rightPublishedAt = right.publishedAt ?? ''
    if (leftPublishedAt !== rightPublishedAt) {
      return rightPublishedAt.localeCompare(leftPublishedAt)
    }

    return right.id - left.id
  })
}

function createEmptyNoticeForm() {
  return {
    id: null,
    title: '',
    bodyHtml: '',
    bodyJson: '',
    originalPublished: false,
    published: false,
    publishedAt: createCurrentDateTimeValue(),
    attachments: [],
  }
}

function createCurrentDateTimeValue() {
  const now = new Date()
  now.setSeconds(0, 0)
  return formatDateTimeValue(now)
}

function formatDateTimeValue(value) {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  const hour = String(value.getHours()).padStart(2, '0')
  const minute = String(value.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hour}:${minute}`
}

function toInputDateTimeValue(value) {
  return value ? value.slice(0, 16) : ''
}

function toApiDateTimeValue(value) {
  if (!value) {
    return null
  }

  return value.length === 16 ? `${value}:00` : value
}

function formatDateTimeLabel(value) {
  if (!value) {
    return '게시 전'
  }

  return value.replace('T', ' ').slice(0, 16)
}

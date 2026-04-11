import { useEffect, useEffectEvent, useState } from 'react'
import { ADMIN_PERMISSION, hasPermission } from '../../admin/app/adminAuthorization'
import {
  AdminPageHeader,
  EmptyState,
  Field,
  RichTextEditor,
  AttachmentField,
} from '../../admin/ui'
import { adminContentApi } from '../../features/content/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'

const CONTENT_PAGE_SORT_MODES = {
  key: 'key순',
  title: '제목순',
}
const EMPTY_CONTENT_PAGE_FORM = createEmptyContentPageForm()
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function ContentPageAdminPage({ onError, onNavigate, onSuccess, session }) {
  const [contentPages, setContentPages] = useState([])
  const [contentPageForm, setContentPageForm] = useState(EMPTY_CONTENT_PAGE_FORM)
  const [contentPageErrors, setContentPageErrors] = useState({})
  const [editorOpen, setEditorOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('key')

  async function loadContentPageWorkspace() {
    setLoading(true)

    try {
      const data = await adminContentApi.getContentPages()
      setContentPages(data)
    } catch (error) {
      onError(error, '안내 페이지 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadContentPageWorkspaceEffect = useEffectEvent(() => {
    void loadContentPageWorkspace()
  })

  useEffect(() => {
    loadContentPageWorkspaceEffect()
  }, [])

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
  const canPublish = hasPermission(session, ADMIN_PERMISSION.CONTENT_PUBLISH)
  const publishedContentLocked = !canPublish
    && (contentPageForm.originalPublished || contentPageForm.published)
  const formBusy = saving || deleting
  const formReadOnly = formBusy || publishedContentLocked
  const filteredContentPages = sortContentPages(
    contentPages.filter((contentPage) =>
      [contentPage.key, contentPage.title].some((value) =>
        value.toLocaleLowerCase('ko').includes(normalizedQuery),
      ),
    ),
    sortMode,
  )

  return (
    <div className="admin-flat-page">
      <AdminPageHeader title="안내 페이지" />

      {loading ? <div className="section-note">안내 페이지 목록을 불러오는 중입니다...</div> : null}
      {detailLoading ? <div className="section-note">선택한 안내 페이지를 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search">
            <input
              aria-label="안내 페이지 검색"
              placeholder="페이지 제목 또는 key로 검색"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <button
            className="ghost-button ghost-button--small"
            type="button"
            onClick={toggleSortMode}
          >
            정렬: {CONTENT_PAGE_SORT_MODES[sortMode]}
          </button>
        </div>

        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--end">
          <span className="admin-directory-toolbar__count">
            총 {filteredContentPages.length}개
          </span>

          <div className="admin-list-toolbar__divider" aria-hidden="true" />

          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={startCreatingContentPage}
          >
            새 페이지
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {contentPages.length === 0 ? (
          <EmptyState
            title="등록된 안내 페이지가 없습니다."
            description="공개 사이트에 필요한 첫 안내 문서를 등록해 주세요."
          />
        ) : filteredContentPages.length === 0 ? (
          <EmptyState
            title="검색 결과가 없습니다."
            description="다른 제목이나 key로 다시 검색해 주세요."
          />
        ) : (
          <div className="admin-table admin-table--content" role="table" aria-label="안내 페이지 목록">
            <div className="admin-table__header" role="row">
              <span className="admin-table__heading" role="columnheader">번호</span>
              <span className="admin-table__heading" role="columnheader">페이지 key</span>
              <span className="admin-table__heading" role="columnheader">제목</span>
              <span className="admin-table__heading" role="columnheader">상태</span>
              <span className="admin-table__heading" role="columnheader">관리</span>
            </div>

            {filteredContentPages.map((contentPage, index) => (
              <div
                key={contentPage.id}
                className={`admin-table__row admin-table__row--static${
                  editorOpen && contentPageForm.id === contentPage.id ? ' admin-table__row--selected' : ''
                }`}
                role="row"
              >
                <span className="admin-table__cell admin-table__cell--index" data-label="번호">
                  {index + 1}
                </span>
                <span className="admin-table__cell" data-label="페이지 key">
                  {contentPage.key}
                </span>
                <span
                  className="admin-table__cell admin-table__cell--primary"
                  data-label="제목"
                >
                  <strong>{contentPage.title}</strong>
                </span>
                <span className="admin-table__cell" data-label="상태">
                  <span
                    className={`status-pill ${
                      contentPage.published ? 'status-pill--active' : 'status-pill--inactive'
                    }`}
                  >
                    {contentPage.published ? '게시' : '비게시'}
                  </span>
                </span>
                <span className="admin-table__cell admin-table__cell--action" data-label="관리">
                  <div className="admin-table__action-cluster">
                    <button
                      className="ghost-button ghost-button--small"
                      type="button"
                      onClick={() => void startEditingContentPage(contentPage.id)}
                    >
                      수정
                    </button>
                    <button
                      className="ghost-button ghost-button--small ghost-button--danger"
                      type="button"
                      onClick={() => void deleteContentPageFromList(contentPage)}
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
            aria-labelledby="content-page-editor-title"
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--wide"
            role="dialog"
          >
            <div className="admin-overlay__header">
              <div className="admin-overlay__heading">
                <h2 id="content-page-editor-title">
                  {contentPageForm.id ? '안내 페이지 수정' : '새 안내 페이지'}
                </h2>
                <p className="admin-form-note">
                  페이지 key는 공개 URL 경로에 쓰이므로, 공개 후에는 가능하면 안정적으로 유지하는 편이 좋습니다.
                </p>
                {!canPublish ? (
                  <p className="admin-form-note">
                    게시 상태 변경과 게시 중 안내 페이지 수정은 `content.publish` 권한이 필요합니다.
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
                void saveContentPage()
              }}
            >
              <Field label="페이지 key" error={readFieldError(contentPageErrors, 'key')}>
                <input
                  placeholder="first-visitor-guide"
                  value={contentPageForm.key}
                  disabled={formReadOnly}
                  onChange={(event) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      key: event.target.value,
                    }))
                    setContentPageErrors((previous) => omitFieldErrors(previous, 'key'))
                  }}
                />
              </Field>

              <Field label="제목" error={readFieldError(contentPageErrors, 'title')}>
                <input
                  value={contentPageForm.title}
                  disabled={formReadOnly}
                  onChange={(event) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                    setContentPageErrors((previous) => omitFieldErrors(previous, 'title'))
                  }}
                />
              </Field>

              <Field as="div" label="본문" error={readFieldError(contentPageErrors, 'bodyHtml')}>
                <RichTextEditor
                  valueHtml={contentPageForm.bodyHtml}
                  valueJson={contentPageForm.bodyJson}
                  disabled={formReadOnly}
                  onChange={({ html, json }) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      bodyHtml: html,
                      bodyJson: json,
                    }))
                    setContentPageErrors((previous) => omitFieldErrors(previous, 'bodyHtml'))
                  }}
                />
              </Field>

              <Field label="첨부파일">
                <AttachmentField
                  attachments={contentPageForm.attachments}
                  disabled={formReadOnly}
                  onChange={(newAttachments) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      attachments: newAttachments,
                    }))
                    setContentPageErrors((previous) => omitFieldErrors(previous, 'attachments'))
                  }}
                />
              </Field>

              <label className="toggle-field">
                <input
                  checked={contentPageForm.published}
                  disabled={formReadOnly || !canPublish}
                  type="checkbox"
                  onChange={(event) =>
                    setContentPageForm((previous) => ({
                      ...previous,
                      published: event.target.checked,
                    }))
                  }
                />
                <span>게시 상태로 저장</span>
              </label>

              <div className="button-row button-row--compact">
                {contentPageForm.key ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => onNavigate(`/content-pages/${contentPageForm.key}`)}
                    disabled={formBusy}
                  >
                    공개 미리 보기
                  </button>
                ) : null}

                <button className="primary-button" type="submit" disabled={formReadOnly}>
                  {saving
                    ? '저장 중...'
                    : contentPageForm.id
                      ? '안내 페이지 저장'
                      : '안내 페이지 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )

  function toggleSortMode() {
    setSortMode((previous) => (previous === 'key' ? 'title' : 'key'))
  }

  function startCreatingContentPage() {
    setContentPageForm(createEmptyContentPageForm())
    setContentPageErrors({})
    setEditorOpen(true)
  }

  async function startEditingContentPage(contentPageId) {
    setDetailLoading(true)

    try {
      const data = await adminContentApi.getContentPage(contentPageId)
      setContentPageForm({
                id: data.id,
        key: data.key,
        title: data.title,
        bodyHtml: data.bodyHtml,
        bodyJson: data.bodyJson,
        published: data.published,
        attachments: data.attachments || [],
      })
      setContentPageErrors({})
      setEditorOpen(true)
    } catch (error) {
      onError(error, '안내 페이지 상세를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  function closeEditor() {
    if (saving || deleting) {
      return
    }

    setEditorOpen(false)
    setContentPageForm(EMPTY_CONTENT_PAGE_FORM)
    setContentPageErrors({})
  }

  async function saveContentPage() {
    setSaving(true)

    try {
      const payload = {
        key: contentPageForm.key,
        title: contentPageForm.title,
        bodyHtml: contentPageForm.bodyHtml,
        bodyJson: contentPageForm.bodyJson,
        published: contentPageForm.published,
        attachmentIds: contentPageForm.attachments.map((a) => a.id),
      }

      await (contentPageForm.id
        ? adminContentApi.updateContentPage(contentPageForm.id, payload)
        : adminContentApi.createContentPage(payload))

      await loadContentPageWorkspace()
      setSearchQuery('')
      setEditorOpen(false)
      setContentPageForm(EMPTY_CONTENT_PAGE_FORM)
      setContentPageErrors({})
      onSuccess(
        contentPageForm.id
          ? '안내 페이지를 수정했습니다.'
          : '안내 페이지를 생성했습니다.',
      )
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setContentPageErrors(fieldErrors)
        return
      }

      setContentPageErrors({})
      onError(
        error,
        contentPageForm.id
          ? '안내 페이지 수정에 실패했습니다.'
          : '안내 페이지 생성에 실패했습니다.',
      )
    } finally {
      setSaving(false)
    }
  }

  async function deleteContentPageFromList(contentPage) {
    if (!contentPage) {
      return
    }

    const confirmed = window.confirm(`"${contentPage.title}" 안내 페이지와 연결된 모든 자식 요소(첨부파일, 본문 삽입 이미지 등)를 함께 삭제하시겠습니까?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      await adminContentApi.deleteContentPage(contentPage.id)

      await loadContentPageWorkspace()
      
      if (editorOpen && contentPageForm.id === contentPage.id) {
        setEditorOpen(false)
        setContentPageForm(EMPTY_CONTENT_PAGE_FORM)
        setContentPageErrors({})
      }
      
      onSuccess('안내 페이지를 삭제했습니다.')
    } catch (error) {
      setContentPageErrors({})
      onError(error, '안내 페이지 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }
}

function sortContentPages(contentPages, sortMode) {
  return [...contentPages].sort((left, right) => {
    if (sortMode === 'title') {
      const titleCompare = textCollator.compare(left.title, right.title)
      if (titleCompare !== 0) {
        return titleCompare
      }
    }

    const keyCompare = textCollator.compare(left.key, right.key)
    if (keyCompare !== 0) {
      return keyCompare
    }

    return left.id - right.id
  })
}

function createEmptyContentPageForm() {
  return {
    id: null,
    key: '',
    title: '',
    bodyHtml: '',
    bodyJson: '',
    published: false,
    attachments: [],
  }
}

import { useEffect, useEffectEvent, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
  Field,
} from '../../components/ui'
import { adminContentApi } from '../../features/content/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'

const CONTENT_PAGE_SORT_MODES = {
  key: 'key순',
  title: '제목순',
}
const EMPTY_CONTENT_PAGE_FORM = createEmptyContentPageForm()
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function ContentPageAdminPage({ onError, onNavigate, onSuccess }) {
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
              <span className="admin-table__heading" role="columnheader">편집</span>
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
                <span className="admin-table__cell admin-table__cell--action" data-label="편집">
                  <button
                    className="ghost-button ghost-button--small"
                    type="button"
                    onClick={() => void startEditingContentPage(contentPage.id)}
                  >
                    수정
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {editorOpen ? (
        <div className="admin-overlay" role="presentation" onClick={closeEditor}>
          <div
            aria-labelledby="content-page-editor-title"
            aria-modal="true"
            className="admin-overlay__dialog admin-overlay__dialog--wide"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-overlay__header">
              <div className="admin-overlay__heading">
                <h2 id="content-page-editor-title">
                  {contentPageForm.id ? '안내 페이지 수정' : '새 안내 페이지'}
                </h2>
                <p className="admin-form-note">
                  페이지 key는 공개 URL 경로에 쓰이므로, 공개 후에는 가능하면 안정적으로 유지하는 편이 좋습니다.
                </p>
              </div>

              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={closeEditor}
                disabled={saving || deleting}
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
                  onChange={(event) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                    setContentPageErrors((previous) => omitFieldErrors(previous, 'title'))
                  }}
                />
              </Field>

              <Field label="본문" error={readFieldError(contentPageErrors, 'body')}>
                <textarea
                  rows={10}
                  value={contentPageForm.body}
                  onChange={(event) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      body: event.target.value,
                    }))
                    setContentPageErrors((previous) => omitFieldErrors(previous, 'body'))
                  }}
                />
              </Field>

              <label className="toggle-field">
                <input
                  checked={contentPageForm.published}
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
                <button className="primary-button" type="submit" disabled={saving || deleting}>
                  {saving
                    ? '저장 중...'
                    : contentPageForm.id
                      ? '안내 페이지 저장'
                      : '안내 페이지 생성'}
                </button>

                {contentPageForm.key ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => onNavigate(`/content-pages/${contentPageForm.key}`)}
                    disabled={saving || deleting}
                  >
                    공개 미리 보기
                  </button>
                ) : null}

                {contentPageForm.id ? (
                  <button
                    className="ghost-button ghost-button--danger"
                    type="button"
                    onClick={() => void deleteContentPage()}
                    disabled={saving || deleting}
                  >
                    {deleting ? '삭제 중...' : '안내 페이지 삭제'}
                  </button>
                ) : null}
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
        body: data.body,
        published: data.published,
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
        body: contentPageForm.body,
        published: contentPageForm.published,
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

  async function deleteContentPage() {
    if (!contentPageForm.id) {
      return
    }

    const confirmed = window.confirm(`"${contentPageForm.title}" 안내 페이지를 삭제하시겠습니까?`)
    if (!confirmed) {
      return
    }

    setDeleting(true)

    try {
      await adminContentApi.deleteContentPage(contentPageForm.id)

      await loadContentPageWorkspace()
      setEditorOpen(false)
      setContentPageForm(EMPTY_CONTENT_PAGE_FORM)
      setContentPageErrors({})
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
    body: '',
    published: false,
  }
}

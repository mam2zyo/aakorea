import { useEffect, useEffectEvent, useState } from 'react'
import {
  AdminPageHeader,
  EmptyState,
  Field,
} from '@/admin/ui'
import { adminContentApi } from '../features/content/api'

const CONTENT_PAGE_SORT_MODES = {
  key: 'key순',
  title: '제목순',
}
const textCollator = new Intl.Collator('ko', { numeric: true, sensitivity: 'base' })

export function ContentPageAdminPage({ onError, onNavigate, onSuccess }) {
  const [contentPages, setContentPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadKey, setUploadKey] = useState('')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadPublished, setUploadPublished] = useState(true)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadId, setUploadId] = useState(null)
  const [currentFileName, setCurrentFileName] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState('key')

  function resetForm() {
    setUploadKey('')
    setUploadTitle('')
    setUploadPublished(true)
    setUploadFile(null)
    setUploadId(null)
    setCurrentFileName(null)
    setIsEditMode(false)
  }

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

  async function handleSave(event) {
    event.preventDefault()

    if (!uploadKey.trim() || !uploadTitle.trim()) {
      window.alert('페이지 key와 제목은 필수입니다.')
      return
    }

    setUploading(true)

    try {
      if (isEditMode) {
        await adminContentApi.updateContentPage(uploadId, {
          key: uploadKey,
          title: uploadTitle,
          published: uploadPublished,
          file: uploadFile,
        })
      } else {
        if (!uploadFile) {
          throw new Error('새 페이지 등록 시 HTML 파일은 필수입니다.')
        }
        await adminContentApi.uploadContentPage({
          key: uploadKey,
          title: uploadTitle,
          published: uploadPublished,
          file: uploadFile,
        })
      }

      await loadContentPageWorkspace()
      setUploadOpen(false)
      resetForm()
      onSuccess?.(isEditMode ? '페이지 정보를 수정했습니다.' : '페이지를 성공적으로 업로드했습니다.')
    } catch (error) {
      onError(error, '저장에 실패했습니다.')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(contentPage) {
    if (!window.confirm(`'${contentPage.key}' 페이지와 관련된 데이터를 모두 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return
    }

    try {
      await adminContentApi.deleteContentPage(contentPage.id)
      await loadContentPageWorkspace()
      onSuccess?.('페이지가 삭제되었습니다.')
    } catch (error) {
      onError(error, '페이지 삭제에 실패했습니다.')
    }
  }

  async function handlePublish(contentPage, published) {
    const action = published ? '게시' : '게시 취소'
    if (!window.confirm(`'${contentPage.key}' 페이지를 ${action}하시겠습니까?`)) {
      return
    }

    try {
      await adminContentApi.publishContentPage(contentPage.id, { published })
      await loadContentPageWorkspace()
      onSuccess?.(`페이지가 ${action}되었습니다.`)
    } catch (error) {
      onError(error, `${action}에 실패했습니다.`)
    }
  }

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase('ko')
  const filteredContentPages = sortContentPages(
    contentPages.filter((contentPage) =>
      [contentPage.key, contentPage.title].some((value) =>
        value.toLocaleLowerCase('ko').includes(normalizedQuery),
      ),
    ),
    sortMode,
  )

  function toggleSortMode() {
    setSortMode((previous) => (previous === 'key' ? 'title' : 'key'))
  }

  return (
    <div className="admin-flat-page">
      <AdminPageHeader title="안내 페이지 (파일 관리)" />

      {loading ? <div className="section-note">안내 페이지 목록을 불러오는 중입니다...</div> : null}

      <div className="admin-list-toolbar">
        <div className="admin-list-toolbar__cluster admin-list-toolbar__cluster--start">
          <div className="admin-list-toolbar__search">
            <input
              aria-label="안내 페이지 검색"
              placeholder="페이지 제목으로 검색"
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
            onClick={() => {
              resetForm()
              setUploadOpen(true)
            }}
          >
            페이지 업로드
          </button>
        </div>
      </div>

      <div className="admin-flat-page__workspace">
        {contentPages.length === 0 ? (
          <EmptyState
            title="등록된 안내 페이지가 없습니다."
            description="서버 리소스 디렉토리에 HTML 파일을 추가하거나 '페이지 업로드'를 이용하세요."
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
                className="admin-table__row admin-table__row--static"
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
                  style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
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
                      onClick={() => window.open(`/content-pages/${contentPage.key}`, '_blank')}
                    >
                      보기
                    </button>
                    <button
                      className="ghost-button ghost-button--small"
                      type="button"
                      onClick={() => {
                        setUploadId(contentPage.id)
                        setUploadKey(contentPage.key || '')
                        setUploadTitle(contentPage.title || '')
                        setUploadPublished(contentPage.published || false)
                        setCurrentFileName(contentPage.originalFileName || null)
                        setUploadFile(null)
                        setIsEditMode(true)
                        setUploadOpen(true)
                      }}
                    >
                      수정
                    </button>
                    <button
                      className="ghost-button ghost-button--small ghost-button--danger"
                      type="button"
                      onClick={() => handleDelete(contentPage)}
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

      {uploadOpen && (
        <div className="admin-overlay" role="presentation">
          <div
            aria-labelledby="upload-dialog-title"
            aria-modal="true"
            className="admin-overlay__dialog"
            role="dialog"
          >
            <div className="admin-overlay__header">
              <h2 id="upload-dialog-title">
                {isEditMode ? '페이지 수정' : '페이지 업로드'}
              </h2>
              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={() => setUploadOpen(false)}
                disabled={uploading}
              >
                닫기
              </button>
            </div>

            <form className="field-grid" onSubmit={handleSave}>
              <Field label="페이지 제목">
                <input
                  required
                  placeholder="예: A.A.의 역사"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  disabled={uploading}
                />
              </Field>

              <Field 
                label="페이지 key (영문, 숫자, 하이픈)"
                description={!isEditMode && uploadKey && contentPages.some(p => p.key === uploadKey) 
                  ? "주의: 이미 사용 중인 key입니다. 저장 시 기존 페이지가 대체됩니다." 
                  : "페이지 주소(URL)로 사용됩니다."}
              >
                <input
                  required
                  disabled={uploading || isEditMode}
                  placeholder="예: history-of-aa"
                  value={uploadKey}
                  onChange={(e) => setUploadKey(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                />
                {isEditMode && (
                   <p className="field__description" style={{ fontSize: '0.84rem' }}>
                     ID(Key)를 변경하려면 삭제 후 새로 등록해야 합니다.
                   </p>
                )}
              </Field>

              <Field label="HTML 파일 선택 (.html)">
                <input
                  type="file"
                  accept=".html"
                  onChange={(e) => setUploadFile(e.target.files?.[0])}
                  disabled={uploading}
                />
                {isEditMode && currentFileName && (
                   <p className="field__description" style={{ fontSize: '0.84rem' }}>
                     현재 파일: <strong>{currentFileName}</strong> (변경하려면 새 파일을 선택하세요)
                   </p>
                )}
              </Field>

              <div className="admin-group-edit-sheet__status-toggle">
                <span className="field__label">게시 상태</span>
                <button
                  aria-checked={uploadPublished}
                  className={`admin-group-edit-sheet__switch${
                    uploadPublished ? ' admin-group-edit-sheet__switch--active' : ''
                  }`}
                  role="switch"
                  type="button"
                  onClick={() => setUploadPublished(!uploadPublished)}
                >
                  <span className="admin-group-edit-sheet__switch-track">
                    <span className="admin-group-edit-sheet__switch-thumb" />
                  </span>
                  <span
                    className={`admin-group-edit-sheet__switch-text admin-group-edit-sheet__switch-text--${
                      uploadPublished ? 'active' : 'inactive'
                    }`}
                  >
                    {uploadPublished ? '게시 중' : '비게시'}
                  </span>
                </button>
              </div>

              <div className="button-row">
                <button
                  className="primary-button"
                  type="submit"
                  disabled={uploading || !uploadKey || !uploadTitle || (!isEditMode && !uploadFile)}
                >
                  {uploading ? '저장 중...' : isEditMode ? '수정 및 업데이트' : '확인 및 업로드'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
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

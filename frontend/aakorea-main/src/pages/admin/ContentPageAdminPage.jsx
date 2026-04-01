import { useEffect, useEffectEvent, useState } from 'react'
import {
  EntityList,
  Field,
  PageIntro,
  PageSection,
  SectionHeader,
  StatCard,
} from '../../components/ui'
import { adminContentApi } from '../../features/content/api/admin'
import { getApiFieldErrors, omitFieldErrors, readFieldError } from '../../lib/formErrors'

const EMPTY_CONTENT_PAGE_FORM = {
  id: null,
  key: '',
  title: '',
  body: '',
  published: false,
}

export function ContentPageAdminPage({ onError, onNavigate, onSuccess }) {
  const [contentPages, setContentPages] = useState([])
  const [contentPageForm, setContentPageForm] = useState(EMPTY_CONTENT_PAGE_FORM)
  const [contentPageErrors, setContentPageErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

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

  async function selectContentPage(contentPageId) {
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
    } catch (error) {
      onError(error, '안내 페이지 상세를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadContentPageWorkspaceEffect = useEffectEvent(() => {
    void loadContentPageWorkspace()
  })

  useEffect(() => {
    loadContentPageWorkspaceEffect()
  }, [])

  const publishedCount = contentPages.filter((contentPage) => contentPage.published).length

  return (
    <>
      <PageIntro
        eyebrow="Admin Content Pages"
        title="안내성 콘텐츠를 페이지 단위로 관리합니다."
        description="소개, 처음 오신 분 안내, 일반 설명성 콘텐츠를 `ContentPage`로 관리하고 공개 화면에 게시합니다."
        aside={
          <div className="stats-grid stats-grid--compact">
            <StatCard label="전체 페이지" value={contentPages.length} />
            <StatCard label="게시 중" value={publishedCount} />
            <StatCard label="권장 key" value="first-visitor-guide" />
          </div>
        }
      />

      <PageSection
        label="Content Page Workspace"
        title="페이지 목록과 편집 폼을 같은 흐름에서 다룹니다."
        description="게시 전 draft로 저장한 뒤, 공개 노출이 준비되면 `published`를 켜서 반영할 수 있습니다."
      >
        {loading ? <div className="section-note">안내 페이지 목록을 불러오는 중입니다...</div> : null}
        {detailLoading ? <div className="section-note">선택한 안내 페이지를 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
          <section className="editor-card editor-card--wide">
            <SectionHeader
              title="안내 페이지 편집"
              actionLabel="새 페이지"
              onAction={() => {
                setContentPageForm(EMPTY_CONTENT_PAGE_FORM)
                setContentPageErrors({})
              }}
            />

            <form
              className="field-grid"
              onSubmit={(event) => {
                event.preventDefault()
                void saveContentPage()
              }}
            >
              <Field
                label="페이지 key"
                error={readFieldError(contentPageErrors, 'key')}
              >
                <input
                  placeholder="first-visitor-guide"
                  value={contentPageForm.key}
                  onChange={(event) => {
                    setContentPageForm((previous) => ({
                      ...previous,
                      key: event.target.value,
                    }))
                    setContentPageErrors((previous) =>
                      omitFieldErrors(previous, 'key'),
                    )
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
                    setContentPageErrors((previous) =>
                      omitFieldErrors(previous, 'title'),
                    )
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
                    setContentPageErrors((previous) =>
                      omitFieldErrors(previous, 'body'),
                    )
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

              <div className="button-row">
                <button className="primary-button" type="submit">
                  {contentPageForm.id ? '안내 페이지 수정' : '안내 페이지 생성'}
                </button>
                {contentPageForm.key ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => onNavigate(`/content-pages/${contentPageForm.key}`)}
                  >
                    공개 미리 보기
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="editor-card">
            <SectionHeader title="안내 페이지 목록" />

            <EntityList
              actionLabel="불러오기"
              emptyTitle="안내 페이지가 없습니다."
              emptyDescription="공개 안내 흐름을 위해 첫 페이지를 등록해 주세요."
              items={contentPages}
              onAction={(contentPage) => void selectContentPage(contentPage.id)}
              renderItem={(contentPage) => (
                <div className="entity-item__body">
                  <strong>{contentPage.title}</strong>
                  <span className="entity-item__meta">{contentPage.key}</span>
                  <span
                    className={`status-pill ${
                      contentPage.published
                        ? 'status-pill--active'
                        : 'status-pill--inactive'
                    }`}
                  >
                    {contentPage.published ? '게시' : '비게시'}
                  </span>
                </div>
              )}
            />
          </section>
        </div>
      </PageSection>
    </>
  )

  async function saveContentPage() {
    try {
      const payload = {
        key: contentPageForm.key,
        title: contentPageForm.title,
        body: contentPageForm.body,
        published: contentPageForm.published,
      }

      const savedContentPage = contentPageForm.id
        ? await adminContentApi.updateContentPage(contentPageForm.id, payload)
        : await adminContentApi.createContentPage(payload)

      setContentPageForm({
        id: savedContentPage.id,
        key: savedContentPage.key,
        title: savedContentPage.title,
        body: savedContentPage.body,
        published: savedContentPage.published,
      })
      setContentPageErrors({})
      onSuccess(
        contentPageForm.id
          ? '안내 페이지를 수정했습니다.'
          : '안내 페이지를 생성했습니다.',
      )
      await loadContentPageWorkspace()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setContentPageErrors(fieldErrors)
        return
      }

      setContentPageErrors({})
      onError(error, '안내 페이지 저장에 실패했습니다.')
    }
  }
}

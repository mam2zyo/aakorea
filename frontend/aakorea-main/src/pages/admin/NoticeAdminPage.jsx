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

const EMPTY_NOTICE_FORM = createEmptyNoticeForm()

export function NoticeAdminPage({ onError, onNavigate, onSuccess }) {
  const [notices, setNotices] = useState([])
  const [noticeForm, setNoticeForm] = useState(EMPTY_NOTICE_FORM)
  const [noticeErrors, setNoticeErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

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

  async function selectNotice(noticeId) {
    setDetailLoading(true)

    try {
      const data = await adminContentApi.getNotice(noticeId)
      setNoticeForm({
        id: data.id,
        title: data.title,
        body: data.body,
        published: data.published,
        publishedAt: toInputDateTimeValue(data.publishedAt),
      })
      setNoticeErrors({})
    } catch (error) {
      onError(error, '공지 상세를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadNoticeWorkspaceEffect = useEffectEvent(() => {
    void loadNoticeWorkspace()
  })

  useEffect(() => {
    loadNoticeWorkspaceEffect()
  }, [])

  const publishedCount = notices.filter((notice) => notice.published).length

  return (
    <>
      <PageIntro
        eyebrow="Admin Notices"
        title="시의성 있는 공지를 최신순 흐름으로 관리합니다."
        description="`Notice`는 목록과 상세에서 함께 노출되므로, 게시 여부와 `publishedAt`을 같이 관리합니다."
        aside={
          <div className="stats-grid stats-grid--compact">
            <StatCard label="전체 공지" value={notices.length} />
            <StatCard label="게시 중" value={publishedCount} />
            <StatCard label="공개 목록" value="/notices" />
          </div>
        }
      />

      <PageSection
        label="Notice Workspace"
        title="최신 공지 순서를 유지하며 등록합니다."
        description="게시 상태일 때는 `publishedAt`이 필요하며, 공개 목록은 이 값을 기준으로 정렬됩니다."
      >
        {loading ? <div className="section-note">공지 목록을 불러오는 중입니다...</div> : null}
        {detailLoading ? <div className="section-note">선택한 공지를 불러오는 중입니다...</div> : null}

        <div className="editor-grid">
          <section className="editor-card editor-card--wide">
            <SectionHeader
              title="공지 편집"
              actionLabel="새 공지"
              onAction={() => {
                setNoticeForm(createEmptyNoticeForm())
                setNoticeErrors({})
              }}
            />

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
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'title'))
                  }}
                />
              </Field>

              <Field label="본문" error={readFieldError(noticeErrors, 'body')}>
                <textarea
                  rows={10}
                  value={noticeForm.body}
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      body: event.target.value,
                    }))
                    setNoticeErrors((previous) => omitFieldErrors(previous, 'body'))
                  }}
                />
              </Field>

              <Field
                label="게시 시각"
                error={readFieldError(noticeErrors, 'publishedAt')}
              >
                <input
                  type="datetime-local"
                  value={noticeForm.publishedAt}
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      publishedAt: event.target.value,
                    }))
                    setNoticeErrors((previous) =>
                      omitFieldErrors(previous, 'publishedAt'),
                    )
                  }}
                />
              </Field>

              <label className="toggle-field">
                <input
                  checked={noticeForm.published}
                  type="checkbox"
                  onChange={(event) => {
                    setNoticeForm((previous) => ({
                      ...previous,
                      published: event.target.checked,
                    }))
                    setNoticeErrors((previous) =>
                      omitFieldErrors(previous, 'publishedAt'),
                    )
                  }}
                />
                <span>게시 상태로 저장</span>
              </label>

              <div className="button-row">
                <button className="primary-button" type="submit">
                  {noticeForm.id ? '공지 수정' : '공지 생성'}
                </button>
                {noticeForm.id ? (
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => onNavigate(`/notices/${noticeForm.id}`)}
                  >
                    공개 미리 보기
                  </button>
                ) : null}
              </div>
            </form>
          </section>

          <section className="editor-card">
            <SectionHeader title="공지 목록" />

            <EntityList
              actionLabel="불러오기"
              emptyTitle="공지 데이터가 없습니다."
              emptyDescription="최신 공지 흐름을 시작할 첫 공지를 등록해 주세요."
              items={notices}
              onAction={(notice) => void selectNotice(notice.id)}
              renderItem={(notice) => (
                <div className="entity-item__body">
                  <strong>{notice.title}</strong>
                  <span className="entity-item__meta">
                    {formatDateTimeLabel(notice.publishedAt)}
                  </span>
                  <span
                    className={`status-pill ${
                      notice.published
                        ? 'status-pill--active'
                        : 'status-pill--inactive'
                    }`}
                  >
                    {notice.published ? '게시' : '비게시'}
                  </span>
                </div>
              )}
            />
          </section>
        </div>
      </PageSection>
    </>
  )

  async function saveNotice() {
    try {
      const payload = {
        title: noticeForm.title,
        body: noticeForm.body,
        published: noticeForm.published,
        publishedAt: noticeForm.published
          ? toApiDateTimeValue(noticeForm.publishedAt)
          : null,
      }

      const savedNotice = noticeForm.id
        ? await adminContentApi.updateNotice(noticeForm.id, payload)
        : await adminContentApi.createNotice(payload)

      setNoticeForm({
        id: savedNotice.id,
        title: savedNotice.title,
        body: savedNotice.body,
        published: savedNotice.published,
        publishedAt: toInputDateTimeValue(savedNotice.publishedAt),
      })
      setNoticeErrors({})
      onSuccess(noticeForm.id ? '공지를 수정했습니다.' : '공지를 생성했습니다.')
      await loadNoticeWorkspace()
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error)
      if (fieldErrors) {
        setNoticeErrors(fieldErrors)
        return
      }

      setNoticeErrors({})
      onError(error, '공지 저장에 실패했습니다.')
    }
  }
}

function createEmptyNoticeForm() {
  return {
    id: null,
    title: '',
    body: '',
    published: false,
    publishedAt: createCurrentDateTimeValue(),
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

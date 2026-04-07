import { useEffect, useEffectEvent, useState } from 'react'
import {
  DetailItem,
  EmptyState,
  PageIntro,
  PageSection,
} from '../../public/ui'
import { publicContentApi } from '../../features/content/api/public'
import { ApiError } from '../../shared/lib/request'

export function NoticePage({ noticeId, onError, onNavigate }) {
  const [notices, setNotices] = useState([])
  const [selectedNotice, setSelectedNotice] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [missingNotice, setMissingNotice] = useState(false)

  async function loadNoticeDetail(id, quiet = false) {
    setDetailLoading(true)

    try {
      const data = await publicContentApi.getNotice(id)
      setSelectedNotice(data)
      setMissingNotice(false)
      return true
    } catch (error) {
      setSelectedNotice(null)

      if (error instanceof ApiError && error.status === 404) {
        setMissingNotice(true)
        return false
      }

      if (!quiet) {
        onError(error, '공지 상세를 불러오지 못했습니다.')
      }

      return false
    } finally {
      setDetailLoading(false)
    }
  }

  async function loadNoticeWorkspace() {
    setLoading(true)

    try {
      const data = await publicContentApi.getNotices()
      setNotices(data)

      if (data.length === 0) {
        setSelectedNotice(null)
        setMissingNotice(false)
        return
      }

      const targetNoticeId = noticeId ?? data[0].id
      const loaded = await loadNoticeDetail(targetNoticeId, true)

      if (!loaded && noticeId == null) {
        setSelectedNotice(null)
      }
    } catch (error) {
      setNotices([])
      setSelectedNotice(null)
      onError(error, '공개 공지를 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadNoticeWorkspaceEffect = useEffectEvent(() => {
    void loadNoticeWorkspace()
  })

  useEffect(() => {
    loadNoticeWorkspaceEffect()
  }, [noticeId])

  return (
    <>
      <PageIntro
        eyebrow="Public Notices"
        title="최신 공지를 확인하고 필요한 안내로 이어집니다."
        description="게시된 Notice를 최신순으로 보여 주고, 선택한 공지의 본문을 같은 흐름에서 확인합니다."
        actions={
          <>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate('/content-pages/first-visitor-guide')}
            >
              처음 안내 보기
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate('/meetings')}
            >
              모임 찾기
            </button>
          </>
        }
      />

      <PageSection
        label="Notice Feed"
        title="게시된 공지를 최신순으로 확인하세요."
        description="목록에서 공지를 선택하면 본문과 게시 시각을 확인할 수 있습니다."
      >
        {loading ? <div className="section-note">공지를 불러오는 중입니다...</div> : null}

        <div className="public-layout">
          <section className="resource-panel">
            <div className="resource-panel__header">
              <strong>공지 목록</strong>
              <span>{notices.length}건</span>
            </div>

            {notices.length === 0 ? (
              <EmptyState
                title="게시된 공지가 없습니다."
                description="운영 화면에서 공지를 게시하면 여기서 최신순으로 확인할 수 있습니다."
              />
            ) : (
              <div className="meeting-list">
                {notices.map((notice) => (
                  <button
                    key={notice.id}
                    className={`meeting-card${
                      selectedNotice?.id === notice.id ? ' meeting-card--selected' : ''
                    }`}
                    type="button"
                    onClick={() => onNavigate(`/notices/${notice.id}`)}
                  >
                    <span className="meeting-card__group">
                      {formatDateTimeLabel(notice.publishedAt)}
                    </span>
                    <strong className="meeting-card__title">{notice.title}</strong>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="resource-panel resource-panel--detail">
            <div className="resource-panel__header">
              <strong>공지 상세</strong>
              <span>{detailLoading ? '불러오는 중' : '본문 확인'}</span>
            </div>

            {missingNotice ? (
              <EmptyState
                title="선택한 공지를 찾지 못했습니다."
                description="게시가 취소되었거나 존재하지 않는 공지일 수 있습니다."
              />
            ) : null}

            {selectedNotice ? (
              <div className="meeting-detail">
                <div className="meeting-detail__hero">
                  <p className="meeting-detail__eyebrow">
                    게시 시각 {formatDateTimeLabel(selectedNotice.publishedAt)}
                  </p>
                  <h2>{selectedNotice.title}</h2>
                </div>

                <dl className="detail-grid">
                  <DetailItem
                    label="게시 시각"
                    value={formatDateTimeLabel(selectedNotice.publishedAt)}
                  />
                </dl>

                <div className="content-body">{selectedNotice.body}</div>
              </div>
            ) : notices.length > 0 && !missingNotice ? (
              <EmptyState
                title="선택된 공지가 없습니다."
                description="목록에서 공지를 선택하면 본문을 확인할 수 있습니다."
              />
            ) : null}
          </section>
        </div>
      </PageSection>
    </>
  )
}

function formatDateTimeLabel(value) {
  if (!value) {
    return '게시 시각 미정'
  }

  return value.replace('T', ' ').slice(0, 16)
}

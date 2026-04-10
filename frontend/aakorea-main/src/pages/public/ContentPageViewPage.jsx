import { useEffect, useEffectEvent, useState } from 'react'
import { EmptyState, PageIntro, PageSection } from '../../public/ui'
import { publicContentApi } from '../../features/content/api/public'
import { ApiError } from '../../shared/lib/request'

export function ContentPageViewPage({ onError, onNavigate, pageKey }) {
  const [contentPage, setContentPage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [missing, setMissing] = useState(false)

  async function loadContentPage() {
    setLoading(true)

    try {
      const data = await publicContentApi.getContentPage(pageKey)
      setContentPage(data)
      setMissing(false)
    } catch (error) {
      setContentPage(null)

      if (error instanceof ApiError && error.status === 404) {
        setMissing(true)
      } else {
        setMissing(false)
        onError(error, '안내 페이지를 불러오지 못했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const loadContentPageEffect = useEffectEvent(() => {
    void loadContentPage()
  })

  useEffect(() => {
    loadContentPageEffect()
  }, [pageKey])

  return (
    <>
      <PageIntro
        eyebrow="Public Content"
        title={contentPage?.title ?? (loading ? '안내 페이지를 불러오는 중입니다.' : '안내 페이지')}
        description="운영자가 게시한 안내성 콘텐츠를 공개 화면에서 확인합니다."
        actions={
          <>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate('/notices')}
            >
              공지 보기
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
        label="Content Page"
        title={contentPage?.title ?? '안내 페이지 본문'}
        description={`현재 페이지 key: ${pageKey}`}
      >
        {loading ? <div className="section-note">안내 페이지를 불러오는 중입니다...</div> : null}

        {missing ? (
          <EmptyState
            title="게시된 안내 페이지가 없습니다."
            description="운영 화면에서 해당 key의 안내 페이지를 게시하면 여기서 확인할 수 있습니다."
          />
        ) : null}

        {contentPage ? <div className="content-body" dangerouslySetInnerHTML={{ __html: contentPage.bodyHtml }} /> : null}
      </PageSection>
    </>
  )
}

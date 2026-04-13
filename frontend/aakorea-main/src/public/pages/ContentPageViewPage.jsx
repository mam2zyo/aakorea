import { useEffect, useEffectEvent, useState, useRef } from 'react'
import { EmptyState, PageIntro, PageSection } from '@/public/ui'
import { publicContentApi } from '../features/content/api'
import { ApiError } from '@/shared/lib/request'
import { PublicAttachmentList } from '../components/PublicAttachmentList'
import { CONTENT_JSX_REGISTRY } from '../features/content/components/registry'

export function ContentPageViewPage({ onError, onNavigate, pageKey }) {
  const [contentPage, setContentPage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [missing, setMissing] = useState(false)
  const [toc, setToc] = useState([])
  const [activeSection, setActiveSection] = useState('')
  const contentRef = useRef(null)

  // 1. Hybrid Rendering: Check if key exists in JSX Registry
  const JsxContentComponent = CONTENT_JSX_REGISTRY[pageKey]

  async function loadContentPage() {
    // If it's a JSX component, we might not need to fetch from API, 
    // unless the JSX component themselves needs data.
    // For now, if JSX exists, we still fetch metadata (title) but ignore bodyHtml.
    setLoading(true)

    try {
      const data = await publicContentApi.getContentPage(pageKey)
      setContentPage(data)
      setMissing(false)
    } catch (error) {
      if (JsxContentComponent) {
        // If JSX exists, we can survive a 404 from the file-base if the JSX is self-contained
        setContentPage({ key: pageKey, title: pageKey.replace(/-/g, ' '), bodyHtml: '' })
        setMissing(false)
      } else if (error instanceof ApiError && error.status === 404) {
        setMissing(true)
      } else {
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

  // 2. Table of Contents & Scroll Spy
  useEffect(() => {
    if (!contentPage?.bodyHtml || !contentRef.current) return

    // Extract H2s and assign IDs if they don't have them
    const headers = contentRef.current.querySelectorAll('h2')
    const tocItems = Array.from(headers).map((h, i) => {
      const id = h.id || `section-${i}`
      h.id = id
      return { id, text: h.innerText }
    })
    setToc(tocItems)

    // Scroll Spy Logic
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-10% 0px -80% 0px' }
    )

    headers.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [contentPage?.bodyHtml])

  if (missing) {
    return (
      <EmptyState
        title="게시된 안내 페이지가 없습니다."
        description="해당 경로의 안내 페이지 파일을 찾을 수 없습니다."
      />
    )
  }

  return (
    <>
      <PageIntro
        eyebrow="안내 콘텐츠"
        title={contentPage?.title ?? (loading ? '공유하는 중...' : '안내 페이지')}
      />

      <div className="content-layout-container">
        <main className={`content-main ${toc.length <= 1 ? 'content-main--full' : ''}`}>
          <PageSection>
            {loading && !contentPage ? (
              <div className="section-note">안내 페이지를 불러오는 중입니다...</div>
            ) : null}

            <article className="content-article" ref={contentRef}>
              {/* 3. Hybrid Selection: JSX registry vs dangerouslySetInnerHTML */}
              {JsxContentComponent ? (
                <JsxContentComponent />
              ) : contentPage ? (
                <div 
                  className="content-body entry-animation" 
                  dangerouslySetInnerHTML={{ __html: contentPage.bodyHtml }} 
                />
              ) : null}
            </article>

            {contentPage?.attachments?.length > 0 && (
              <PublicAttachmentList attachments={contentPage.attachments} />
            )}
          </PageSection>
        </main>

        {/* Sidebar ToC - Only visible if we have multiple sections */}
        {toc.length > 1 && (
          <aside className="content-sidebar">
            <nav className="content-toc">
              <h3 className="content-toc__title">목차</h3>
              <ul className="content-toc__list">
                {toc.map((item) => (
                  <li key={item.id} className="content-toc__item">
                    <a
                      href={`#${item.id}`}
                      className={`content-toc__link ${activeSection === item.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>
    </>
  )
}

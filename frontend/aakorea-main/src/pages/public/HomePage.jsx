import { useEffect, useEffectEvent, useState } from 'react'
import { EmptyState, PageIntro, PageSection } from '../../components/ui'
import { publicContentApi } from '../../lib/api'

const GUIDE_PAGE_KEY = 'first-visitor-guide'

export function HomePage({ onNavigate }) {
  const [notices, setNotices] = useState([])
  const [noticeLoading, setNoticeLoading] = useState(false)
  const [noticeLoadFailed, setNoticeLoadFailed] = useState(false)

  async function loadNotices() {
    setNoticeLoading(true)

    try {
      const data = await publicContentApi.getNotices()
      setNotices(data.slice(0, 2))
      setNoticeLoadFailed(false)
    } catch {
      setNotices([])
      setNoticeLoadFailed(true)
    } finally {
      setNoticeLoading(false)
    }
  }

  const loadNoticesEffect = useEffectEvent(() => {
    void loadNotices()
  })

  useEffect(() => {
    loadNoticesEffect()
  }, [])

  const latestNotice = notices[0] ?? null

  return (
    <>
      <PageIntro
        eyebrow="Alcoholics Anonymous Korea"
        title="처음 오셨나요? 안내를 읽고 가까운 AA 모임을 찾을 수 있습니다."
        description="처음 방문한 분은 안내를 먼저 읽고, 바로 도움을 찾고 싶은 분은 지역별 모임과 공개 연락처를 확인할 수 있도록 홈을 출발점으로 구성했습니다."
        actions={
          <>
            <button
              className="primary-button"
              type="button"
              onClick={() => onNavigate(`/content-pages/${GUIDE_PAGE_KEY}`)}
            >
              처음 오신 분 안내
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate('/meetings')}
            >
              모임 찾기
            </button>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate('/notices')}
            >
              공지 보기
            </button>
          </>
        }
        aside={
          <div className="home-hero-stack">
            <div className="home-hero-card">
              <span className="home-chip">빠른 시작</span>
              <strong>어디서부터 봐야 할지 바로 정할 수 있게</strong>
              <p>
                안내, 공지, 모임 찾기를 첫 화면에서 같은 수준으로 두고 다음 행동을
                짧게 고를 수 있게 했습니다.
              </p>
            </div>

            <div className="home-hero-card home-hero-card--accent">
              <p className="home-hero-card__eyebrow">최신 공지</p>
              <strong>
                {latestNotice
                  ? latestNotice.title
                  : noticeLoading
                    ? '최신 공지를 불러오는 중입니다.'
                    : '게시된 공지가 생기면 여기서 바로 확인할 수 있습니다.'}
              </strong>
              <p>
                {latestNotice
                  ? `${formatDateTimeLabel(latestNotice.publishedAt)} 기준으로 확인할 수 있습니다.`
                  : '운영 화면에서 공지를 게시하면 홈에서도 바로 이어집니다.'}
              </p>
              <button
                className="ghost-button ghost-button--small"
                type="button"
                onClick={() =>
                  onNavigate(latestNotice ? `/notices/${latestNotice.id}` : '/notices')
                }
              >
                {latestNotice ? '최신 공지 열기' : '공지 보기'}
              </button>
            </div>
          </div>
        }
      />

      <section className="home-choice-grid">
        <button
          className="home-choice-card"
          type="button"
          onClick={() => onNavigate(`/content-pages/${GUIDE_PAGE_KEY}`)}
        >
          <span className="home-choice-card__eyebrow">Start Here</span>
          <strong>처음 오신 분 안내</strong>
          <p>AA 소개와 처음 참석 전에 읽어두면 좋은 기본 안내를 먼저 확인합니다.</p>
          <span className="home-choice-card__action">안내 읽기</span>
        </button>

        <button
          className="home-choice-card"
          type="button"
          onClick={() => onNavigate('/meetings')}
        >
          <span className="home-choice-card__eyebrow">Find A Meeting</span>
          <strong>가까운 모임 찾기</strong>
          <p>지역을 기준으로 공개된 모임을 살펴보고 시간과 장소를 확인합니다.</p>
          <span className="home-choice-card__action">모임 보러 가기</span>
        </button>

        <button
          className="home-choice-card"
          type="button"
          onClick={() => onNavigate('/notices')}
        >
          <span className="home-choice-card__eyebrow">Latest Updates</span>
          <strong>최신 공지 확인</strong>
          <p>운영 공지와 안내성 알림을 먼저 확인하고 필요한 정보로 이어집니다.</p>
          <span className="home-choice-card__action">공지 확인하기</span>
        </button>
      </section>

      <div className="feature-grid">
        <PageSection
          label="Latest Updates"
          title="지금 확인할 공지"
          description="홈에서 공지의 존재를 바로 확인하고, 필요한 경우 상세 화면으로 곧바로 이동할 수 있게 합니다."
        >
          {noticeLoading ? (
            <div className="section-note">최신 공지를 불러오는 중입니다...</div>
          ) : null}

          {notices.length > 0 ? (
            <div className="home-notice-list">
              {notices.map((notice) => (
                <button
                  key={notice.id}
                  className="home-notice-card"
                  type="button"
                  onClick={() => onNavigate(`/notices/${notice.id}`)}
                >
                  <span className="home-notice-card__meta">
                    {formatDateTimeLabel(notice.publishedAt)}
                  </span>
                  <strong>{notice.title}</strong>
                  <span className="home-notice-card__action">상세 보기</span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title={
                noticeLoadFailed
                  ? '공개 공지를 아직 불러오지 못했습니다.'
                  : '현재 게시된 공지가 없습니다.'
              }
              description={
                noticeLoadFailed
                  ? '잠시 후 다시 시도하거나 처음 오신 분 안내에서 기본 정보를 먼저 확인해 주세요.'
                  : '안내 페이지를 먼저 읽고 모임 찾기에서 지역별 정보를 확인할 수 있습니다.'
              }
            />
          )}
        </PageSection>

        <PageSection
          label="First Visit"
          title="처음 방문했다면 이 순서로 보시면 됩니다."
          description="설명보다 행동 순서를 먼저 보여 주어, 처음인 분도 망설임 없이 다음 단계로 넘어가도록 구성했습니다."
        >
          <div className="home-journey">
            <div className="home-journey__step">
              <span className="home-journey__number">1</span>
              <div>
                <strong>안내 페이지를 먼저 읽어보세요.</strong>
                <p>AA 소개와 처음 참석 전 참고할 내용을 짧게 확인할 수 있습니다.</p>
              </div>
            </div>

            <div className="home-journey__step">
              <span className="home-journey__number">2</span>
              <div>
                <strong>지역별 모임을 찾아보세요.</strong>
                <p>가까운 지역, 요일, 시간대를 기준으로 실제 참석 가능한 모임을 확인합니다.</p>
              </div>
            </div>

            <div className="home-journey__step">
              <span className="home-journey__number">3</span>
              <div>
                <strong>전화하거나 방문 계획을 세워보세요.</strong>
                <p>공개된 연락처와 모임 정보를 바탕으로 다음 행동으로 바로 이어집니다.</p>
              </div>
            </div>
          </div>
        </PageSection>
      </div>

      <PageSection
        label="Quick Reassurance"
        title="처음이라도 너무 많은 설명 없이 바로 이해할 수 있게"
        description="홈 하단에는 긴 소개 대신, 처음 방문자가 자주 궁금해하는 포인트만 짧게 정리합니다."
      >
        <div className="home-reassurance-grid">
          <div className="home-reassurance-card">
            <strong>처음 참석하는 분도 확인할 수 있습니다.</strong>
            <p>홈에서 안내를 읽고 모임을 찾아보는 흐름을 한 번에 이어지게 구성했습니다.</p>
          </div>

          <div className="home-reassurance-card">
            <strong>지역별 정보와 연락 지점을 공개 범위 안에서 확인합니다.</strong>
            <p>모임 상세에서 시간, 장소, 연락처를 차례대로 확인할 수 있습니다.</p>
          </div>

          <div className="home-reassurance-card">
            <strong>읽고 끝나는 화면이 아니라 다음 행동으로 이어집니다.</strong>
            <p>안내, 공지, 모임 찾기 사이를 자연스럽게 오가도록 CTA를 정리했습니다.</p>
          </div>
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

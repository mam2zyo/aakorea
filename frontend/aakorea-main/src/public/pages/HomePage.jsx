import { useEffect, useEffectEvent, useState } from 'react'
import { EmptyState, PageIntro, PageSection } from '../../public/ui'
import { publicContentApi } from '../features/content/api'

const GUIDE_PAGE_KEY = 'first-visitor-guide'
const HOME_AUDIENCES = Object.freeze([
  Object.freeze({
    description: 'AA를 처음 접하는 분이 가장 먼저 확인해야 할 흐름을 짧게 정리했습니다.',
    eyebrow: 'New To AA',
    highlights: Object.freeze([
      'AA가 어떤 모임인지 핵심만 먼저 이해합니다.',
      '가까운 지역의 공개 모임과 시간을 바로 찾습니다.',
      '처음 참석 전에 읽어둘 안내를 순서대로 확인합니다.',
    ]),
    id: 'newcomer',
    label: '처음 오신 분',
    primaryAction: Object.freeze({
      label: '처음 안내 보기',
      path: `/content-pages/${GUIDE_PAGE_KEY}`,
    }),
    secondaryAction: Object.freeze({
      label: '가까운 모임 찾기',
      path: '/meetings',
    }),
    title: '처음 방문이라면 안내와 모임 찾기부터 시작하세요.',
  }),
  Object.freeze({
    description: '가족이나 지인이 도움을 주고 싶을 때 확인할 만한 기본 안내와 운영 정보를 묶었습니다.',
    eyebrow: 'Family & Friends',
    highlights: Object.freeze([
      'AA의 기본 원칙과 참석 흐름을 먼저 이해합니다.',
      '공지에서 운영 안내와 일정 변경을 확인합니다.',
      '당사자가 직접 선택할 수 있도록 안내의 톤을 유지합니다.',
    ]),
    id: 'family',
    label: '가족/지인',
    primaryAction: Object.freeze({
      label: '처음 안내 보기',
      path: `/content-pages/${GUIDE_PAGE_KEY}`,
    }),
    secondaryAction: Object.freeze({
      label: '운영 공지 보기',
      path: '/notices',
    }),
    title: '가족이나 지인이라면 정보와 흐름을 먼저 살펴보세요.',
  }),
  Object.freeze({
    description: '전문가나 실무자가 참고할 수 있도록 공개 범위 안의 기본 설명과 공지를 우선 배치합니다.',
    eyebrow: 'Professionals',
    highlights: Object.freeze([
      'AA 소개와 공개 가능한 설명을 짧게 확인합니다.',
      '운영 공지와 안내 변경 사항을 최신순으로 봅니다.',
      '외부 설명보다 실제 공개 정보 구조를 먼저 파악합니다.',
    ]),
    id: 'professional',
    label: '전문가',
    primaryAction: Object.freeze({
      label: 'AA 기본 안내 보기',
      path: `/content-pages/${GUIDE_PAGE_KEY}`,
    }),
    secondaryAction: Object.freeze({
      label: '최신 공지 확인',
      path: '/notices',
    }),
    title: '전문가라면 공개 설명과 운영 공지를 먼저 확인하세요.',
  }),
  Object.freeze({
    description: '기존 멤버가 빠르게 필요한 화면으로 이동할 수 있도록 탐색 동선을 단순하게 정리했습니다.',
    eyebrow: 'Existing Members',
    highlights: Object.freeze([
      '지역별 모임과 시간 변경을 바로 다시 확인합니다.',
      '최근 공지에서 운영 안내와 일정 변화를 확인합니다.',
      '처음 방문자 안내도 같은 구조 안에서 다시 살펴볼 수 있습니다.',
    ]),
    id: 'member',
    label: '기존 멤버',
    primaryAction: Object.freeze({
      label: '모임 찾기',
      path: '/meetings',
    }),
    secondaryAction: Object.freeze({
      label: '공지 보기',
      path: '/notices',
    }),
    title: '기존 멤버도 필요한 안내와 모임 정보로 빠르게 이동할 수 있습니다.',
  }),
])

export function HomePage({ onNavigate }) {
  const [activeAudienceId, setActiveAudienceId] = useState(HOME_AUDIENCES[0].id)
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
  const activeAudience = HOME_AUDIENCES.find((audience) => audience.id === activeAudienceId)
    ?? HOME_AUDIENCES[0]
  const resourceLinks = [
    {
      description: 'AA 소개와 처음 참석 전에 읽어둘 내용을 먼저 확인합니다.',
      label: '처음 오신 분 안내',
      meta: '기본 안내',
      path: `/content-pages/${GUIDE_PAGE_KEY}`,
    },
    {
      description: '지역, 요일, 장소를 기준으로 공개된 모임을 찾아봅니다.',
      label: '가까운 모임 찾기',
      meta: '모임 탐색',
      path: '/meetings',
    },
    {
      description: latestNotice
        ? `${formatDateTimeLabel(latestNotice.publishedAt)} 게시 공지를 바로 확인합니다.`
        : '운영 공지와 안내 변경을 최신순으로 확인합니다.',
      label: latestNotice ? latestNotice.title : '최신 공지 확인',
      meta: latestNotice ? '최신 공지' : '운영 안내',
      path: latestNotice ? `/notices/${latestNotice.id}` : '/notices',
    },
    {
      description: '전체 공지 목록을 최신순으로 확인하고 필요한 상세로 이동합니다.',
      label: '공지 목록 보기',
      meta: '공지 모아보기',
      path: '/notices',
    },
  ]

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

      <section className="home-notice-banner">
        <div className="home-notice-banner__copy">
          <p className="home-notice-banner__eyebrow">Notice</p>
          <strong className="home-notice-banner__title">
            {latestNotice
              ? latestNotice.title
              : noticeLoading
                ? '최신 공지를 불러오는 중입니다.'
                : '운영 공지와 안내 변경이 생기면 여기서 먼저 알려드립니다.'}
          </strong>
          <p className="home-notice-banner__description">
            {latestNotice
              ? `${formatDateTimeLabel(latestNotice.publishedAt)} 기준으로 공개 중인 공지입니다.`
              : noticeLoadFailed
                ? '지금은 공지를 불러오지 못했지만 공지 페이지에서 다시 시도할 수 있습니다.'
                : '사무국 운영, 방문 안내, 주요 일정 변경 같은 소식은 공지에서 바로 이어집니다.'}
          </p>
        </div>

        <div className="home-notice-banner__actions">
          <button
            className="primary-button primary-button--small"
            type="button"
            onClick={() => onNavigate(latestNotice ? `/notices/${latestNotice.id}` : '/notices')}
          >
            {latestNotice ? '최신 공지 열기' : '공지 페이지 열기'}
          </button>
        </div>
      </section>

      <section className="home-audience-panel">
        <div className="home-audience-panel__header">
          <p className="eyebrow">Start With Your Situation</p>
          <h2>지금 나에게 맞는 안내부터 고르세요.</h2>
          <p>
            같은 정보를 모두에게 한 번에 보여주기보다, 방문 목적에 맞는 출발점을 먼저
            정할 수 있게 구성했습니다.
          </p>
        </div>

        <div className="home-audience-nav" role="tablist" aria-label="추천 탐색 경로">
          {HOME_AUDIENCES.map((audience) => (
            <button
              key={audience.id}
              role="tab"
              aria-selected={activeAudience.id === audience.id}
              className={`home-audience-tab${
                activeAudience.id === audience.id ? ' home-audience-tab--active' : ''
              }`}
              type="button"
              onClick={() => setActiveAudienceId(audience.id)}
            >
              {audience.label}
            </button>
          ))}
        </div>

        <div className="home-audience-content">
          <div className="home-audience-copy">
            <p className="home-chip">{activeAudience.eyebrow}</p>
            <h3>{activeAudience.title}</h3>
            <p>{activeAudience.description}</p>

            <div className="button-row">
              <button
                className="primary-button"
                type="button"
                onClick={() => onNavigate(activeAudience.primaryAction.path)}
              >
                {activeAudience.primaryAction.label}
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={() => onNavigate(activeAudience.secondaryAction.path)}
              >
                {activeAudience.secondaryAction.label}
              </button>
            </div>
          </div>

          <div className="home-audience-highlights">
            {activeAudience.highlights.map((highlight) => (
              <div key={highlight} className="home-audience-highlight">
                <strong>{highlight}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="feature-grid">
        <PageSection
          label="Latest Updates"
          title="지금 확인할 공지"
          description="중요한 운영 소식은 카드보다 리스트에 가깝게 정리해, 제목과 시각을 빠르게 훑을 수 있게 했습니다."
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
                  <div className="home-notice-card__copy">
                    <span className="home-notice-card__meta">
                      {formatDateTimeLabel(notice.publishedAt)}
                    </span>
                    <strong>{notice.title}</strong>
                  </div>
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
          label="First Visit Flow"
          title="처음 방문했다면 이 순서로 보시면 됩니다."
          description="긴 설명보다 행동 순서를 먼저 보여 주어, 처음인 분도 다음 단계로 자연스럽게 이어지도록 구성했습니다."
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
        label="Resource Guide"
        title="자주 찾는 안내를 한 번에 정리했습니다."
        description="문서형 정보는 카드보다 리스트로 정리해, 필요한 링크를 빠르게 고를 수 있게 구성했습니다."
      >
        <div className="home-resource-list">
          {resourceLinks.map((resource) => (
            <button
              key={`${resource.meta}-${resource.label}`}
              className="home-resource-link"
              type="button"
              onClick={() => onNavigate(resource.path)}
            >
              <div className="home-resource-link__copy">
                <span className="home-resource-link__meta">{resource.meta}</span>
                <strong>{resource.label}</strong>
                <p>{resource.description}</p>
              </div>
              <span className="home-resource-link__arrow" aria-hidden="true">-&gt;</span>
            </button>
          ))}
        </div>
      </PageSection>

      <section className="home-cta-band">
        <div className="home-cta-band__copy">
          <p className="eyebrow">Take The Next Step</p>
          <h2>지금 필요한 한 가지 행동만 선택해도 충분합니다.</h2>
          <p>
            처음 오신 분은 안내에서 시작하고, 바로 도움이 필요하면 모임 찾기로 이어질
            수 있게 출발점을 단순하게 유지했습니다.
          </p>
        </div>

        <div className="button-row">
          <button
            className="home-cta-band__primary"
            type="button"
            onClick={() => onNavigate('/meetings')}
          >
            가까운 모임 찾기
          </button>
          <button
            className="home-cta-band__ghost"
            type="button"
            onClick={() => onNavigate(`/content-pages/${GUIDE_PAGE_KEY}`)}
          >
            처음 안내 보기
          </button>
        </div>
      </section>
    </>
  )
}

function formatDateTimeLabel(value) {
  if (!value) {
    return '게시 시각 미정'
  }

  return value.replace('T', ' ').slice(0, 16)
}

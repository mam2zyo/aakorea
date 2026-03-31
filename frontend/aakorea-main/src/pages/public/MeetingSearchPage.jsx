import { useEffect, useEffectEvent, useState } from 'react'
import {
  DetailItem,
  EmptyState,
  PageIntro,
  PageSection,
  StatCard,
} from '../../components/ui'
import { publicMeetingApi } from '../../lib/api'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
  SEARCH_DAY_OF_WEEK_OPTIONS,
} from '../../lib/options'
import { lookupLabel } from '../../lib/view'

const INITIAL_PUBLIC_SEARCH = { province: 'seoul', dayOfWeek: '' }
const GUIDE_PAGE_PATH = '/content-pages/first-visitor-guide'

export function MeetingSearchPage({ onError, onNavigate }) {
  const [publicSearch, setPublicSearch] = useState(INITIAL_PUBLIC_SEARCH)
  const [publicMeetings, setPublicMeetings] = useState([])
  const [selectedPublicMeeting, setSelectedPublicMeeting] = useState(null)
  const [publicLoading, setPublicLoading] = useState(false)
  const [publicDetailLoading, setPublicDetailLoading] = useState(false)
  const [publicLoadFailed, setPublicLoadFailed] = useState(false)

  async function loadPublicMeetingDetail(meetingId, quiet = false) {
    setPublicDetailLoading(true)

    try {
      const detail = await publicMeetingApi.getMeeting(meetingId)
      setSelectedPublicMeeting(detail)
    } catch (error) {
      setSelectedPublicMeeting(null)
      if (!quiet) {
        onError(error, '모임 상세를 불러오지 못했습니다.')
      }
    } finally {
      setPublicDetailLoading(false)
    }
  }

  async function runSearch(filters, quiet = false) {
    setPublicLoading(true)

    try {
      const data = await publicMeetingApi.getMeetings(filters)
      setPublicMeetings(data)
      setPublicLoadFailed(false)

      if (data.length > 0) {
        await loadPublicMeetingDetail(data[0].id, true)
      } else {
        setSelectedPublicMeeting(null)
      }
    } catch (error) {
      setPublicMeetings([])
      setSelectedPublicMeeting(null)
      setPublicLoadFailed(true)
      if (!quiet) {
        onError(error, '공개 모임을 불러오지 못했습니다.')
      }
    } finally {
      setPublicLoading(false)
    }
  }

  const initialSearchEffect = useEffectEvent(() => {
    void runSearch(INITIAL_PUBLIC_SEARCH, true)
  })

  useEffect(() => {
    initialSearchEffect()
  }, [])

  const selectedProvinceLabel = lookupLabel(PROVINCE_OPTIONS, publicSearch.province)
  const selectedDayLabel = publicSearch.dayOfWeek
    ? lookupLabel(DAY_OF_WEEK_OPTIONS, publicSearch.dayOfWeek)
    : '요일 전체'
  const selectedMeetingProvince = selectedPublicMeeting
    ? lookupLabel(PROVINCE_OPTIONS, selectedPublicMeeting.province)
    : selectedProvinceLabel
  const selectedMeetingDay = selectedPublicMeeting
    ? lookupLabel(DAY_OF_WEEK_OPTIONS, selectedPublicMeeting.dayOfWeek)
    : null
  const selectedMeetingType = selectedPublicMeeting
    ? lookupLabel(MEETING_TYPE_OPTIONS, selectedPublicMeeting.type)
    : null

  function resetSearch() {
    setPublicSearch(INITIAL_PUBLIC_SEARCH)
    void runSearch(INITIAL_PUBLIC_SEARCH)
  }

  return (
    <>
      <PageIntro
        eyebrow="Find A Meeting"
        title="가까운 AA 모임을 찾아보고, 필요하면 바로 연락해 보세요."
        description="지역을 먼저 고르고 요일을 좁혀 가며 공개된 모임을 찾을 수 있습니다. 결과를 선택하면 장소와 대표 연락처를 같은 화면에서 바로 확인할 수 있습니다."
        actions={
          <>
            <button
              className="ghost-button"
              type="button"
              onClick={() => onNavigate(GUIDE_PAGE_PATH)}
            >
              처음 안내 보기
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
          <div className="info-stack">
            <div className="info-card">
              <strong>먼저 지역을 선택하세요.</strong>
              <p>현재는 지역 기준 탐색이 중심이고, 요일은 결과를 더 좁혀 보는 보조 필터로 씁니다.</p>
            </div>
            <div className="info-card">
              <strong>대표 연락처가 있으면 바로 전화할 수 있습니다.</strong>
              <p>모임 상세에서 공개된 전화번호를 바로 확인하고 다음 행동으로 이어질 수 있습니다.</p>
            </div>
          </div>
        }
      />

      <PageSection
        label="Meeting Search"
        title="지역을 고르고, 결과를 보고, 상세와 연락처까지 이어서 확인하세요."
        description="검색 폼, 결과 목록, 모임 상세를 한 화면에 두어 처음 방문한 분도 다음 행동을 망설이지 않게 구성했습니다."
      >
        <div className="stats-grid stats-grid--compact">
          <StatCard label="선택 지역" value={selectedProvinceLabel} />
          <StatCard label="요일 필터" value={selectedDayLabel} />
          <StatCard label="검색 결과" value={`${publicMeetings.length}건`} />
        </div>

        <div className="meeting-search-toolbar">
          <div className="meeting-search-toolbar__intro">
            <strong>먼저 조건을 고른 뒤 결과를 확인해 보세요.</strong>
            <p>
              너무 많은 정보를 먼저 보여주기보다, 지역과 요일을 짧게 고른 다음
              결과에서 실제로 갈 수 있는 모임을 확인하게 했습니다.
            </p>
          </div>

          <form
            className="field-grid field-grid--public meeting-search-toolbar__form"
            onSubmit={(event) => {
              event.preventDefault()
              void runSearch(publicSearch)
            }}
          >
            <label className="field">
              <span className="field__label">지역</span>
              <select
                value={publicSearch.province}
                onChange={(event) =>
                  setPublicSearch((previous) => ({
                    ...previous,
                    province: event.target.value,
                  }))
                }
              >
                {PROVINCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field__label">요일</span>
              <select
                value={publicSearch.dayOfWeek}
                onChange={(event) =>
                  setPublicSearch((previous) => ({
                    ...previous,
                    dayOfWeek: event.target.value,
                  }))
                }
              >
                {SEARCH_DAY_OF_WEEK_OPTIONS.map((option) => (
                  <option key={option.value || 'ALL'} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="button-row button-row--compact">
              <button
                className="primary-button"
                type="submit"
                disabled={publicLoading}
              >
                {publicLoading ? '조회 중...' : '모임 조회'}
              </button>
              <button
                className="ghost-button"
                type="button"
                onClick={resetSearch}
                disabled={publicLoading}
              >
                기본 조건으로 보기
              </button>
            </div>
          </form>
        </div>

        <div className="public-layout">
          <section className="resource-panel">
            <div className="resource-panel__header">
              <strong>검색 결과</strong>
              <span>{selectedProvinceLabel}{publicSearch.dayOfWeek ? ` · ${selectedDayLabel}` : ''}</span>
            </div>

            {publicMeetings.length === 0 ? (
              <>
                <EmptyState
                  title={
                    publicLoadFailed
                      ? '모임 정보를 아직 불러오지 못했습니다.'
                      : '조건에 맞는 모임을 찾지 못했습니다.'
                  }
                  description={
                    publicLoadFailed
                      ? '잠시 후 다시 시도하거나 처음 오신 분 안내에서 기본 정보를 먼저 확인해 주세요.'
                      : '요일을 전체로 바꾸거나 다른 지역으로 다시 찾아보면 더 많은 결과가 나올 수 있습니다.'
                  }
                />
                <div className="button-row">
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={resetSearch}
                    disabled={publicLoading}
                  >
                    기본 조건으로 다시 보기
                  </button>
                  <button
                    className="ghost-button"
                    type="button"
                    onClick={() => onNavigate(GUIDE_PAGE_PATH)}
                  >
                    처음 안내 보기
                  </button>
                </div>
              </>
            ) : (
              <div className="meeting-list">
                {publicMeetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    className={`meeting-card${
                      selectedPublicMeeting?.id === meeting.id
                        ? ' meeting-card--selected'
                        : ''
                    }`}
                    type="button"
                    onClick={() => void loadPublicMeetingDetail(meeting.id)}
                  >
                    <div className="meeting-card__topline">
                      <span className="meeting-card__group">{meeting.groupName}</span>
                      <span className="meeting-card__badge">
                        {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                      </span>
                    </div>
                    <strong className="meeting-card__title">
                      {lookupLabel(PROVINCE_OPTIONS, meeting.province)} ·{' '}
                      {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} ·{' '}
                      {meeting.startTime}
                    </strong>
                    <span className="meeting-card__location">
                      {meeting.location.name}
                    </span>
                    <span className="meeting-card__meta">{meeting.location.address}</span>
                    <span className="meeting-card__action">상세와 연락처 보기</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="resource-panel resource-panel--detail">
            <div className="resource-panel__header">
              <strong>모임 상세</strong>
              <span>{publicDetailLoading ? '불러오는 중' : '대표 연락처 확인'}</span>
            </div>

            {selectedPublicMeeting ? (
              <div className="meeting-detail">
                <div className="meeting-detail__hero meeting-detail__hero--meeting">
                  <div className="meeting-detail__hero-copy">
                    <p className="meeting-detail__eyebrow">
                      {selectedPublicMeeting.groupName}
                    </p>
                    <h2>
                      {selectedMeetingProvince} · {selectedMeetingDay}
                    </h2>
                    <p>
                      {selectedPublicMeeting.startTime} · {selectedMeetingType}
                    </p>
                  </div>

                  {selectedPublicMeeting.contactPhone ? (
                    <a
                      className="primary-button meeting-detail__call"
                      href={`tel:${selectedPublicMeeting.contactPhone}`}
                    >
                      대표 연락처로 바로 전화하기
                    </a>
                  ) : (
                    <div className="meeting-detail__callout">
                      <strong>현재 공개된 대표 연락처가 없습니다.</strong>
                      <p>장소와 시간을 먼저 확인한 뒤 다른 지역 결과도 함께 살펴보세요.</p>
                    </div>
                  )}
                </div>

                <dl className="detail-grid detail-grid--meeting">
                  <DetailItem label="장소명" value={selectedPublicMeeting.location.name} />
                  <DetailItem
                    label="주소"
                    value={selectedPublicMeeting.location.address}
                  />
                  <DetailItem label="모임 형식" value={selectedMeetingType} />
                  <DetailItem
                    label="대표 연락처"
                    value={
                      selectedPublicMeeting.contactPhone ??
                      '현재 공개 가능한 연락처가 없습니다.'
                    }
                  />
                </dl>

                <div className="meeting-help-grid">
                  <div className="meeting-help-card">
                    <strong>처음 참석해도 괜찮습니다.</strong>
                    <p>모임 장소와 시간을 먼저 확인한 뒤, 필요하면 대표 연락처로 문의해 보세요.</p>
                  </div>

                  <div className="meeting-help-card">
                    <strong>읽고 끝나지 않게 다음 행동을 바로 보여줍니다.</strong>
                    <p>결과를 고르면 장소, 주소, 형식, 전화 연결이 한곳에서 이어집니다.</p>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="선택된 모임이 없습니다."
                description="결과 목록에서 모임을 선택하면 위치와 연락처를 같은 흐름에서 확인할 수 있습니다."
              />
            )}
          </section>
        </div>
      </PageSection>
    </>
  )
}

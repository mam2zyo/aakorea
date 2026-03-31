import { useEffect, useEffectEvent, useState } from 'react'
import {
  DetailItem,
  EmptyState,
  PageIntro,
  PageSection,
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

export function MeetingSearchPage({ onError }) {
  const [publicSearch, setPublicSearch] = useState(INITIAL_PUBLIC_SEARCH)
  const [publicMeetings, setPublicMeetings] = useState([])
  const [selectedPublicMeeting, setSelectedPublicMeeting] = useState(null)
  const [publicLoading, setPublicLoading] = useState(false)
  const [publicDetailLoading, setPublicDetailLoading] = useState(false)

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

      if (data.length > 0) {
        await loadPublicMeetingDetail(data[0].id, true)
      } else {
        setSelectedPublicMeeting(null)
      }
    } catch (error) {
      setPublicMeetings([])
      setSelectedPublicMeeting(null)
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

  return (
    <>
      <PageIntro
        eyebrow="Public Flow"
        title="지역 기준으로 모임을 찾고 대표 연락처까지 확인합니다."
        description="Province와 요일을 선택해 공개 모임 목록을 조회하고, 선택한 모임의 장소와 대표 연락처를 이어서 확인할 수 있습니다."
        aside={
          <div className="info-stack">
            <div className="info-card">
              <strong>검색 기준</strong>
              <p>현재 MVP는 Province 기준 조회를 기본으로 하고, 요일은 보조 필터로 사용합니다.</p>
            </div>
            <div className="info-card">
              <strong>연락 연결</strong>
              <p>모임 상세에서는 Group의 대표 연락처를 확인할 수 있습니다.</p>
            </div>
          </div>
        }
      />

      <PageSection
        label="Meeting Search"
        title="지역과 요일을 선택해 모임을 탐색하세요."
        description="조회 결과는 목록과 상세를 한 작업 흐름 안에서 보여 줍니다."
      >
        <form
          className="field-grid field-grid--public"
          onSubmit={(event) => {
            event.preventDefault()
            void runSearch(publicSearch)
          }}
        >
          <label className="field">
            <span className="field__label">Province</span>
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
          </div>
        </form>

        <div className="public-layout">
          <section className="resource-panel">
            <div className="resource-panel__header">
              <strong>검색 결과</strong>
              <span>{publicMeetings.length}건</span>
            </div>

            {publicMeetings.length === 0 ? (
              <EmptyState
                title="조회 결과가 없습니다."
                description="운영 화면에서 Group과 Meeting을 등록한 뒤 다시 확인해 주세요."
              />
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
                    <span className="meeting-card__group">{meeting.groupName}</span>
                    <strong className="meeting-card__title">
                      {lookupLabel(PROVINCE_OPTIONS, meeting.province)} ·{' '}
                      {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)}
                    </strong>
                    <span className="meeting-card__meta">
                      {meeting.startTime} /{' '}
                      {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                    </span>
                    <span className="meeting-card__location">
                      {meeting.location.name}
                    </span>
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
                <div className="meeting-detail__hero">
                  <p className="meeting-detail__eyebrow">
                    {selectedPublicMeeting.groupName}
                  </p>
                  <h2>
                    {lookupLabel(PROVINCE_OPTIONS, selectedPublicMeeting.province)} /{' '}
                    {lookupLabel(
                      DAY_OF_WEEK_OPTIONS,
                      selectedPublicMeeting.dayOfWeek,
                    )}
                  </h2>
                  <p>
                    {selectedPublicMeeting.startTime} ·{' '}
                    {lookupLabel(MEETING_TYPE_OPTIONS, selectedPublicMeeting.type)}
                  </p>
                </div>

                <dl className="detail-grid">
                  <DetailItem label="장소명" value={selectedPublicMeeting.location.name} />
                  <DetailItem
                    label="주소"
                    value={selectedPublicMeeting.location.address}
                  />
                  <DetailItem
                    label="대표 연락처"
                    value={
                      selectedPublicMeeting.contactPhone ??
                      '현재 공개 가능한 연락처가 없습니다.'
                    }
                  />
                </dl>
              </div>
            ) : (
              <EmptyState
                title="선택된 모임이 없습니다."
                description="결과 목록에서 모임을 선택하면 위치와 연락처를 확인할 수 있습니다."
              />
            )}
          </section>
        </div>
      </PageSection>
    </>
  )
}

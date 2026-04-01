import { useEffect, useEffectEvent, useState } from 'react'
import {
  DetailItem,
  EmptyState,
  Field,
  PageIntro,
  PageSection,
} from '../../../components/ui'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
  SEARCH_DAY_OF_WEEK_OPTIONS,
} from '../../../lib/options'
import { lookupLabel } from '../../../lib/view'
import { ApiError } from '../../../shared/lib/request'
import { publicMeetingApi } from '../api/public'

const DEFAULT_PROVINCE = PROVINCE_OPTIONS[0]?.value ?? 'seoul'

export function MeetingSearchPage({
  dayOfWeek,
  meetingId,
  onError,
  onNavigate,
  province,
}) {
  const [filters, setFilters] = useState({
    province: province || DEFAULT_PROVINCE,
    dayOfWeek: dayOfWeek || '',
  })
  const [meetings, setMeetings] = useState([])
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [missingMeeting, setMissingMeeting] = useState(false)

  useEffect(() => {
    setFilters({
      province: province || DEFAULT_PROVINCE,
      dayOfWeek: dayOfWeek || '',
    })
  }, [dayOfWeek, province])

  async function loadMeetingDetail(id, quiet = false) {
    setDetailLoading(true)

    try {
      const detail = await publicMeetingApi.getMeeting(id)
      setSelectedMeeting(detail)
      setMissingMeeting(false)
      return true
    } catch (error) {
      setSelectedMeeting(null)

      if (error instanceof ApiError && error.status === 404) {
        setMissingMeeting(true)
        return false
      }

      if (!quiet) {
        onError(error, '모임 상세 정보를 불러오지 못했습니다.')
      }

      return false
    } finally {
      setDetailLoading(false)
    }
  }

  async function loadMeetings() {
    setLoading(true)

    try {
      const summaries = await publicMeetingApi.getMeetings({
        province: filters.province || DEFAULT_PROVINCE,
        dayOfWeek: filters.dayOfWeek,
      })

      setMeetings(summaries)

      if (summaries.length === 0) {
        setSelectedMeeting(null)
        setMissingMeeting(false)
        return
      }

      const preferredId = meetingId
        ? Number(meetingId)
        : selectedMeeting?.id && summaries.some((item) => item.id === selectedMeeting.id)
          ? selectedMeeting.id
          : summaries[0].id

      const loaded = await loadMeetingDetail(preferredId, true)
      if (!loaded) {
        setSelectedMeeting(null)
      }
    } catch (error) {
      setMeetings([])
      setSelectedMeeting(null)
      onError(error, '공개 모임 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadMeetingsEffect = useEffectEvent(() => {
    void loadMeetings()
  })

  useEffect(() => {
    loadMeetingsEffect()
  }, [filters.dayOfWeek, filters.province, meetingId])

  return (
    <>
      <PageIntro
        eyebrow="Public Meetings"
        title="지역과 요일을 기준으로 가까운 AA 모임을 찾을 수 있습니다."
        description="먼저 지역을 고르고, 필요하면 요일로 좁혀서 실제 참석 가능한 모임을 확인합니다."
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
              onClick={() => onNavigate('/notices')}
            >
              공지 보기
            </button>
          </>
        }
      />

      <PageSection
        label="Meeting Search"
        title="원하는 조건으로 모임을 좁혀 보세요."
        description="현재 백엔드는 `province`가 필수이므로, 먼저 지역을 선택한 뒤 결과를 조회합니다."
      >
        <form
          className="meeting-filter-grid"
          onSubmit={(event) => {
            event.preventDefault()
            void loadMeetings()
          }}
        >
          <Field label="지역">
            <select
              value={filters.province}
              onChange={(event) =>
                setFilters((previous) => ({
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
          </Field>

          <Field label="요일">
            <select
              value={filters.dayOfWeek}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  dayOfWeek: event.target.value,
                }))
              }
            >
              {SEARCH_DAY_OF_WEEK_OPTIONS.map((option) => (
                <option key={option.value || 'all'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="button-row button-row--compact">
            <button className="primary-button" type="submit">
              조건 다시 조회
            </button>
          </div>
        </form>

        {loading ? <div className="section-note">모임 목록을 불러오는 중입니다...</div> : null}
        {detailLoading ? <div className="section-note">선택한 모임을 불러오는 중입니다...</div> : null}

        <div className="public-layout">
          <section className="resource-panel">
            <div className="resource-panel__header">
              <strong>모임 목록</strong>
              <span>{meetings.length}개</span>
            </div>

            {meetings.length === 0 ? (
              <EmptyState
                title="조건에 맞는 모임이 없습니다."
                description="지역이나 요일 조건을 바꿔 다시 확인해 주세요."
              />
            ) : (
              <div className="meeting-list">
                {meetings.map((meeting) => (
                  <button
                    key={meeting.id}
                    className={`meeting-card${
                      selectedMeeting?.id === meeting.id ? ' meeting-card--selected' : ''
                    }`}
                    type="button"
                    onClick={() => void loadMeetingDetail(meeting.id)}
                  >
                    <span className="meeting-card__group">{meeting.groupName}</span>
                    <strong className="meeting-card__title">
                      {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                    </strong>
                    <span className="entity-item__meta">
                      {meeting.groupLocation?.name || '기본 장소 미정'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="resource-panel resource-panel--detail">
            <div className="resource-panel__header">
              <strong>모임 상세</strong>
              <span>{selectedMeeting ? selectedMeeting.groupName : '선택 대기'}</span>
            </div>

            {missingMeeting ? (
              <EmptyState
                title="선택한 모임을 찾지 못했습니다."
                description="비활성화되었거나 더 이상 공개되지 않은 모임일 수 있습니다."
              />
            ) : null}

            {selectedMeeting ? (
              <div className="meeting-detail">
                <div className="meeting-detail__hero">
                  <p className="meeting-detail__eyebrow">
                    {lookupLabel(PROVINCE_OPTIONS, selectedMeeting.province)}
                  </p>
                  <h2>{selectedMeeting.groupName}</h2>
                  <p>
                    {lookupLabel(DAY_OF_WEEK_OPTIONS, selectedMeeting.dayOfWeek)} {selectedMeeting.startTime}
                    {' · '}
                    {lookupLabel(MEETING_TYPE_OPTIONS, selectedMeeting.type)}
                  </p>
                </div>

                <dl className="detail-grid">
                  <DetailItem
                    label="기본 장소"
                    value={selectedMeeting.group.locationName || '미정'}
                  />
                  <DetailItem
                    label="주소"
                    value={selectedMeeting.group.locationAddress || '공개 주소 없음'}
                  />
                  <DetailItem
                    label="예외 장소 메모"
                    value={selectedMeeting.meetingPlaceNote || '없음'}
                  />
                  <DetailItem
                    label="연락처"
                    value={selectedMeeting.contactPhone || '공개 연락처 없음'}
                  />
                </dl>

                {selectedMeeting.contactPhone ? (
                  <div className="button-row button-row--compact">
                    <a className="primary-button" href={`tel:${selectedMeeting.contactPhone}`}>
                      전화 걸기
                    </a>
                  </div>
                ) : null}

                {selectedMeeting.group.introduction ? (
                  <div className="content-body">{selectedMeeting.group.introduction}</div>
                ) : null}

                {selectedMeeting.group.notice ? (
                  <div className="content-note">
                    <strong>공지</strong>
                    <p>{selectedMeeting.group.notice}</p>
                  </div>
                ) : null}

                {selectedMeeting.group.changeSummary ? (
                  <div className="content-note">
                    <strong>최근 변경</strong>
                    <p>{selectedMeeting.group.changeSummary}</p>
                  </div>
                ) : null}

                <div className="schedule-list">
                  <strong>같은 Group의 활성 모임</strong>
                  {selectedMeeting.groupMeetings.map((meeting) => (
                    <div key={meeting.id} className="schedule-item">
                      <span>
                        {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                      </span>
                      <span>{lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : meetings.length > 0 && !missingMeeting ? (
              <EmptyState
                title="선택된 모임이 없습니다."
                description="왼쪽 목록에서 모임을 선택하면 상세를 확인할 수 있습니다."
              />
            ) : null}
          </section>
        </div>
      </PageSection>
    </>
  )
}

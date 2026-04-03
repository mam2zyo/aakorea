import { useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
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
  groupId,
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
  const [loading, setLoading] = useState(false)
  const [groupDetails, setGroupDetails] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [missingGroup, setMissingGroup] = useState(false)

  const activeGroupId = Number.isFinite(groupId) ? groupId : null
  const isDialogOpen = activeGroupId !== null

  useEffect(() => {
    setFilters({
      province: province || DEFAULT_PROVINCE,
      dayOfWeek: dayOfWeek || '',
    })
  }, [dayOfWeek, province])

  async function loadMeetings() {
    setLoading(true)

    try {
      const summaries = await publicMeetingApi.getMeetings({
        province: filters.province || DEFAULT_PROVINCE,
        dayOfWeek: filters.dayOfWeek,
      })

      setMeetings(summaries)
    } catch (error) {
      setMeetings([])
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
  }, [filters.dayOfWeek, filters.province])

  async function loadGroupDetails(targetGroupId) {
    if (!Number.isFinite(targetGroupId)) {
      setGroupDetails(null)
      setMissingGroup(false)
      return
    }

    setDetailLoading(true)

    try {
      const detail = await publicMeetingApi.getGroup(targetGroupId)
      setGroupDetails(detail)
      setMissingGroup(false)
    } catch (error) {
      setGroupDetails(null)

      if (error instanceof ApiError && error.status === 404) {
        setMissingGroup(true)
        return
      }

      onError(error, '선택한 Group 정보를 불러오지 못했습니다.')
    } finally {
      setDetailLoading(false)
    }
  }

  const loadGroupDetailsEffect = useEffectEvent((targetGroupId) => {
    void loadGroupDetails(targetGroupId)
  })

  useEffect(() => {
    loadGroupDetailsEffect(activeGroupId)
  }, [activeGroupId])

  const selectedMeeting = useMemo(() => {
    if (!groupDetails) {
      return null
    }

    if (Number.isFinite(meetingId)) {
      const focusedMeeting = groupDetails.meetings.find((meeting) => meeting.id === meetingId)
      if (focusedMeeting) {
        return focusedMeeting
      }
    }

    return groupDetails.meetings[0] ?? null
  }, [groupDetails, meetingId])

  const closePath = useMemo(() => buildMeetingsPath(filters), [filters.dayOfWeek, filters.province])
  const selectedSearchMeetingId = selectedMeeting?.id ?? meetingId ?? null

  useEffect(() => {
    if (!isDialogOpen) {
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onNavigate(closePath)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closePath, isDialogOpen, onNavigate])

  return (
    <>
      <PageIntro
        eyebrow="Public Meetings"
        title="가까운 AA 모임을 찾아보세요."
        description="지역과 요일을 고른 뒤 모임을 누르면, 같은 Group의 전체 일정과 장소를 한 번에 확인할 수 있습니다."
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
        title="조건을 고르고 모임을 선택하세요."
        description="선택한 모임에 맞춰 장소와 향후 지도 영역이 함께 바뀌도록 구성했습니다."
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

        <section className="meeting-search-results">
          <div className="meeting-search-results__header">
            <div className="meeting-search-results__copy">
              <strong>모임 목록</strong>
              <p>리스트에서 모임을 선택하면 장소와 그룹 안내가 모달로 열립니다.</p>
            </div>
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
                  className={`meeting-search-item${
                    selectedSearchMeetingId === meeting.id ? ' meeting-search-item--active' : ''
                  }`}
                  type="button"
                  onClick={() => onNavigate(buildMeetingsPath(filters, meeting.groupId, meeting.id))}
                >
                  <div className="meeting-search-item__body">
                    <span className="meeting-search-item__group">{meeting.groupName}</span>
                    <strong className="meeting-search-item__title">
                      {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                      {' · '}
                      {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                    </strong>
                    <span className="meeting-search-item__meta">
                      {meeting.locationName || '장소 미정'}
                    </span>
                  </div>
                  <span className="meeting-search-item__province">
                    {lookupLabel(PROVINCE_OPTIONS, meeting.province)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </PageSection>

      {isDialogOpen ? (
        <div
          className="meeting-focus-overlay"
          role="presentation"
          onClick={() => onNavigate(closePath)}
        >
          <section
            aria-labelledby="meeting-focus-title"
            aria-modal="true"
            className="meeting-focus-dialog"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="meeting-focus-dialog__header">
              <div className="meeting-focus-dialog__identity">
                <h2 id="meeting-focus-title">{groupDetails?.name ?? '모임 안내'}</h2>
                <p className="meeting-focus-dialog__district">
                  {groupDetails?.district?.name || '지역연합 정보 없음'}
                </p>
              </div>

              <button
                aria-label="모달 닫기"
                className="meeting-focus-dialog__close"
                type="button"
                onClick={() => onNavigate(closePath)}
              >
                ×
              </button>
            </header>

            <div className="meeting-focus-dialog__body">
              {detailLoading ? (
                <div className="meeting-focus-state">Group 안내를 불러오는 중입니다...</div>
              ) : null}

              {missingGroup ? (
                <EmptyState
                  title="요청한 Group을 찾지 못했습니다."
                  description="비공개 처리되었거나 더 이상 공개 중인 모임이 없을 수 있습니다."
                />
              ) : null}

              {groupDetails && selectedMeeting ? (
                <div className="meeting-focus-sheet">
                  <section className="meeting-focus-section">
                    <div className="meeting-focus-section__header">
                      <strong>모임 리스트</strong>
                      <span>{groupDetails.meetings.length}개</span>
                    </div>

                    <div className="meeting-focus-list">
                      {groupDetails.meetings.map((meeting) => (
                        <button
                          key={meeting.id}
                          className={`meeting-focus-list__item${
                            selectedMeeting.id === meeting.id ? ' meeting-focus-list__item--selected' : ''
                          }`}
                          type="button"
                          onClick={() => onNavigate(buildMeetingsPath(filters, groupDetails.id, meeting.id))}
                        >
                          <span className="meeting-focus-list__dot" aria-hidden="true" />
                          <strong>
                            {lookupLabel(DAY_OF_WEEK_OPTIONS, meeting.dayOfWeek)} {meeting.startTime}
                          </strong>
                          <span>{lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}</span>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="meeting-focus-section meeting-focus-section--location">
                    <p className="meeting-focus-section__label">모임 장소</p>
                    <div className="meeting-focus-location-summary">
                      <strong className="meeting-focus-location-card__title">
                        {selectedMeeting.locationName || '장소명 미정'}
                      </strong>
                      <p className="meeting-focus-location-card__address">
                        {selectedMeeting.locationAddress || '공개 주소 없음'}
                      </p>
                    </div>
                  </section>

                  <section className="meeting-focus-section meeting-focus-section--map">
                    <div className="meeting-focus-map">
                      <div className="meeting-focus-map__pin" aria-hidden="true" />
                      <div className="meeting-focus-map__copy meeting-focus-location-card meeting-focus-location-card--overlay">
                        <strong className="meeting-focus-location-card__title">
                          {selectedMeeting.locationName || '선택한 모임 위치'}
                        </strong>
                        <p className="meeting-focus-location-card__address">
                          {selectedMeeting.locationAddress || '지도 API 연동 시 이 위치가 이 영역에 표시됩니다.'}
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
            </div>

            {groupDetails ? (
              <footer className="meeting-focus-dialog__footer">
                <div className="meeting-focus-contact">
                  <p className="meeting-focus-section__label">연락처</p>
                  <strong className="meeting-focus-contact__value">
                    {groupDetails.contactPhone || '공개 연락처 없음'}
                  </strong>
                </div>

                {groupDetails.contactPhone ? (
                  <a className="primary-button meeting-focus-contact__action" href={`tel:${groupDetails.contactPhone}`}>
                    전화 걸기
                  </a>
                ) : null}
              </footer>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  )
}

function buildMeetingsPath(filters, groupId = null, meetingId = null) {
  const searchParams = new URLSearchParams()

  if (filters.province) {
    searchParams.set('province', filters.province)
  }

  if (filters.dayOfWeek) {
    searchParams.set('dayOfWeek', filters.dayOfWeek)
  }

  if (Number.isFinite(groupId)) {
    searchParams.set('groupId', String(groupId))
  }

  if (Number.isFinite(meetingId)) {
    searchParams.set('meetingId', String(meetingId))
  }

  const query = searchParams.toString()
  return query ? `/meetings?${query}` : '/meetings'
}

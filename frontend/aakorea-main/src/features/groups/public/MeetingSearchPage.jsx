import { useEffect } from 'react'
import {
  Field,
  PageIntro,
  PageSection,
} from '../../../public/ui'
import {
  PROVINCE_OPTIONS,
  SEARCH_DAY_OF_WEEK_OPTIONS,
} from '../../../lib/options'
import { MeetingFocusDialog } from './components/MeetingFocusDialog'
import { MeetingResultsSection } from './components/MeetingResultsSection'
import { useMeetingSearch } from './hooks/useMeetingSearch'
import {
  buildMeetingsPath,
  DEFAULT_PROVINCE,
  DEFAULT_NEARBY_RADIUS_KM,
  MEETING_SEARCH_MODE,
  readMeetingSearchMode,
} from './utils'

export function MeetingSearchPage({
  dayOfWeek,
  groupId,
  latitude,
  longitude,
  meetingId,
  onError,
  onNavigate,
  province,
  radiusKm,
  searchMode,
}) {
  const {
    activeFilters,
    closePath,
    detailLoading,
    filters,
    groupDetails,
    isDialogOpen,
    loading,
    meetings,
    missingGroup,
    searchMeta,
    selectedMeeting,
    selectedSearchMeetingId,
    setFilters,
  } = useMeetingSearch({
    dayOfWeek,
    groupId,
    latitude,
    longitude,
    meetingId,
    onError,
    province,
    radiusKm,
    searchMode,
  })
  const nearbySearchActive = readMeetingSearchMode(activeFilters.searchMode) === MEETING_SEARCH_MODE.NEARBY

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
        {nearbySearchActive ? (
          <div className="meeting-search-mode-banner" role="status">
            <strong>현재 위치 기준 검색 중</strong>
            <span>
              요일 필터는 유지하고, 가까운 모임 20개를 찾을 때까지 반경을 최대 50km까지 넓혀 확인합니다.
            </span>
          </div>
        ) : null}

        <form
          className="meeting-filter-grid"
          onSubmit={(event) => {
            event.preventDefault()
            onNavigate(buildMeetingsPath({
              ...filters,
              province: filters.province || DEFAULT_PROVINCE,
              searchMode: MEETING_SEARCH_MODE.REGION,
            }))
          }}
        >
          <Field label="지역">
            <select
              value={filters.province}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  province: event.target.value,
                  searchMode: MEETING_SEARCH_MODE.REGION,
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
            <button className="primary-button" type="submit" disabled={loading}>
              지역으로 조회
            </button>
            <button
              className="ghost-button"
              type="button"
              disabled={loading}
              onClick={() => void requestNearbyMeetings()}
            >
              {loading && nearbySearchActive ? '내 주변 확인 중...' : '내 주변 찾기'}
            </button>
            {nearbySearchActive ? (
              <button
                className="ghost-button"
                type="button"
                disabled={loading}
                onClick={() => onNavigate(buildMeetingsPath({
                  province: filters.province || DEFAULT_PROVINCE,
                  dayOfWeek: filters.dayOfWeek,
                  searchMode: MEETING_SEARCH_MODE.REGION,
                }))}
              >
                지역 검색으로 전환
              </button>
            ) : null}
          </div>
        </form>

        <MeetingResultsSection
          filters={activeFilters}
          loading={loading}
          meetings={meetings}
          onNavigate={onNavigate}
          searchMeta={searchMeta}
          selectedSearchMeetingId={selectedSearchMeetingId}
        />
      </PageSection>

      {isDialogOpen ? (
        <MeetingFocusDialog
          detailLoading={detailLoading}
          filters={activeFilters}
          groupDetails={groupDetails}
          missingGroup={missingGroup}
          onClose={() => onNavigate(closePath)}
          onNavigate={onNavigate}
          selectedMeeting={selectedMeeting}
        />
      ) : null}
    </>
  )

  async function requestNearbyMeetings() {
    if (typeof window === 'undefined' || !window.navigator?.geolocation) {
      onError(new Error('geolocation is not supported'), '브라우저에서 현재 위치 기능을 지원하지 않습니다.')
      return
    }

    try {
      const position = await readCurrentPosition()
      onNavigate(buildMeetingsPath({
        dayOfWeek: filters.dayOfWeek,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        radiusKm: DEFAULT_NEARBY_RADIUS_KM,
        searchMode: MEETING_SEARCH_MODE.NEARBY,
      }))
    } catch (error) {
      onError(error, readLocationErrorMessage(error))
    }
  }
}

function readCurrentPosition() {
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 60_000,
      timeout: 10_000,
    })
  })
}

function readLocationErrorMessage(error) {
  if (typeof window !== 'undefined' && error instanceof window.GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return '현재 위치 권한이 거부되었습니다. 브라우저 권한을 허용한 뒤 다시 시도해 주세요.'
      case error.POSITION_UNAVAILABLE:
        return '현재 위치를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.'
      case error.TIMEOUT:
        return '현재 위치 확인 시간이 초과되었습니다. 다시 시도해 주세요.'
      default:
        return '현재 위치를 확인하지 못했습니다.'
    }
  }

  return '현재 위치를 확인하지 못했습니다.'
}

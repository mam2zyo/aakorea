import { useEffect } from 'react'
import {
  Field,
  PageIntro,
  PageSection,
} from '../../../components/ui'
import {
  PROVINCE_OPTIONS,
  SEARCH_DAY_OF_WEEK_OPTIONS,
} from '../../../lib/options'
import { MeetingFocusDialog } from './components/MeetingFocusDialog'
import { MeetingResultsSection } from './components/MeetingResultsSection'
import { useMeetingSearch } from './hooks/useMeetingSearch'

export function MeetingSearchPage({
  dayOfWeek,
  groupId,
  meetingId,
  onError,
  onNavigate,
  province,
}) {
  const {
    closePath,
    detailLoading,
    filters,
    groupDetails,
    isDialogOpen,
    loading,
    meetings,
    missingGroup,
    selectedMeeting,
    selectedSearchMeetingId,
    setFilters,
    loadMeetings,
  } = useMeetingSearch({
    dayOfWeek,
    groupId,
    meetingId,
    onError,
    province,
  })

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

        <MeetingResultsSection
          filters={filters}
          loading={loading}
          meetings={meetings}
          onNavigate={onNavigate}
          selectedSearchMeetingId={selectedSearchMeetingId}
        />
      </PageSection>

      {isDialogOpen ? (
        <MeetingFocusDialog
          detailLoading={detailLoading}
          filters={filters}
          groupDetails={groupDetails}
          missingGroup={missingGroup}
          onClose={() => onNavigate(closePath)}
          onNavigate={onNavigate}
          selectedMeeting={selectedMeeting}
        />
      ) : null}
    </>
  )
}

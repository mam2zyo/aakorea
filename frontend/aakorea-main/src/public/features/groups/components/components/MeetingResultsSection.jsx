import { EmptyState } from '../../../../ui'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
} from '@/shared/lib/options'
import { lookupLabel } from '@/shared/lib/view'
import { getShortDayLabel } from '@/shared/lib/options'
import { buildMeetingsPath, formatDistanceLabel, MEETING_SEARCH_MODE } from '../utils'

export function MeetingResultsSection({
  filters,
  hasMore,
  loading,
  loadMore,
  meetings,
  onNavigate,
  searchMeta,
  selectedSearchMeetingId,
  totalCount,
  visibleCount,
}) {
  const nearbySearchActive = filters.searchMode === MEETING_SEARCH_MODE.NEARBY

  return (
    <>
      {loading ? <div className="section-note">모임 목록을 불러오는 중입니다...</div> : null}

      <section className="meeting-search-results">
        <div className="meeting-search-results__header">
          <div className="meeting-search-results__copy">
            <strong>모임 목록</strong>
            <p>
              {nearbySearchActive
                ? `현재 위치 기준 결과입니다. 반경 ${searchMeta.appliedRadiusKm ?? filters.radiusKm ?? ''}km 안에서 가까운 순으로 보여 줍니다.`
                : '리스트에서 모임을 선택하면 장소와 그룹 안내가 모달로 열립니다.'}
            </p>
          </div>
          <span>전체 {totalCount ?? meetings.length}개</span>
        </div>

        {meetings.length === 0 ? (
          <EmptyState
            title="조건에 맞는 모임이 없습니다."
            description="지역이나 요일 조건을 바꿔 다시 확인해 주세요."
          />
        ) : (
          <div className="meeting-list">
            {meetings.slice(0, visibleCount).map((meeting) => (
              <button
                key={meeting.id}
                className={`meeting-search-item${
                  selectedSearchMeetingId === meeting.id ? ' meeting-search-item--active' : ''
                }`}
                type="button"
                onClick={() => onNavigate(buildMeetingsPath(meeting.groupId, meeting.id))}
              >
                <div className="meeting-search-item__body">
                  {/* 1행: 요일 시간 그룹명 타입 */}
                  <div className="meeting-search-item__row-primary">
                    <span className="meeting-search-item__day">
                      {getShortDayLabel(meeting.dayOfWeek)}
                    </span>
                    <span className="meeting-search-item__time">
                      {meeting.startTime}
                    </span>
                    <span className="meeting-search-item__group-name">
                      {meeting.groupName}
                    </span>
                    <span className={`meeting-focus-type-badge meeting-focus-type-badge--${meeting.type?.toLowerCase()}`}>
                      {lookupLabel(MEETING_TYPE_OPTIONS, meeting.type)}
                    </span>
                  </div>

                  {/* 2행: 주소 + 거리 */}
                  <div className="meeting-search-item__row-secondary">
                    <span className="meeting-search-item__address">
                      {meeting.locationAddress || '주소 정보 없음'}
                      {nearbySearchActive && Number.isFinite(meeting.distanceKm) && (
                        <span className="meeting-search-item__distance">
                          {` (${formatDistanceLabel(meeting.distanceKm)})`}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </button>
            ))}

            {hasMore ? (
              <div className="meeting-list__more">
                <button
                  className="meeting-list__more-button"
                  type="button"
                  onClick={loadMore}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                  결과 더 보기 ({totalCount - visibleCount}개 남음)
                </button>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </>
  )
}

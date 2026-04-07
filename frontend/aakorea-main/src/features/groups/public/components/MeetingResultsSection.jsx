import { EmptyState } from '../../../../public/ui'
import {
  DAY_OF_WEEK_OPTIONS,
  MEETING_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
} from '../../../../lib/options'
import { lookupLabel } from '../../../../lib/view'
import { buildMeetingsPath, formatDistanceLabel, MEETING_SEARCH_MODE } from '../utils'

export function MeetingResultsSection({
  filters,
  loading,
  meetings,
  onNavigate,
  searchMeta,
  selectedSearchMeetingId,
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
                    {meeting.locationDetail || '상세 위치 미정'}
                  </span>
                </div>
                <span className="meeting-search-item__province">
                  {nearbySearchActive && Number.isFinite(meeting.distanceKm)
                    ? formatDistanceLabel(meeting.distanceKm)
                    : lookupLabel(PROVINCE_OPTIONS, meeting.province)}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

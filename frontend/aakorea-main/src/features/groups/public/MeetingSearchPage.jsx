import { useEffect, useState } from 'react'
import {
  Field,
  PageIntro,
  PageSection,
} from '../../../public/ui'
import {
  SEARCH_DAY_OF_WEEK_OPTIONS,
  SEARCH_PROVINCE_OPTIONS,
  SEARCH_MEETING_TYPE_OPTIONS,
} from '../../../lib/options'
import { MeetingFocusDialog } from './components/MeetingFocusDialog'
import { MeetingResultsSection } from './components/MeetingResultsSection'
import { useMeetingSearch, SEARCH_STATE } from './hooks/useMeetingSearch'
import { buildMeetingsPath } from './utils'

export function MeetingSearchPage({ groupId, meetingId, onError, onNavigate }) {
  const {
    // 상태
    searchState,
    isLoading,
    isRegionActive,
    isNearbyActive,
    hasResults,
    // 지역 선택
    province,
    setProvince,
    // 상세 필터
    filters,
    setFilters,
    // 검색 결과
    meetings,
    districts,
    // 액션
    handleRegionSearch,
    handleNearbySearch,
    handleReset,
    // 다이얼로그
    closePath,
    detailLoading,
    groupDetails,
    isDialogOpen,
    missingGroup,
    selectedMeeting,
    selectedSearchMeetingId,
  } = useMeetingSearch({ groupId, meetingId, onError })

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [localKeyword, setLocalKeyword] = useState('')

  // 키워드 데바운스 (400ms)
  useEffect(() => {
    if (localKeyword === (filters.keyword || '')) return
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, keyword: localKeyword }))
    }, 400)
    return () => clearTimeout(timer)
  }, [localKeyword])

  // 검색 초기화 시 상세 필터도 초기화
  useEffect(() => {
    if (searchState === SEARCH_STATE.IDLE) {
      setLocalKeyword('')
      setShowAdvancedFilters(false)
    }
  }, [searchState])

  // 다이얼로그 키보드 이벤트
  useEffect(() => {
    if (!isDialogOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(event) {
      if (event.key === 'Escape') onNavigate(closePath)
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
        description="지역을 선택하거나 현재 위치를 기준으로 모임을 검색할 수 있습니다."
      />

      <PageSection className="meeting-search-section">
        <div className="meeting-search-form">
          {/* ── 메인 검색 영역 ── */}
          <div className="meeting-search-grid">
            <Field label="지역 선택">
              <select
                value={province}
                disabled={isLoading || isNearbyActive || isRegionActive}
                onChange={(event) => setProvince(event.target.value)}
              >
                {SEARCH_PROVINCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="meeting-search-actions">
              {/* 지역 검색 버튼 / 검색 초기화 */}
              {isRegionActive ? (
                <button
                  className="meeting-search-reset"
                  type="button"
                  onClick={handleReset}
                >
                  {/* 리셋/새로고침 라인 아이콘 */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  검색 초기화
                </button>
              ) : (
                <button
                  className="primary-button"
                  type="button"
                  disabled={isLoading || isNearbyActive}
                  onClick={() => void handleRegionSearch()}
                >
                  {isLoading && !isNearbyActive ? (
                    <>
                      {/* 스피너 라인 아이콘 */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      검색 중...
                    </>
                  ) : (
                    <>
                      {/* 돋보기 라인 아이콘 */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      지역 검색
                    </>
                  )}
                </button>
              )}

              {/* 내 주변 찾기 버튼 / 검색 초기화 */}
              {isNearbyActive ? (
                <button
                  className="meeting-search-reset"
                  type="button"
                  onClick={handleReset}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  검색 초기화
                </button>
              ) : (
                <button
                  className="meeting-search-nearby"
                  type="button"
                  disabled={isLoading || isRegionActive}
                  onClick={() => void handleNearbySearch()}
                >
                  {isLoading && !isRegionActive ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      위치 확인 중...
                    </>
                  ) : (
                    <>
                      {/* 위치 핀 라인 아이콘 */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      가까운 모임
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* ── 상세 조건 (검색 후에만 표시) ── */}
          {hasResults && (
            <>
              <div className="meeting-filter-toggle-row">
                <button
                  type="button"
                  className="meeting-filter-toggle ghost-button btn-sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? '상세 조건 접기 ▲' : '상세 조건 펼치기 ▼'}
                </button>
              </div>

              <div className={`meeting-filter-advanced ${showAdvancedFilters ? 'is-open' : ''}`}>
                <div className="meeting-filter-advanced-inner">
                  <Field label="요일">
                    <select
                      value={filters.dayOfWeek}
                      onChange={(e) => setFilters(prev => ({ ...prev, dayOfWeek: e.target.value }))}
                    >
                      {SEARCH_DAY_OF_WEEK_OPTIONS.map((option) => (
                        <option key={option.value || 'all'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="모임 유형">
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    >
                      {SEARCH_MEETING_TYPE_OPTIONS.map((option) => (
                        <option key={option.value || 'all'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="지역연합">
                    <select
                      value={filters.districtId}
                      onChange={(e) => setFilters(prev => ({ ...prev, districtId: e.target.value }))}
                    >
                      <option value="">연합 전체</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="키워드 검색">
                    <input
                      type="text"
                      placeholder="그룹명 또는 장소 검색"
                      value={localKeyword}
                      onChange={(e) => setLocalKeyword(e.target.value)}
                    />
                  </Field>
                </div>
              </div>
            </>
          )}
        </div>
      </PageSection>

      <PageSection id="meeting-results">
        {!hasResults && !isLoading ? (
          <div className="meeting-search-prompt">
            <p>지역을 선택하고 <strong>지역 검색</strong>을 누르거나,<br /><strong>가까운 모임</strong>으로 주변 모임을 찾아보세요.</p>
          </div>
        ) : (
          <MeetingResultsSection
            filters={{
              searchMode: isNearbyActive ? 'nearby' : 'region',
              radiusKm: 100,
            }}
            loading={isLoading}
            meetings={meetings}
            onNavigate={onNavigate}
            searchMeta={{ appliedRadiusKm: 100, mode: isNearbyActive ? 'nearby' : 'region' }}
            selectedSearchMeetingId={selectedSearchMeetingId}
          />
        )}
      </PageSection>

      {isDialogOpen && (
        <MeetingFocusDialog
          groupDetails={groupDetails}
          loading={detailLoading}
          missingGroup={missingGroup}
          onClose={() => onNavigate(closePath)}
          onNavigate={onNavigate}
          selectedMeeting={selectedMeeting}
        />
      )}
    </>
  )
}

import { useEffect, useRef, useState } from 'react'
import {
  Field,
  PageIntro,
  PageSection,
} from '../../../ui'
import {
  SEARCH_DAY_OF_WEEK_OPTIONS,
  SEARCH_PROVINCE_OPTIONS,
  SEARCH_MEETING_TYPE_OPTIONS,
} from '@/shared/lib/options'
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
    totalCount,
    visibleCount,
    hasMore,
    // 액션
    handleRegionSearch,
    handleNearbySearch,
    handleReset,
    loadMore,
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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [localKeyword, setLocalKeyword] = useState('')

  // ── Sticky 상태 감지 ────────────────────────────────────────
  const [isSticky, setIsSticky] = useState(false)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: [0], rootMargin: '-72px 0px 0px 0px' }
    )

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Sticky 전환 시 상세 필터 자동 닫기
  useEffect(() => {
    if (isSticky) {
      setShowAdvancedFilters(false)
    }
  }, [isSticky])

  // 키워드 데바운스 (400ms)
  useEffect(() => {
    if (localKeyword === (filters.keyword || '')) return
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, keyword: localKeyword }))
    }, 400)
    return () => clearTimeout(timer)
  }, [localKeyword])

  // 검색 초기화 시 상세 필터도 초기화 및 스크롤 상단 이동
  useEffect(() => {
    if (searchState === SEARCH_STATE.IDLE) {
      setLocalKeyword('')
      setShowAdvancedFilters(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [searchState])

  // 모달(상세 정보 또는 상세 검색) 열림 시 배경 스크롤 차단 및 키보드 이벤트
  useEffect(() => {
    const isAnyModalOpen = isDialogOpen || isFilterModalOpen
    if (!isAnyModalOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    
    // 배경 스크롤 차단 및 터치 간섭 방지
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none' 

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (isDialogOpen) onNavigate(closePath)
        if (isFilterModalOpen) setIsFilterModalOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closePath, isDialogOpen, isFilterModalOpen, onNavigate])

  const provinceLabel = SEARCH_PROVINCE_OPTIONS.find(o => o.value === province)?.label || '전국'

  return (
    <>
      <PageIntro
        eyebrow="Public Meetings"
        title="가까운 AA 모임을 찾아보세요."
        description="지역을 선택하거나 현재 위치를 기준으로 모임을 검색할 수 있습니다."
      />

      <div className="meeting-search-container">
        {/* Sticky 감지용 앵커 */}
        <div ref={sentinelRef} className="meeting-search-sentinel" />
        
        {/* Placeholder: Sticky 상태일 때 레이아웃이 무너지는 것을 방지 */}
        {isSticky && hasResults && <div className="meeting-search-placeholder panel" />}
        
        <div className={`meeting-search-form ${isSticky && hasResults ? 'meeting-search-form--sticky' : 'panel'}`}>
          {isSticky && hasResults ? (
            /* ── 스티키 모드: 요약 정보 + 액션 ── */
            <div className="meeting-search-sticky-layout">
              <div className="meeting-search-status">
                <span className="status-label">
                  {isNearbyActive ? '반경 80km' : provinceLabel}
                </span>
                <span className="status-divider">·</span>
                <span className="status-count">{totalCount}개</span>
              </div>
              
              <div className="meeting-search-sticky-actions">
                <button 
                  className="icon-button reset-button" 
                  onClick={handleReset}
                  title="검색 초기화"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  <span>초기화</span>
                </button>
                <button 
                  className="icon-button filter-button" 
                  onClick={() => setIsFilterModalOpen(true)}
                  title="상세 검색"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14" />
                    <line x1="4" y1="10" x2="4" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12" y2="3" />
                    <line x1="20" y1="21" x2="20" y2="16" />
                    <line x1="20" y1="12" x2="20" y2="3" />
                    <line x1="2" y1="14" x2="6" y2="14" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                    <line x1="18" y1="16" x2="22" y2="16" />
                  </svg>
                  <span>필터</span>
                </button>
              </div>
            </div>
          ) : (
            /* ── 일반 모드: 검색 폼 분기 ── */
            <>
              {!hasResults ? (
                <div className="meeting-search-grid">
                  <Field label="지역 선택">
                    <select
                      value={province}
                      disabled={isLoading}
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
                    <button
                      className="primary-button"
                      type="button"
                      disabled={isLoading}
                      onClick={() => void handleRegionSearch()}
                    >
                      {isLoading && !isNearbyActive ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          검색 중...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          지역 검색
                        </>
                      )}
                    </button>

                    <button
                      className="meeting-search-nearby"
                      type="button"
                      disabled={isLoading}
                      onClick={() => void handleNearbySearch()}
                    >
                      {isLoading && isNearbyActive ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={{ animation: 'spin 1s linear infinite' }}>
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                          </svg>
                          위치 확인 중...
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          가까운 모임
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── 검색 후 모드: 액션 버튼만 노출 ── */
                <div className="meeting-search-grid">
                  <div className="meeting-search-actions">
                    <button
                      className="meeting-search-reset"
                      type="button"
                      onClick={() => handleReset()}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      검색 초기화
                    </button>
                    
                    <button
                      className="primary-button"
                      type="button"
                      onClick={() => setIsFilterModalOpen(true)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="4" y1="21" x2="4" y2="14" />
                        <line x1="4" y1="10" x2="4" y2="3" />
                        <line x1="12" y1="21" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12" y2="3" />
                        <line x1="20" y1="21" x2="20" y2="16" />
                        <line x1="20" y1="12" x2="20" y2="3" />
                        <line x1="2" y1="14" x2="6" y2="14" />
                        <line x1="10" y1="12" x2="14" y2="12" />
                        <line x1="18" y1="16" x2="22" y2="16" />
                      </svg>
                      상세 조건
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <PageSection id="meeting-results">
          {!hasResults && !isLoading ? (
            <div className="meeting-search-prompt">
              <p>지역을 선택하고 <strong>지역 검색</strong>을 누르거나,<br /><strong>가까운 모임</strong>으로 주변 모임을 찾아보세요.</p>
            </div>
          ) : (
            <MeetingResultsSection
              filters={{
                searchMode: isNearbyActive ? 'nearby' : 'region',
                radiusKm: 80,
              }}
              hasMore={hasMore}
              loading={isLoading}
              loadMore={loadMore}
              meetings={meetings}
              onNavigate={onNavigate}
              searchMeta={{ appliedRadiusKm: 80, mode: isNearbyActive ? 'nearby' : 'region' }}
              selectedSearchMeetingId={selectedSearchMeetingId}
              totalCount={totalCount}
              visibleCount={visibleCount}
            />
          )}
        </PageSection>
      </div>

      {isFilterModalOpen && (
        <MeetingFilterDialog
          districts={districts}
          filters={filters}
          localKeyword={localKeyword}
          setFilters={setFilters}
          setLocalKeyword={setLocalKeyword}
          onClose={() => setIsFilterModalOpen(false)}
        />
      )}

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

function MeetingFilterDialog({ districts, filters, localKeyword, setLocalKeyword, setFilters, onClose }) {
  return (
    <div className="meeting-focus-overlay" onClick={onClose}>
      <div className="meeting-focus-dialog filter-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="meeting-focus-dialog__header">
          <div className="meeting-focus-dialog__identity">
            <h2 id="meeting-focus-title">상세 검색</h2>
          </div>
          <button className="meeting-focus-dialog__close" onClick={onClose}>×</button>
        </div>
        
        <div className="meeting-focus-dialog__body">
          {/* 키워드 검색 */}
          <Field label="모임명 또는 장소 검색">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={localKeyword}
              onChange={(e) => setLocalKeyword(e.target.value)}
            />
          </Field>

          {/* 지역연합 선택 */}
          <Field label="지역연합">
            <select
              value={filters.districtId}
              onChange={(e) => setFilters(prev => ({ ...prev, districtId: e.target.value }))}
            >
              <option value="ALL">지역연합 전체</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>

          {/* 모임 유형 */}
          <Field label="모임 유형">
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="ALL">유형 전체</option>
              <option value="OPEN">공개</option>
              <option value="CLOSED">비공개</option>
              <option value="NOTFIXED">가변</option>
            </select>
          </Field>

          {/* 요일 선택 */}
          <Field label="요일">
            <select
              value={filters.dayOfWeek}
              onChange={(e) => setFilters(prev => ({ ...prev, dayOfWeek: e.target.value }))}
            >
              <option value="ALL">요일 전체</option>
              <option value="MONDAY">월요일</option>
              <option value="TUESDAY">화요일</option>
              <option value="WEDNESDAY">수요일</option>
              <option value="THURSDAY">목요일</option>
              <option value="FRIDAY">금요일</option>
              <option value="SATURDAY">토요일</option>
              <option value="SUNDAY">일요일</option>
            </select>
          </Field>
        </div>

        <div className="meeting-focus-dialog__footer">
          <button className="primary-button full-width" onClick={onClose}>
            검색 결과 보기
          </button>
        </div>
      </div>
    </div>
  )
}

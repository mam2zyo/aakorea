<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import { publicContentApi, type Meeting, type MeetingFilters, type GroupDetail } from '$lib/api/publicContent';
  import { SEARCH_PROVINCE_OPTIONS, DAY_OF_WEEK_OPTIONS, MEETING_TYPE_OPTIONS } from '$lib/data/options';
  import GroupDetailModal from '$lib/components/shared/GroupDetailModal.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // --- State ---
  let isLoading = $state(false);
  let hasSearched = $state(false);
  let searchMode = $state<'region' | 'nearby' | null>(null);
  let meetings = $state<Meeting[]>([]);
  let visibleCount = $state(20);
  
  let filters = $state<MeetingFilters>({
    province: 'all',
    districtId: 'ALL',
    dayOfWeek: 'ALL',
    type: 'ALL',
    keyword: ''
  });

  let showFilterDialog = $state(false);
  let showInfoModal = $state(false);

  // Group Detail Modal State
  let selectedMeeting = $state<Meeting | null>(null);
  let groupDetail = $state<GroupDetail | null>(null);
  let loadingGroupDetail = $state(false);

  // --- Derived ---
  let visibleMeetings = $derived(meetings.slice(0, visibleCount));
  let remainingCount = $derived(Math.max(0, meetings.length - visibleCount));

  // --- Actions ---
  async function handleSearch() {
    isLoading = true;
    searchMode = 'region';
    visibleCount = 20;
    try {
      meetings = await publicContentApi.getMeetings(filters);
      hasSearched = true;
    } catch (e) {
      console.error('Search failed', e);
      alert('검색 중 오류가 발생했습니다.');
    } finally {
      isLoading = false;
    }
  }

  async function handleNearbySearch() {
    if (!navigator.geolocation) {
      alert('이 브라우저는 위치 정보를 지원하지 않습니다.');
      return;
    }

    isLoading = true;
    searchMode = 'nearby';
    visibleCount = 20;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const nearbyFilters: MeetingFilters = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radiusKm: 80
          };
          meetings = await publicContentApi.getMeetings(nearbyFilters);
          hasSearched = true;
        } catch (e) {
          console.error('Nearby search failed', e);
          alert('주변 모임을 찾는 중 오류가 발생했습니다.');
        } finally {
          isLoading = false;
        }
      },
      (error) => {
        console.error('Geolocation error', error);
        alert('위치 정보를 가져올 수 없습니다. 권한 설정을 확인해 주세요.');
        isLoading = false;
      }
    );
  }

  async function handleMeetingClick(meeting: Meeting) {
    selectedMeeting = meeting;
    loadingGroupDetail = true;
    groupDetail = null;

    try {
      const response = await publicContentApi.getGroup(meeting.groupId);
      groupDetail = response;
    } catch (error) {
      console.error('Failed to fetch group details:', error);
    } finally {
      loadingGroupDetail = false;
    }
  }

  function closeDetailModal() {
    selectedMeeting = null;
    groupDetail = null;
  }

  function handleReset() {
    hasSearched = false;
    searchMode = null;
    meetings = [];
    visibleCount = 20;
    filters = {
      province: 'all',
      districtId: 'ALL',
      dayOfWeek: 'ALL',
      type: 'ALL',
      keyword: ''
    };
    showFilterDialog = false;
  }

  function loadMore() {
    visibleCount += 20;
  }

  function formatDay(day: string) {
    const days: Record<string, string> = {
      'MONDAY': '월요일',
      'TUESDAY': '화요일',
      'WEDNESDAY': '수요일',
      'THURSDAY': '목요일',
      'FRIDAY': '금요일',
      'SATURDAY': '토요일',
      'SUNDAY': '일요일'
    };
    return days[day] || day;
  }

  function formatType(type: string) {
    const types: Record<string, string> = {
      'OPEN': '공개',
      'CLOSED': '비공개',
      'NOTFIXED': '가변'
    };
    return types[type] || type;
  }
</script>

<svelte:head>
  <title>모임 찾기 - AA Korea</title>
</svelte:head>

<Section class="hero-section">
  <Container>
    <div class="panel header-panel">
      <h1 class="page-title">AA 모임 찾기</h1>
      <div class="header-links">
        <div class="header-actions">
          <a href="#online" class="cta-button" onclick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
            온라인 모임
          </a>
          <a href="#step12" class="cta-button" onclick={(e) => { e.preventDefault(); alert('준비 중입니다.'); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V7"></path><path d="M13 20v-9"></path><path d="M8 20v-5"></path><path d="M3 20v-1"></path></svg>
            제12단계 운동
          </a>
        </div>
      </div>
    </div>

    {#if !hasSearched}
      <div class="panel search-panel">
        <div class="field">
          <label for="province">지역 선택</label>
          <select id="province" bind:value={filters.province} disabled={isLoading}>
            {#each SEARCH_PROVINCE_OPTIONS as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
        
        <div class="search-actions">
          <button class="btn-primary" onclick={handleSearch} disabled={isLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            지역 검색
          </button>
          <button class="btn-outline" onclick={handleNearbySearch} disabled={isLoading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            가까운 모임
          </button>
        </div>
      </div>

      <div class="prompt-panel">
        <p>지역을 선택하고 <strong>지역 검색</strong>을 누르거나,<br /><strong>가까운 모임</strong>으로 주변 모임을 찾아보세요.</p>
      </div>
    {:else}
      <div class="results-top-actions">
        <button class="btn-reset" onclick={handleReset}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
          검색 초기화
        </button>
        <button class="btn-primary" onclick={() => showFilterDialog = true}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="12" x2="14" y2="12"></line><line x1="18" y1="16" x2="22" y2="16"></line></svg>
          상세 조건
        </button>
      </div>

      <div class="results-meta">
        <div class="results-summary">
          <span class="total-count-label">검색된 모임 수 : <strong>{meetings.length} 개</strong></span>
          <button class="help-link" onclick={() => showInfoModal = true}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            공개/비공개 모임이란?
          </button>
        </div>
      </div>

      <div class="meeting-list">
        {#each visibleMeetings as meeting (meeting.id)}
          <button class="meeting-card" onclick={() => handleMeetingClick(meeting)}>
            <div class="card-left">
              <div class="day-time">
                <span class="day">{formatDay(meeting.dayOfWeek)}</span>
                <span class="time">{meeting.startTime.substring(0, 5)}</span>
              </div>
            </div>
            
            <div class="card-main">
              <div class="group-info">
                <h3 class="group-name">{meeting.groupName}</h3>
                <span class="type-badge" data-type={meeting.type}>{formatType(meeting.type)}</span>
              </div>
              <p class="address">{meeting.locationAddress || '주소 정보 없음'}</p>
              {#if meeting.distanceKm != null}
                <p class="distance">내 위치에서 {meeting.distanceKm.toFixed(1)}km</p>
              {/if}
            </div>
          </button>
        {:else}
          <div class="empty-list">검색 결과가 없습니다.</div>
        {/each}
      </div>

      {#if remainingCount > 0}
        <div class="pagination-area">
          <button class="load-more-btn" onclick={loadMore}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            결과 더 보기 ({remainingCount}개 남음)
          </button>
        </div>
      {/if}
    {/if}

    <GroupDetailModal 
      {selectedMeeting} 
      {groupDetail} 
      loading={loadingGroupDetail} 
      onClose={closeDetailModal} 
    />

    {#if showFilterDialog}
      <div class="modal-overlay" role="button" tabindex="-1" onclick={() => showFilterDialog = false} onkeydown={(e) => e.key === 'Escape' && (showFilterDialog = false)}>
        <div class="modal-content" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h2>상세 검색</h2>
            <button class="close-btn" onclick={() => showFilterDialog = false}>×</button>
          </div>
          <div class="modal-body">
            <div class="field">
              <label for="keyword">키워드 (모임명/장소)</label>
              <input type="text" id="keyword" bind:value={filters.keyword} placeholder="검색어를 입력하세요..." />
            </div>
            <div class="field">
              <label for="districtId">지역연합</label>
              <select id="districtId" bind:value={filters.districtId}>
                <option value="ALL">지역연합 전체</option>
                {#each data.districts as district}
                  <option value={district.id}>{district.name}</option>
                {/each}
              </select>
            </div>
            <div class="field">
              <label for="type">모임 유형</label>
              <select id="type" bind:value={filters.type}>
                <option value="ALL">유형 전체</option>
                {#each MEETING_TYPE_OPTIONS as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
            <div class="field">
              <label for="dayOfWeek">요일</label>
              <select id="dayOfWeek" bind:value={filters.dayOfWeek}>
                <option value="ALL">요일 전체</option>
                {#each DAY_OF_WEEK_OPTIONS as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary full-width" onclick={() => { handleSearch(); showFilterDialog = false; }}>
              검색 결과 보기
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if showInfoModal}
      <div class="modal-overlay" role="button" tabindex="-1" onclick={() => showInfoModal = false} onkeydown={(e) => e.key === 'Escape' && (showInfoModal = false)}>
        <div class="modal-content" role="dialog" aria-modal="true" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()}>
          <div class="modal-header">
            <h2>모임 유형 안내</h2>
            <button class="close-btn" onclick={() => showInfoModal = false}>×</button>
          </div>
          <div class="modal-body info-modal-body">
            <div class="info-section">
              <span class="badge-preview open">공개 모임 (Open)</span>
              <p>AA의 회복 프로그램에 관심이 있는 사람이라면 <strong>누구나 참석할 수 있는 모임</strong>입니다. 알코올 중독자가 아닌 분들도 참관인 자격으로 참석이 가능합니다.</p>
            </div>
            <div class="info-section">
              <span class="badge-preview closed">비공개 모임 (Closed)</span>
              <p>오직 AA 멤버이거나, 본인이 술 문제가 있고 <strong>"술을 끊으려는 열망"이 있는 분들</strong>만을 위한 회복 모임입니다.</p>
            </div>
            <div class="info-section">
              <span class="badge-preview notfixed">가변 (Variable)</span>
              <p>주차에 따라 공개와 비공개 유형이 바뀌는 경우입니다. (예: 평소엔 비공개이나 매월 마지막 주만 공개로 진행 등)</p>
              <p class="sub-info">※ 참관을 원하는 비알코올중독자는 <strong>사전에 해당 그룹 봉사자에게 연락하여</strong> 유형을 확인해 주시기 바랍니다.</p>
            </div>
            <div class="info-note">
              <p>※ 모든 AA 모임에서는 참석자들이 알코올 중독으로부터의 회복에 관련된 주제로만 대화를 나누어 주실 것을 요청받을 수 있습니다.</p>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary" onclick={() => showInfoModal = false}>확인</button>
          </div>
        </div>
      </div>
    {/if}
  </Container>
</Section>

<style>
  :global(.hero-section) {
    padding-top: 0 !important;
  }

  .header-panel {
    text-align: left;
    margin-bottom: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding-left: var(--space-12) !important;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-text-strong);
    margin: 0;
  }

  .results-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 0.9rem;
    color: var(--color-text-soft);
  }

  .header-links {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--space-6);
  }

  .header-actions {
    display: flex;
    gap: var(--space-3);
  }

  .cta-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.6rem 1.2rem;
    background: #fff;
    border: 1px solid var(--palette-blue-100);
    color: var(--color-primary);
    text-decoration: none;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.05);
  }

  .cta-button:hover {
    background: var(--palette-blue-50);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }

  .cta-button svg {
    opacity: 0.9;
  }

  .help-link {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    background: none;
    border: none;
    padding: 0;
    color: var(--color-text-soft);
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.2s;
  }

  .help-link:hover {
    color: var(--color-primary);
  }

  .help-link svg {
    opacity: 0.7;
  }

  /* Info Modal Body */
  .info-modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .info-section {
    padding: var(--space-4);
    background: var(--color-bg-subtle);
    border-radius: 1rem;
  }

  .badge-preview {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: var(--space-3);
  }

  .badge-preview.open { background: #EBF5FF; color: #0066FF; }
  .badge-preview.closed { background: #FEF2F2; color: #EF4444; }
  .badge-preview.notfixed { background: #FFFBEB; color: #D97706; }

  .info-section p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--color-text);
  }

  .sub-info {
    font-size: 0.85rem;
    color: var(--color-text-soft);
    margin-top: var(--space-2);
    line-height: 1.4;
  }

  .info-note {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    padding: 0 var(--space-2);
  }

  .panel {
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 10px 30px var(--color-shadow);
    padding: var(--space-8);
    margin-bottom: var(--space-6);
  }

  .prompt-panel {
    padding: var(--space-8);
    text-align: center;
    background: rgba(var(--palette-blue-50-rgb), 0.5);
    border: 1px solid rgba(var(--palette-blue-200-rgb), 0.3);
    border-radius: 1.5rem;
    color: var(--color-text);
  }

  .prompt-panel p {
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
  }

  .field label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-strong);
    margin-left: 0.5rem;
  }

  select, input {
    width: 100%;
    padding: 0.85rem 1.25rem;
    border: 1px solid var(--color-border);
    border-radius: 0.85rem;
    background: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  select:focus, input:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--palette-blue-500-rgb), 0.1);
  }

  .search-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  .results-top-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
    margin-bottom: var(--space-8);
  }

  button {
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    border-radius: 1.5rem;
    font-size: 1rem;
    border: 1px solid transparent;
  }

  .btn-primary { background: var(--color-primary); color: #fff; }
  .meeting-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .meeting-card {
    width: 100%;
    text-align: left;
    background: #fff;
    padding: var(--space-6) var(--space-8);
    border-radius: 1.5rem;
    border: 1px solid var(--color-border-subtle);
    display: flex;
    gap: var(--space-2);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    appearance: none;
    font-family: inherit;
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  .meeting-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px var(--color-shadow);
    border-color: var(--color-primary);
  }

  .card-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 75px;
  }

  .day-time {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .day-time .day {
    font-size: 1.1rem;
    font-weight: 600;
    color: #4B5563;
  }

  .day-time .time {
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--color-primary);
  }

  .card-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .group-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .group-info .group-name {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0;
    flex: 1;
  }

  .location-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }

  .card-main .address {
    font-size: 0.9rem;
    color: #4B5563;
    margin: 0;
  }

  .card-main .distance {
    font-size: 0.85rem;
    color: var(--color-primary);
    font-weight: 600;
    margin-top: var(--space-1);
  }

  .type-badge {
    padding: 0.2rem 0.6rem;
    border-radius: 0.5rem;
    font-size: 0.7rem;
    font-weight: 600;
    white-space: nowrap;
    margin-left: auto;
  }

  .type-badge[data-type="OPEN"] { background: #EBF5FF; color: #0066FF; }
  .type-badge[data-type="CLOSED"] { background: #FEF2F2; color: #EF4444; }
  .type-badge[data-type="NOTFIXED"] { background: #FFFBEB; color: #D97706; }

  .pagination-area { display: flex; justify-content: center; margin-top: var(--space-8); }
  .load-more-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-8);
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: 2rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-soft);
    transition: all 0.2s;
  }

  .load-more-btn:hover { background: var(--color-bg-subtle); border-color: var(--color-primary); color: var(--color-primary); }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
    padding: var(--space-4);
  }

  .modal-content {
    background: #fff;
    width: 100%;
    max-width: 480px;
    border-radius: 2rem;
    padding: var(--space-8);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes modal-pop { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

  .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-8); }
  .modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-strong);
  }
  .close-btn { background: none; border: none; font-size: 2rem; color: var(--color-text-soft); cursor: pointer; }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-8);
  }

  .empty-list { padding: var(--space-12); text-align: center; color: var(--color-text-soft); }

  @media (max-width: 640px) {
    .panel { padding: var(--space-6); }
    .header-panel { margin-bottom: var(--space-3); gap: var(--space-3); padding-left: var(--space-6) !important; }
    .page-title { font-size: 1.5rem; }
    .header-links { flex-direction: row; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
    .header-actions { flex-direction: row; flex-wrap: nowrap; gap: var(--space-2); }
    .cta-button { width: auto; padding: 0.5rem 0.8rem; font-size: 0.8rem; }
    .search-actions { grid-template-columns: 1fr; }
    .results-top-actions { grid-template-columns: 1fr 1fr; gap: var(--space-2); }
    .meeting-card { padding: var(--space-5) var(--space-6); }
    .meeting-title { font-size: 1.05rem; }
    .results-top-actions button { font-size: 0.85rem; padding: 0.75rem 0.5rem; }
  }
</style>

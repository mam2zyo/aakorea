<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import { publicContentApi, type Meeting, type MeetingFilters, type GroupDetail } from '$lib/api/publicContent';
  import { SEARCH_PROVINCE_OPTIONS } from '$lib/data/options';
  import GroupDetailModal from './components/GroupDetailModal.svelte';
  import SearchHero from './components/SearchHero.svelte';
  import MeetingCard from './components/MeetingCard.svelte';
  import FilterModal from './components/FilterModal.svelte';
  import MeetingInfoModal from './components/MeetingInfoModal.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // --- State ---
  let isLoading = $state(false);
  let hasSearched = $state(false);
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
</script>

<svelte:head>
  <title>모임 찾기 - AA Korea</title>
</svelte:head>

<Section class="hero-section">
  <Container>
    <SearchHero />

    {#if !hasSearched}
      <div class="panel search-panel">
        <div class="field">
          <label for="province">지역 선택</label>
          <select id="province" bind:value={filters.province} disabled={isLoading}>
            {#each SEARCH_PROVINCE_OPTIONS as option (option.value)}
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
          <MeetingCard {meeting} onclick={() => handleMeetingClick(meeting)} />
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

    <FilterModal 
      bind:show={showFilterDialog} 
      bind:filters 
      districts={data.districts} 
      onClose={() => showFilterDialog = false} 
      onSearch={handleSearch} 
    />

    <MeetingInfoModal 
      bind:show={showInfoModal} 
      onClose={() => showInfoModal = false} 
    />
  </Container>
</Section>

<style>
  :global(.hero-section) {
    padding-top: 0 !important;
  }

  .results-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-size: 0.9rem;
    color: var(--color-text-soft);
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

  select {
    width: 100%;
    padding: 0.85rem 1.25rem;
    border: 1px solid var(--color-border);
    border-radius: 0.85rem;
    background: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .search-actions, .results-top-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
  }

  .results-top-actions {
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
  .btn-outline { background: #fff; border-color: var(--color-primary); color: var(--color-primary); }
  .btn-reset { background: #fff; border-color: var(--color-border); color: var(--color-text-soft); }

  .meeting-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

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

  .empty-list { padding: var(--space-12); text-align: center; color: var(--color-text-soft); }

  @media (max-width: 640px) {
    .panel { padding: var(--space-6); }
    .search-actions { grid-template-columns: 1fr; }
    .results-top-actions { grid-template-columns: 1fr 1fr; gap: var(--space-2); }
    .results-top-actions button { font-size: 0.85rem; padding: 0.75rem 0.5rem; }
  }
</style>

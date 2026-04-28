<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import SubPageHero from '$lib/components/ui/SubPageHero.svelte';
  import {
    publicContentApi,
    type Meeting,
    type MeetingFilters,
    type GroupDetail
  } from '$lib/api/publicContent';
  import { SEARCH_PROVINCE_OPTIONS } from '$lib/data/options';
  import GroupDetailModal from './components/GroupDetailModal.svelte';
  import MeetingCard from './components/MeetingCard.svelte';
  import FilterModal from './components/FilterModal.svelte';
  import MeetingInfoModal from './components/MeetingInfoModal.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();

  // ... state logic same as before ...

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

<SubPageHero eyebrow="AA Meeting Finder" title="AA 모임 찾기">
  <button
    class="cta-button"
    onclick={() => {
      alert('준비 중입니다.');
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      ><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"
      ></rect></svg
    >
    온라인 모임
  </button>
  <button
    class="cta-button"
    onclick={() => {
      alert('준비 중입니다.');
    }}
  >
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      ><path d="M18 20V7"></path><path d="M13 20v-9"></path><path d="M8 20v-5"></path><path
        d="M3 20v-1"
      ></path></svg
    >
    제12단계 운동
  </button>
</SubPageHero>

<Container>
  {#if !hasSearched}
    <div class="search-section-wrapper">
      <div class="panel search-panel">
        <div class="field">
          <label for="province">지역 선택</label>
          <div class="custom-select-wrapper">
            <select id="province" bind:value={filters.province} disabled={isLoading}>
              {#each SEARCH_PROVINCE_OPTIONS as option (option.value)}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
            <svg
              class="chevron"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg
            >
          </div>
        </div>

        <div class="search-actions">
          <button class="btn-primary" onclick={handleSearch} disabled={isLoading}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"
              ></line></svg
            >
            지역 검색
          </button>
          <button class="btn-outline" onclick={handleNearbySearch} disabled={isLoading}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle
                cx="12"
                cy="10"
                r="3"
              ></circle></svg
            >
            가까운 모임
          </button>
        </div>
      </div>

      <div class="search-prompt">
        <p>
          지역을 선택하고 <strong>지역 검색</strong>을 누르거나, <strong>가까운 모임</strong>으로
          주변 모임을 찾아보세요.
        </p>
      </div>
    </div>
  {:else}
    <div class="results-top-actions">
      <button class="btn-reset" onclick={handleReset}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"
          ></path></svg
        >
        검색 초기화
      </button>
      <button class="btn-primary" onclick={() => (showFilterDialog = true)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"
          ></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"
          ></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"
          ></line><line x1="2" y1="14" x2="6" y2="14"></line><line x1="10" y1="12" x2="14" y2="12"
          ></line><line x1="18" y1="16" x2="22" y2="16"></line></svg
        >
        상세 조건
      </button>
    </div>

    <div class="results-meta">
      <div class="results-summary">
        <span class="total-count-label">검색된 모임 수 : <strong>{meetings.length} 개</strong></span
        >
        <button class="help-link" onclick={() => (showInfoModal = true)}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
            ></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg
          >
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
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg
          >
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
    onClose={() => (showFilterDialog = false)}
    onSearch={handleSearch}
  />

  <MeetingInfoModal bind:show={showInfoModal} onClose={() => (showInfoModal = false)} />
</Container>

<style>
  :global(.hero-section) {
    padding-top: 0 !important;
    padding-bottom: var(--space-4) !important;
    background: linear-gradient(180deg, #fff 0%, var(--palette-blue-50) 100%);
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
    border-radius: var(--radius-lg);
    box-shadow: 0 12px 48px rgba(var(--palette-blue-900-rgb), 0.08);
    border: 1px solid rgba(var(--palette-blue-500-rgb), 0.1);
    padding: var(--space-8) var(--space-6);
    margin-bottom: var(--space-6);
    position: relative;
    z-index: 2;
  }

  .search-prompt {
    padding: var(--space-4) var(--space-2);
    text-align: left;
    color: var(--palette-slate-500);
  }

  .search-prompt p {
    margin: 0;
    line-height: 1.6;
    font-size: 0.9rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-6);
  }

  .field label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--palette-blue-950);
    margin-left: 0.2rem;
  }

  .custom-select-wrapper {
    position: relative;
    width: 100%;
  }

  select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: 1rem 1.5rem;
    padding-right: 3.5rem;
    border: 1px solid var(--palette-blue-200);
    border-radius: var(--radius-md);
    background: #fff;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--palette-blue-950);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 8px rgba(var(--palette-blue-500-rgb), 0.04);
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(var(--palette-blue-500-rgb), 0.1);
  }

  .chevron {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--palette-blue-400);
    transition: transform 0.2s ease;
  }

  select:focus + .chevron {
    color: var(--color-primary);
    transform: translateY(-50%) rotate(180deg);
  }

  .search-actions,
  .results-top-actions {
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

  .btn-primary {
    background: var(--palette-blue-500);
    color: #fff;
    box-shadow: 0 4px 12px rgba(47, 99, 216, 0.2);
  }
  .btn-primary:hover {
    background: var(--palette-blue-700);
    transform: translateY(-1px);
  }
  .btn-outline {
    background: #fff;
    border-color: var(--palette-blue-200);
    color: var(--palette-blue-500);
  }
  .btn-outline:hover {
    background: var(--palette-blue-50);
    border-color: var(--palette-blue-500);
  }
  .btn-reset {
    background: #fff;
    border-color: var(--color-border);
    color: var(--color-text-soft);
  }

  .meeting-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .pagination-area {
    display: flex;
    justify-content: center;
    margin-top: var(--space-8);
  }
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

  .load-more-btn:hover {
    background: var(--color-bg-subtle);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .empty-list {
    padding: var(--space-12);
    text-align: center;
    color: var(--color-text-soft);
  }

  .cta-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.75rem 1.25rem;
    background: #fff;
    border: 1px solid rgba(var(--palette-blue-500-rgb), 0.15);
    color: var(--palette-blue-700);
    border-radius: var(--radius-md);
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 12px rgba(var(--palette-blue-500-rgb), 0.04);
  }

  .cta-button:hover {
    background: var(--palette-blue-50);
    border-color: var(--palette-blue-400);
    color: var(--palette-blue-800);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(var(--palette-blue-500-rgb), 0.08);
  }

  @media (max-width: 640px) {
    .cta-button {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
    }
    .panel {
      padding: var(--space-6);
      margin-bottom: var(--space-8);
    }
    .search-actions {
      grid-template-columns: 1fr;
    }
    .results-top-actions {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-2);
    }
    .results-top-actions button {
      font-size: 0.85rem;
      padding: 0.75rem 0.5rem;
    }
  }
</style>

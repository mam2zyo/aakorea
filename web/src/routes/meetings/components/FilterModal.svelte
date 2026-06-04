<script lang="ts">
  import type { MeetingFilters, District } from '$lib/api/publicContent';
  import { MEETING_TYPE_OPTIONS, DAY_OF_WEEK_OPTIONS } from '$lib/data/options';

  interface Props {
    show?: boolean;
    filters: MeetingFilters;
    districts: District[];
    onClose: () => void;
    onSearch: () => void;
  }

  let {
    show = $bindable(false),
    filters = $bindable(),
    districts,
    onClose,
    onSearch
  }: Props = $props();
</script>

{#if show}
  <div
    class="modal-overlay"
    role="button"
    tabindex="-1"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div
      class="modal-content"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="modal-header">
        <h2>상세 검색</h2>
        <button class="close-btn" onclick={onClose}>×</button>
      </div>
      <div class="modal-body">
        <div class="field">
          <label for="keyword">키워드 (모임명/장소)</label>
          <input
            type="text"
            id="keyword"
            bind:value={filters.keyword}
            placeholder="검색어를 입력하세요..."
          />
        </div>
        <div class="field">
          <label for="districtId">지역연합</label>
          <select id="districtId" bind:value={filters.districtId}>
            <option value="ALL">지역연합 전체</option>
            {#each districts as district (district.id)}
              <option value={district.id}>{district.name}</option>
            {/each}
          </select>
        </div>
        <div class="field">
          <label for="type">모임 유형</label>
          <select id="type" bind:value={filters.type}>
            <option value="ALL">유형 전체</option>
            {#each MEETING_TYPE_OPTIONS as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
        <div class="field">
          <label for="dayOfWeek">요일</label>
          <select id="dayOfWeek" bind:value={filters.dayOfWeek}>
            <option value="ALL">요일 전체</option>
            {#each DAY_OF_WEEK_OPTIONS as option (option.value)}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        </div>
      </div>
      <div class="modal-footer">
        <button
          class="btn-primary full-width"
          onclick={() => {
            onSearch();
            onClose();
          }}
        >
          검색 결과 보기
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start; /* 상단 잘림 방지 */
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
    padding: var(--space-4);
  }

  .modal-content {
    background: #fff;
    width: 100%;
    max-width: 480px;
    margin: auto; /* 중앙 배치 + 상단 잘림 방지 */
    max-height: 90dvh;
    overflow-y: auto;
    border-radius: 2rem;
    padding: var(--space-8);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes modal-pop {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8);
  }
  .modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-strong);
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--color-text-soft);
    cursor: pointer;
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

  select,
  input {
    width: 100%;
    padding: 0.85rem 1.25rem;
    border: 1px solid var(--color-border);
    border-radius: 0.85rem;
    background: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  select:focus,
  input:focus {
    border-color: var(--color-primary);
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--palette-blue-500-rgb), 0.1);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-8);
  }

  .btn-primary {
    background: var(--color-primary);
    color: #fff;
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

  .full-width {
    width: 100%;
  }
</style>

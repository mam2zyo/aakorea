<script lang="ts">
  import type { Meeting } from '$lib/api/publicContent';
  import { formatDay, formatType } from '$lib/utils/format';

  interface Props {
    meeting: Meeting;
    onclick: () => void;
  }

  let { meeting, onclick }: Props = $props();
</script>

<button class="meeting-card" {onclick}>
  <div class="card-left">
    <div class="day-time">
      <span class="day">{formatDay(meeting.dayOfWeek)}</span>
      <span class="time">{meeting.startTime.substring(0, 5)}</span>
    </div>
  </div>

  <div class="card-main">
    <div class="group-info">
      <h3 class="group-name">
        {meeting.groupName}
        {#if meeting.distanceKm != null}
          <span class="distance-inline">({meeting.distanceKm.toFixed(1)}km)</span>
        {/if}
      </h3>
      <span class="type-badge" data-type={meeting.type}>{formatType(meeting.type)}</span>
    </div>
    <p class="address">{meeting.locationAddress || '주소 정보 없음'}</p>
  </div>
</button>

<style>
  .meeting-card {
    width: 100%;
    text-align: left;
    background: #fff;
    padding: var(--space-6) var(--space-8);
    border-radius: var(--radius-md);
    border: 1px solid var(--palette-blue-100);
    display: flex;
    gap: var(--space-6);
    align-items: flex-start;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    appearance: none;
    font-family: inherit;
    box-shadow: 0 4px 12px rgba(var(--palette-blue-900-rgb), 0.04);
    margin: 0;
  }

  .meeting-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(var(--palette-blue-900-rgb), 0.08);
    border-color: var(--color-primary);
  }

  .card-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 60px;
    border-right: 1px solid var(--palette-blue-100);
    padding-right: var(--space-2);
  }

  .day-time {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .day-time .day {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--palette-blue-950);
  }

  .day-time .time {
    font-size: 1rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .card-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    justify-content: center;
  }

  .group-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .group-info .group-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--palette-blue-950);
    margin: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .distance-inline {
    font-size: 0.85rem;
    color: var(--color-primary);
    font-weight: 600;
  }

  .card-main .address {
    font-size: 0.95rem;
    color: var(--palette-slate-450);
    margin: 0;
  }

  .type-badge {
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .type-badge[data-type='OPEN'] {
    background: var(--color-success);
    color: var(--color-success-text);
  }
  .type-badge[data-type='CLOSED'] {
    background: var(--color-danger-soft);
    color: var(--color-danger);
  }
  .type-badge[data-type='NOTFIXED'] {
    background: var(--palette-blue-100);
    color: var(--palette-slate-450);
  }

  @media (max-width: 640px) {
    .meeting-card {
      padding: var(--space-4) var(--space-4);
      border-radius: var(--radius-sm);
      gap: var(--space-4);
    }
  }
</style>

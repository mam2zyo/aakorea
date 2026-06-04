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
      <span class="day">{meeting.dayOfWeek ? formatDay(meeting.dayOfWeek) : '-'}</span>
      <span class="time">{meeting.startTime ? meeting.startTime.substring(0, 5) : '--:--'}</span>
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
      <span class="type-badge" data-type={meeting.type ?? 'NOTFIXED'}>
        {meeting.type ? formatType(meeting.type) : '미정'}
      </span>
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
    align-items: center;
    min-width: 60px;
    border-right: 1px solid var(--palette-blue-100);
  }

  .day-time {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .day-time .day {
    font-size: 1rem;
    font-weight: 700;
    color: var(--palette-blue-950);
    line-height: 1.2;
  }

  .day-time .time {
    font-size: 1rem;
    font-weight: 700;
    color: var(--palette-blue-950);
    line-height: 1.2;
  }

  .card-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .group-info {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .group-info .group-name {
    font-size: 1rem;
    font-weight: 800;
    color: var(--palette-blue-950);
    margin: 0;
    flex: 1;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    line-height: 1.2;
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
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
    margin-top: 2px;
  }

  .type-badge[data-type='OPEN'] {
    background: #ecfdf5;
    color: #059669;
  }
  .type-badge[data-type='CLOSED'] {
    background: #fef2f2;
    color: #dc2626;
  }
  .type-badge[data-type='NOTFIXED'] {
    background: #fffbeb;
    color: #d97706;
  }

  @media (max-width: 640px) {
    .meeting-card {
      padding: var(--space-4) var(--space-4);
      border-radius: var(--radius-sm);
      gap: var(--space-4);
    }
  }
</style>

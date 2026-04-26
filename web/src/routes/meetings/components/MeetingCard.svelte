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
		border-radius: 1.5rem;
		border: 1px solid var(--color-border-subtle);
		display: flex;
		gap: var(--space-1);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		appearance: none;
		font-family: inherit;
		box-shadow: 0 4px 12px var(--color-shadow);
		margin: 0;
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
		min-width: 70px;
	}

	.day-time {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.day-time .day {
		font-size: 1rem;
		font-weight: 600;
		color: #393c40;
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
		color: #1f2937;
		margin: 0;
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.distance-inline {
		font-size: 0.85rem;
		color: var(--color-primary);
		font-weight: 500;
		margin-top: 1px;
	}

	.card-main .address {
		font-size: 0.9rem;
		color: #4b5563;
		margin: 0;
	}

	.type-badge {
		padding: 0.2rem 0.6rem;
		border-radius: 0.5rem;
		font-size: 0.7rem;
		font-weight: 600;
		white-space: nowrap;
		margin-left: auto;
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
			padding: var(--space-5) var(--space-6);
		}
	}
</style>

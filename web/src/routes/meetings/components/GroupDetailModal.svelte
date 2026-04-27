<script lang="ts">
	import type { Meeting, GroupDetail, GroupMeeting } from '$lib/api/publicContent';
	import KakaoMeetingMap from './KakaoMeetingMap.svelte';

	interface Props {
		selectedMeeting: Meeting | null;
		groupDetail: GroupDetail | null;
		loading: boolean;
		onClose: () => void;
	}

	let { selectedMeeting, groupDetail, loading, onClose }: Props = $props();

	// 현재 상세 팝업에서 선택된(포커스된) 모임 일정
	let activeMeeting = $state<GroupMeeting | Meeting | null>(null);

	// 모달이 열릴 때(selectedMeeting이 변경될 때) activeMeeting을 초기화 및 배경 스크롤 방지
	$effect(() => {
		activeMeeting = selectedMeeting;

		if (selectedMeeting) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}

		return () => {
			document.body.style.overflow = '';
		};
	});

	// 상세 정보가 로드되면, 현재 선택된 일정을 상세 정보 버전(GroupMeeting)으로 교체하여 더 많은 정보(연락처 등)를 표시할 수 있게 함
	$effect(() => {
		if (groupDetail && activeMeeting && !isGroupMeeting(activeMeeting)) {
			const matched = groupDetail.meetings.find((m) => m.id === activeMeeting?.id);
			if (matched) {
				activeMeeting = matched;
			}
		}
	});

	function handleScheduleClick(meeting: GroupMeeting | Meeting) {
		activeMeeting = meeting;
	}

	function isMeeting(m: Meeting | GroupMeeting | null): m is Meeting {
		return !!m && 'groupName' in m;
	}

	function isGroupMeeting(m: Meeting | GroupMeeting | null): m is GroupMeeting {
		return !!m && 'contactPhone' in m;
	}

	const currentContactPhone = $derived(
		isGroupMeeting(activeMeeting)
			? activeMeeting.contactPhone || groupDetail?.contactPhone
			: groupDetail?.contactPhone
	);

	function formatDay(day: string) {
		const days: Record<string, string> = {
			MONDAY: '월요일',
			TUESDAY: '화요일',
			WEDNESDAY: '수요일',
			THURSDAY: '목요일',
			FRIDAY: '금요일',
			SATURDAY: '토요일',
			SUNDAY: '일요일'
		};
		return days[day] || day;
	}

	function formatType(type: string) {
		const types: Record<string, string> = {
			OPEN: '공개',
			CLOSED: '비공개',
			NOTFIXED: '가변'
		};
		return types[type] || type;
	}

	function getKakaoMapUrl(m: Meeting | GroupMeeting) {
		if (!m.latitude || !m.longitude) return '#';
		const groupName =
			(isMeeting(m) ? m.groupName : '') || selectedMeeting?.groupName || 'AA 모임 장소';
		const label = encodeURIComponent(m.locationDetail || groupName);
		return `https://map.kakao.com/link/map/${label},${m.latitude},${m.longitude}`;
	}

	function getTMapUrl(m: Meeting | GroupMeeting) {
		if (!m.latitude || !m.longitude) return '#';
		const appKey = import.meta.env.VITE_TMAP_APP_KEY;
		const groupName =
			(isMeeting(m) ? m.groupName : '') || selectedMeeting?.groupName || 'AA 모임 장소';
		const params = new URLSearchParams({
			appKey: appKey || '',
			lat: String(m.latitude),
			lon: String(m.longitude),
			name: m.locationDetail || groupName
		});
		return `https://apis.openapi.sk.com/tmap/app/routes?${params.toString()}`;
	}
</script>

{#if selectedMeeting}
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
				<div class="header-title-group">
					<h2 class="group-name">{selectedMeeting.groupName}</h2>
					<span class="district-name">{groupDetail?.district?.name || '지역 정보 없음'}</span>
				</div>
				<button class="close-btn-header" onclick={onClose} aria-label="닫기">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
						></line></svg
					>
				</button>
			</div>

			<div class="modal-body">
				{#if loading}
					<div class="loading-state">
						<div class="spinner"></div>
						<p>정보를 불러오고 있습니다...</p>
					</div>
				{:else}
					<!-- 공지사항 -->
					{#if groupDetail?.notice}
						<div class="detail-section notice-section">
							<h3 class="section-title">그룹 공지</h3>
							<div class="notice-display">
								<p class="notice-content">{groupDetail.notice}</p>
							</div>
						</div>
					{/if}

					<!-- 모임 일정 (스케줄) -->
					<div class="detail-section">
						<h3 class="section-title">모임 일정</h3>
						<div class="schedule-list">
							{#each groupDetail?.meetings || [] as meeting (meeting.id)}
								<button
									class="schedule-card"
									class:active={activeMeeting?.id === meeting.id}
									onclick={() => handleScheduleClick(meeting)}
								>
									<div class="schedule-main">
										<span class="day-time">
											<strong
												>{formatDay(meeting.dayOfWeek)} {meeting.startTime.substring(0, 5)}</strong
											>
										</span>
										<span class="type-badge" data-type={meeting.type}
											>{formatType(meeting.type)}</span
										>
									</div>
								</button>
							{/each}
						</div>
					</div>

					<!-- 모임 장소 (선택된 일정 기준) -->
					{#if activeMeeting}
						<div class="detail-section">
							<h3 class="section-title">모임 장소</h3>
							<div class="location-card">
								<div class="location-header">
									<div class="location-info">
										<strong class="location-detail"
											>{activeMeeting.locationDetail || '상세 위치 정보 없음'}</strong
										>
										<p class="location-address">
											{activeMeeting.locationAddress || '주소 정보 없음'}
										</p>
									</div>

									<div class="map-actions">
										<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
										<a
											href={getKakaoMapUrl(activeMeeting)}
											target="_blank"
											rel="noopener noreferrer"
											class="map-icon-btn"
											title="카카오맵에서 보기"
										>
											<img src="/images/icons/kakaomap100.png" alt="카카오맵" />
										</a>
										<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
										<a
											href={getTMapUrl(activeMeeting)}
											target="_blank"
											rel="noopener noreferrer"
											class="map-icon-btn"
											title="티맵에서 보기"
										>
											<img src="/images/icons/tmap100.png" alt="티맵" />
										</a>
									</div>
								</div>

								<div class="map-container">
									<KakaoMeetingMap
										latitude={activeMeeting.latitude}
										longitude={activeMeeting.longitude}
										groupName={selectedMeeting.groupName}
									/>
								</div>
							</div>
						</div>

						<!-- 연락처 -->
						{#if currentContactPhone}
							<div class="detail-section contact-section">
								<h3 class="section-title">연락처</h3>
								<div class="contact-display">
									<strong class="phone-number">{currentContactPhone}</strong>
								</div>
							</div>
						{/if}
					{/if}
				{/if}
			</div>

			{#if currentContactPhone}
				<footer class="modal-footer">
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a href="tel:{currentContactPhone}" class="fab-call-btn" aria-label="전화하기">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M6.62 10.79a15.06 15.06 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.32.56 3.57.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.06 21 3 13.94 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.45.56 3.57a1 1 0 0 1-.24 1.02z"
							/>
						</svg>
					</a>
				</footer>
			{/if}
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(8px);
		z-index: 2000;
		display: flex;
		align-items: flex-end; /* 모바일: 하단 배치 */
		justify-content: center;
	}

	.modal-content {
		background: #fff;
		width: 100%;
		max-width: 600px;
		height: 90vh;
		border-radius: 2rem 2rem 0 0;
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
		animation: slide-up 0.4s cubic-bezier(0.25, 1, 0.5, 1);
	}

	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}

	@keyframes modal-appear {
		from {
			opacity: 0;
			transform: scale(0.95) translateY(20px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.close-btn-header {
		background: var(--color-bg-subtle);
		border: none;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-text-soft);
		transition: all 0.2s;
	}

	.close-btn-header:hover {
		background: #eee;
		color: var(--color-text-strong);
	}

	.modal-header {
		padding: var(--space-3) var(--space-8);
		border-bottom: 1.5px solid #e2e2e2; /* 조금 더 선명한 구분선 */
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: sticky;
		top: 0;
		background: #fff;
		z-index: 10;
	}

	.header-title-group {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: var(--space-3) var(--space-8);
		padding-bottom: var(--space-24); /* 여유 있는 하단 스크롤 (버튼에 가려지지 않게) */
	}

	.group-name {
		font-size: 1.4rem;
		font-weight: 700;
		color: var(--color-text-strong);
		margin: 0;
	}

	.district-name {
		color: var(--color-text-soft);
		font-size: 0.9rem;
		font-weight: 500;
	}

	.section-title {
		font-size: 0.85rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0 0 var(--space-2) 0; /* 제목과 내용 사이 간격 축소 */
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.detail-section {
		margin-bottom: var(--space-10); /* 섹션 간 간격 확대 */
	}

	/* 공지사항 */
	.notice-display {
		padding-left: var(--space-4);
	}

	.notice-content {
		margin: 0;
		line-height: 1.6;
		color: var(--color-text);
		white-space: pre-wrap;
	}

	/* 일정 리스트 */
	.schedule-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.schedule-card {
		background: #fff;
		border: 1px solid var(--color-border-subtle);
		border-radius: 1rem;
		padding: var(--space-4);
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
	}

	.schedule-card.active {
		background: var(--palette-blue-50);
		border-color: var(--color-primary);
		box-shadow: 0 0 0 1px var(--color-primary);
	}

	.schedule-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.day-time {
		font-size: 1rem;
		color: var(--color-text-strong);
	}

	/* 장소 카드 */
	.location-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-3); /* 내부 요소 간격 축소 */
	}

	.location-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-4);
	}

	.location-info {
		padding-left: var(--space-4);
		flex: 1;
		min-width: 0;
	}

	.location-detail {
		display: block;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-strong);
		margin-bottom: 0.25rem;
	}

	.location-address {
		color: var(--color-text-soft);
		margin: 0;
		line-height: 1.5;
		word-break: keep-all;
		overflow-wrap: break-word;
	}

	.map-actions {
		display: flex;
		gap: var(--space-3);
		flex-shrink: 0;
	}

	.map-icon-btn {
		display: block;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s;
	}

	.map-icon-btn:hover {
		transform: translateY(-2px);
	}

	.map-icon-btn img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.map-container {
		height: 240px;
		border-radius: 1.5rem;
		overflow: hidden;
		border: 1px solid var(--color-border-subtle);
	}

	/* 연락처 */
	.contact-display {
		padding-left: var(--space-4);
	}

	.phone-number {
		font-size: 1rem;
		color: var(--color-text-strong);
	}

	/* 하단 전화 버튼 (FAB) */
	.modal-footer {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		padding-bottom: var(--space-6);
		pointer-events: none;
		z-index: 15;
	}

	.fab-call-btn {
		pointer-events: auto;
		width: 4rem;
		height: 4rem;
		background: var(--color-primary);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.fab-call-btn:hover {
		transform: scale(1.1) translateY(-5px);
		background: var(--color-primary-strong);
	}

	/* 타입 뱃지 */
	.type-badge {
		padding: 0.2rem 0.6rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 700;
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

	.loading-state {
		padding: var(--space-12);
		text-align: center;
		color: var(--color-text-soft);
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--color-bg-subtle);
		border-top-color: var(--color-primary);
		border-radius: 50%;
		margin: 0 auto var(--space-4);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (min-width: 640px) {
		.modal-overlay {
			align-items: center; /* 큰 화면: 중앙 배치 */
			padding: var(--space-6);
		}

		.modal-content {
			height: auto;
			max-height: 85vh;
			border-radius: 2rem; /* 사방 곡률 */
			animation: modal-appear 0.4s cubic-bezier(0.25, 1, 0.5, 1);
			box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
		}

		.modal-header {
			padding: var(--space-6) var(--space-10);
		}

		.modal-body {
			padding: var(--space-4) var(--space-10);
			padding-bottom: var(--space-24);
		}
	}
</style>

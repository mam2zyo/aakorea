<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import SubPageHero from '$lib/components/ui/SubPageHero.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const notices = $derived(data.notices || []);
</script>

<svelte:head>
  <title>공지사항 - AA Korea</title>
  <meta name="description" content="한국 AA 연합의 새로운 소식과 공지사항을 확인하세요." />
</svelte:head>

<SubPageHero eyebrow="Announcements & News" title="공지사항" />

<Container>
  <div class="notice-list-container">
    <div class="notice-list">
      {#if notices.length === 0}
        <div class="empty-state">
          <p>등록된 공지사항이 없습니다.</p>
        </div>
      {:else}
        {#each notices as notice (notice.id)}
          <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
          <a href="/notices/{notice.id}" class="notice-card" class:important={notice.important}>
            <div class="notice-meta">
              {#if notice.important}
                <span class="badge important">중요</span>
              {/if}
              <span class="date">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <h2 class="notice-title">{notice.title}</h2>
            <div class="notice-footer">
              <span class="view-count">조회 {notice.viewCount}</span>
            </div>
          </a>
        {/each}
      {/if}
    </div>
  </div>
</Container>

<style>
  .notice-list-container {
    padding: var(--space-10) 0;
  }

  .notice-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .notice-card {
    display: block;
    padding: var(--space-6);
    background: #fff;
    border: 1px solid var(--palette-blue-100);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 4px 12px rgba(var(--palette-blue-500-rgb), 0.04);
  }

  .notice-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(var(--palette-blue-500-rgb), 0.1);
  }

  .notice-card.important {
    background: var(--palette-blue-50);
    border-left: 4px solid var(--color-accent);
  }

  .notice-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .badge {
    padding: 2px 10px;
    border-radius: 999px;
    font-size: var(--font-size-xs);
    font-weight: 700;
  }

  .badge.important {
    background: var(--color-accent);
    color: #fff;
  }

  .date {
    font-size: var(--font-size-sm);
    color: var(--color-text-soft);
  }

  .notice-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--palette-blue-950);
    margin: 0 0 var(--space-3);
    line-height: 1.4;
  }

  .notice-footer {
    display: flex;
    justify-content: flex-end;
  }

  .view-count {
    font-size: var(--font-size-xs);
    color: var(--color-text-soft);
  }

  .empty-state {
    padding: var(--space-12);
    text-align: center;
    background: var(--palette-blue-50);
    border-radius: var(--radius-lg);
    color: var(--color-text-soft);
  }

  @media (max-width: 640px) {
    .notice-card {
      padding: var(--space-5);
    }
  }
</style>

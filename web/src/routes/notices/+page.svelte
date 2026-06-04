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
          <a href="/notices/{notice.id}" class="notice-card">
            <div class="notice-meta">
              <span class="date">{new Date(notice.publishedAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <h2 class="notice-title">{notice.title}</h2>
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

  .notice-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .date {
    font-size: var(--font-size-sm);
    color: var(--color-text-soft);
  }

  .notice-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--palette-blue-950);
    margin: 0;
    line-height: 1.4;
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

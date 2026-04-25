<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const notices = $derived(data.notices || []);
</script>

<svelte:head>
  <title>공지사항 - AA Korea</title>
  <meta name="description" content="한국 AA 연합의 새로운 소식과 공지사항을 확인하세요." />
</svelte:head>

<Section>
  <Container>
    <div class="page-header">
      <h1 class="page-title">공지사항</h1>
      <p class="page-description">한국 AA 연합의 새로운 소식과 안내를 전해드립니다.</p>
    </div>

    <div class="notice-list">
      {#if notices.length === 0}
        <div class="empty-state">
          <p>등록된 공지사항이 없습니다.</p>
        </div>
      {:else}
        {#each notices as notice}
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
  </Container>
</Section>

<style>
  .page-header {
    margin-bottom: var(--space-8);
  }

  .page-title {
    font-size: var(--font-size-3xl);
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-text-strong);
    margin: 0 0 var(--space-2);
  }

  .page-description {
    color: var(--color-text-soft);
    font-size: var(--font-size-lg);
  }

  .notice-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .notice-card {
    display: block;
    padding: var(--space-5);
    background: var(--public-card-background);
    border: 1px solid var(--public-card-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .notice-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px var(--color-shadow);
  }

  .notice-card.important {
    background: var(--public-card-background-soft);
    border-left: 4px solid var(--palette-gold);
  }

  .notice-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: var(--font-size-xs);
    font-weight: 600;
  }

  .badge.important {
    background: var(--palette-gold);
    color: var(--palette-blue-950);
  }

  .date {
    font-size: var(--font-size-sm);
    color: var(--color-text-soft);
  }

  .notice-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-strong);
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
    background: var(--public-card-background-soft);
    border-radius: var(--radius-lg);
    color: var(--color-text-soft);
  }

  @media (max-width: 640px) {
    .page-title {
      font-size: var(--font-size-2xl);
    }
    
    .notice-card {
      padding: var(--space-4);
    }
  }
</style>

<script lang="ts">
  import Container from '$lib/components/ui/Container.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const notice = $derived(data.notice);
</script>

<svelte:head>
  <title>{notice.title} - 공지사항 | AA Korea</title>
  <meta name="description" content={notice.title} />
</svelte:head>

<Section>
  <Container>
    <div class="notice-header">
      <a href="/notices" class="back-link">← 목록으로 돌아가기</a>

      <div class="title-wrapper">
        {#if notice.important}
          <span class="badge important">중요</span>
        {/if}
        <h1 class="notice-title">{notice.title}</h1>
      </div>

      <div class="notice-meta">
        <span class="date"
          >{new Date(notice.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span
        >
        <span class="divider">|</span>
        <span class="views">조회 {notice.viewCount}</span>
      </div>
    </div>

    <div class="notice-content prose">
      {@html notice.content}
    </div>

    <div class="notice-actions">
      <Button href="/notices" variant="outline">목록보기</Button>
    </div>
  </Container>
</Section>

<style>
  .notice-header {
    margin-bottom: var(--space-8);
    padding-bottom: var(--space-8);
    border-bottom: 1px solid var(--color-border);
  }

  .back-link {
    display: inline-block;
    margin-bottom: var(--space-6);
    color: var(--color-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .title-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .notice-title {
    font-size: var(--font-size-3xl);
    font-family: var(--font-display);
    font-weight: 700;
    color: var(--color-text-strong);
    line-height: 1.3;
    margin: 0;
  }

  .badge {
    margin-top: 0.25rem;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: var(--font-size-xs);
    font-weight: 600;
    flex-shrink: 0;
  }

  .badge.important {
    background: var(--palette-gold);
    color: var(--palette-blue-950);
  }

  .notice-meta {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--color-text-soft);
    font-size: var(--font-size-sm);
  }

  .divider {
    opacity: 0.3;
  }

  .notice-content {
    min-height: 300px;
    margin-bottom: var(--space-12);
    color: var(--color-text);
    line-height: 1.8;
  }

  /* Prose styles for rendered HTML */
  :global(.prose img) {
    max-width: 100%;
    height: auto;
    border-radius: var(--radius-md);
    margin: var(--space-6) 0;
  }

  :global(.prose p) {
    margin-bottom: var(--space-4);
  }

  :global(.prose h2, .prose h3) {
    color: var(--color-text-strong);
    margin: var(--space-8) 0 var(--space-4);
  }

  .notice-actions {
    display: flex;
    justify-content: center;
    padding-top: var(--space-8);
    border-top: 1px solid var(--color-border);
  }

  @media (max-width: 640px) {
    .notice-title {
      font-size: var(--font-size-2xl);
    }

    .title-wrapper {
      flex-direction: column;
      gap: var(--space-2);
    }
  }
</style>

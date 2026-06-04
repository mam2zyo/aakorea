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
        <h1 class="notice-title">{notice.title}</h1>
      </div>

      <div class="notice-meta">
        <span class="date"
          >{new Date(notice.publishedAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span
        >
      </div>
    </div>

    <div class="notice-content prose">
      {@html notice.bodyHtml}
    </div>

    {#if notice.attachments && notice.attachments.length > 0}
      <div class="attachments-section">
        <h3 class="attachments-title">첨부파일</h3>
        <ul class="attachments-list">
          {#each notice.attachments as attachment (attachment.id)}
            <li class="attachment-item">
              <a href={attachment.url} target="_blank" rel="noopener noreferrer" class="attachment-link">
                <span class="file-icon">📎</span>
                <span class="file-name">{attachment.originalName}</span>
                <span class="file-size">({Math.round(attachment.fileSize / 1024)} KB)</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

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

  .notice-meta {
    color: var(--color-text-soft);
    font-size: var(--font-size-sm);
  }

  .notice-content {
    min-height: 300px;
    margin-bottom: var(--space-12);
    color: var(--color-text);
    line-height: 1.8;
  }

  /* Attachments Section */
  .attachments-section {
    margin: var(--space-12) 0;
    padding: var(--space-6);
    background: var(--palette-blue-50);
    border-radius: var(--radius-lg);
  }

  .attachments-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--space-4);
    color: var(--color-text-strong);
  }

  .attachments-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .attachment-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);
    text-decoration: none;
    font-size: var(--font-size-sm);
    padding: var(--space-2) var(--space-3);
    background: #fff;
    border: 1px solid var(--palette-blue-100);
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .attachment-link:hover {
    background: var(--palette-blue-100);
    border-color: var(--color-primary);
  }

  .file-size {
    color: var(--color-text-soft);
    font-size: var(--font-size-xs);
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

  :global(.prose ul) {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-bottom: var(--space-4);
  }

  :global(.prose ol) {
    list-style-type: decimal;
    padding-left: 1.25rem;
    margin-bottom: var(--space-4);
  }

  :global(.prose li) {
    margin-bottom: var(--space-1);
  }

  :global(.prose li p) {
    margin-bottom: 0;
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
  }
</style>

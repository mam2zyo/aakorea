<script lang="ts">
  import Hero from './Hero.svelte';
  import Section from '$lib/components/ui/Section.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const latestNotices = $derived(data.latestNotices || []);
</script>

<Hero />

{#if latestNotices.length > 0}
  <Section eyebrow="News" title="최신 소식" description="AA Korea의 새로운 소식을 확인하세요.">
    <div class="notices-grid">
      {#each latestNotices as notice (notice.id)}
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <a href="/notices/{notice.id}" class="notice-item">
          <div class="notice-date">
            {notice.publishedAt ? new Date(notice.publishedAt).toLocaleDateString('ko-KR') : ''}
          </div>
          <h3 class="notice-title">{notice.title}</h3>
          <span class="more">자세히 보기 →</span>
        </a>
      {/each}
    </div>
    <div class="notices-footer">
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a href="/notices" class="text-link">모든 공지사항 보기</a>
    </div>
  </Section>
{/if}

<Section
  id="guide"
  eyebrow="First Visit Flow"
  title="처음 방문이시라면?"
  description="먼저 아래 카드들을 살펴보세요."
>
  <div class="journey-grid">
    <div class="step">
      <span class="number">1</span>
      <h3>안내 페이지를 먼저 읽어보세요.</h3>
      <p>AA 소개와 처음 참석 전 참고할 내용을 짧게 확인할 수 있습니다.</p>
    </div>

    <div class="step">
      <span class="number">2</span>
      <h3>지역별 모임을 찾아보세요.</h3>
      <p>
        가까운 지역, 요일, 시간대를 기준으로 실제 참석 가능한 모임을 확인합니다. 내 위치를 기준으로
        검색할 수 있습니다.
      </p>
    </div>

    <div class="step">
      <span class="number">3</span>
      <h3>전화하거나 방문 계획을 세워보세요.</h3>
      <p>공개된 연락처로 전화하거나 문자 메시지를 남겨보세요.</p>
    </div>
  </div>
</Section>

<style>
  .notices-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-bottom: var(--space-8);
  }

  .notice-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-6);
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .notice-item:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: 0 4px 20px var(--color-shadow);
  }

  .notice-date {
    font-size: var(--font-size-xs);
    color: var(--color-text-soft);
    font-weight: 600;
  }

  .notice-title {
    font-size: var(--font-size-lg);
    color: var(--color-text-strong);
    margin: 0;
    line-height: 1.4;
    font-weight: 600;
    /* Limit to 2 lines */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .more {
    font-size: var(--font-size-sm);
    color: var(--color-primary);
    font-weight: 500;
    margin-top: auto;
  }

  .notices-footer {
    display: flex;
    justify-content: center;
  }

  .text-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--font-size-base);
  }

  .text-link:hover {
    text-decoration: underline;
  }

  .journey-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }

  .step {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-6);
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    transition: transform 0.2s ease;
  }

  .step:hover {
    transform: translateY(-4px);
    border-color: var(--color-primary);
  }

  .number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--color-primary);
    color: #fff;
    border-radius: 999px;
    font-weight: 700;
    font-size: var(--font-size-lg);
  }

  .step h3 {
    font-size: var(--font-size-lg);
    color: var(--color-text);
    margin: 0;
  }

  .step p {
    font-size: var(--font-size-base);
    color: var(--color-text-muted);
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 920px) {
    .journey-grid,
    .notices-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script lang="ts">
  import Hero from './Hero.svelte';
  import Section from '$lib/components/ui/Section.svelte';
</script>

<Hero />

<Section 
  eyebrow="First Visit Flow" 
  title="처음 방문했다면 이 순서로 보시면 됩니다."
  description="긴 설명보다 행동 순서를 먼저 보여 주어, 처음인 분도 다음 단계로 자연스럽게 이어지도록 구성했습니다."
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
      <p>가까운 지역, 요일, 시간대를 기준으로 실제 참석 가능한 모임을 확인합니다.</p>
    </div>

    <div class="step">
      <span class="number">3</span>
      <h3>전화하거나 방문 계획을 세워보세요.</h3>
      <p>공개된 연락처와 모임 정보를 바탕으로 다음 행동으로 바로 이어집니다.</p>
    </div>
  </div>
</Section>

<style>
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
    .journey-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

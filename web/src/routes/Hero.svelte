<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Container from '$lib/components/ui/Container.svelte';
</script>

<div class="hero">
  <Container>
    <div class="hero-inner">
      <div class="copy">
        <p class="eyebrow">Alcoholics Anonymous Korea</p>
        <h1 class="title">
          처음 오셨나요? <br />
          안내를 읽고 가까운 <span class="accent">AA 모임</span>을 찾을 수 있습니다.
        </h1>
        <p class="description">
          처음 방문한 분은 안내를 먼저 읽고, 바로 도움을 찾고 싶은 분은 지역별 모임과 공개 연락처를 확인할 수 있도록 홈을 출발점으로 구성했습니다.
        </p>

        <div class="actions">
          <Button variant="primary" size="lg">처음 오신 분 안내</Button>
          <Button variant="outline" size="lg">모임 찾기</Button>
          <Button variant="ghost" size="lg">공지 보기</Button>
        </div>
      </div>

      <div class="aside">
        <div class="card glass">
          <span class="chip">빠른 시작</span>
          <strong>어디서부터 봐야 할지 바로 정할 수 있게</strong>
          <p>안내, 공지, 모임 찾기를 첫 화면에서 같은 수준으로 두고 다음 행동을 짧게 고를 수 있게 했습니다.</p>
        </div>
      </div>
    </div>
  </Container>
</div>

<style>
  .hero {
    padding: var(--space-12) 0;
    position: relative;
    overflow: hidden;
  }

  .hero-inner {
    display: grid;
    grid-template-columns: 1.3fr 0.7fr;
    gap: var(--space-8);
    align-items: center;
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .eyebrow {
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin: 0;
  }

  .title {
    font-family: var(--font-display);
    font-size: var(--font-size-4xl);
    line-height: 1.15;
    color: var(--color-text);
    margin: 0;
  }

  .accent {
    color: var(--color-primary);
    position: relative;
  }

  .description {
    font-size: var(--font-size-xl);
    color: var(--color-text-muted);
    line-height: 1.6;
    margin: 0;
    max-width: 640px;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    margin-top: var(--space-4);
  }

  .aside {
    display: flex;
    justify-content: flex-end;
  }

  .card {
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    border: 1px solid var(--public-panel-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    max-width: 320px;
    box-shadow: var(--public-panel-shadow);
  }

  .glass {
    background: rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .chip {
    display: inline-flex;
    align-self: flex-start;
    padding: var(--space-1) var(--space-3);
    background: rgba(var(--palette-blue-500-rgb), 0.1);
    color: var(--color-primary);
    border-radius: 999px;
    font-size: var(--font-size-xs);
    font-weight: 700;
  }

  .card strong {
    font-size: var(--font-size-lg);
    color: var(--color-text);
    line-height: 1.3;
  }

  .card p {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0;
  }

  @media (max-width: 1024px) {
    .hero-inner {
      grid-template-columns: 1fr;
      gap: var(--space-10);
    }

    .aside {
      justify-content: flex-start;
    }

    .card {
      max-width: none;
      width: 100%;
    }
  }

  @media (max-width: 640px) {
    .title {
      font-size: var(--font-size-3xl);
    }

    .description {
      font-size: var(--font-size-lg);
    }
    
    .actions > :global(*) {
      width: 100%;
    }
  }
</style>

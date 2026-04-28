<script lang="ts">
  import Button from '$lib/components/ui/Button.svelte';
  import Container from '$lib/components/ui/Container.svelte';
  import heroBg from '$lib/assets/hero-bg.png?enhanced&w=1920;1280;640';
</script>

<div class="hero">
  <div class="hero-bg">
    <enhanced:img
      src={heroBg}
      alt="Hope and Recovery"
      fetchpriority="high"
      loading="eager"
      sizes="min(1920px, 100vw)"
    />
  </div>

  <Container>
    <div class="hero-inner">
      <div class="copy">
        <p class="eyebrow">Alcoholics Anonymous Korea</p>
        <h1 class="title">
          술문제로 <br />
          어려움이 있으신가요?
        </h1>
        <p class="description">
          AA가 도움이 될 수 있습니다. <br />
          익명의 알코올중독자들 모임에 참석해보세요.
        </p>

        <div class="actions">
          <Button variant="accent" size="lg">가까운 모임 찾기</Button>
          <Button variant="outline" size="lg">처음 오신 분 안내</Button>
        </div>
      </div>

      <div class="aside">
        <div class="card glass">
          <span class="chip">Hope & Recovery</span>
          <strong>혼자가 아닙니다</strong>
          <p>
            전 세계 수백만 명의 멤버들이 AA를 통해 회복의 삶을 살고 있습니다. 오늘 그 첫걸음을
            내디뎌보세요.
          </p>
        </div>
      </div>
    </div>
  </Container>
</div>

<style>
  .hero {
    min-height: 70vh;
    display: flex;
    align-items: center;
    padding: var(--space-12) 0;
    position: relative;
    overflow: hidden;
    background-color: var(--palette-blue-50);
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero-bg :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .hero-inner {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-10);
  }

  .copy {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    max-width: 580px;
  }

  .eyebrow {
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    font-weight: 700;
    text-transform: uppercase;
    margin: 0;
    text-shadow: 0 1px 4px rgba(255, 255, 255, 0.9);
  }

  .title {
    font-family: var(--font-display);
    font-size: 3.5rem;
    font-weight: 800;
    line-height: 1.2;
    color: var(--palette-blue-950);
    margin: 0;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 16px rgba(255, 255, 255, 0.9);
  }

  .description {
    font-size: var(--font-size-xl);
    color: var(--palette-white);
    max-width: 600px;
    line-height: 1.6;
    font-weight: 400;
    letter-spacing: -0.02em;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    margin-top: var(--space-2);
  }

  .aside {
    display: flex;
    justify-content: flex-start;
    width: 100%;
  }

  .card {
    padding: var(--space-8) var(--space-10);
    border-radius: var(--radius-lg);
    border: 1px solid rgba(255, 255, 255, 0.4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 420px;
    box-shadow: 0 12px 40px rgba(var(--palette-blue-900-rgb), 0.08);
  }

  .glass {
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .chip {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    padding: var(--space-1) var(--space-3);
    background: var(--color-primary);
    color: #fff;
    border-radius: 999px;
    font-size: var(--font-size-xs);
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .card strong {
    font-size: var(--font-size-xl);
    color: var(--palette-blue-950);
    line-height: 1.3;
    margin: 0;
  }

  .card p {
    font-size: var(--font-size-base);
    color: var(--palette-blue-900);
    opacity: 0.8;
    line-height: 1.6;
    margin: 0;
  }

  @media (max-width: 1024px) {
    .hero {
      min-height: 60vh;
      padding: var(--space-20) 0;
    }
    .title {
      font-size: 2.8rem;
    }
  }

  @media (max-width: 640px) {
    .hero {
      min-height: 38vh;
      padding: var(--space-8) 0 var(--space-6);
    }
    .hero-bg :global(img) {
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: 50%;
    }
    .hero-inner {
      gap: var(--space-6);
      position: relative;
      z-index: 2;
    }
    .title {
      font-size: 1.95rem;
    }
    .description {
      font-size: var(--font-size-base);
    }
    .actions {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-4);
    }
    .actions > :global(*) {
      width: auto;
      min-width: 180px;
      padding: 0.9rem 1.8rem;
      font-size: 1rem;
    }
    /* Enhance visibility for the outline button on mobile image background */
    .actions > :global(*:last-child) {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    .aside {
      display: none;
    }
  }
</style>

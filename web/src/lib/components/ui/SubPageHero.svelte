<script lang="ts">
  import Container from './Container.svelte';

  interface Props {
    eyebrow: string;
    title: string;
    children?: import('svelte').Snippet;
  }

  let { eyebrow, title, children }: Props = $props();
</script>

<div class="sub-hero">
  <div class="hero-bg"></div>
  <Container>
    <div class="hero-content">
      <div class="title-group">
        <span class="eyebrow">{eyebrow}</span>
        <h1 class="page-title">{title}</h1>
      </div>
      {#if children}
        <div class="hero-actions">
          {@render children()}
        </div>
      {/if}
    </div>
  </Container>
</div>

<style>
  .sub-hero {
    position: relative;
    overflow: hidden;
    /* background: linear-gradient(135deg, #efc26e 0%, rgb(64, 130, 58) 100%); */
    background-color: var(--palette-gold-500);
    padding: var(--space-10) 0 var(--space-12);
    border-bottom: 1px solid var(--palette-blue-100);
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background-image: radial-gradient(var(--palette-blue-300) 1px, transparent 1px);
    background-size: 32px 32px;
    mask-image: radial-gradient(ellipse at center, black, transparent 90%);
  }

  .hero-content {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--space-10);
  }

  .title-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .eyebrow {
    font-size: 0.85rem;
    font-weight: 700;
    padding-left: var(--space-2);
    color: var(--color-primary);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }

  .page-title {
    font-size: 3.2rem;
    font-weight: 800;
    color: var(--palette-blue-950);
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.1;
    font-family: var(--font-display);
  }

  .hero-actions {
    display: flex;
    gap: var(--space-4);
  }

  @media (max-width: 920px) {
    .hero-content {
      display: flex; /* Override grid */
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-6);
    }
    .page-title {
      font-size: 2.8rem;
      line-height: 1.2;
    }
    .hero-actions {
      width: 100%;
      flex-wrap: wrap;
    }
    .sub-hero {
      padding: var(--space-8) 0 var(--space-10);
    }
  }

  @media (max-width: 640px) {
    .sub-hero {
      padding: var(--space-6) 0 var(--space-8);
    }
    .page-title {
      font-size: 2.1rem;
      line-height: 1.2;
    }
  }
</style>

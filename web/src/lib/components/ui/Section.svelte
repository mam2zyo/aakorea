<script lang="ts">
  import type { Snippet } from 'svelte';
  import Container from './Container.svelte';

  interface Props {
    title?: string;
    description?: string;
    eyebrow?: string;
    center?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    title,
    description,
    eyebrow,
    center = false,
    class: className = '',
    children
  }: Props = $props();
</script>

<section class="section {className}" class:center>
  <Container>
    {#if eyebrow || title || description}
      <div class="header">
        {#if eyebrow}
          <p class="eyebrow">{eyebrow}</p>
        {/if}
        {#if title}
          <h2 class="title">{title}</h2>
        {/if}
        {#if description}
          <p class="description">{description}</p>
        {/if}
      </div>
    {/if}

    {#if children}
      <div class="content">
        {@render children()}
      </div>
    {/if}
  </Container>
</section>

<style>
  .section {
    padding: var(--space-12) 0;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 800px;
    margin-bottom: var(--space-8);
  }

  .center .header {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }

  .eyebrow {
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .title {
    font-family: var(--font-display);
    font-size: var(--font-size-3xl);
    color: var(--color-text);
    margin: 0;
    line-height: 1.2;
  }

  .description {
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    margin: 0;
    line-height: 1.6;
  }

  @media (max-width: 640px) {
    .section {
      padding: var(--space-8) 0;
    }

    .title {
      font-size: var(--font-size-2xl);
    }

    .description {
      font-size: var(--font-size-base);
    }
  }
</style>

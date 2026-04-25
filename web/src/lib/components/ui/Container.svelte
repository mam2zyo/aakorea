<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    maxWidth?: string;
    class?: string;
    children: Snippet;
  }

  let { 
    maxWidth = '1180px', 
    class: className = '', 
    children 
  }: Props = $props();
</script>

<div class="container {className}" style:max-width={maxWidth}>
  {@render children()}
</div>

<style>
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--space-5);
    padding-right: var(--space-5);
  }

  @media (max-width: 640px) {
    .container {
      padding-left: var(--space-4);
      padding-right: var(--space-4);
    }
  }
</style>

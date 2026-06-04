<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit';
    disabled?: boolean;
    class?: string;
    style?: string;
    href?: string;
    target?: string;
    rel?: string;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    class: className = '',
    style = '',
    href,
    target,
    rel,
    onclick,
    children
  }: Props = $props();
</script>

{#if href}
  <a {href} {target} {rel} class="btn {variant} {size} {className}" {style} {onclick}>
    {@render children()}
  </a>
{:else}
  <button {type} {disabled} class="btn {variant} {size} {className}" {style} {onclick}>
    {@render children()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid transparent;
    font-family: inherit;
    white-space: nowrap;
    text-decoration: none;
  }

  .btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Variants */
  .primary {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--palette-blue-800) 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(var(--palette-blue-500-rgb), 0.25);
  }

  .primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--palette-blue-500-rgb), 0.35);
  }

  .accent {
    background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-strong) 100%);
    color: #fff;
    box-shadow: 0 4px 14px rgba(var(--palette-gold-rgb), 0.2);
  }

  .accent:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(var(--palette-gold-rgb), 0.3);
  }

  .ghost {
    background: transparent;
    color: var(--color-text);
  }

  .ghost:hover:not(:disabled) {
    background: var(--palette-blue-100);
    color: var(--color-primary-strong);
  }

  .outline {
    background: transparent;
    border-color: var(--color-border);
    color: var(--color-text);
  }

  .outline:hover:not(:disabled) {
    border-color: var(--color-primary);
    background: var(--palette-blue-50);
    color: var(--color-primary);
  }

  /* Sizes */
  .sm {
    padding: 0.5rem 1rem;
    font-size: var(--font-size-sm);
  }

  .md {
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-base);
  }

  .lg {
    padding: 1rem 2rem;
    font-size: var(--font-size-lg);
  }
</style>

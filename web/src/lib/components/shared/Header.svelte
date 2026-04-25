<script lang="ts">
  import Container from '../ui/Container.svelte';
  import { page } from '$app/state';

  const navLinks = [
    { label: '홈', path: '/' },
    { label: '모임 찾기', path: '/meetings' },
    { label: '공지사항', path: '/notices' }
  ];

  let isScrolling = $state(false);

  // Simple scroll listener for minimal header effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      isScrolling = window.scrollY > 20;
    }, { passive: true });
  }
</script>

<header class="header" class:scrolled={isScrolling}>
  <Container>
    <div class="inner">
      <a href="/" class="brand">
        <img src="/logo.svg" alt="AA Logo" class="brand-logo" />
        <div class="brand-copy">
          <strong>익명의 알코올중독자들</strong>
          <span>Alcoholics Anonymous Korea</span>
        </div>
      </a>

      <nav class="nav">
        {#each navLinks as link}
          <a 
            href={link.path} 
            class="nav-link" 
            class:active={page.url.pathname === link.path}
          >
            {link.label}
          </a>
        {/each}
      </nav>
    </div>
  </Container>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--public-shell-background);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--public-shell-border);
    transition: all 0.2s ease;
    padding: var(--space-3) 0;
  }

  /* Scrolled state for visual polish on better devices */
  .scrolled {
    padding: var(--space-2) 0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }

  .inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    color: var(--public-shell-text);
  }

  .brand-logo {
    width: 1.8rem;
    height: 1.8rem;
    object-fit: contain;
    flex-shrink: 0;
  }

  .brand-copy {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .brand-copy strong {
    font-size: var(--font-size-base);
    font-family: var(--font-display);
    font-weight: 500;
  }

  .brand-copy span {
    font-size: 0.65rem;
    opacity: 0.7;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .nav {
    display: flex;
    gap: var(--space-1);
  }

  .nav-link {
    padding: var(--space-2) var(--space-3);
    border-radius: 999px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: var(--public-shell-nav-text);
    transition: all 0.15s ease;
  }

  .nav-link:hover {
    background: var(--public-shell-nav-hover-background);
  }

  .nav-link.active {
    background: var(--public-shell-nav-active-background);
    color: var(--public-shell-nav-active-text);
  }

  @media (max-width: 640px) {
    .brand-copy {
      display: none;
    }
    
    .nav-link {
      padding: var(--space-2);
      font-size: var(--font-size-xs);
    }
  }
</style>

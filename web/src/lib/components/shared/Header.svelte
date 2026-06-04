<script lang="ts">
  import Container from '../ui/Container.svelte';
  import { page } from '$app/state';

  const navLinks = [
    { label: '모임 찾기', path: '/meetings' },
    { label: '공지사항', path: '/notices' }
  ];

  let isScrolled = $state(false);
  let isHidden = $state(false);
  let lastScrollY = 0;

  if (typeof window !== 'undefined') {
    window.addEventListener(
      'scroll',
      () => {
        const currentScrollY = window.scrollY;
        
        // 1. Shrink effect
        isScrolled = currentScrollY > 20;

        // 2. Direction-based hide/show
        if (currentScrollY > 100) { // Threshold for hiding
          if (currentScrollY > lastScrollY && !isHidden) {
            isHidden = true; // Scrolling down
          } else if (currentScrollY < lastScrollY && isHidden) {
            isHidden = false; // Scrolling up
          }
        } else {
          isHidden = false; // Always show at top
        }

        lastScrollY = currentScrollY;
      },
      { passive: true }
    );
  }
</script>

<header class="header" class:scrolled={isScrolled} class:hidden={isHidden}>
  <Container>
    <div class="inner">
      <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
      <a href="/" class="brand">
        <svg class="brand-logo" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="8" />
          <path d="M50 18 L82 70 L18 70 Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round" />
        </svg>
        <div class="brand-copy">
          <strong>익명의 알코올중독자들</strong>
          <span>Alcoholics Anonymous Korea</span>
        </div>
      </a>

      <nav class="nav">
        {#each navLinks as link (link.path)}
          <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
          <a href={link.path} class="nav-link" class:active={page.url.pathname === link.path}>
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
    background: #fff;
    border-bottom: 1px solid var(--color-border-subtle, #eee);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    padding: var(--space-4) 0;
  }

  :root.is-rich-ui .header {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .header.hidden {
    transform: translateY(-100%);
    box-shadow: none;
  }

  /* Scrolled state for visual polish on better devices */
  .scrolled {
    padding: var(--space-2) 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
    gap: var(--space-4);
    color: var(--palette-blue-900);
  }

  .brand-logo {
    width: 2.2rem;
    height: 2.2rem;
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
    font-weight: 600;
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
    padding: var(--space-2) var(--space-4);
    border-radius: 999px;
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--palette-slate-450);
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    background: var(--palette-blue-50);
    color: var(--palette-blue-600);
  }

  .nav-link.active {
    background: var(--palette-blue-50);
    color: var(--palette-blue-800);
    box-shadow: inset 0 0 0 1px var(--palette-blue-200);
  }

  @media (max-width: 640px) {
    .brand-copy {
      display: none;
    }

    .nav-link {
      padding: var(--space-2) var(--space-3);
      font-size: var(--font-size-xs);
    }
  }
</style>

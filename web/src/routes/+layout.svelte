<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/shared/Header.svelte';
  import Footer from '$lib/components/shared/Footer.svelte';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    // Check for high-end device characteristics using type assertions to avoid 'any'
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { effectiveType: string } };

    // 1. Memory >= 4GB (if supported)
    const isHighEndMemory = nav.deviceMemory ? nav.deviceMemory >= 4 : true;
    // 2. CPU Cores >= 4
    const isHighEndCPU = navigator.hardwareConcurrency ? navigator.hardwareConcurrency >= 4 : true;
    // 3. Fast connection (not 2G/3G)
    const connection = nav.connection;
    const isFastNetwork = connection ? !['slow-2g', '2g', '3g'].includes(connection.effectiveType) : true;

    // Optional: Check if user has explicitly set low-end mode in localStorage
    const manualLowEnd = localStorage.getItem('low-end-mode') === 'true';

    if (isHighEndMemory && isHighEndCPU && isFastNetwork && !manualLowEnd) {
      document.documentElement.classList.add('is-rich-ui');
    }
  });
</script>

<div class="app-container">
  <Header />

  <main class="main-content">
    {@render children()}
  </main>

  <Footer />
</div>

<style>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
  }
</style>

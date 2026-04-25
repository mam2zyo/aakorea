<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/shared/Header.svelte';
  import Footer from '$lib/components/shared/Footer.svelte';
  
  let { children } = $props();
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
    /* Extra padding for main content consistency if needed */
  }
</style>

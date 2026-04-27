<script lang="ts">
</script>

<div class="panel header-panel">
  <h1 class="page-title">AA 모임 찾기</h1>
  <div class="header-links">
    <div class="header-actions">
      <a
        href="#online"
        class="cta-button"
        onclick={(e) => {
          e.preventDefault();
          alert('준비 중입니다.');
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"
          ></rect></svg
        >
        온라인 모임
      </a>
      <a
        href="#step12"
        class="cta-button"
        onclick={(e) => {
          e.preventDefault();
          alert('준비 중입니다.');
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M18 20V7"></path><path d="M13 20v-9"></path><path d="M8 20v-5"></path><path
            d="M3 20v-1"
          ></path></svg
        >
        제12단계 운동
      </a>
    </div>
  </div>
</div>

<style>
  .header-panel {
    text-align: left;
    margin-bottom: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-8);
    padding-left: var(--space-12) !important;
    background: #fff;
    border-radius: 2rem;
    box-shadow: 0 10px 30px var(--color-shadow);
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-text-strong);
    margin: 0;
  }

  .header-links {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: var(--space-6);
  }

  .header-actions {
    display: flex;
    gap: var(--space-3);
  }

  .cta-button {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: 0.6rem 1.2rem;
    background: #fff;
    border: 1px solid var(--palette-blue-100);
    color: var(--color-primary);
    text-decoration: none;
    border-radius: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.05);
  }

  .cta-button:hover {
    background: var(--palette-blue-50);
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  }

  @media (max-width: 640px) {
    .header-panel {
      margin-bottom: var(--space-3);
      gap: var(--space-3);
      padding-left: var(--space-6) !important;
    }
    .page-title {
      font-size: 1.5rem;
    }
    .header-links {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-3);
    }
    .header-actions {
      flex-direction: row;
      flex-wrap: nowrap;
      gap: var(--space-2);
    }
    .cta-button {
      width: auto;
      padding: 0.5rem 0.8rem;
      font-size: 0.8rem;
    }
  }
</style>

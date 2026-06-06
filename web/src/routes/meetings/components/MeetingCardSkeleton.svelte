<div class="meeting-card-skeleton">
  <div class="card-left">
    <div class="day-time">
      <div class="skeleton-text day"></div>
      <div class="skeleton-text time"></div>
    </div>
  </div>

  <div class="card-main">
    <div class="group-info">
      <div class="skeleton-text title"></div>
      <div class="skeleton-badge"></div>
    </div>
    <div class="skeleton-text address"></div>
  </div>
</div>

<style>
  .meeting-card-skeleton {
    width: 100%;
    background: #fff;
    padding: var(--space-6) var(--space-8);
    border-radius: var(--radius-md);
    border: 1px solid var(--palette-blue-100);
    display: flex;
    gap: var(--space-6);
    align-items: flex-start;
    box-shadow: 0 4px 12px rgba(var(--palette-blue-900-rgb), 0.04);
  }

  .card-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
    border-right: 1px solid var(--palette-blue-100);
    padding-right: var(--space-6);
  }

  .day-time {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    width: 100%;
  }

  .skeleton-text {
    background: var(--palette-blue-100);
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;
  }

  .skeleton-text.day {
    width: 40px;
    height: 1.2rem;
  }

  .skeleton-text.time {
    width: 50px;
    height: 1.2rem;
  }

  .card-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
  }

  .group-info {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
  }

  .skeleton-text.title {
    width: 60%;
    height: 1.2rem;
  }

  .skeleton-badge {
    width: 50px;
    height: 1.25rem;
    border-radius: 999px;
    background: var(--palette-blue-100);
    animation: pulse 1.5s infinite ease-in-out;
  }

  .skeleton-text.address {
    width: 80%;
    height: 1rem;
    margin-top: 4px;
  }

  @keyframes pulse {
    0% {
      background-color: var(--palette-blue-100);
    }
    50% {
      background-color: var(--palette-blue-200);
    }
    100% {
      background-color: var(--palette-blue-100);
    }
  }

  @media (max-width: 640px) {
    .meeting-card-skeleton {
      padding: var(--space-4) var(--space-4);
      border-radius: var(--radius-sm);
      gap: var(--space-4);
    }
    .card-left {
      padding-right: var(--space-4);
    }
  }
</style>

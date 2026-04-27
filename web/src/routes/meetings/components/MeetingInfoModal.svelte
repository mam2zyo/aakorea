<script lang="ts">
  interface Props {
    show?: boolean;
    onClose: () => void;
  }

  let { show = $bindable(false), onClose }: Props = $props();
</script>

{#if show}
  <div
    class="modal-overlay"
    role="button"
    tabindex="-1"
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div
      class="modal-content"
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
    >
      <div class="modal-header">
        <h2>모임 유형 안내</h2>
        <button class="close-btn" onclick={onClose}>×</button>
      </div>
      <div class="modal-body info-modal-body">
        <div class="info-section">
          <span class="badge-preview open">공개 모임 (Open)</span>
          <p>
            AA의 회복 프로그램에 관심이 있는 사람이라면 <strong>누구나 참석할 수 있는 모임</strong
            >입니다. 알코올 중독자가 아닌 분들도 참관인 자격으로 참석이 가능합니다.
          </p>
        </div>
        <div class="info-section">
          <span class="badge-preview closed">비공개 모임 (Closed)</span>
          <p>
            오직 AA 멤버이거나, 본인이 술 문제가 있고 <strong
              >"술을 끊으려는 열망"이 있는 분들</strong
            >만을 위한 회복 모임입니다.
          </p>
        </div>
        <div class="info-section">
          <span class="badge-preview notfixed">가변 (Variable)</span>
          <p>
            주차에 따라 공개와 비공개 유형이 바뀌는 경우입니다. (예: 평소엔 비공개이나 매월 마지막
            주만 공개로 진행 등)
          </p>
          <p class="sub-info">
            ※ 참관을 원하는 비알코올중독자는 <strong>사전에 해당 그룹 봉사자에게 연락하여</strong> 유형을
            확인해 주시기 바랍니다.
          </p>
        </div>
        <div class="info-note">
          <p>
            ※ 모든 AA 모임에서는 참석자들이 알코올 중독으로부터의 회복에 관련된 주제로만 대화를
            나누어 주실 것을 요청받을 수 있습니다.
          </p>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-primary" onclick={onClose}>확인</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(8px);
    padding: var(--space-4);
  }

  .modal-content {
    background: #fff;
    width: 100%;
    max-width: 480px;
    border-radius: 2rem;
    padding: var(--space-8);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes modal-pop {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-8);
  }
  .modal-header h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text-strong);
  }
  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--color-text-soft);
    cursor: pointer;
  }

  .info-modal-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .info-section {
    padding: var(--space-4);
    background: var(--color-bg-subtle);
    border-radius: 1rem;
  }

  .badge-preview {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: var(--space-3);
  }

  .badge-preview.open {
    background: #ecfdf5;
    color: #059669;
  }
  .badge-preview.closed {
    background: #fef2f2;
    color: #dc2626;
  }
  .badge-preview.notfixed {
    background: #fffbeb;
    color: #d97706;
  }

  .info-section p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.6;
    color: var(--color-text);
  }

  .sub-info {
    font-size: 0.85rem;
    color: var(--color-text-soft);
    margin-top: var(--space-2);
    line-height: 1.4;
  }

  .info-note {
    font-size: 0.85rem;
    color: var(--color-text-muted);
    padding: 0 var(--space-2);
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--space-8);
  }

  .btn-primary {
    background: var(--color-primary);
    color: #fff;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    border-radius: 1.5rem;
    font-size: 1rem;
    border: 1px solid transparent;
  }
</style>

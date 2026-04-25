<script lang="ts">
  import Container from '../ui/Container.svelte';

  const ABOUT_GSO_URL = 'http://aakorea.org/aboutgso.html';
  const SITE_POLICY_URL = 'http://aakorea.org/aboutgso.html#policy1';
</script>

<footer class="footer">
  <Container>
    <div class="footer-inner">
      <div class="primary-info">
        <strong class="brand">에이에이한국연합</strong>
        <p class="biz-info">사업자등록번호: 107-82-69892</p>
        
        <div class="divider"></div>
        
        <p class="address">주소: 서울특별시 영등포구 영신로20길 6, 정우빌딩 5층</p>
        
        <div class="divider"></div>
        
        <div class="contact-grid">
          <p>
            전화: 
            <a href="tel:02-774-3797">02-774-3797</a>, 
            <a href="tel:02-833-0311">02-833-0311</a>
          </p>
          <p>팩스: 02-833-0422</p>
          <p>
            이메일: 
            <a href="mailto:aakoreagso@gmail.com">aakoreagso@gmail.com</a>
          </p>
        </div>
      </div>

      <div class="secondary-info">
        <a href={ABOUT_GSO_URL} target="_blank" rel="noreferrer" class="footer-link">
          About G.S.O.
        </a>
        <a href={SITE_POLICY_URL} target="_blank" rel="noreferrer" class="footer-link">
          사이트 운영정책
        </a>
      </div>
    </div>

    <div class="copyright">
      &copy; {new Date().getFullYear()} AA Korea General Service Office. All rights reserved.
    </div>
  </Container>
</footer>

<style>
  .footer {
    margin-top: auto;
    background: var(--public-footer-background);
    color: var(--public-footer-text);
    padding: var(--space-10) 0 var(--space-6);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-inner {
    display: grid;
    grid-template-columns: 1.5fr 0.7fr;
    gap: var(--space-8);
    margin-bottom: var(--space-8);
  }

  .primary-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .brand {
    font-family: var(--font-display);
    font-size: var(--font-size-lg);
    color: #fff;
    margin-bottom: var(--space-1);
  }

  .biz-info, .address, .contact-grid p {
    font-size: var(--font-size-sm);
    opacity: 0.8;
    margin: 0;
    line-height: 1.6;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
    margin: var(--space-3) 0;
  }

  .contact-grid {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .contact-grid a {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
  }

  .contact-grid a:hover {
    text-decoration: underline;
  }

  .secondary-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }

  .footer-link {
    display: inline-flex;
    align-items: center;
    padding: var(--space-2) var(--space-4);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    color: #fff;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
  }

  .footer-link:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  .copyright {
    padding-top: var(--space-6);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    font-size: 0.75rem;
    opacity: 0.4;
    text-align: center;
  }

  @media (max-width: 768px) {
    .footer-inner {
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }

    .secondary-info {
      flex-direction: row;
      flex-wrap: wrap;
    }
  }
</style>

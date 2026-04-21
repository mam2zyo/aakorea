import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // 이 프로젝트에 맞는 적절한 제목인지 테스트합니다
  await expect(page).toHaveTitle(/AAKorea/i);
});

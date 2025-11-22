import { test, expect } from '@playwright/test';

/**
 * スモークテスト2: チームページへのナビゲーション
 * 目的: 基本的なページ遷移が動作することを確認
 */
test('チームページへ遷移できる', async ({ page }) => {
  // トップページにアクセス
  await page.goto('/');

  // チームリンクをクリック
  await page.getByRole('link', { name: 'チーム' }).click();

  // URLが変わることを確認
  await expect(page).toHaveURL('/teams');

  // ページタイトルを確認
  await expect(page).toHaveTitle(/イマドコ/);

  // チームページの主要要素が表示されることを確認
  const main = page.locator('main');
  await expect(main).toBeVisible();

  // ヘッダーが引き続き表示されることを確認
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();
});

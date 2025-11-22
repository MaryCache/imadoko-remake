import { test, expect } from '@playwright/test';

/**
 * スモークテスト1: トップページの基本表示
 * 目的: アプリケーションが正常に起動し、基本的なUI要素が表示されることを確認
 */
test('トップページが正常に表示される', async ({ page }) => {
  // トップページにアクセス
  await page.goto('/');

  // ページタイトルを確認
  await expect(page).toHaveTitle(/イマドコ/);

  // ヘッダーが表示されることを確認
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();

  // ヘッダーロゴが表示されることを確認
  const logo = page.getByAltText('イマドコ・ローテ');
  await expect(logo).toBeVisible();

  // ナビゲーション要素が表示されることを確認
  await expect(page.getByRole('link', { name: '試合' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'チーム' })).toBeVisible();

  // メインコンテンツが表示されることを確認
  const main = page.locator('main');
  await expect(main).toBeVisible();
});

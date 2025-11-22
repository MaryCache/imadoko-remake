import { test, expect } from '@playwright/test';

/**
 * スモークテスト3: レスポンシブデザインの基本確認
 * 目的: モバイルビューでも基本的なUI要素が表示されることを確認
 */
test('モバイルビューで基本要素が表示される', async ({ page }) => {
  // モバイルサイズに設定
  await page.setViewportSize({ width: 375, height: 667 });

  // トップページにアクセス
  await page.goto('/');

  // ヘッダーが表示されることを確認
  const header = page.getByRole('banner');
  await expect(header).toBeVisible();

  // ロゴが表示されることを確認
  const logo = page.getByAltText('イマドコ・ローテ');
  await expect(logo).toBeVisible();

  // ナビゲーション要素が表示されることを確認
  await expect(page.getByRole('link', { name: '試合' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'チーム' })).toBeVisible();

  // メインコンテンツが表示されることを確認
  const main = page.getByRole('main');
  await expect(main).toBeVisible();

  // レイアウトが崩れていないことを確認（ヘッダーの高さが適切）
  const headerBox = await header.boundingBox();
  expect(headerBox?.height).toBeGreaterThan(0);
  expect(headerBox?.height).toBeLessThan(200); // 異常な高さでないことを確認
});

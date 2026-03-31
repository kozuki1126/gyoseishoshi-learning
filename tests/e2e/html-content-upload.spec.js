const path = require('path');
const { test, expect } = require('@playwright/test');

async function gotoWithRetry(page, url, attempts = 3) {
  let lastError = null;

  for (let index = 0; index < attempts; index += 1) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(1500);
    }
  }

  throw lastError;
}

test.describe('HTML content flow', () => {
  test('uploads HTML content from admin and renders it on the unit page', async ({ page, request }) => {
    test.setTimeout(180000);
    const sampleHtmlPath = path.join(process.cwd(), 'SampleHTML', 'gyosei_minpo_kihon_1-4.html');
    const uniqueTitle = `E2E HTML ${Date.now()}`;
    const updatedMarker = `更新反映 ${Date.now()}`;
    let createdId = null;

    try {
      await request.get('/admin/content/create');
      await gotoWithRetry(page, '/admin/content/create');

      await page.getByTestId('content-title-input').fill(uniqueTitle);
      await page.getByTestId('content-subject-select').selectOption('civil-law');
      await page.getByTestId('content-status-select').selectOption('published');
      await page.getByTestId('html-file-input').setInputFiles(sampleHtmlPath);

      await expect(page.locator('text=比較表① 近代民法3大原則の内容と修正')).toBeVisible();

      const createResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/admin/content') && response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: '保存' }).click();
      const createResponse = await createResponsePromise;
      expect(createResponse.ok()).toBeTruthy();

      const createPayload = await createResponse.json();
      createdId = createPayload?.unit?.id || null;
      expect(createdId).toBeTruthy();

      await request.get(`/subjects/civil-law/${createdId}`);
      await gotoWithRetry(page, `/subjects/civil-law/${createdId}`);

      await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
      await expect(page.getByRole('heading', { name: '比較表① 近代民法3大原則の内容と修正' })).toBeVisible();
      await expect(page.locator('text=宇奈月温泉事件').first()).toBeVisible();
      await request.get(`/admin/content/${createdId}`);
      await gotoWithRetry(page, `/admin/content/${createdId}`);
      await page.getByRole('button', { name: '編集' }).click();

      await page.getByTestId('content-edit-textarea').fill(`<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>${uniqueTitle}</title>
  <style>
    :root { --line: #1d4ed8; }
    body { font-family: 'Hiragino Sans', 'Yu Gothic', Meiryo, sans-serif; background: #f8fafc; color: #0f172a; }
    .section { background: #ffffff; border: 2px solid var(--line); border-radius: 16px; padding: 24px; }
    .divider { border: none; border-top: 3px solid var(--line); margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 2px solid var(--line); padding: 12px; }
  </style>
</head>
<body>
  <section class="section">
    <h2>${updatedMarker}</h2>
    <p>HTML更新の保存確認です。</p>
    <hr class="divider">
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>項目</th><th>内容</th></tr>
        </thead>
        <tbody>
          <tr><td>状態</td><td>更新済み</td></tr>
        </tbody>
      </table>
    </div>
  </section>
</body>
</html>`);

      const updateResponsePromise = page.waitForResponse((response) =>
        response.url().includes(`/api/admin/content/${createdId}`) && response.request().method() === 'PUT'
      );
      await page.getByRole('button', { name: '更新' }).click();
      const updateResponse = await updateResponsePromise;
      expect(updateResponse.ok()).toBeTruthy();
      await expect(page.locator('text=コンテンツを更新しました')).toBeVisible();

      await request.get(`/subjects/civil-law/${createdId}`);
      await gotoWithRetry(page, `/subjects/civil-law/${createdId}`);
      await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
      await expect(page.getByRole('heading', { name: updatedMarker })).toBeVisible();
      await expect(page.locator('text=更新済み')).toBeVisible();
    } finally {
      if (createdId) {
        const response = await request.delete(`/api/admin/content/${createdId}`);
        expect(response.ok()).toBeTruthy();
      }
    }
  });

  test('allows admin preview of premium unit pages without premium membership', async ({ page, request }) => {
    test.setTimeout(180000);
    const sampleHtmlPath = path.join(process.cwd(), 'SampleHTML', 'gyosei_minpo_kihon_1-4.html');
    const uniqueTitle = `E2E Premium Preview ${Date.now()}`;
    let createdId = null;

    try {
      await request.get('/admin/content/create');
      await gotoWithRetry(page, '/admin/content/create');

      await page.getByTestId('content-title-input').fill(uniqueTitle);
      await page.getByTestId('content-subject-select').selectOption('civil-law');
      await page.getByTestId('content-status-select').selectOption('published');
      await page.getByTestId('html-file-input').setInputFiles(sampleHtmlPath);
      await page.getByTestId('content-access-level-select').selectOption('premium');

      const createResponsePromise = page.waitForResponse((response) =>
        response.url().includes('/api/admin/content') && response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: '保存' }).click();
      const createResponse = await createResponsePromise;
      expect(createResponse.ok()).toBeTruthy();

      const createPayload = await createResponse.json();
      createdId = createPayload?.unit?.id || null;
      expect(createdId).toBeTruthy();

      await request.get('/admin/content');
      await gotoWithRetry(page, '/admin/content');
      await page.getByPlaceholder('タイトルまたはIDで検索...').fill(uniqueTitle);
      await page.getByPlaceholder('タイトルまたはIDで検索...').blur();

      const row = page.locator('tr', { hasText: uniqueTitle }).first();
      await expect(row).toBeVisible();
      await row.getByRole('button').click();
      await row.getByRole('link', { name: 'プレビュー' }).click();

      await expect(page).toHaveURL(new RegExp(`/subjects/civil-law/${createdId}\\?adminPreview=1$`));
      await expect(page.getByRole('heading', { name: uniqueTitle })).toBeVisible();
      await expect(page.getByText('プレミアム限定')).toBeVisible();
      await expect(page.getByRole('heading', { name: '比較表① 近代民法3大原則の内容と修正' })).toBeVisible();
    } finally {
      if (createdId) {
        const response = await request.delete(`/api/admin/content/${createdId}`);
        expect(response.ok()).toBeTruthy();
      }
    }
  });
});

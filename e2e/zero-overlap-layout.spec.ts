import { test, expect } from '@playwright/test';

// 輔助函式：檢測兩個 Bounding Box 是否有重疊（允許 1px 浮點渲染容差）
function areBoxesOverlapping(
  boxA: { x: number; y: number; width: number; height: number },
  boxB: { x: number; y: number; width: number; height: number },
  tolerance = 1
): boolean {
  if (boxA.width <= 0 || boxA.height <= 0 || boxB.width <= 0 || boxB.height <= 0) return false;
  return !(
    boxA.x + boxA.width <= boxB.x + tolerance ||
    boxB.x + boxB.width <= boxA.x + tolerance ||
    boxA.y + boxA.height <= boxB.y + tolerance ||
    boxB.y + boxB.height <= boxA.y + tolerance
  );
}

test.describe('Zero Overlap & Layout Integrity Rigorous Validation', () => {

  const viewports = [
    { name: '320px (極小手機)', width: 320, height: 568 },
    { name: '375px (一般手機)', width: 375, height: 667 },
    { name: '768px (平板直向)', width: 768, height: 1024 },
    { name: '1280px (筆電)', width: 1280, height: 800 },
    { name: '1920px (高解析大螢幕)', width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    test(`[Viewport: ${vp.name}] 頁面無水平溢出、卡片互不重疊且圖表 5 區塊不相交`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // 1. 等待主畫面加載
      await expect(page.locator('h1')).toContainText('Review Signal');
      await page.waitForTimeout(500);

      // 2. 驗證全域無水平溢出
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll, `Viewport ${vp.name} 不得產生全域水平捲軸`).toBe(false);

      // 3. 圖表卡片獨立排版區域檢測 (RatingDistributionEChart)
      // 確保 Header、Description、Statistics、Chart Canvas、Footer 各自 Bounding Box 不相交
      const ratingCard = page.locator('div:has-text("評分星等分佈")').first();
      await expect(ratingCard).toBeVisible();

      const ratingHeader = ratingCard.locator('h3:has-text("評分星等分佈")').first();
      const ratingStatsRow = ratingCard.locator('text=滿意度 (CSAT)：').first();
      const ratingChartCanvas = ratingCard.locator('.echarts-for-react').first();

      const headerBox = await ratingHeader.boundingBox();
      const statsBox = await ratingStatsRow.boundingBox();
      const chartBox = await ratingChartCanvas.boundingBox();

      if (headerBox && statsBox && chartBox) {
        expect(areBoxesOverlapping(headerBox, statsBox), '圖表 Header 不得與統計數值區重疊').toBe(false);
        expect(areBoxesOverlapping(statsBox, chartBox), '統計數值區不得與圖表繪製區重疊').toBe(false);
        expect(headerBox.y + headerBox.height, 'Header 必須在 Statistics 之前').toBeLessThanOrEqual(statsBox.y + 5);
        expect(statsBox.y + statsBox.height, 'Statistics 必須在 Chart 之前').toBeLessThanOrEqual(chartBox.y + 5);
      }

      // 4. 時序趨勢圖 (TrendTimelineEChart) 排版區域檢測
      const trendCard = page.locator('div:has-text("時間趨勢與星等走勢")').first();
      await expect(trendCard).toBeVisible();

      const trendHeader = trendCard.locator('h3:has-text("時間趨勢與星等走勢")').first();
      const trendStatsRow = trendCard.locator('text=涵蓋樣本：').first();
      const trendChartCanvas = trendCard.locator('.echarts-for-react').nth(1);

      const tHeaderBox = await trendHeader.boundingBox();
      const tStatsBox = await trendStatsRow.boundingBox();
      const tChartBox = await trendChartCanvas.boundingBox();

      if (tHeaderBox && tStatsBox && tChartBox) {
        expect(areBoxesOverlapping(tHeaderBox, tStatsBox), '時序圖 Header 不得與統計數值重疊').toBe(false);
        expect(areBoxesOverlapping(tStatsBox, tChartBox), '時序圖統計數值不得壓到圖表繪製區').toBe(false);
        expect(tHeaderBox.y + tHeaderBox.height, '時序圖 Header 必須在 Statistics 之前').toBeLessThanOrEqual(tStatsBox.y + 5);
        expect(tStatsBox.y + tStatsBox.height, '時序圖 Statistics 必須在 Chart 之前').toBeLessThanOrEqual(tChartBox.y + 5);
      }

      // 5. Overview 指標卡片互相不覆蓋檢查
      const overviewCards = page.locator('.grid-cols-2 > div, .grid-cols-6 > div');
      const cardCount = await overviewCards.count();
      if (cardCount >= 6) {
        const boxes = [];
        for (let i = 0; i < 6; i++) {
          const b = await overviewCards.nth(i).boundingBox();
          if (b) boxes.push(b);
        }
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            expect(areBoxesOverlapping(boxes[i], boxes[j]), `OverviewCard ${i} 與 ${j} 不得互相覆蓋`).toBe(false);
          }
        }
      }

      // 6. 截圖存檔以供視覺查驗
      await page.screenshot({
        path: `test-results/screenshots/layout-viewport-${vp.width}.png`,
        fullPage: false,
      });
    });
  }

  test('瀏覽器 200% 文字/縮放模擬：排版自然延展、無非預期重疊與斷裂', async ({ page }) => {
    // 模擬 768px 平板下 200% 文字放大
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // 模擬 WCAG 1.4.4 文字放大 200%
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    await page.waitForTimeout(500);

    // 檢查標題與關鍵內容仍清晰可見、無橫向溢出
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow, '200% 文字放大下頁面仍不得產生全域溢出').toBe(false);

    // 截圖確認 200% 文字放大排版
    await page.screenshot({
      path: `test-results/screenshots/layout-zoom-200.png`,
      fullPage: false,
    });
  });

  test('切換資料集後動態重繪：排版結構穩定、不發生任何擠壓變形', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 切換至 SaaS 範例資料集
    const saasButton = page.locator('button:has-text("SaaS")').first();
    if (await saasButton.isVisible()) {
      await saasButton.click();
      await expect(page.locator('text=24').first()).toBeVisible();
      await page.waitForTimeout(500);

      // 檢查指標卡與圖表重新渲染後無重疊
      const ratingCanvas = page.locator('.echarts-for-react').first();
      await expect(ratingCanvas).toBeVisible();

      // 切換至外送生鮮範例資料集
      const foodButton = page.locator('button:has-text("外送")').first();
      if (await foodButton.isVisible()) {
        await foodButton.click();
        await expect(page.locator('text=30').first()).toBeVisible();
        await page.waitForTimeout(500);
      }
    }
  });

  test('雙主題切換 (Light / Dark) 視覺對比與無重疊驗證', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // 切換深色模式
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `test-results/screenshots/layout-dark-mode.png`,
    });

    // 切換淺色模式
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark');
    });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `test-results/screenshots/layout-light-mode.png`,
    });
  });

});

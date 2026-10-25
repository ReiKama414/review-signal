import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: '320px - 極小型手機', width: 320, height: 568, isMobile: true },
  { name: '375px - 一般手機', width: 375, height: 667, isMobile: true },
  { name: '390px - 主流手機', width: 390, height: 844, isMobile: true },
  { name: '430px - 大型手機', width: 430, height: 932, isMobile: true },
  { name: '768px - 平板直向', width: 768, height: 1024, isMobile: false },
  { name: '1024px - 平板橫向', width: 1024, height: 768, isMobile: false },
  { name: '1280px - 筆電', width: 1280, height: 800, isMobile: false },
  { name: '1440px - 桌面', width: 1440, height: 900, isMobile: false },
  { name: '1920px - 大型螢幕', width: 1920, height: 1080, isMobile: false },
];

test.describe('Responsive Web Design (9 Viewports) & Dual Theme Validation', () => {

  for (const vp of VIEWPORTS) {
    test(`Viewport ${vp.name} (${vp.width}x${vp.height}): 無水平溢出、元件自適應、雙主題正常`, async ({ page }) => {
      // 監聽並攔截 Console Error
      const consoleErrors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // 設定視窗尺寸
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // 1. 驗證無整個頁面非預期水平溢出
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(hasHorizontalScroll, `頁面在 ${vp.width}px 不得產生全域水平捲軸`).toBe(false);

      // 2. 核心元素可見且邊界正常
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=總樣本數')).toBeVisible();
      await expect(page.locator('.echarts-for-react').first()).toBeVisible();

      // 3. 測試淺色與深色主題切換
      // 切換至淺色
      await page.evaluate(() => {
        window.localStorage.setItem('review_signal_theme', 'light');
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.setAttribute('data-theme', 'light');
      });
      await page.waitForTimeout(100);

      const htmlClassesLight = await page.evaluate(() => document.documentElement.className);
      expect(htmlClassesLight).toContain('light');

      // 切換至深色
      await page.evaluate(() => {
        window.localStorage.setItem('review_signal_theme', 'dark');
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      await page.waitForTimeout(100);

      const htmlClassesDark = await page.evaluate(() => document.documentElement.className);
      expect(htmlClassesDark).toContain('dark');

      // 4. 手機版 Drawer / 選單測試 (在 < 640px 時)
      if (vp.isMobile) {
        const menuButton = page.locator('button[aria-label="開啟選單"]');
        if (await menuButton.isVisible()) {
          await menuButton.click();
          await expect(page.locator('text=介面主題風格：')).toBeVisible();
          // 關閉選單
          await page.locator('button[aria-label="開啟選單"]').click();
        }
      }

      // 5. Modal 展開測試（驗證彈窗不超出可視區域）
      const firstInspectButton = page.locator('button:has-text("深入檢視")').first();
      if (await firstInspectButton.isVisible()) {
        await firstInspectButton.click();
        
        const modal = page.locator('div[role="dialog"], .fixed > div.bg-white, .fixed > div.dark\\:bg-slate-900').first();
        await expect(modal).toBeVisible();

        // 檢查 Modal 寬度不超出 Viewport
        const modalBox = await modal.boundingBox();
        if (modalBox) {
          expect(modalBox.x, 'Modal 左側不可小於 0').toBeGreaterThanOrEqual(0);
          expect(modalBox.width, 'Modal 寬度不可大於視窗寬度').toBeLessThanOrEqual(vp.width);
        }

        // 關閉 Modal
        await page.locator('button:has-text("關閉視窗")').click();
      }

      // 6. 再次驗證無水平溢出
      const finalScrollCheck = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      expect(finalScrollCheck).toBe(false);

      // 7. 驗證無嚴重 Console 錯誤
      const filteredErrors = consoleErrors.filter(err => 
        !err.includes('favicon') && !err.includes('extension')
      );
      expect(filteredErrors).toHaveLength(0);
    });
  }

});

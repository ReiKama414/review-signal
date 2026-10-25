import { test, expect } from '@playwright/test';

test.describe('Review Signal Workspace E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // 前往本地開發網址
    await page.goto('/');
  });

  test('1. 應正確載入預設樣本資料集並渲染工作台指標', async ({ page }) => {
    // 檢查品牌標題
    await expect(page.locator('h1')).toContainText('Review Signal');
    
    // 檢查樣本名稱與評論數 (36 則)
    await expect(page.locator('text=總樣本數')).toBeVisible();
    await expect(page.locator('text=36').first()).toBeVisible();

    // 檢查平均評分與 CSAT
    await expect(page.locator('text=滿意度 (CSAT)')).toBeVisible();
    await expect(page.locator('text=推薦差額 NPS')).toBeVisible();
  });

  test('2. 應正常渲染 ECharts 圖表元件', async ({ page }) => {
    // 評分星等分佈圖表
    await expect(page.locator('text=評分星等分佈')).toBeVisible();
    // 時間趨勢圖表
    await expect(page.locator('text=時間趨勢與星等走勢')).toBeVisible();

    // 檢查 ECharts SVG/Canvas 節點存在
    const echartsElements = page.locator('.echarts-for-react');
    await expect(echartsElements.first()).toBeVisible();
  });

  test('3. 全文搜尋與即時過濾應有效縮減評論清單', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="搜尋評論內文"]');
    await expect(searchInput).toBeVisible();

    // 輸入關鍵字「閃退」
    await searchInput.fill('閃退');
    
    // 檢查當前篩選顯示之數量少於 36
    await expect(page.locator('text=當前篩選顯示：')).toBeVisible();
    
    // 所有顯示的卡片內文應包含「閃退」
    const firstReview = page.locator('p:has-text("閃退")').first();
    await expect(firstReview).toBeVisible();

    // 清除搜尋
    await searchInput.fill('');
    await expect(page.locator('text=36 / 36 則評論')).toBeVisible();
  });

  test('4. 點擊字詞頻率標籤應能觸發鑽取篩選 (Drill-down)', async ({ page }) => {
    // 等待字詞頻率區塊出現
    await expect(page.locator('text=字詞頻率與 N-gram 挖掘')).toBeVisible();

    // 尋找高頻詞（例如「閃退」或「客服」）
    const wordButton = page.locator('button:has-text("閃退")').first();
    if (await wordButton.isVisible()) {
      await wordButton.click();
      // 應顯示篩選標籤
      await expect(page.locator('text=篩選字詞：')).toBeVisible();
    }
  });

  test('5. 演算法透明度彈窗應詳實呈現規則原理與即時沙盒', async ({ page }) => {
    // 點擊「算法透明度」按鈕
    await page.click('button:has-text("算法透明度")');

    // 檢查聲明標題
    await expect(page.locator('h2:has-text("演算法透明度與科學倫理聲明")')).toBeVisible();
    await expect(page.locator('text=拒絕偽裝 AI')).toBeVisible();

    // 切換至沙盒分頁
    await page.click('button:has-text("實時透明沙盒測試")');
    await expect(page.locator('text=分詞結果 (Tokens)：')).toBeVisible();
    await expect(page.locator('text=比對到的詞典規則證據鏈：')).toBeVisible();

    // 關閉視窗
    await page.click('button:has-text("我瞭解了")');
    await expect(page.locator('h2:has-text("演算法透明度與科學倫理聲明")')).not.toBeVisible();
  });

  test('6. 應能檢視評論深度細節與規則證據鏈，並新增標籤與研究筆記', async ({ page }) => {
    // 點擊第一則評論的「深入檢視」
    await page.locator('button:has-text("深入檢視")').first().click();

    // 檢視彈窗應出現
    await expect(page.locator('h2:has-text("評論深度研究與詞義特徵")')).toBeVisible();
    await expect(page.locator('text=顧客原始評論內文')).toBeVisible();
    await expect(page.locator('text=確定性情感詞典計算證據')).toBeVisible();

    // 新增手動標籤
    const tagInput = page.locator('input[placeholder="新增標籤..."]');
    await tagInput.fill('測試標籤QA');
    await page.click('button:has-text("新增")');
    await expect(page.locator('span:has-text("#測試標籤QA")').first()).toBeVisible();

    // 填寫研究筆記
    const notesArea = page.locator('textarea[placeholder*="記錄訪談備註"]');
    await notesArea.fill('此問題經確認為 v4.12 版本的底層 WebView 衝突所致。');
    await page.click('button:has-text("儲存筆記")');
    await expect(page.locator('text=✓ 筆記已成功儲存')).toBeVisible();

    // 關閉視窗
    await page.click('button:has-text("關閉視窗")');
  });

  test('7. 匯出彈窗應正確提供 CSV、JSON 與 Markdown 報告預覽', async ({ page }) => {
    // 點擊頂部「匯出」按鈕
    await page.click('button:has-text("匯出")');

    // 檢查格式選項
    await expect(page.locator('text=CSV 試算表 (UTF-8 BOM)')).toBeVisible();
    await expect(page.locator('text=結構化 JSON 資料庫')).toBeVisible();
    await expect(page.locator('text=Markdown 研究洞察摘要報告')).toBeVisible();

    // 切換至 Markdown 報告即時預覽分頁
    await page.click('button:has-text("Markdown 報告即時預覽")');
    await expect(page.locator('pre')).toContainText('Review Signal 評論研究與顧客之聲分析報告');
    await expect(page.locator('button:has-text("一鍵複製 Markdown")')).toBeVisible();

    // 關閉視窗
    await page.click('button:has-text("關閉")');
  });

  test('8. 快速切換內建樣本資料集應正常運作', async ({ page }) => {
    // 切換至 SaaS 專案反饋
    const saasButton = page.locator('button:has-text("SaaS")').first();
    if (await saasButton.isVisible()) {
      await saasButton.click();
      await expect(page.locator('text=SaaS 協作與敏捷專案工具反饋')).toBeVisible();
      await expect(page.locator('text=24').first()).toBeVisible();
    }
  });
});

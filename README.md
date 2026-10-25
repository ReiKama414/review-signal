# 📡 Review Signal — 專業評論研究與顧客之聲 (VoC) 工作台

> **正式可用、客觀統計、本地隱私、拒絕偽裝 AI 的評論研究工作台**  
> 專為產品經理 (Product Managers)、UX 研究員 (UX Researchers) 與客服體驗團隊設計。  
> 採用 **React 18 + TypeScript + Vite + Tailwind CSS + ECharts + IndexedDB** 架構，支援 Vercel 零配置秒速發布。

---

## 🌟 核心設計原則與功能特色

### 1. 🔍 清楚區分「字詞規則」與「真正情緒模型」（科學倫理堅持）
- **拒絕假裝 AI (No Fake AI)**：商業軟體常將簡單的正負向字詞計數偽稱為「深度 AI 語意理解」。Review Signal 恪守研究工具的客觀真實性，明確標示當前引擎為 **確定性規則詞典 (Deterministic Rule-Based NLP)**。
- **滑動視窗修飾機制 (Context Window Modifiers)**：
  - **否定詞翻轉 (Negation)**：偵測「不、沒、無、未、無法」，動態反轉情緒極性（例如：「好用 (+1.0)」→「不好用 (-1.0)」）。
  - **程度副詞放大 (Intensifier)**：偵測「超、非常、極度、太、無比」，乘上 1.4x ~ 1.8x 強度倍率（例如：「超爛 (-1.1 × 1.5 = -1.65)」）。
- **完整數學證據鏈 (Auditable Evidence Tree)**：點擊任一評論，可即時展開該評分的平滑雙曲歸一化數學公式與命中的規則詞清單：
  $$\text{Normalized Score} = \frac{\text{PositiveScore} - \text{NegativeScore}}{\text{Total} + 0.5} \in [-1.0, +1.0]$$

### 2. 🧩 現代瀏覽器原生中文斷詞與 N-gram 探勘
- **瀏覽器原生 Intl.Segmenter**：零下載外部 20MB 權重或巨型辭典檔，直接調用瀏覽器原生繁簡中文斷詞引擎。
- **領域專屬複合詞重組**：內建針對台灣電商、SaaS 軟體與外送服務業的 200+ 專業領域複合詞庫（如「閃退」、「當機」、「客服人員」、「退貨退款」、「外送員」、「折扣碼」），避免詞組被切碎。
- **N-gram 探勘**：
  - **單字詞 (1-gram)**：快速掌握高頻正負向核心痛點。
  - **二元組 (2-gram)**：挖掘語境搭配（如「更新後 閃退」、「物流 超慢」）。
  - **三元組 (3-gram)**：深層語塊（如「客服 都 沒回」、「包裝 嚴重 破損」）。
- **雙向聯動鑽取 (Cross-Filtering Drill-Down)**：在詞彙雲點擊任意單詞或 N-gram，即時過濾出包含該關鍵詞的所有顧客原聲評論。
- **停用詞管理 (Custom Stopwords)**：內建中英停用詞庫，並支援研究員即時新增／移除自訂停用詞。

### 3. 📊 ECharts 專業可視化圖表
- **評分星等直方圖 (ECharts Bar)**：直觀呈現 1~5 星分佈比例、中位數、顧客滿意度 (CSAT, % 4-5 星) 與淨推薦估算 (NPS Proxy)。點擊柱狀圖可直接連動過濾評論。
- **時序走勢圖 (ECharts Composed Timeline)**：
  - 左 Y 軸：正面、中性、負面堆疊柱狀圖（紅條突起即代表爆發客訴事件）。
  - 右 Y 軸：每日平均星等波動折線（1~5 星滿意度趨勢）。

### 4. 🚨 問題分類統計與修復優先級矩陣 (Priority Action Matrix)
- **客觀規則分類歸因**：
  - ⚡ 功能異常與閃退 (Bug & Crash)
  - 🚚 物流配送與包裝 (Delivery & Packaging)
  - 🎧 客戶服務與售後 (Customer Support)
  - 🎨 介面設計與易用性 (UI/UX)
  - 💰 價格費用與退款 (Pricing & Refund)
  - 📦 商品品質與期待 (Product Quality)
  - 🌟 滿意與產品讚譽 (Praise & Delight)
- **四象限優先級判定**：結合「評論量佔比 (Volume)」與「平均滿意度 (Avg Rating)」，自動標示：
  - 🔴 **緊急修復 (Critical Action)**：高客訴量且評分低於 2.5 星之致命問題。
  - 🟠 **重點關注 (High Priority)**：影響範圍廣或評分持續低迷之模組。
  - 🔵 **持續優化 (Medium Priority)**：一般體驗改進。
  - 🟢 **表現良好 (Healthy)**：高評分強項。

### 5. 💾 IndexedDB 本地持久化儲存
- 採用標準 `idb` 異步資料庫驅動。
- 使用者匯入的評論資料、自訂標籤（Tags）、分類調整以及研究員撰寫的質化筆記（Researcher Notes），**在重新整理瀏覽器或重啟電腦後皆完整保留，100% 離線可用且無隱私外洩風險**。

### 6. 🏷️ 手動標籤、質化筆記與批量作業
- **手動標籤系統**：研究員可即時為個別評論新增自訂標籤（如 `#雙11塞車`、`#iOS18改版`、`#待轉工程團隊`）。
- **批量選取與打標**：勾選多筆評論，一鍵批量賦予共同標籤。
- **質化研究員筆記 (Researcher Annotation)**：每則評論可撰寫假說紀錄、根因推論 (Root Cause) 與跨部門處理指示。

### 7. 📁 資料匯入、匯出與豐富範例
- **匯入支援**：
  - 拖曳上傳 CSV（支援 UTF-8、自動偵測逗號／分號／Tab）。
  - 上傳 JSON（支援陣列或嵌套結構）。
  - 剪貼簿直接貼上文字。
  - 智慧欄位自動對應（自動辨識 rating, content, date, category, tags），異常評分自動標準化（如 10 分制轉 5 分制、負數過濾）。
- **內建 3 大豐富情境示例資料**：
  1. 🛒 **台灣電商購物 App 顧客評論**：物流時效、改版閃退、折扣碼無效、退貨爭議。
  2. 💼 **SaaS 敏捷協作工具用戶反饋**：API 限流、Cmd+K 快捷鍵、離線衝突、定價爭議。
  3. 🍜 **外送美食與生鮮快送評論**：外送延誤、湯汁傾倒、備註忽視、秒退服務。
- **全方位匯出能力**：
  - **CSV (UTF-8 with BOM)**：在微軟 Excel 中直接開啟繁體中文，**保證絕不亂碼**！
  - **JSON 資料庫**：乾淨結構化資料。
  - **Markdown 完整研究報告**：自動生成包含 KPI 摘要、緊急修復清單、Top 痛點關鍵字與倫理聲明的專業研究簡報。

---

## 🛠️ 技術棧 (Tech Stack)

- **前端框架**：[React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) + [Vite 5](https://vitejs.dev/)
- **樣式系統**：[Tailwind CSS](https://tailwindcss.com/)（專業高對比工作台風格）
- **可視化圖表**：[Apache ECharts 5](https://echarts.apache.org/) + `echarts-for-react`
- **本地持久化**：[IndexedDB](https://developer.mozilla.org/zh-TW/docs/Web/API/IndexedDB_API)（透過 `idb` Promise 封裝）
- **資料解析**：[PapaParse](https://www.papaparse.com/)
- **單元測試**：[Vitest](https://vitest.dev/) (20 組單元測試通過)
- **端到端測試**：[Playwright](https://playwright.dev/) (17 組端到端測試通過，包含 9 Viewports RWD 與黑白雙主題)
- **響應式與雙主題**：
  - 完美相容 9 種主流 Viewport 尺寸（320px、375px、390px、430px、768px、1024px、1280px、1440px、1920px），頁面零水平溢出。
  - System（跟隨系統）、Light、Dark 黑白雙主題即時切換與持久化。

---

## 🚀 部署至 Vercel

本專案為標準 Vite SPA，已內建 [`vercel.json`](file:///c:/Users/User/Rei/Code/Gemini38plan/review-signal/vercel.json)：

### 方式 1：GitHub 連結部署（推薦）
1. 將本專案推送到 GitHub：
   ```bash
   git remote add origin https://github.com/<your-username>/review-signal.git
   git branch -M main
   git push -u origin main
   ```
2. 在 [Vercel 儀表板 (vercel.com)](https://vercel.com/) 點擊 **"Add New Project"**，選擇該儲存庫。
3. Framework Preset 會自動識別為 **Vite**，Build Command 為 `npm run build`，Output Directory 為 `dist`。
4. 點擊 **"Deploy"**，約 20 秒即可上線。

### 方式 2：使用 Vercel CLI
```bash
npx vercel
npx vercel --prod
```

---

## 💻 本地端運行與驗證

```bash
# 1. 啟動開發伺服器
npm run dev
# 瀏覽器訪問 http://localhost:3000

# 2. 執行核心計算單元測試 (Vitest)
npm test

# 3. 執行 Playwright 端到端瀏覽器測試 (E2E)
npm run test:e2e

# 4. 生產環境建置檢查
npm run build
```

---

## ⚠️ 已知限制與倫理說明

1. **詞典規則覆蓋範圍**：當前情緒計分完全由公開詞典（NTUSD 改編）與修飾詞乘數計算，具備 100% 可解釋性。對於深層語意反詰、複雜雙關語或隱喻，詞典可能判定為中性。本平台絕不私自宣稱其為生成式神經網路模型。
2. **純本地計算限制**：大檔案匯入（超過 5 萬筆）之解析與斷詞在單線程 JavaScript 運算時可能需花費 2~3 秒，建議分批或按月匯入。所有運算皆在用戶瀏覽器內完成，資料絕不上傳第三方伺服器。

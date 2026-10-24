# 📡 Review Signal — 專業評論研究與顧客之聲 (VoC) 分析平台

> **Empirical, Privacy-First, Zero-Fake-AI Review Research Workspace**  
> 專為產品經理 (Product Managers)、UX 研究員 (UX Researchers) 與顧客體驗團隊設計的現代化評論研究工作台。  
> 100% 瀏覽器本地隱私計算、拒絕將簡單字詞統計包裝為「黑箱生成式 AI」，提供完整可解釋的規則證據鏈。

---

## 🌟 核心特色 (Core Highlights)

### 1. 🔍 清楚區分「字詞規則」與「真正情緒模型」（科學倫理堅持）
- **拒絕偽裝 AI (No Fake AI)**：許多商業軟體將簡單的情感詞比對偽稱為「先進 AI 深度分析」。Review Signal 恪守研究工具的客觀誠信原則，明確標示當前引擎為 **確定性詞典規則 (Deterministic Rule-Based NLP)**。
- **滑動修飾詞視窗 (Context Window Modifiers)**：
  - **否定詞翻轉 (Negation)**：偵測「不、沒、無、未、無法」，動態反轉情緒極性（例如：「好用 (+1.0)」→「不好用 (-1.0)」）。
  - **程度副詞放大 (Intensifier)**：偵測「超、非常、極度、太、無比」，乘上 1.4x ~ 1.8x 強度倍率（例如：「超爛 (-1.1 × 1.5 = -1.65)」）。
- **完整證據鏈追溯 (Auditable Evidence Tree)**：點擊任一則評論，即可展開該評分背後的數學歸一化公式：
  $$\text{Normalized Score} = \frac{\text{PositiveScore} - \text{NegativeScore}}{\text{Total} + 0.5} \in [-1.0, +1.0]$$

### 2. 🧩 現代瀏覽器原生中文斷詞與 N-gram 挖掘
- **瀏覽器原生 Intl.Segmenter**：無需下載動輒 20MB 的龐大 WebAssembly 或辭典檔，直接調用現代瀏覽器繁簡中文分詞引擎。
- **領域專屬複合詞重組**：內建針對台灣電商、SaaS 軟體與外送服務業的 200+ 專業領域複合詞庫（如「閃退」、「當機」、「客服人員」、「退貨退款」、「外送員」、「折扣碼」），避免詞組被切碎。
- **N-gram 探勘**：
  - **單字詞 (1-gram)**：快速掌握高頻正負向核心痛點。
  - **二元組 (2-gram)**：挖掘語境搭配（如「更新後 閃退」、「物流 超慢」）。
  - **三元組 (3-gram)**：深層語塊（如「客服 都 沒回」、「包裝 嚴重 破損」）。
- **雙向聯動鑽取 (Cross-Filtering Drill-Down)**：在詞彙雲點擊任意單詞或 N-gram，即時過濾出包含該關鍵詞的所有顧客原聲評論。
- **停用詞管理 (Custom Stopwords)**：內建中英停用詞庫，並支援研究員即時新增／移除自訂停用詞。

### 3. 📊 評分分佈與時間趨勢
- **1~5 星級直方圖**：直觀呈現星等分佈比例、中位數、顧客滿意度 (CSAT, % 4-5 星) 與淨推薦估算 (NPS Proxy)。點擊任一星等直條可立即篩選。
- **時序走勢圖 (Composed Timeline)**：
  - 每日／每週評論總量增長。
  - 正向／負向／中性疊加直方圖（紅條激增即代表爆發客訴事件）。
  - 每日平均星等折線（波動預警）。

### 4. 🚨 問題分類統計與修復優先級矩陣 (Priority Action Matrix)
- **客觀規則分類歸因**：
  - ⚡ 功能異常與閃退 (Bug & Stability)
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

### 5. 🏷️ 手動標籤、質化筆記與批量作業
- **手動標籤系統**：研究員可即時為個別評論新增自訂標籤（如 `#雙11塞車`、`#iOS18改版`、`#待轉工程團隊`）。
- **批量選取與打標**：勾選多筆評論，一鍵批量賦予共同標籤。
- **質化研究員筆記 (Researcher Annotation)**：每則評論可撰寫假說紀錄、根因推論 (Root Cause) 與跨部門處理指示。

### 6. 📁 資料匯入、匯出與豐富範例
- **匯入支援**：
  - 拖曳上傳 CSV（支援 UTF-8、自動偵測逗號／分號／Tab）。
  - 上傳 JSON（支援陣列或嵌套結構）。
  - 剪貼簿直接貼上文字。
  - 智慧欄位自動對應（自動辨識 rating, content, date, category, tags）。
- **內建 3 大豐富情境示例資料**：
  1. 🛒 **台灣電商購物 App 顧客評論**：物流時效、改版閃退、折扣碼無效、退貨爭議。
  2. 💼 **SaaS 敏捷協作工具用戶反饋**：API 限流、Cmd+K 快捷鍵、離線衝突、定價爭議。
  3. 🍜 **外送美食與生鮮快送評論**：外送延誤、湯汁傾倒、備註忽視、秒退服務。
- **全方位匯出能力**：
  - **CSV (UTF-8 with BOM)**：在微軟 Excel 中直接開啟繁體中文，**保證絕不亂碼**！
  - **JSON 資料庫**：乾淨結構化資料。
  - **Markdown 完整研究報告**：自動生成包含 KPI 摘要、緊急修復清單、Top 痛點關鍵字與倫理聲明的專業研究簡報，可直接複製至 Notion 或 Jira。

---

## 🚀 部署至 Vercel (Deployment)

本專案基於 Next.js 14 App Router 開發，原生為 Vercel 雲端平台設計，支援零配置 (Zero-Config) 極速發布：

### 方法 1：透過 GitHub 與 Vercel 儀表板（最推薦）
1. 將本專案推送到您的 GitHub 儲存庫：
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit for Review Signal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/review-signal.git
   git push -u origin main
   ```
2. 前往 [Vercel 儀表板 (vercel.com)](https://vercel.com)。
3. 點擊 **"Add New Project"** 並選擇剛推上去的 GitHub 儲存庫。
4. Framework Preset 會自動識別為 **Next.js**，直接點擊 **"Deploy"**！
5. 約 30 秒即可在全域 CDN 邊緣網路上線。

### 方法 2：使用 Vercel CLI 直接部署
```bash
# 全域安裝 Vercel CLI (若尚未安裝)
npm install -g vercel

# 於專案根目錄執行發布
vercel

# 正式發布 (Production)
vercel --prod
```

---

## 💻 本地端開發與建置 (Local Development)

```bash
# 1. 安裝依賴套件
npm install

# 2. 啟動本機開發伺服器
npm run dev

# 3. 瀏覽器開啟 http://localhost:3000
```

### 生產環境建置檢查
```bash
npm run build
npm run start
```

---

## 🛠️ 技術架構 (Tech Stack)

- **框架**：[Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **樣式**：[Tailwind CSS](https://tailwindcss.com/)
- **圖表**：[Recharts](https://recharts.org/)
- **CSV 解析**：[PapaParse](https://www.papaparse.com/) (含 UTF-8 BOM 處理)
- **圖標庫**：[Lucide React](https://lucide.dev/)
- **分詞引擎**：瀏覽器原生 `Intl.Segmenter` + 複合名詞掃描庫
- **情感運算**：透明確定性規則詞典 (Rule-Based Sentiment Lexicon)

---

## 📜 授權協議 (License)

MIT License © 2026 Review Signal Team.

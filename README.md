# Review Signal

> **顧客之聲 (VoC) 與評論研究專業工作台**，整合原生繁中斷詞、確定性詞典情感分析、N-gram 語塊探勘、四象限修復優先級矩陣與 ECharts 視覺化

<p align="center">
  <a href="https://github.com/ReiKama414/review-signal">GitHub</a> ·
  <a href="https://reikama414.vercel.app/">個人網站</a> ·
  <a href="#快速開始">快速開始</a> ·
  <a href="#測試與驗證">測試驗證</a> ·
  <a href="#license--權限">License</a>
</p>

---

## 為什麼做

商業軟體常將簡單的關鍵字正負統計包裝為黑盒演算法，缺乏透明度與推導依據。Review Signal 專為產品經理、UX 研究員與用戶體驗團隊打造，堅持**確定性規則詞典 (Deterministic Rule-Based NLP)** 與可審計的數學公式，完整呈現命中詞彙與加權證據鏈

所有運算均於使用者瀏覽器本機執行，透過 IndexedDB 持久化存儲標籤與筆記，零資料上傳雲端，兼顧專業分析深度與隱私安全

---

## 核心亮點

- **確定性情感規則引擎** — 改編自 NTUSD 情感詞庫，結合否定詞極性翻轉（「不」、「未」、「無法」）與程度副詞強度加權（1.4x ~ 1.8x），提供完全公開的平滑雙曲歸一化數學公式與特徵證據鏈
- **瀏覽器原生中文斷詞** — 直接調用現代瀏覽器 `Intl.Segmenter`，結合 200+ 台灣電商、SaaS 軟體與外送物流領域專屬複合詞庫，零外部大型權重下載
- **N-gram 探勘與雙向鑽取** — 支援 1-gram、2-gram、3-gram 快速切換，提供自訂停用詞管理；點擊任意詞彙即時過濾並高亮標記對應評論
- **四象限修復優先級矩陣** — 結合評論量佔比 (Volume) 與平均星等 (Rating)，自動判定「緊急修復」、「重點關注」、「持續優化」與「表現良好」
- **ECharts 5 獨立五分區可視化** — 評分星等直方圖點選過濾、雙 Y 軸情緒時序堆疊柱與平均星等走勢折線；嚴格劃分 Header、Description、Statistics、Chart、Footer，杜絕重疊遮擋
- **手動標籤與研究員質化筆記** — 支援單筆或勾選多筆批次打標，每則評論可記錄質化訪談備註、根本原因推論與跨部門處理建議
- **IndexedDB 本機持久化** — 採用 `idb` 非同步資料庫，自訂資料集、手動標籤與研究筆記在瀏覽器重啟後完整留存，100% 離線可用
- **無亂碼匯出與報告即時預覽** — 匯出帶 UTF-8 BOM 之 CSV（微軟 Excel 開啟繁中保證不亂碼）、JSON 資料庫，以及包含 KPI、緊急清單與倫理聲明的 Markdown 報告
- **響應式排版與黑白雙主題** — 通過 9 種 Viewport（320px ~ 1920px）全域無水平溢出驗證，支援 System（跟隨系統）、Light、Dark 主題，且在 200% 文字放大下排版自然延展

---

## 演算法透明度與計算公式

本平台公開情緒評分標準，拒絕不透明的黑盒標籤：

### 1. 平滑雙曲歸一化評分

$$\text{Normalized Score} = \frac{\text{PositiveScore} - \text{NegativeScore}}{\text{TotalScore} + 0.5} \in [-1.0, +1.0]$$

### 2. 滑動視窗修飾機制

- **否定詞翻轉 (Negation)**：視窗向前探測「不、沒、無、未、非、無法」，動態反轉後續情感極性（如：「好用 (+1.0)」→「不好用 (-1.0)」）
- **程度副詞放大 (Intensifier)**：視窗向前探測「超、非常、極度、太、無比」，乘上 1.4x ~ 1.8x 強度倍率（如：「超爛 (-1.1 × 1.5 = -1.65)」）

每則評論均可透過「深入檢視」查看分詞樹狀證據與規則對比

---

## 技術棧

| 領域 | 技術 | 說明 |
| --- | --- | --- |
| 核心框架 | [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) | 嚴格型別定義與元件化架構 |
| 建置工具 | [Vite 5](https://vitejs.dev/) | 輕量秒速 HMR 與生產環境最佳化打包 |
| 樣式系統 | [Tailwind CSS](https://tailwindcss.com/) | 高對比工作台風格、全域雙主題、無多餘漸層發光 |
| 圖表繪製 | [Apache ECharts 5](https://echarts.apache.org/) (`echarts-for-react`) | 向量 SVG 渲染、containLabel 自動留白、點擊雙向連動 |
| 本機存儲 | [IndexedDB](https://developer.mozilla.org/zh-TW/docs/Web/API/IndexedDB_API) (`idb`) | 結構化資料本機持久化，保護研究隱私 |
| 資料解析 | [PapaParse](https://www.papaparse.com/) | CSV 自動欄位偵測、編碼相容與異常評分正規化 |
| 圖標庫 | [Lucide React](https://lucide.dev/) | 簡潔一致的工程工作台視覺圖示 |
| 測試套件 | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) | 核心演算法單元測試與端到端排版防禦驗證 |

---

## 快速開始

### 環境需求

- Node.js 18.0 或以上版本
- npm 9.0 或以上版本

### 安裝與啟動

```bash
# 1. 複製儲存庫
git clone https://github.com/ReiKama414/review-signal.git
cd review-signal

# 2. 安裝依賴套件
npm install

# 3. 啟動本機開發伺服器
npm run dev -- --port 3008
```

> **提醒：** 啟動後於瀏覽器造訪 [http://localhost:3008](http://localhost:3008)，即可進入完整功能的工作台

---

## 測試與驗證

專案具備完整自動化測試體系，全數測試均於真實環境下執行驗證：

| 測試類型 | 執行指令 | 涵蓋範疇 |
| --- | --- | --- |
| 單元測試 (Unit) | `npm test` | 5 組套件、20 項測試：斷詞重組、詞典滑動視窗、分類優先矩陣、CSV/JSON 解析與 BOM 匯出 |
| 核心互動 (E2E) | `npx playwright test e2e/review-signal.spec.ts` | 8 項主要流程：範例載入、圖表渲染、關鍵字搜尋、字詞鑽取、透明沙盒、深入檢視、Markdown 匯出 |
| 響應式 (RWD) | `npx playwright test e2e/rwd-theme-viewport.spec.ts` | 9 種指定 Viewport（320px、375px、390px、430px、768px、1024px、1280px、1440px、1920px）全域無溢出 |
| 零重疊 (Zero-Overlap) | `npx playwright test e2e/zero-overlap-layout.spec.ts` | 8 項排版防禦：Header/Stats/Chart 獨立 Bounding Box 碰撞檢測、200% 文字放大延展、資料動態重繪 |
| 完整執行 (All E2E) | `npm run test:e2e` | 一鍵執行全數 25 項端到端自動化測試 |

---

## 生產建置與部署

### 1. 本地生產建置

```bash
npm run build
```

建置產物輸出至 `dist/`，包含 TypeScript 檢查與 Vite 資源最佳化分塊

### 2. 部署至 Vercel

本專案已內建 [vercel.json](./vercel.json)：

- **方式一（GitHub 連結）**：推送到 GitHub 後，於 [Vercel 控制台](https://vercel.com/) 點擊「Add New Project」選取該儲存庫，Framework Preset 自動辨識為 Vite，直接部署
- **方式二（Vercel CLI）**：
  ```bash
  npx vercel
  npx vercel --prod
  ```

---

## 資料處理與隱私界線

- **純本機計算**：所有分詞、情感計分、分類矩陣與圖表渲染皆在使用者瀏覽器執行，絕不上傳第三方伺服器
- **離線資料庫**：自訂標籤與質化研究筆記寫入本機 IndexedDB（資料庫名稱：`review-signal-db`）
- **容量建議**：瀏覽器單執行緒解析建議單檔在 50,000 則評論以內；超大型資料集建議分批或按月份匯入

---

## 已知限制

- **詞典規則邊界**：規則引擎依賴確定性詞庫與前後滑動修飾詞，具備百分之百可解釋性；對於極深層反諷、雙關語或隱喻，可能判定為中性
- **內建範例情境**：預設提供電商購物（36 則）、SaaS 工具反饋（24 則）與美食外送（30 則）三套真實情境資料集，便於快速體驗
- **字型環境**：中文字體優先調用作業系統預設之蘋方（PingFang SC）、微軟正黑體（Microsoft JhengHei）與思源黑體，維持工作台專業簡潔質感

---

## 身分與對外連結

| 項目 | 值 |
| --- | --- |
| 作者 | ReiKama414（Myers） |
| GitHub | [ReiKama414/review-signal](https://github.com/ReiKama414/review-signal) |
| 個人網站 | [作品集](https://reikama414.vercel.app/) |
| 授權全文 | [LICENSE](./LICENSE) |

---

## License / 權限

Copyright (c) ReiKama414. All rights reserved.

本專案僅供個人瀏覽與學習。未經著作權人書面同意，不得使用、複製、修改、散布或併入其他專案（含非商業用途）

- [GitHub](https://github.com/ReiKama414/review-signal)
- [個人網站](https://reikama414.vercel.app/)
- [授權全文](./LICENSE)

---

<sub>Copyright (c) 2026 ReiKama414. All rights reserved.</sub>

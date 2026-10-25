# Visual Asset Requests (ComfyUI Specification)

此文件記錄 Review Signal 平台未來的視覺素材需求規格與 ComfyUI 生成 Prompt。所有 UI 目前使用簡潔純向量 SVG 與專業數據可視化元件，確保功能先行、無任何外部素材阻塞。

---

## 1. 平台品牌標誌 (Brand Icon & Avatar)
- **檔案路徑**：`assets/brand-logo.png`
- **尺寸**：`1024 x 1024 px` (PNG 32-bit Transparent)
- **用途**：首頁品牌圖標、社交分享 OpenGraph 圖、PWA App Icon
- **風格要求**：高對比科技風、現代簡約、資訊工程感、波形／訊號波長 (Signal Wave) 與研究放大鏡的結合
- **ComfyUI Prompt 建議**：
  > `(masterpiece, best quality:1.2), modern minimalist tech logo, oscilloscope signal soundwave transformed into a glowing clean cyan and indigo geometric crest, dark sleek background, vector graphic style, sharp clean lines, professional data science SaaS icon, 8k resolution, centered`
- **Negative Prompt**：
  > `blurry, noise, gradients, realistic photo, human, 3d render, messy, low quality, artifacts, watermark, text`

---

## 2. 空狀態占位插圖 (Empty State Illustration)
- **檔案路徑**：`assets/empty-reviews.png`
- **尺寸**：`800 x 600 px` (WebP / PNG)
- **用途**：當使用者篩選查無資料或尚未匯入任何資料時的質樸占位符號
- **風格要求**：乾淨線條、沉穩 Slate 灰藍色調、技術工作台手繪工程圖風格
- **ComfyUI Prompt 建議**：
  > `(flat vector technical illustration:1.3), minimalist line art of clean data spreadsheets and charts on a desk, subtle blueprint aesthetic, slate blue and monochrome palette, high contrast, clean negative space, centered composition`
- **Negative Prompt**：
  > `colorful, busy, childish, messy, 3d, realistic photo, gradients, dark messy shadows`

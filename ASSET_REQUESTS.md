# Review Signal — 視覺素材生成規格與 Prompt 指南 (ComfyUI)

本文件依據工程規範建立，記錄 Review Signal 評論研究與顧客之聲 (VoC) 工作台所需各類視覺素材（品牌識別圖示、空評論狀態圖、內建情境資料集代表卡片）之精確規格與 ComfyUI 提示詞。目前專案已使用簡潔之 SVG / Tailwind CSS 占位區與向量圖示，所有功能完整可用，無任何阻塞。

---

## 🎨 素材項目與 Prompt 規格清單

### 1. 工作台主品牌圖示 (Studio Logo / Favicon)
- **檔案存放路徑**：`public/favicon.svg` (現行向量占位), `src/assets/brand-logo.png`
- **尺寸與格式**：`512 x 512 px`, 32-bit PNG (含透明通道)
- **視覺風格**：Clean isometric technical data analytics icon, sharp vector lines, slate and indigo accents, dark mode compatible, minimalist.
- **推薦 Checkpoint / 模型**：SDXL 1.0 或 Flux.1-dev
- **ComfyUI Positive Prompt**:
  ```text
  (masterpiece, top quality, vector graphics:1.2), isometric 3D soundwave signal emblem, intersecting crystal voice-of-customer waveform, glowing analytical grid canvas, modern precision engineering, frosted glass accents, indigo blue #4f46e5 and slate dark theme, crisp edges, transparent background, isolated, minimalist logo, 8k resolution, octane render style
  ```
- **ComfyUI Negative Prompt**:
  ```text
  text, watermark, low quality, blurry, photorealistic human, noisy texture, messy sketch, cartoonish, 3d clutter, gradient fluff
  ```

---

### 2. 評論空狀態插圖 (Empty State Illustration)
- **檔案存放路徑**：`src/assets/empty-reviews.png`
- **尺寸與格式**：`800 x 600 px`, PNG
- **視覺風格**：Technical blueprint schematic, customer feedback research workbench waiting for input, clean slate grey & subtle emerald tones.
- **ComfyUI Positive Prompt**:
  ```text
  (technical blueprint illustration:1.2), empty customer feedback research canvas workbench, isometric schematic of clean empty sentiment timeline and review cards with dashed connecting lines, waiting for CSV upload, minimalist engineering UI illustration, slate gray background #0f172a, high precision lines, architectural drafting aesthetic, clean vector
  ```
- **ComfyUI Negative Prompt**:
  ```text
  overcrowded, complex, colorful, 3d character, messy background, anime, fantasy, bright neon
  ```

---

### 3. 三組內建實戰資料集代表預覽圖 (Sample Dataset Badges)
- **尺寸與格式**：`400 x 240 px` 寬高比 5:3
- **規格**:
  1. **台灣電商購物平台顧客反饋 (E-Commerce)**:
     - Prompt: `isometric minimalist parcel delivery and shopping cart feedback metrics, star rating badges and barcode receipt, clean slate palette, technical precision, flat vector 2.5D`
  2. **SaaS 敏捷協作工具用戶反饋 (SaaS Tool)**:
     - Prompt: `isometric agile sprint kanban board node, memory usage telemetry graph, software bug resolution indicator, slate blue clean aesthetic`
  3. **美食外送與生鮮快送評論 (Food & Grocery)**:
     - Prompt: `isometric fresh grocery box with scooter dispatch route node and clock timer badge, precision line drawing, slate palette`

---

## ⚙️ ComfyUI 參數設置建議

| 參數項目 | 建議值 |
| :--- | :--- |
| **Sampler** | `dpmpp_2m_sde` 或 `euler` |
| **Scheduler** | `karras` |
| **Steps** | 28 ~ 35 |
| **CFG Scale** | 6.5 ~ 7.5 |
| **Clip Skip** | 1 |
| **Denoise** | 1.0 (Text-to-Image) |

import Papa from 'papaparse';
import { Review, CategorySummary, TokenStat, RatingStats } from '@/types';

/**
 * 匯出為 CSV 格式 (支援 UTF-8 BOM，防止 Excel 開啟繁體中文亂碼)
 */
export function exportToCSV(reviews: Review[], filename: string = 'review-signal-export.csv') {
  const rows = reviews.map(r => ({
    '評論ID': r.id,
    '星等評分': r.rating,
    '評論內容': r.content,
    '問題分類': r.category,
    '情緒標籤(規則詞典)': r.sentiment.label === 'positive' ? '正面 (Positive)' : (r.sentiment.label === 'negative' ? '負面 (Negative)' : '中性 (Neutral)'),
    '情緒得分': r.sentiment.score,
    '情緒規則證據': r.sentiment.evidence.map(e => `${e.token}(${e.weight})`).join('; '),
    '手動標籤': r.tags.join(', '),
    '研究員筆記': r.notes || '',
    '日期': r.date,
    '作者/用戶': r.author || '',
    '裝置': r.device || '',
    '版本': r.version || ''
  }));

  const csv = Papa.unparse(rows);
  // 加入 UTF-8 BOM (\uFEFF)
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * 匯出為 JSON 格式
 */
export function exportToJSON(reviews: Review[], filename: string = 'review-signal-export.json') {
  const jsonStr = JSON.stringify({
    metadata: {
      exportedAt: new Date().toISOString(),
      platform: 'Review Signal',
      totalCount: reviews.length,
      methodology: 'Deterministic Lexicon + Intl.Segmenter'
    },
    reviews
  }, null, 2);

  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * 匯出完整研究洞察摘要報告 (Markdown 格式)
 */
export function generateMarkdownReport(
  reviews: Review[],
  ratingStats: RatingStats,
  categories: CategorySummary[],
  topKeywords: TokenStat[],
  datasetName: string = '評論資料集'
): string {
  const criticalIssues = categories.filter(c => c.priority === 'critical' || c.priority === 'high');
  const negativeKeywords = topKeywords.filter(k => k.sentimentScore < -0.1 || k.avgRating < 3.0).slice(0, 8);

  return `# 📊 Review Signal 評論研究與顧客之聲分析報告

> **分析對象**：${datasetName}
> **產出時間**：${new Date().toLocaleString('zh-TW')}
> **樣本總數**：${reviews.length} 則有效顧客評論
> **分析引擎**：Review Signal 確定性分詞與規則字典情緒引擎（本地 100% 隱私運算，非黑箱 AI）

---

## 1. 核心指標概況 (KPI Executive Summary)

| 指標名稱 | 數值 | 說明 |
| :--- | :--- | :--- |
| **平均評分 (Avg Rating)** | ⭐ **${ratingStats.average.toFixed(2)}** / 5.0 | 總體滿意度基準線 |
| **顧客滿意度 (CSAT)** | **${ratingStats.csat.toFixed(1)}%** | 給予 4~5 星之正面顧客比例 |
| **淨推薦值評估 (Net Promoter)** | **${ratingStats.npsScore >= 0 ? '+' : ''}${ratingStats.npsScore.toFixed(1)}** | 推薦者(4-5星) 減 批評者(1-2星) |
| **評分中位數 (Median)** | **${ratingStats.median}** 星 | 消除極端值之評分分佈中位數 |

### 評分星等分佈 (Rating Breakdown)
- ⭐ 5 星：${ratingStats[5]} 則 (${((ratingStats[5]/ratingStats.total)*100).toFixed(1)}%)
- ⭐ 4 星：${ratingStats[4]} 則 (${((ratingStats[4]/ratingStats.total)*100).toFixed(1)}%)
- ⭐ 3 星：${ratingStats[3]} 則 (${((ratingStats[3]/ratingStats.total)*100).toFixed(1)}%)
- ⭐ 2 星：${ratingStats[2]} 則 (${((ratingStats[2]/ratingStats.total)*100).toFixed(1)}%)
- ⭐ 1 星：${ratingStats[1]} 則 (${((ratingStats[1]/ratingStats.total)*100).toFixed(1)}%)

---

## 2. 🚨 緊急修復與關鍵痛點 (Priority Action Matrix)

${criticalIssues.length === 0 ? '目前暫無急迫性 Critical 議題。' : criticalIssues.map((cat, i) => `
### ${i + 1}. 【${cat.priority.toUpperCase()}】${cat.category}
- **佔比**：${cat.percentage}% (${cat.count} 則評論)
- **平均星等**：⭐ ${cat.avgRating} / 5.0
- **負向情緒評論數**：${cat.negativeCount} 則
- **典型顧客原聲**：
${cat.sampleReviews.slice(0, 2).map(r => `  > "${r}"`).join('\n')}
`).join('\n')}

---

## 3. 問題分類統計分佈 (Issue Categories Breakdown)

| 類別名稱 | 評論數 | 佔比 | 平均評分 | 負向數 | 正向數 | 優先級 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
${categories.map(c => `| ${c.category} | ${c.count} | ${c.percentage}% | ⭐ ${c.avgRating} | ${c.negativeCount} | ${c.positiveCount} | \`${c.priority}\` |`).join('\n')}

---

## 4. 關鍵詞彙與負向訊號 (Top Keywords & Negative Signals)

### 高頻負向/痛點關鍵字：
${negativeKeywords.length === 0 ? '無明顯負向聚集字詞。' : negativeKeywords.map((k, i) => `
${i + 1}. **${k.word}**
   - 出現評論數：${k.reviewCount} 則 (${k.percentage}%)
   - 關聯平均評分：⭐ ${k.avgRating}
   - 情緒規則傾向：\`${k.sentimentScore.toFixed(2)}\`
`).join('')}

---

## 5. 算法與研究方法聲明 (Methodology & Ethics)
本報告分析之字詞頻率採用瀏覽器原生 \`Intl.Segmenter\` 斷詞，並輔以電商與科技領域複合詞庫。情緒極性則嚴格根據「NTUSD / 繁中規則情感詞典」與否定詞、程度副詞滑動視窗計算，**絕不偽裝為未經微調之黑箱 AI 神經網路模型**，提供 100% 可解釋、可審計的客觀研究依據。

*報告產出工具：Review Signal 評論研究平台*
`;
}

/**
 * 匯出 Markdown 檔案至瀏覽器下載
 */
export function exportToMarkdown(
  reviews: Review[],
  ratingStats: RatingStats,
  categories: CategorySummary[],
  topKeywords: TokenStat[],
  filename: string = 'review-signal-report.md',
  datasetName?: string
) {
  const md = generateMarkdownReport(reviews, ratingStats, categories, topKeywords, datasetName);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // 移除檔名中的非法字元（Windows / macOS 不允許 \ / : * ? " < > |）
  a.download = filename.replace(/[\\/:*?"<>|]/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 延遲釋放，避免部分瀏覽器尚未開始下載就被撤銷
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

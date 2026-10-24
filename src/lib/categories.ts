import { CategorySummary, Review } from '@/types';

export interface CategoryRule {
  category: string;
  keywords: string[];
  color: string;
  icon: string;
  description: string;
}

export const PRESET_CATEGORIES: CategoryRule[] = [
  {
    category: '功能異常與閃退 (Bug & Crash)',
    keywords: ['閃退', '當機', '卡頓', '卡死', '崩潰', '無法登入', '登不出', '黑屏', '連線異常', 'bug', 'crash', '死機', '白屏', '錯誤', '失靈', '打不開'],
    color: '#ef4444', // red
    icon: 'Bug',
    description: '軟體運作不穩定、連線失敗或核心功能中斷'
  },
  {
    category: '物流配送與包裝 (Delivery)',
    keywords: ['物流', '運送', '出貨', '配送', '包裝', '破損', '送達', '外送員', '超商', '包裹', '取貨', '漏寄', '少寄', '等太久', '遲到', '冷掉', '灑出'],
    color: '#f97316', // orange
    icon: 'Truck',
    description: '實體貨品出貨進度、超商取件、外送品質與外包裝狀態'
  },
  {
    category: '客戶服務與售後 (Customer Support)',
    keywords: ['客服', '真人客服', '電話', '回覆', '沒回', '不回', '推卸責任', '態度差', '售後', '保固', '投訴', '申訴', '無效溝通', '等客服'],
    color: '#eab308', // amber
    icon: 'Headphones',
    description: '客服專員回覆時效、服務態度與問題處理能力'
  },
  {
    category: '介面設計與易用性 (UI/UX)',
    keywords: ['介面', '改版', '排版', '找不到', '難用', '字太小', '操作不便', '動線', '反人類', '複雜', '繁瑣', '體驗差', '按鈕', '滑動', '按不到'],
    color: '#8b5cf6', // purple
    icon: 'Layout',
    description: '視覺改版、操作流程順暢度與按鈕動線引導'
  },
  {
    category: '價格費用與退款 (Pricing & Refund)',
    keywords: ['價格', '太貴', '扣款', '重複扣款', '退款', '退費', '退貨', '優惠券', '折價券', '折扣碼', '收費', '訂閱', '續訂', '會員費', '運費', '發票'],
    color: '#06b6d4', // cyan
    icon: 'Receipt',
    description: '計費透明度、退款退貨爭議、優惠券折抵與訂閱制度'
  },
  {
    category: '商品品質與期待 (Product Quality)',
    keywords: ['品質', '瑕疵', '材質', '做工', '色差', '跟照片不符', '假貨', '發霉', '過期', '異味', '難吃', '味道', '份量少', '名不虛傳', '正品'],
    color: '#ec4899', // pink
    icon: 'Package',
    description: '商品實物品質、材質做工、食物口感與圖文相符程度'
  },
  {
    category: '滿意與產品讚譽 (Praise & Delight)',
    keywords: ['超讚', '好用', '滿意', '推薦', '大推', '神作', '喜歡', '回購', '順暢', '優秀', '便宜', '實惠', '質感好', '物超所值', '給讚'],
    color: '#10b981', // emerald
    icon: 'ThumbsUp',
    description: '顧客高度肯定、推薦與忠誠正面回饋'
  },
  {
    category: '其他綜合意見 (Other Feedback)',
    keywords: [],
    color: '#64748b', // slate
    icon: 'HelpCircle',
    description: '未符合特定類別的一般性意見與提問'
  }
];

/**
 * 規則式分類判定 (Deterministic Rule-Based Categorization)
 * 根據正則關鍵字命中度，透明打分分類，絕非黑箱模型
 */
export function classifyReviewRuleBased(text: string): { category: string; matchedKeywords: string[] } {
  if (!text) return { category: '其他綜合意見 (Other Feedback)', matchedKeywords: [] };

  const lowerText = text.toLowerCase();
  let bestCategory = '其他綜合意見 (Other Feedback)';
  let maxMatches = 0;
  let matchedList: string[] = [];

  for (const preset of PRESET_CATEGORIES) {
    if (preset.keywords.length === 0) continue;
    const matches = preset.keywords.filter(kw => lowerText.includes(kw.toLowerCase()));
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      bestCategory = preset.category;
      matchedList = matches;
    }
  }

  return {
    category: bestCategory,
    matchedKeywords: matchedList
  };
}

/**
 * 統計各分類的分布、平均評分、情緒與四象限緊急修復優先級 (Priority Matrix)
 */
export function calculateCategorySummaries(reviews: Review[]): CategorySummary[] {
  const map = new Map<string, {
    count: number;
    totalRating: number;
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    sampleReviews: string[];
  }>();

  // 初始化所有 preset
  PRESET_CATEGORIES.forEach(c => {
    map.set(c.category, {
      count: 0,
      totalRating: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      sampleReviews: []
    });
  });

  const totalReviews = reviews.length || 1;

  for (const review of reviews) {
    const cat = review.category || '其他綜合意見 (Other Feedback)';
    let entry = map.get(cat);
    if (!entry) {
      entry = {
        count: 0,
        totalRating: 0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 0,
        sampleReviews: []
      };
      map.set(cat, entry);
    }
    entry.count += 1;
    entry.totalRating += review.rating;
    if (review.sentiment?.label === 'positive') entry.positiveCount += 1;
    else if (review.sentiment?.label === 'negative') entry.negativeCount += 1;
    else entry.neutralCount += 1;

    if (entry.sampleReviews.length < 3 && review.content) {
      entry.sampleReviews.push(review.content);
    }
  }

  const summaries: CategorySummary[] = [];

  map.forEach((data, category) => {
    if (data.count === 0) return; // 略過無資料的

    const avgRating = Number((data.totalRating / data.count).toFixed(2));
    const percentage = Number(((data.count / totalReviews) * 100).toFixed(1));

    // 四象限優先級判定 (Priority Matrix):
    // 依評論量 (Volume) 與 平均星等 (Avg Rating)
    // 評分 < 2.5 且 佔比 >= 15% -> Critical (緊急修復)
    // 評分 < 3.0 或 佔比 >= 20% -> High (重點關注)
    // 評分 < 3.8 -> Medium (優化項目)
    // 評分 >= 3.8 -> Low / Positive (健康維護)
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
    if (avgRating <= 2.5 && percentage >= 12) {
      priority = 'critical';
    } else if (avgRating <= 3.0 || (avgRating <= 3.5 && percentage >= 20)) {
      priority = 'high';
    } else if (avgRating < 4.0) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    summaries.push({
      category,
      count: data.count,
      percentage,
      avgRating,
      positiveCount: data.positiveCount,
      neutralCount: data.neutralCount,
      negativeCount: data.negativeCount,
      sampleReviews: data.sampleReviews,
      priority
    });
  });

  return summaries.sort((a, b) => b.count - a.count);
}

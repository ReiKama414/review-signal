import { TokenStat, Review } from '@/types';

// ==========================================
// 預設停用詞列表 (Stopwords)
// 可依研究需求過濾高頻無實質語意的虛詞、代名詞、標點
// ==========================================
export const DEFAULT_STOPWORDS = new Set([
  '的', '了', '在', '是', '我', '有', '和', '就', '人', '都', '一', '個', '上',
  '也', '很', '到', '說', '要', '去', '你', '會', '著', '沒有', '如果', '雖然',
  '但是', '因為', '所以', '以及', '或者', '這個', '那個', '這些', '那些', '自己',
  '什麼', '怎麼', '這樣', '那樣', '只是', '還是', '已經', '可以', '能夠', '應該',
  '就是', '不是', '現在', '之後', '之前', '時候', '今天', '明天', '昨天', '覺得',
  '感覺', '真的', '一下', '一點', '一些', '一樣', '而且', '然後', '不過', '其實',
  '大家', '有人', '我們', '你們', '他們', '她們', '它的', '其', '此', '及', '與',
  // 英文常見 stopwords
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'to', 'for',
  'in', 'on', 'at', 'by', 'with', 'about', 'it', 'this', 'that', 'i', 'my', 'me',
  'you', 'your', 'we', 'our', 'they', 'their', 'of', 'so', 'just', 'be', 'as'
]);

// 專業複合詞（提升斷詞品質，避免被切成單字）
export const DOMAIN_COMPOUND_WORDS = [
  '閃退', '當機', '卡頓', '連線異常', '無法登入', '登不出', '無法開啟', '黑屏', '死機',
  '客服人員', '客服電話', '在線客服', '真人客服', '推卸責任', '不回訊息', '態度惡劣',
  '退貨退款', '退貨流程', '申請退款', '鑑賞期', '免運券', '折價券', '優惠代碼', '折扣碼',
  '外送員', '配送速度', '延遲送達', '包裝破損', '餐點冷掉', '漏送餐點', '送錯地址',
  '版本更新', '強制更新', '系統升級', '介面設計', '使用者體驗', '操作不便', '找不到功能',
  '自動扣款', '扣錯款項', '重複收費', '會員訂閱', '取消訂閱', '發票開立', '載具歸戶',
  '商品品質', '包裝完整', '物美價廉', '值得推薦', '出貨迅速', '出貨速度', '物流超快',
  '售後服務', '處理效率', '解決問題', '耐心回答', '親切專業', '值得信賴', '回購多次'
];

/**
 * 智慧中文與跨語言斷詞器
 * 優先使用現代瀏覽器內建 Intl.Segmenter，輔以領域複合詞重組
 */
export function tokenizeText(text: string, customStopwords?: Set<string>): string[] {
  if (!text || typeof text !== 'string') return [];

  const stopwords = customStopwords || DEFAULT_STOPWORDS;
  const cleanText = text.trim();
  if (!cleanText) return [];

  let rawTokens: string[] = [];

  // 1. 若支援 Intl.Segmenter 則使用原生高品質多語言分詞
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    try {
      const segmenter = new (Intl as any).Segmenter('zh-TW', { granularity: 'word' });
      const segments = segmenter.segment(cleanText);
      for (const seg of segments) {
        if (seg.isWordLike) {
          rawTokens.push(seg.segment);
        }
      }
    } catch {
      rawTokens = fallbackTokenize(cleanText);
    }
  } else {
    rawTokens = fallbackTokenize(cleanText);
  }

  // 2. 複合詞重組掃描 (若有斷開的常見詞如 "閃" + "退" -> "閃退")
  const mergedTokens = mergeCompoundWords(rawTokens);

  // 3. 過濾停用詞、標點符號、純數字或過短非有效字
  return mergedTokens.filter(t => {
    const trimmed = t.trim().toLowerCase();
    if (!trimmed || trimmed.length < 2) {
      // 保留關鍵單字情緒（如：爛、讚、差、貴）
      if (!['爛', '讚', '差', '貴', '雷', '棒'].includes(trimmed)) {
        return false;
      }
    }
    // 過濾純數字
    if (/^\d+$/.test(trimmed)) return false;
    // 過濾停用詞
    if (stopwords.has(trimmed)) return false;
    return true;
  });
}

/**
 * 後備簡單分詞（正則匹配英文字詞或中文字符）
 */
function fallbackTokenize(text: string): string[] {
  const tokens: string[] = [];
  const regex = /[\u4e00-\u9fa5]{1,4}|[a-zA-Z0-9_-]+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push(match[0]);
  }
  return tokens;
}

/**
 * 領域詞庫重組：將分開的字詞拼合回有意義的領域專有名詞
 */
function mergeCompoundWords(tokens: string[]): string[] {
  const result: string[] = [];
  const len = tokens.length;
  let i = 0;

  while (i < len) {
    // 檢查 3 詞複合
    if (i + 2 < len) {
      const tri = `${tokens[i]}${tokens[i + 1]}${tokens[i + 2]}`;
      if (DOMAIN_COMPOUND_WORDS.some(w => w === tri)) {
        result.push(tri);
        i += 3;
        continue;
      }
    }
    // 檢查 2 詞複合
    if (i + 1 < len) {
      const bi = `${tokens[i]}${tokens[i + 1]}`;
      if (DOMAIN_COMPOUND_WORDS.some(w => w === bi)) {
        result.push(bi);
        i += 2;
        continue;
      }
    }
    result.push(tokens[i]);
    i++;
  }

  return result;
}

/**
 * 生成 N-gram (1-gram, 2-gram, 3-gram)
 */
export function generateNgrams(tokens: string[], n: 1 | 2 | 3): string[] {
  if (tokens.length < n) return [];
  if (n === 1) return tokens;

  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    const slice = tokens.slice(i, i + n);
    // 連接詞組（若是純英文則空格分隔，中文則直接相連或空格清晰顯示）
    const phrase = slice.join(' ');
    ngrams.push(phrase);
  }
  return ngrams;
}

/**
 * 統計字詞與 N-gram 頻率與評價關聯度
 */
export function extractTokenStats(
  reviews: Review[],
  ngramType: 1 | 2 | 3 = 1,
  limit: number = 50,
  stopwords?: Set<string>
): TokenStat[] {
  const tokenMap = new Map<string, {
    count: number;
    reviewIds: Set<string>;
    totalRating: number;
    totalSentiment: number;
  }>();

  for (const review of reviews) {
    // 每次動態分詞或使用快取的 tokens
    const tokens = review.tokens && ngramType === 1 
      ? review.tokens 
      : tokenizeText(review.content, stopwords);

    const ngrams = generateNgrams(tokens, ngramType);

    for (const phrase of ngrams) {
      if (!phrase) continue;
      let entry = tokenMap.get(phrase);
      if (!entry) {
        entry = {
          count: 0,
          reviewIds: new Set<string>(),
          totalRating: 0,
          totalSentiment: 0
        };
        tokenMap.set(phrase, entry);
      }
      entry.count += 1;
      if (!entry.reviewIds.has(review.id)) {
        entry.reviewIds.add(review.id);
        entry.totalRating += review.rating;
        entry.totalSentiment += review.sentiment?.score ?? 0;
      }
    }
  }

  const totalReviews = reviews.length || 1;
  const stats: TokenStat[] = [];

  tokenMap.forEach((val, word) => {
    const reviewCount = val.reviewIds.size;
    // 門檻：至少出現 1 次，計算平均值
    stats.push({
      word,
      count: val.count,
      reviewCount,
      percentage: Number(((reviewCount / totalReviews) * 100).toFixed(1)),
      avgRating: Number((val.totalRating / reviewCount).toFixed(2)),
      sentimentScore: Number((val.totalSentiment / reviewCount).toFixed(2)),
      ngramType
    });
  });

  // 排序：先比出現的評論數，再比總出現次數
  return stats
    .sort((a, b) => b.reviewCount - a.reviewCount || b.count - a.count)
    .slice(0, limit);
}

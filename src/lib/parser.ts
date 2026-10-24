import Papa from 'papaparse';
import { Review } from '@/types';
import { analyzeSentimentRuleBased } from './sentiment';
import { tokenizeText } from './tokenizer';
import { classifyReviewRuleBased } from './categories';

export interface ColumnMapping {
  content: string;
  rating: string;
  date?: string;
  title?: string;
  author?: string;
  category?: string;
  tags?: string;
}

export interface ParseResult {
  reviews: Review[];
  totalRows: number;
  validRows: number;
  skippedRows: number;
  detectedHeaders: string[];
  suggestedMapping: ColumnMapping;
}

/**
 * 智慧欄位偵測 (Smart Column Auto-Detection)
 */
export function detectColumns(headers: string[]): ColumnMapping {
  const lowerMap = new Map(headers.map(h => [h.toLowerCase().trim(), h]));

  const findHeader = (candidates: string[]): string | undefined => {
    const entries = Array.from(lowerMap.entries());
    for (const cand of candidates) {
      for (const [lower, orig] of entries) {
        if (lower === cand || lower.includes(cand)) {
          return orig;
        }
      }
    }
    return undefined;
  };

  const contentCol = findHeader(['content', 'text', 'comment', 'review', 'body', 'message', '評論', '內文', '反饋', '意見', '說明']) || headers[0] || 'content';
  const ratingCol = findHeader(['rating', 'score', 'stars', 'star', '評分', '星等', '分數', '滿意度']) || headers[1] || 'rating';
  const dateCol = findHeader(['date', 'created_at', 'timestamp', 'time', '時間', '日期', '建立時間']);
  const titleCol = findHeader(['title', 'subject', 'headline', '標題', '主旨']);
  const authorCol = findHeader(['author', 'user', 'username', 'name', 'reviewer', '作者', '用戶', '會員']);
  const categoryCol = findHeader(['category', 'topic', 'type', '分類', '問題類型', '類別']);
  const tagsCol = findHeader(['tags', 'labels', '標籤']);

  return {
    content: contentCol,
    rating: ratingCol,
    date: dateCol,
    title: titleCol,
    author: authorCol,
    category: categoryCol,
    tags: tagsCol
  };
}

/**
 * 將原始資料轉換為標準 Review 模型並執行斷詞與規則情緒分析
 */
export function convertRowsToReviews(
  rows: Record<string, any>[],
  mapping: ColumnMapping
): Review[] {
  const reviews: Review[] = [];

  rows.forEach((row, index) => {
    const rawContent = row[mapping.content];
    if (!rawContent || String(rawContent).trim().length === 0) {
      return; // 略過無內文的評論
    }

    const contentStr = String(rawContent).trim();

    // 處理評分 (支援 1~5 星，如果是 1~10 或百分比則標準化為 1~5)
    let rawRating = Number(row[mapping.rating]);
    if (isNaN(rawRating) || rawRating <= 0) {
      // 嘗試從文字中解析星等
      const starMatch = String(row[mapping.rating] || '').match(/(\d(\.\d)?)/);
      rawRating = starMatch ? parseFloat(starMatch[1]) : 3;
    }
    if (rawRating > 5 && rawRating <= 10) {
      rawRating = Math.round(rawRating / 2);
    } else if (rawRating > 10) {
      rawRating = Math.round((rawRating / 100) * 5);
    }
    const finalRating = Math.max(1, Math.min(5, Math.round(rawRating)));

    // 處理日期
    let dateStr = new Date().toISOString().split('T')[0];
    if (mapping.date && row[mapping.date]) {
      const parsedDate = new Date(row[mapping.date]);
      if (!isNaN(parsedDate.getTime())) {
        dateStr = parsedDate.toISOString().split('T')[0];
      }
    }

    // 斷詞
    const tokens = tokenizeText(contentStr);

    // 規則情緒分析
    const sentiment = analyzeSentimentRuleBased(tokens, contentStr);

    // 分類：若原始資料無分類，則透過規則分類器判定
    let category = mapping.category && row[mapping.category] ? String(row[mapping.category]).trim() : '';
    if (!category) {
      category = classifyReviewRuleBased(contentStr).category;
    }

    // 標籤
    let tags: string[] = [];
    if (mapping.tags && row[mapping.tags]) {
      const rawTags = row[mapping.tags];
      if (Array.isArray(rawTags)) {
        tags = rawTags.map(t => String(t).trim()).filter(Boolean);
      } else if (typeof rawTags === 'string') {
        tags = rawTags.split(/[,;|，、]/).map(t => t.trim()).filter(Boolean);
      }
    }

    reviews.push({
      id: row.id ? String(row.id) : `rev-${Date.now()}-${index}`,
      content: contentStr,
      rating: finalRating,
      date: dateStr,
      title: mapping.title && row[mapping.title] ? String(row[mapping.title]).trim() : undefined,
      author: mapping.author && row[mapping.author] ? String(row[mapping.author]).trim() : undefined,
      category,
      sentiment,
      tags,
      tokens,
      device: row.device ? String(row.device) : undefined,
      version: row.version ? String(row.version) : undefined,
      helpfulCount: row.helpfulCount ? Number(row.helpfulCount) : undefined
    });
  });

  return reviews;
}

/**
 * 解析 CSV 字串或檔案
 */
export function parseCSV(csvString: string): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, any>[];
        const suggestedMapping = detectColumns(headers);
        const reviews = convertRowsToReviews(rows, suggestedMapping);

        resolve({
          reviews,
          totalRows: rows.length,
          validRows: reviews.length,
          skippedRows: rows.length - reviews.length,
          detectedHeaders: headers,
          suggestedMapping
        });
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
}

/**
 * 解析 JSON 字串
 */
export function parseJSON(jsonString: string): ParseResult {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err: any) {
    throw new Error(`JSON 格式錯誤：${err.message}`);
  }

  let rows: Record<string, any>[] = [];
  if (Array.isArray(parsed)) {
    rows = parsed;
  } else if (parsed && typeof parsed === 'object') {
    if (Array.isArray(parsed.reviews)) rows = parsed.reviews;
    else if (Array.isArray(parsed.data)) rows = parsed.data;
    else if (Array.isArray(parsed.items)) rows = parsed.items;
    else {
      // 嘗試將物件值視為單列
      rows = [parsed];
    }
  }

  if (rows.length === 0) {
    throw new Error('JSON 未包含任何可讀取的評論陣列 (需為陣列或包含 reviews/data 欄位)');
  }

  // 抓取第一列的鍵值作為 headers
  const headers = Object.keys(rows[0] || {});
  const suggestedMapping = detectColumns(headers);
  const reviews = convertRowsToReviews(rows, suggestedMapping);

  return {
    reviews,
    totalRows: rows.length,
    validRows: reviews.length,
    skippedRows: rows.length - reviews.length,
    detectedHeaders: headers,
    suggestedMapping
  };
}

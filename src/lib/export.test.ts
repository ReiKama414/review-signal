import { describe, it, expect } from 'vitest';
import { generateMarkdownReport } from './export';
import { Review, RatingStats, CategorySummary, TokenStat } from '@/types';

describe('Export Engine (Reports & Data Verification)', () => {
  it('should generate comprehensive Markdown report with KPIs and transparent ethics disclosure', () => {
    const dummyReviews: Review[] = [
      {
        id: '1',
        rating: 1,
        content: '閃退嚴重',
        category: '功能異常與閃退 (Bug & Crash)',
        sentiment: {
          score: -0.8,
          label: 'negative',
          method: 'rule_lexicon',
          evidence: [],
          positiveScore: 0,
          negativeScore: 1.2,
          summary: ''
        },
        tags: ['待修復'],
        date: '2026-10-25'
      }
    ];

    const ratingStats: RatingStats = {
      1: 1, 2: 0, 3: 0, 4: 0, 5: 0,
      total: 1,
      average: 1.0,
      median: 1,
      csat: 0,
      npsScore: -100
    };

    const categories: CategorySummary[] = [
      {
        category: '功能異常與閃退 (Bug & Crash)',
        count: 1,
        percentage: 100,
        avgRating: 1.0,
        positiveCount: 0,
        neutralCount: 0,
        negativeCount: 1,
        sampleReviews: ['閃退嚴重'],
        priority: 'critical'
      }
    ];

    const topKeywords: TokenStat[] = [
      {
        word: '閃退',
        count: 1,
        reviewCount: 1,
        percentage: 100,
        avgRating: 1.0,
        sentimentScore: -0.8,
        ngramType: 1
      }
    ];

    const report = generateMarkdownReport(dummyReviews, ratingStats, categories, topKeywords, '測試資料集');

    expect(report).toContain('Review Signal 評論研究與顧客之聲分析報告');
    expect(report).toContain('CSAT');
    expect(report).toContain('CRITICAL');
    expect(report).toContain('閃退');
    expect(report).toContain('絕不偽裝為未經微調之黑箱 AI 神經網路模型');
  });
});

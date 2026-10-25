import { describe, it, expect } from 'vitest';
import { classifyReviewRuleBased, calculateCategorySummaries } from './categories';
import { Review } from '@/types';

describe('Issue Category & Priority Matrix Engine', () => {
  it('should classify bug & crash reviews accurately by keywords', () => {
    const text = '每次滑到主頁就直接黑屏當機卡死';
    const result = classifyReviewRuleBased(text);

    expect(result.category).toContain('Bug & Crash');
    expect(result.matchedKeywords).toContain('當機');
    expect(result.matchedKeywords).toContain('黑屏');
  });

  it('should classify delivery and logistics reviews', () => {
    const text = '外送員態度差，湯麵全部外漏灑出，餐點完全冷掉';
    const result = classifyReviewRuleBased(text);

    expect(result.category).toContain('Delivery');
  });

  it('should calculate priority matrix: high volume & low rating yields critical priority', () => {
    const criticalReviews: Review[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `crit-${i}`,
      rating: 1,
      content: '閃退無法登入',
      category: '功能異常與閃退 (Bug & Crash)',
      sentiment: {
        score: -0.8,
        label: 'negative',
        method: 'rule_lexicon',
        evidence: [],
        positiveScore: 0,
        negativeScore: 1.0,
        summary: ''
      },
      tags: [],
      date: '2026-10-25'
    }));

    const summaries = calculateCategorySummaries(criticalReviews);
    const bugCategory = summaries.find(s => s.category.includes('Bug & Crash'));

    expect(bugCategory).toBeDefined();
    expect(bugCategory?.avgRating).toBe(1.0);
    expect(bugCategory?.priority).toBe('critical');
  });
});

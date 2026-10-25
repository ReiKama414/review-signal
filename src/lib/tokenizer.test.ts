import { describe, it, expect } from 'vitest';
import { tokenizeText, generateNgrams, extractTokenStats } from './tokenizer';
import { Review } from '@/types';

describe('Tokenizer & N-gram Engine', () => {
  it('should segment Chinese text and preserve domain compound terms', () => {
    const text = '更新後一直閃退，客服人員都沒回覆，太爛了！';
    const tokens = tokenizeText(text);

    // Should include compound terms like 閃退, 客服人員
    expect(tokens).toContain('閃退');
    expect(tokens).toContain('客服人員');
    // Should filter out common stopwords like 的, 了, 在
    expect(tokens).not.toContain('了');
  });

  it('should filter custom stopwords', () => {
    const customStopwords = new Set(['閃退', '更新']);
    const text = '更新後一直閃退，客服人員服務很好';
    const tokens = tokenizeText(text, customStopwords);

    expect(tokens).not.toContain('閃退');
    expect(tokens).not.toContain('更新');
    expect(tokens).toContain('客服人員');
  });

  it('should generate accurate 1-gram, 2-gram, and 3-gram sequences', () => {
    const tokens = ['出貨', '速度', '超快', '品質', '良好'];

    const unigrams = generateNgrams(tokens, 1);
    expect(unigrams).toEqual(tokens);

    const bigrams = generateNgrams(tokens, 2);
    expect(bigrams).toHaveLength(4);
    expect(bigrams[0]).toBe('出貨 速度');
    expect(bigrams[1]).toBe('速度 超快');

    const trigrams = generateNgrams(tokens, 3);
    expect(trigrams).toHaveLength(3);
    expect(trigrams[0]).toBe('出貨 速度 超快');
    expect(trigrams[2]).toBe('超快 品質 良好');
  });

  it('should extract token statistics across reviews with sentiment and ratings', () => {
    const dummyReviews: Review[] = [
      {
        id: '1',
        rating: 1,
        content: '更新後一直閃退，太爛了',
        category: '功能異常',
        sentiment: {
          score: -0.8,
          label: 'negative',
          method: 'rule_lexicon',
          evidence: [],
          positiveScore: 0,
          negativeScore: 1.2,
          summary: '負面'
        },
        tags: [],
        date: '2026-10-25'
      },
      {
        id: '2',
        rating: 2,
        content: '每次打開就閃退，等很久',
        category: '功能異常',
        sentiment: {
          score: -0.6,
          label: 'negative',
          method: 'rule_lexicon',
          evidence: [],
          positiveScore: 0,
          negativeScore: 1.0,
          summary: '負面'
        },
        tags: [],
        date: '2026-10-25'
      }
    ];

    const stats = extractTokenStats(dummyReviews, 1, 10);
    const crashStat = stats.find(s => s.word === '閃退');

    expect(crashStat).toBeDefined();
    expect(crashStat?.reviewCount).toBe(2);
    expect(crashStat?.avgRating).toBe(1.5); // (1 + 2) / 2
    expect(crashStat?.sentimentScore).toBe(-0.7); // (-0.8 + -0.6) / 2
  });
});

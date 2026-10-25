import { describe, it, expect } from 'vitest';
import { analyzeSentimentRuleBased } from './sentiment';
import { tokenizeText } from './tokenizer';

describe('Sentiment Analysis Rule-Based Engine (No Fake AI)', () => {
  it('should evaluate positive reviews with high score and positive evidence', () => {
    const text = '商品品質好，出貨速度超快，非常滿意！';
    const tokens = tokenizeText(text);
    const result = analyzeSentimentRuleBased(tokens, text);

    expect(result.method).toBe('rule_lexicon');
    expect(result.label).toBe('positive');
    expect(result.score).toBeGreaterThan(0.2);
    expect(result.positiveScore).toBeGreaterThan(0);
    expect(result.evidence.length).toBeGreaterThan(0);
  });

  it('should evaluate negative reviews with negative polarity and crash evidence', () => {
    const text = '更新後一直閃退，太爛了，根本無法使用！';
    const tokens = tokenizeText(text);
    const result = analyzeSentimentRuleBased(tokens, text);

    expect(result.method).toBe('rule_lexicon');
    expect(result.label).toBe('negative');
    expect(result.score).toBeLessThan(-0.2);
    expect(result.negativeScore).toBeGreaterThan(0);
  });

  it('should apply negation modifier inversion correctly (不好用 -> negative)', () => {
    const text = '這個功能不好用';
    const tokens = ['不', '好用'];
    const result = analyzeSentimentRuleBased(tokens, text);

    // "好用" is positive, but "不" negates it to negative
    expect(result.negativeScore).toBeGreaterThan(0);
    const negationEvidence = result.evidence.find(e => e.type === 'negation');
    expect(negationEvidence).toBeDefined();
    expect(negationEvidence?.explanation).toContain('翻轉');
  });

  it('should apply intensifier multipliers correctly (超爛 > 爛)', () => {
    const baseText = '爛';
    const baseResult = analyzeSentimentRuleBased(['爛'], baseText);

    const intenseText = '超爛';
    const intenseResult = analyzeSentimentRuleBased(['超', '爛'], intenseText);

    expect(intenseResult.negativeScore).toBeGreaterThan(baseResult.negativeScore);
  });

  it('should remain bounded within [-1.0, 1.0]', () => {
    const extremeNegative = '極度超爛崩潰當機死機黑屏無法登入詐騙黑心垃圾';
    const tokens = tokenizeText(extremeNegative);
    const result = analyzeSentimentRuleBased(tokens, extremeNegative);

    expect(result.score).toBeGreaterThanOrEqual(-1.0);
    expect(result.score).toBeLessThanOrEqual(1.0);
  });
});

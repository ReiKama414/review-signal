import { describe, it, expect } from 'vitest';
import { parseCSV, parseJSON, detectColumns } from './parser';

describe('Data Parser Engine (CSV & JSON Robust Handling)', () => {
  it('should auto-detect common column headers in Traditional Chinese and English', () => {
    const headers = ['用戶ID', '評論內容', '評分星等', '建立時間', '問題分類'];
    const mapping = detectColumns(headers);

    expect(mapping.content).toBe('評論內容');
    expect(mapping.rating).toBe('評分星等');
    expect(mapping.date).toBe('建立時間');
    expect(mapping.category).toBe('問題分類');
  });

  it('should parse standard CSV with ratings and contents successfully', async () => {
    const csvData = `id,rating,content,date\n1,5,"出貨速度超快，滿意！",2026-10-25\n2,1,"閃退卡死無法結帳",2026-10-24`;
    const result = await parseCSV(csvData);

    expect(result.validRows).toBe(2);
    expect(result.reviews[0].rating).toBe(5);
    expect(result.reviews[0].content).toContain('出貨速度超快');
    expect(result.reviews[1].rating).toBe(1);
    expect(result.reviews[1].sentiment.label).toBe('negative');
  });

  it('should normalize out-of-bound ratings (e.g., 10-star to 5-star)', async () => {
    const csvData = `id,rating,content\n1,10,"非常推薦的好產品"\n2,-2,"糟糕透頂"`;
    const result = await parseCSV(csvData);

    expect(result.validRows).toBe(2);
    expect(result.reviews[0].rating).toBe(5); // 10 clamped/normalized to 5
    expect(result.reviews[1].rating).toBe(1); // negative clamped to 1
  });

  it('should skip rows with empty content and report skipped count', async () => {
    const csvData = `id,rating,content\n1,5,""\n2,4,"   "\n3,5,"有效評論"`;
    const result = await parseCSV(csvData);

    expect(result.validRows).toBe(1);
    expect(result.skippedRows).toBe(2);
  });

  it('should parse JSON array and nested reviews object', () => {
    const jsonArray = JSON.stringify([
      { id: 'j-1', score: 5, comment: '介面設計優雅' }
    ]);
    const res1 = parseJSON(jsonArray);
    expect(res1.validRows).toBe(1);
    expect(res1.reviews[0].rating).toBe(5);

    const jsonNested = JSON.stringify({
      reviews: [
        { id: 'j-2', stars: 2, review: '連線常常中斷' }
      ]
    });
    const res2 = parseJSON(jsonNested);
    expect(res2.validRows).toBe(1);
    expect(res2.reviews[0].rating).toBe(2);
  });

  it('should throw descriptive error on malformed JSON', () => {
    expect(() => parseJSON('{ invalid json text')).toThrow(/JSON 格式錯誤/);
  });

  it('should throw error on empty JSON structure', () => {
    expect(() => parseJSON('[]')).toThrow(/未包含任何可讀取的評論陣列/);
  });
});

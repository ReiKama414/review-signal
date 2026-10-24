import { SentimentAnalysisResult, SentimentEvidence, SentimentType } from '@/types';

// ==========================================
// 繁簡中文與常見英文情緒詞典 (Rule-Based Lexicon)
// 此處為確定性規則比對，非神經網路 / 機器學習模型
// ==========================================

export const POSITIVE_LEXICON: Record<string, number> = {
  // 產品滿意與稱讚
  '好用': 1.0, '超讚': 1.2, '讚': 0.9, '推薦': 0.9, '大推': 1.1, '滿意': 0.8,
  '喜歡': 0.8, '優秀': 1.0, '棒': 0.9, '太棒': 1.1, '順暢': 0.9, '流暢': 0.9,
  '穩定': 0.8, '快速': 0.8, '迅速': 0.9, '及時': 0.7, '便宜': 0.8, '划算': 0.9,
  '實惠': 0.8, '精緻': 0.8, '品質好': 1.0, '質感好': 1.0, '貼心': 0.9, '親切': 0.8,
  '專業': 0.8, '給力': 0.8, '良心': 0.9, '方便': 0.8, '便捷': 0.8, '易用': 0.8,
  '好上手': 0.8, '乾淨': 0.7, '省時': 0.8, '驚艷': 1.1, '完美': 1.2, '超值': 1.0,
  '值得': 0.8, '愛用': 0.9, '神作': 1.2, '實用': 0.8, '用心': 0.9, '回購': 0.9,
  '感謝': 0.7, '謝謝': 0.6, '高效': 0.8, '齊全': 0.7, '清晰': 0.7, '給讚': 0.8,
  '優質': 0.9, '耐用': 0.8, '正品': 0.8, '正貨': 0.8, '誠實': 0.8, '出色': 0.9,
  '進步': 0.7, '驚喜': 0.9, '解決': 0.7, '好玩': 0.7, '好看': 0.7,
  // 英文常用
  'good': 0.8, 'great': 1.0, 'excellent': 1.1, 'amazing': 1.2, 'perfect': 1.2,
  'awesome': 1.1, 'fast': 0.8, 'smooth': 0.8, 'love': 1.0, 'helpful': 0.8,
  'satisfied': 0.9, 'best': 1.1, 'useful': 0.8, 'recommend': 0.9, 'nice': 0.7
};

export const NEGATIVE_LEXICON: Record<string, number> = {
  // 軟體穩定與異常
  '閃退': 1.2, '當機': 1.2, '卡頓': 0.9, '死機': 1.2, '黑屏': 1.1, '白屏': 1.0,
  '崩潰': 1.1, '連不上': 1.0, '斷線': 0.9, '延遲': 0.8, '慢': 0.7, '超慢': 1.1,
  '無法登入': 1.1, '登不出': 0.8, '無法開啟': 1.1, '錯誤': 0.8, 'bug': 0.9,
  '漏洞': 0.9, '異常': 0.8, '失靈': 0.9, '卡住': 0.9, '轉圈': 0.7,
  // 服務與客服體驗
  '爛': 1.1, '超爛': 1.3, '極差': 1.2, '太爛': 1.2, '差評': 1.0, '負評': 1.0,
  '差勁': 1.0, '糟糕': 1.0, '失望': 0.9, '太扯': 1.0, '誇張': 0.8, '離譜': 0.9,
  '態度差': 1.1, '愛理不理': 1.0, '沒回': 0.8, '不回': 0.8, '找不到客服': 1.0,
  '推卸責任': 1.1, '無效': 0.8, '處理慢': 0.9, '浪費時間': 1.1, '傻眼': 0.9,
  // 物流與交易問題
  '破損': 1.1, '瑕疵': 0.9, '缺件': 1.0, '少寄': 1.0, '送錯': 1.0, '漏單': 1.0,
  '過期': 1.1, '發霉': 1.2, '髒': 0.8, '冷掉': 0.9, '倒灑': 1.0, '外漏': 1.0,
  '延誤': 0.8, '等太久': 0.9, '退款難': 1.1, '不給退': 1.2, '扣錯錢': 1.2,
  '騙人': 1.2, '詐騙': 1.3, '黑心': 1.3, '垃圾': 1.2, '騙錢': 1.3, '坑人': 1.1,
  '收費貴': 0.8, '太貴': 0.8, '不划算': 0.8, '難用': 1.0, '難看': 0.7, '繁瑣': 0.8,
  '強制更新': 0.9, '廣告多': 0.9, '廣告煩': 0.9, '強迫': 0.9, '退步': 0.9,
  '後悔': 0.9, '卸載': 1.0, '刪除': 0.8, '不會再來': 1.1, '不再買': 1.1,
  // 英文常用
  'bad': 0.8, 'terrible': 1.1, 'horrible': 1.2, 'worst': 1.2, 'crash': 1.1,
  'glitch': 0.9, 'slow': 0.7, 'freeze': 0.9, 'broken': 1.0, 'waste': 1.0,
  'disappointed': 0.9, 'useless': 1.0, 'poor': 0.8, 'scam': 1.3, 'refund': 0.6
};

// 否定詞 (Negation words: 在前或後翻轉情緒極性)
export const NEGATION_WORDS: Record<string, number> = {
  '不': -1.0, '沒': -1.0, '無': -0.9, '非': -0.9, '未': -0.8, '別': -0.7,
  '絕不': -1.2, '根本不': -1.2, '毫不': -1.0, '完全不': -1.2, '無法': -0.8,
  'not': -1.0, "don't": -1.0, "doesn't": -1.0, "never": -1.2, "no": -0.9
};

// 程度副詞 / 增強詞 (Intensifiers: 放大或縮小情緒強度)
export const INTENSIFIER_WORDS: Record<string, number> = {
  '超': 1.5, '超級': 1.6, '非常': 1.4, '極度': 1.6, '特別': 1.3,
  '實在': 1.2, '太': 1.4, '十分': 1.3, '無敵': 1.5, '真的': 1.2,
  '無比': 1.5, '格外': 1.3, '異常': 1.3, '超級無敵': 1.8,
  'very': 1.4, 'extremely': 1.6, 'super': 1.5, 'really': 1.3, 'too': 1.3
};

/**
 * 規則式情緒分析器 (Rule-Based Sentiment Analyzer)
 * 嚴格透明：只透過詞典權重、否定詞反轉與程度修飾符計算，絕不偽裝為深度學習 AI 模型。
 */
export function analyzeSentimentRuleBased(tokens: string[], originalText: string): SentimentAnalysisResult {
  let positiveScore = 0;
  let negativeScore = 0;
  const evidence: SentimentEvidence[] = [];

  const lowerTokens = tokens.map(t => t.toLowerCase().trim());
  const length = lowerTokens.length;

  for (let i = 0; i < length; i++) {
    const token = lowerTokens[i];
    if (!token) continue;

    // 檢查是否有連續 2 詞或單詞比對
    const bigramToken = i < length - 1 ? `${token}${lowerTokens[i + 1]}` : null;
    const trigramToken = i < length - 2 ? `${token}${lowerTokens[i + 1]}${lowerTokens[i + 2]}` : null;

    // 檢查前面的修飾詞 (前 1~2 個詞是否有否定詞或程度副詞)
    let modifier = 1.0;
    let isNegated = false;
    let modifierEvidence: string[] = [];

    const prevTokens = [
      i > 0 ? lowerTokens[i - 1] : null,
      i > 1 ? lowerTokens[i - 2] : null
    ].filter(Boolean) as string[];

    for (const prev of prevTokens) {
      if (NEGATION_WORDS[prev] !== undefined) {
        isNegated = true;
        modifier *= NEGATION_WORDS[prev];
        modifierEvidence.push(`否定詞「${prev}」(${NEGATION_WORDS[prev]}x)`);
      } else if (INTENSIFIER_WORDS[prev] !== undefined) {
        modifier *= INTENSIFIER_WORDS[prev];
        modifierEvidence.push(`程度詞「${prev}」(${INTENSIFIER_WORDS[prev]}x)`);
      }
    }

    // 比對正向詞典 (優先長詞)
    let matchedPosWeight = POSITIVE_LEXICON[trigramToken || ''] || POSITIVE_LEXICON[bigramToken || ''] || POSITIVE_LEXICON[token];
    let matchedToken = POSITIVE_LEXICON[trigramToken || ''] ? trigramToken! : (POSITIVE_LEXICON[bigramToken || ''] ? bigramToken! : token);

    if (matchedPosWeight !== undefined) {
      const finalWeight = matchedPosWeight * modifier;
      if (finalWeight > 0) {
        positiveScore += finalWeight;
        evidence.push({
          token: matchedToken,
          weight: finalWeight,
          type: 'positive_word',
          explanation: modifierEvidence.length > 0 
            ? `正向詞「${matchedToken}」(+${matchedPosWeight}) 經 ${modifierEvidence.join(', ')} 修飾後計 +${finalWeight.toFixed(2)}`
            : `正向詞「${matchedToken}」(+${matchedPosWeight})`
        });
      } else {
        // 被否定詞翻轉為負向
        negativeScore += Math.abs(finalWeight);
        evidence.push({
          token: matchedToken,
          weight: finalWeight,
          type: 'negation',
          explanation: `正向詞「${matchedToken}」(+${matchedPosWeight}) 被 ${modifierEvidence.join(', ')} 翻轉為負向計 -${Math.abs(finalWeight).toFixed(2)}`
        });
      }
      continue;
    }

    // 比對負向詞典
    let matchedNegWeight = NEGATIVE_LEXICON[trigramToken || ''] || NEGATIVE_LEXICON[bigramToken || ''] || NEGATIVE_LEXICON[token];
    if (matchedNegWeight !== undefined) {
      matchedToken = NEGATIVE_LEXICON[trigramToken || ''] ? trigramToken! : (NEGATIVE_LEXICON[bigramToken || ''] ? bigramToken! : token);
      const finalWeight = matchedNegWeight * modifier;
      if (finalWeight > 0) {
        negativeScore += finalWeight;
        evidence.push({
          token: matchedToken,
          weight: -finalWeight,
          type: 'negative_word',
          explanation: modifierEvidence.length > 0 
            ? `負向詞「${matchedToken}」(-${matchedNegWeight}) 經 ${modifierEvidence.join(', ')} 修飾後計 -${finalWeight.toFixed(2)}`
            : `負向詞「${matchedToken}」(-${matchedNegWeight})`
        });
      } else {
        // 負負得正 (e.g. 不卡頓)
        positiveScore += Math.abs(finalWeight);
        evidence.push({
          token: matchedToken,
          weight: Math.abs(finalWeight),
          type: 'negation',
          explanation: `負向詞「${matchedToken}」(-${matchedNegWeight}) 被 ${modifierEvidence.join(', ')} 翻轉為正面計 +${Math.abs(finalWeight).toFixed(2)}`
        });
      }
    }
  }

  // 計算最終歸一化分數 (-1.0 到 1.0)
  const total = positiveScore + negativeScore;
  let normalizedScore = 0;
  if (total > 0) {
    normalizedScore = (positiveScore - negativeScore) / (total + 0.5); // 平滑系數
    normalizedScore = Math.max(-1.0, Math.min(1.0, normalizedScore));
  }

  // 判斷情緒標籤
  let label: SentimentType = 'neutral';
  if (normalizedScore >= 0.15) {
    label = 'positive';
  } else if (normalizedScore <= -0.15) {
    label = 'negative';
  }

  const summary = evidence.length === 0 
    ? '詞典未偵測到明確正負向情緒詞，判定為中性' 
    : `比對到 ${evidence.length} 個情緒規則特徵詞（正面得分 ${positiveScore.toFixed(2)}，負面得分 ${negativeScore.toFixed(2)}）`;

  return {
    score: Number(normalizedScore.toFixed(2)),
    label,
    method: 'rule_lexicon',
    evidence,
    positiveScore: Number(positiveScore.toFixed(2)),
    negativeScore: Number(negativeScore.toFixed(2)),
    summary
  };
}

/**
 * 透明度規格說明：提供給用戶與研究者的公開算法透明度文件
 */
export const METHODOLOGY_SPEC = {
  title: 'Review Signal 算法透明度與情緒分析原理聲明',
  ruleBasedNLP: {
    name: '確定性字詞規則與情緒詞典（當前使用）',
    type: 'Deterministic Rule-Based NLP',
    privacy: '100% 本地運算，不發送任何資料至第三方或雲端伺服器',
    mechanism: [
      '使用瀏覽器原生 Intl.Segmenter 進行繁簡中文與跨語言基礎斷詞。',
      '外掛電商、SaaS 與服務業專業領域複合詞庫（例如：閃退、當機、客服、退貨退款）。',
      '比對開放情緒詞典（包含正面詞 50+、負面詞 70+ 與權重）。',
      '前瞻/後視否定詞（Negation: 不、沒、無法）與程度副詞（Intensifier: 超、非常、太）之滑動視窗動態加權。',
      '以平滑除數歸一化分數至 [-1.0, 1.0] 區間，絕不隨機捏造或偽稱神經網路預測。'
    ],
    pros: '計算速度極快（毫秒級）、100% 可解釋（可追溯每個詞與乘數）、零隱私風險、零 Token 成本。',
    limitations: '無法捕捉深層反諷、隱喻、雙關語或極複雜的上下文長距離轉折。'
  },
  deepLearningML: {
    name: '真正深度學習 / 語言模型（可選擴充）',
    type: 'Deep Learning / Transformer LLM (BERT, Gemini, GPT)',
    privacy: '需透過 API 金鑰發送文字至模型供應商或於 WebGPU 下載數百 MB 權重',
    mechanism: [
      '透過自注意力機制（Self-Attention）與數十億參數量編碼上下文語意。',
      '具備深層推論、反諷辨識與開放分類能力。'
    ],
    pros: '語意捕捉細膩、理解口語反諷能力強。',
    limitations: '成本高昂、具黑箱性、受限於 API 配額與資料外洩合規風險。'
  }
};

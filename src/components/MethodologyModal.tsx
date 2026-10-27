import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  Check, 
} from 'lucide-react';
import { analyzeSentimentRuleBased } from '@/lib/sentiment';
import { tokenizeText } from '@/lib/tokenizer';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
  const [sandboxInput, setSandboxInput] = useState('退貨流程超快而且客服態度親切，完全不卡頓！');
  const [activeTab, setActiveTab] = useState<'comparison' | 'formula' | 'sandbox'>('comparison');

  if (!isOpen) return null;

  // 實時在沙盒中執行規則分析
  const testTokens = tokenizeText(sandboxInput);
  const testResult = analyzeSentimentRuleBased(testTokens, sandboxInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-4xl max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-start space-x-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5 break-words">
                <span>演算法透明度與科學倫理聲明</span>
                <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                  拒絕偽裝 AI
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 break-words mt-0.5">
                清楚區分字詞規則與真正神經網路模型，確保資料 100% 本地運算與可解釋性
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-4 sm:px-6 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'comparison'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            規則分析 vs 真正 AI 模型對比
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'formula'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            數學計分公式與滑動視窗
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'sandbox'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            實時透明沙盒測試
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-700 dark:text-slate-300 text-xs sm:text-sm min-w-0">
          
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              
              {/* Core Ethical Statement */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 flex items-start space-x-2.5 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-900 dark:text-amber-300">為什麼 Review Signal 堅持不隨意標籤為「AI」？</strong>
                  <p className="mt-0.5 text-amber-800/90 dark:text-amber-200/90">
                    許多商業軟體將簡單的情緒關鍵字詞典包裝為「先進生成式 AI」或「深度神經網路情感分析」。Review Signal 恪守研究工具的客觀誠信原則：明確標示本平台為「<strong>確定性規則詞典 (Rule-Based NLP)</strong>」，提供毫秒級運算、100% 隱私與可完整稽核的證據鏈。
                  </p>
                </div>
              </div>

              {/* Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* Rule-Based (Current) */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        當前使用中
                      </span>
                      <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-0.5">
                      確定性字詞規則與情感詞典
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      Deterministic Lexicon & Pattern Matching
                    </p>

                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>100% 本地隱私</strong>：所有斷詞與計分在瀏覽器端 IndexedDB 記憶體完成，文字絕不外傳。</span>
                      </li>
                      <li className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>毫秒級處理</strong>：千筆評論斷詞與分類在數十毫秒內完成，零 API 延遲與 Token 費用。</span>
                      </li>
                      <li className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>完全可解釋</strong>：精確指出是因為哪一個詞組、否定修飾詞或倍率得出此得分。</span>
                      </li>
                      <li className="flex items-start space-x-1.5 text-slate-500">
                        <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                        <span><strong>限制</strong>：無法判讀深層反諷、高難度雙關語或極複雜的長篇暗喻。</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                    採用標準：Intl.Segmenter + 繁中領域複合詞典 + NTUSD 情感詞典改編
                  </div>
                </div>

                {/* True Deep Learning / ML (Comparison) */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-indigo-300 dark:border-indigo-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                        理論對比架構
                      </span>
                      <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-0.5">
                      真正深度學習 / 語言模型 (LLM)
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                      Transformer-based Neural Networks (BERT / Gemini / GPT)
                    </p>

                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong>語意推論強大</strong>：透過自注意力機制（Attention）理解上下文、長篇語境與口語反詰。</span>
                      </li>
                      <li className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                        <span><strong>開放分類能力</strong>：能根據複雜自訂提示直接進行歸因與意圖推論。</span>
                      </li>
                      <li className="flex items-start space-x-1.5 text-slate-500">
                        <span className="text-rose-500 shrink-0 mt-0.5">⚠️</span>
                        <span><strong>隱私與成本</strong>：需外連雲端 API 消耗費用，或於本機下載數百 MB 龐大模型權重。</span>
                      </li>
                      <li className="flex items-start space-x-1.5 text-slate-500">
                        <span className="text-rose-500 shrink-0 mt-0.5">⚠️</span>
                        <span><strong>黑箱不可釋</strong>：輸出結果為機率分佈，難以給出確定性的單詞權重數學證明。</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500">
                    若需深度語意理解，可匯出資料後接入真正的大模型，本平台絕不虛構或謊稱本地規則為神經網路。
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'formula' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">情緒計分數學公式</h3>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 font-mono text-xs border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300 leading-relaxed overflow-x-auto">
                <p className="text-slate-500 dark:text-slate-400 mb-1.5">// 歸一化分數計算公式 (平滑雙曲系數)</p>
                <p>Total = PositiveScore + NegativeScore</p>
                <p>NormalizedScore = (PositiveScore - NegativeScore) / (Total + 0.5)</p>
                <p>Range = [-1.0, +1.0]</p>
                <p className="text-slate-500 dark:text-slate-400 mt-2">// 判定閾值：</p>
                <p>Score ≥ +0.15 → 正面 (Positive)</p>
                <p>Score ≤ -0.15 → 負面 (Negative)</p>
                <p>其他 → 中性 (Neutral)</p>
              </div>

              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mt-3">
                滑動修飾詞視窗機制 (Context Window)
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                當掃描到正向或負向核心詞彙時，演算法會向前檢視前 2 個 Token 的修飾關係：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">否定翻轉 (Negation)：</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    若前方出現「不、沒、無、未、無法」，權重乘以 -1.0。例如：「好用 (+1.0)」→「不好用 (-1.0)」。
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">程度放大 (Intensifier)：</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    若前方出現「超、非常、極度、太、無比」，權重乘以 1.4 ~ 1.6。例如：「超爛 (-1.1 × 1.5 = -1.65)」。
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sandbox' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  輸入測試語句，實時查看斷詞與確定性規則評分：
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={sandboxInput}
                    onChange={(e) => setSandboxInput(e.target.value)}
                    placeholder="輸入一句評論測試..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => setSandboxInput('雙十一物流超慢而且包裝破損，但客服處理得很迅速。')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-200 shrink-0"
                  >
                    示範語句
                  </button>
                </div>
              </div>

              {/* Sandbox Analysis Result */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-1 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">分詞結果 (Tokens)：</span>
                  <div className="flex flex-wrap gap-1">
                    {testTokens.map((tok, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                        {tok}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">規則綜合得分：</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-base font-bold ${
                      testResult.label === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
                      testResult.label === 'negative' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
                    }`}>
                      {testResult.score > 0 ? `+${testResult.score}` : testResult.score}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      testResult.label === 'positive' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                      testResult.label === 'negative' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {testResult.label === 'positive' ? '正面' :
                       testResult.label === 'negative' ? '負面' : '中性'}
                    </span>
                  </div>
                </div>

                {/* Evidence Chain */}
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">比對到的詞典規則證據鏈：</span>
                  {testResult.evidence.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">未偵測到明確規則特徵詞。</p>
                  ) : (
                    <div className="space-y-1">
                      {testResult.evidence.map((ev, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-slate-700 dark:text-slate-300 break-words flex-1 pr-2">{ev.explanation}</span>
                          <span className={`font-mono font-semibold shrink-0 ${
                            ev.weight > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {ev.weight > 0 ? `+${ev.weight.toFixed(2)}` : ev.weight.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span className="truncate">遵循負責任客觀研究原則</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            我瞭解了
          </button>
        </div>

      </div>
    </div>
  );
};

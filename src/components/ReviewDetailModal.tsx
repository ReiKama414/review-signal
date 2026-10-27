import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Review } from '@/types';
import { PRESET_CATEGORIES } from '@/lib/categories';

interface ReviewDetailModalProps {
  review: Review | null;
  onClose: () => void;
  onUpdateTags: (tags: string[]) => void;
  onUpdateCategory: (category: string) => void;
  onUpdateNotes: (notes: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export const ReviewDetailModal: React.FC<ReviewDetailModalProps> = ({
  review,
  onClose,
  onUpdateTags,
  onUpdateCategory,
  onUpdateNotes,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [notesInput, setNotesInput] = useState(review?.notes || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!review) return null;

  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (trimmed && !review.tags.includes(trimmed)) {
      onUpdateTags([...review.tags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(review.tags.filter(t => t !== tagToRemove));
  };

  const handleSaveNotes = () => {
    onUpdateNotes(notesInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const sentiment = review.sentiment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-3xl max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-start space-x-2.5 min-w-0">
            <div className="flex items-center space-x-0.5 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm shrink-0 mt-0.5">
              <span>{review.rating}</span>
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5 break-words">
                <span>評論深度研究與詞義特徵</span>
                <span className="font-mono text-[10px] text-slate-400">#{review.id}</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 break-words mt-0.5">
                發布於 {review.date} {review.author ? `• 作者：${review.author}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            {hasPrev && (
              <button
                onClick={onPrev}
                className="p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title="上一筆"
                aria-label="上一筆"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="p-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title="下一筆"
                aria-label="下一筆"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              aria-label="關閉"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 min-w-0">
          
          {/* Full Content */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              顧客原始評論內文
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed break-words">
              {review.content}
            </p>
          </div>

          {/* Tokens Breakdown */}
          {review.tokens && review.tokens.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                分詞結果 (Intl.Segmenter Tokens)：
              </span>
              <div className="flex flex-wrap gap-1">
                {review.tokens.map((token, i) => (
                  <span
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-mono"
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Calculation Tree & Evidence */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  確定性情感詞典計算證據 (Evidence Tree)
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                100% 透明無假 AI
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">判定標籤</span>
                <span className={`font-bold mt-0.5 block ${
                  sentiment.label === 'positive' ? 'text-emerald-600 dark:text-emerald-400' :
                  sentiment.label === 'negative' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'
                }`}>
                  {sentiment.label === 'positive' ? '正面 (Positive)' :
                   sentiment.label === 'negative' ? '負面 (Negative)' : '中性 (Neutral)'}
                </span>
              </div>

              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">綜合歸一化得分</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  {sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score}
                </span>
              </div>

              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">正向特徵合計</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
                  +{sentiment.positiveScore}
                </span>
              </div>

              <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">負向特徵合計</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">
                  -{sentiment.negativeScore}
                </span>
              </div>
            </div>

            {/* Evidence items */}
            {sentiment.evidence.length === 0 ? (
              <p className="text-xs text-slate-400 italic">
                詞典未偵測到明確的情感特徵詞，本則評語為中性基準 (0.00)。
              </p>
            ) : (
              <div className="space-y-1 pt-1">
                <span className="text-xs text-slate-600 dark:text-slate-400 block font-medium">特徵詞與修飾詞步驟：</span>
                {sentiment.evidence.map((ev, i) => (
                  <div 
                    key={i} 
                    className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-700 dark:text-slate-300 break-words flex-1 pr-2">{ev.explanation}</span>
                    <span className={`font-mono font-bold shrink-0 ${
                      ev.weight > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {ev.weight > 0 ? `+${ev.weight.toFixed(2)}` : ev.weight.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category & Tags Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                問題分類歸因 (Category)
              </label>
              <select
                value={review.category}
                onChange={(e) => onUpdateCategory(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {PRESET_CATEGORIES.map(c => (
                  <option key={c.category} value={c.category}>{c.category}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                手動標籤 (Manual Tags)
              </label>
              <div className="flex gap-1.5 mb-1.5">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="新增標籤..."
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 shrink-0"
                >
                  新增
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {review.tags.map(t => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-indigo-700 dark:text-indigo-300 flex items-center space-x-1"
                  >
                    <span>#{t}</span>
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-400 hover:text-rose-500"
                      aria-label={`移除標籤 ${t}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Researcher Notes */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                研究員質化筆記 (Researcher Annotation)
              </label>
              {isSaved && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                  ✓ 筆記已成功儲存
                </span>
              )}
            </div>
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              rows={2}
              placeholder="記錄訪談備註、根因推論（Root Cause）或跨部門指派行動..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="mt-1 flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
              >
                儲存筆記
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>標籤與筆記即時生效並支援匯出</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
          >
            關閉視窗
          </button>
        </div>

      </div>
    </div>
  );
};

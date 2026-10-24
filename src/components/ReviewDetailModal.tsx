import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Smile, 
  Frown, 
  Meh, 
  Tag, 
  Plus, 
  Edit3, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  MessageSquare,
  Smartphone,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm">
              <span>{review.rating}</span>
              <Star className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>評論深度研究與詞義特徵</span>
                <span className="font-mono text-xs text-slate-500">#{review.id}</span>
              </h2>
              <p className="text-xs text-slate-400">
                發布於 {review.date} {review.author ? `• 作者：${review.author}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Prev / Next navigation */}
            {hasPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                title="上一筆"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                title="下一筆"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Full Content */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              顧客原始評論內文 (Original Review)
            </span>
            <p className="text-sm text-slate-100 leading-relaxed font-sans">
              {review.content}
            </p>
          </div>

          {/* Tokens Breakdown */}
          {review.tokens && review.tokens.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                分詞結果 (Browser Intl.Segmenter Tokens)：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {review.tokens.map((token, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono"
                  >
                    {token}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Calculation Tree & Evidence */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">
                  確定性情感詞典計算證據 (Deterministic Evidence Tree)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% 透明無假 AI
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">判定標籤</span>
                <span className={`font-bold mt-0.5 block ${
                  sentiment.label === 'positive' ? 'text-emerald-400' :
                  sentiment.label === 'negative' ? 'text-rose-400' : 'text-slate-300'
                }`}>
                  {sentiment.label === 'positive' ? '正面 (Positive)' :
                   sentiment.label === 'negative' ? '負面 (Negative)' : '中性 (Neutral)'}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">綜合歸一化得分</span>
                <span className="font-bold text-white font-mono mt-0.5 block">
                  {sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">正向特徵權重合計</span>
                <span className="font-bold text-emerald-400 font-mono mt-0.5 block">
                  +{sentiment.positiveScore}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">負向特徵權重合計</span>
                <span className="font-bold text-rose-400 font-mono mt-0.5 block">
                  -{sentiment.negativeScore}
                </span>
              </div>
            </div>

            {/* Evidence items */}
            {sentiment.evidence.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                詞典未偵測到明確的情感特徵詞，本則評語得分為中性基準 (0.00)。
              </p>
            ) : (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs text-slate-400 block font-medium">特徵詞與修飾詞計算步驟：</span>
                {sentiment.evidence.map((ev, i) => (
                  <div 
                    key={i} 
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300">{ev.explanation}</span>
                    <span className={`font-mono font-bold ${
                      ev.weight > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {ev.weight > 0 ? `+${ev.weight.toFixed(2)}` : ev.weight.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category & Tags Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                問題分類歸因 (Category)
              </label>
              <select
                value={review.category}
                onChange={(e) => onUpdateCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {PRESET_CATEGORIES.map(c => (
                  <option key={c.category} value={c.category}>{c.category}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                手動標籤 (Manual Tags)
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="新增標籤..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500"
                >
                  新增
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {review.tags.map(t => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-indigo-300 flex items-center space-x-1"
                  >
                    <span>#{t}</span>
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="text-slate-500 hover:text-rose-400"
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-400">
                研究員質化筆記 (Researcher Annotation & Hypothesis)
              </label>
              {isSaved && (
                <span className="text-xs text-emerald-400 animate-in fade-in">
                  ✓ 筆記已成功儲存
                </span>
              )}
            </div>
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              rows={3}
              placeholder="記錄訪談備註、根因推論（Root Cause）或跨部門指派行動..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
            <div className="mt-1.5 flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                儲存筆記
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>所有標籤與筆記即時生效並支援匯出</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
          >
            關閉視窗
          </button>
        </div>

      </div>
    </div>
  );
};

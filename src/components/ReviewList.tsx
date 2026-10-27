import React, { useState } from 'react';
import { 
  Star, 
  Smile, 
  Frown, 
  Meh, 
  Tag, 
  Plus, 
  X, 
  Edit3, 
  CheckSquare, 
  Square,
  MessageSquare
} from 'lucide-react';
import { Review } from '@/types';
import { PRESET_CATEGORIES } from '@/lib/categories';

interface ReviewListProps {
  reviews: Review[];
  highlightToken?: string | null;
  onUpdateReviewTags: (reviewId: string, tags: string[]) => void;
  onUpdateReviewCategory: (reviewId: string, category: string) => void;
  onUpdateReviewNotes: (reviewId: string, notes: string) => void;
  onSelectReviewDetail: (review: Review) => void;
  selectedIds: Set<string>;
  onToggleSelectId: (reviewId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBatchAddTag: (tag: string) => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  highlightToken,
  onUpdateReviewTags,
  onUpdateReviewCategory,
  onSelectReviewDetail,
  selectedIds,
  onToggleSelectId,
  onSelectAll,
  onDeselectAll,
  onBatchAddTag,
}) => {
  const [addingTagId, setAddingTagId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [batchTagInput, setBatchTagInput] = useState('');
  const [showBatchTagInput, setShowBatchTagInput] = useState(false);

  const handleAddTagSubmit = (reviewId: string, currentTags: string[]) => {
    const trimmed = newTagInput.trim();
    if (trimmed && !currentTags.includes(trimmed)) {
      onUpdateReviewTags(reviewId, [...currentTags, trimmed]);
    }
    setNewTagInput('');
    setAddingTagId(null);
  };

  const handleRemoveTag = (reviewId: string, currentTags: string[], tagToRemove: string) => {
    onUpdateReviewTags(reviewId, currentTags.filter(t => t !== tagToRemove));
  };

  const handleBatchTagSubmit = () => {
    const trimmed = batchTagInput.trim();
    if (trimmed) {
      onBatchAddTag(trimmed);
      setBatchTagInput('');
      setShowBatchTagInput(false);
    }
  };

  // 關鍵字高亮工具
  const renderHighlightedContent = (text: string) => {
    if (!highlightToken || !highlightToken.trim()) return text;
    const parts = text.split(new RegExp(`(${highlightToken})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlightToken.toLowerCase() ? (
        <mark key={i} className="bg-amber-300 dark:bg-amber-500/80 text-slate-900 dark:text-black font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-2.5 min-w-0">
      
      {/* Batch Action Bar if any items selected */}
      {selectedIds.size > 0 && (
        <div className="sticky top-16 z-30 p-2.5 sm:p-3 rounded-xl bg-indigo-900 text-white border border-indigo-700 shadow-lg flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in max-w-full">
          <div className="flex items-center space-x-2">
            <span className="font-bold">已選取 {selectedIds.size} 則評論</span>
            <button
              onClick={onDeselectAll}
              className="text-indigo-200 hover:text-white underline ml-1"
            >
              取消選取
            </button>
          </div>

          <div className="flex items-center space-x-1.5">
            {showBatchTagInput ? (
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={batchTagInput}
                  onChange={(e) => setBatchTagInput(e.target.value)}
                  placeholder="標籤名稱..."
                  className="bg-indigo-950 border border-indigo-400 rounded px-2 py-1 text-xs text-white focus:outline-none w-28 sm:w-36"
                  onKeyDown={(e) => e.key === 'Enter' && handleBatchTagSubmit()}
                  autoFocus
                />
                <button
                  onClick={handleBatchTagSubmit}
                  className="px-2 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                >
                  套用
                </button>
                <button
                  onClick={() => setShowBatchTagInput(false)}
                  className="p-1 text-indigo-300 hover:text-white"
                  aria-label="取消"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowBatchTagInput(true)}
                className="px-2.5 py-1 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-500 flex items-center space-x-1"
              >
                <Tag className="w-3 h-3" />
                <span>批量打標</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Select All Row */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={selectedIds.size === reviews.length ? onDeselectAll : onSelectAll}
          className="flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          {selectedIds.size === reviews.length && reviews.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <Square className="w-4 h-4 text-slate-400 dark:text-slate-600" />
          )}
          <span>全選本頁 ({reviews.length})</span>
        </button>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          點選卡片可展開完整規則計分樹狀圖與筆記
        </span>
      </div>

      {/* Reviews Cards List */}
      {reviews.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400">
          <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">查無符合條件之評論</p>
          <p className="text-xs text-slate-500 mt-1">請嘗試放寬篩選條件或清除關鍵字搜尋</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {reviews.map((review) => {
            const isSelected = selectedIds.has(review.id);
            const sentiment = review.sentiment;

            return (
              <div
                key={review.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all min-w-0 ${
                  isSelected
                    ? 'bg-indigo-50/60 dark:bg-slate-900/90 border-indigo-500 dark:border-indigo-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Top Row: Checkbox, Stars, Category, Sentiment, Date */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleSelectId(review.id)}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5"
                      aria-label="選取評論"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Star Rating Badge */}
                    <div className="flex items-center space-x-0.5 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold shrink-0">
                      <span>{review.rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>

                    {/* Category Selector */}
                    <select
                      value={review.category}
                      onChange={(e) => onUpdateReviewCategory(review.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-xs text-slate-800 dark:text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[130px] sm:max-w-[180px] truncate"
                    >
                      {PRESET_CATEGORIES.map(c => (
                        <option key={c.category} value={c.category}>{c.category}</option>
                      ))}
                    </select>

                    {/* Sentiment Badge (Rule-Based Indicator) */}
                    <div
                      className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-medium border shrink-0 ${
                        sentiment.label === 'positive'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                          : sentiment.label === 'negative'
                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/30'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                      title={sentiment.summary}
                    >
                      {sentiment.label === 'positive' && <Smile className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />}
                      {sentiment.label === 'negative' && <Frown className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />}
                      {sentiment.label === 'neutral' && <Meh className="w-2.5 h-2.5 text-slate-400" />}
                      <span>
                        {sentiment.label === 'positive' ? '正向' :
                         sentiment.label === 'negative' ? '負向' : '中性'}
                      </span>
                      <span className="font-mono text-[9px] text-slate-400">
                        ({sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score})
                      </span>
                    </div>
                  </div>

                  {/* Metadata: Date, Author, Device */}
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono shrink-0 ml-auto">
                    {review.author && <span className="truncate max-w-[80px]">{review.author}</span>}
                    {review.device && (
                      <span className="hidden sm:inline bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                        {review.device}
                      </span>
                    )}
                    <span>{review.date}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div 
                  onClick={() => onSelectReviewDetail(review)}
                  className="cursor-pointer group/text py-1"
                >
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed group-hover/text:text-indigo-600 dark:group-hover/text:text-indigo-300 transition-colors break-words">
                    {renderHighlightedContent(review.content)}
                  </p>
                </div>

                {/* Sentiment Evidence Chips */}
                {sentiment.evidence.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="text-slate-400 text-[9px]">比對詞：</span>
                    {sentiment.evidence.map((ev, i) => (
                      <span
                        key={i}
                        className={`px-1 py-0.2 rounded font-mono text-[9px] border ${
                          ev.weight > 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                        }`}
                        title={ev.explanation}
                      >
                        {ev.token} ({ev.weight > 0 ? `+${ev.weight.toFixed(1)}` : ev.weight.toFixed(1)})
                      </span>
                    ))}
                  </div>
                )}

                {/* Manual Tags & Notes Row */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5">
                  
                  {/* Tags list */}
                  <div className="flex flex-wrap items-center gap-1 min-w-0">
                    {review.tags && review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] text-indigo-700 dark:text-indigo-300 flex items-center space-x-1"
                      >
                        <span className="truncate max-w-[100px]">#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(review.id, review.tags, tag)}
                          className="text-slate-400 hover:text-rose-500"
                          aria-label={`移除標籤 ${tag}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}

                    {/* Add Tag Inline Form */}
                    {addingTagId === review.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          placeholder="標籤..."
                          className="bg-slate-50 dark:bg-slate-950 border border-indigo-500 rounded px-1.5 py-0.5 text-[10px] text-slate-900 dark:text-white focus:outline-none w-20"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTagSubmit(review.id, review.tags);
                            if (e.key === 'Escape') setAddingTagId(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddTagSubmit(review.id, review.tags)}
                          className="px-1 py-0.5 bg-indigo-600 rounded text-[10px] text-white"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setAddingTagId(null)}
                          className="p-0.5 text-slate-400"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setAddingTagId(review.id);
                          setNewTagInput('');
                        }}
                        className="px-1.5 py-0.5 rounded border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 text-[10px] flex items-center space-x-0.5 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>標籤</span>
                      </button>
                    )}
                  </div>

                  {/* Researcher Note Preview & Detail Trigger */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {review.notes && (
                      <span className="text-amber-700 dark:text-amber-400/90 italic text-[10px] break-words max-w-[150px] sm:max-w-[220px]" title={review.notes}>
                        筆記：{review.notes}
                      </span>
                    )}

                    <button
                      onClick={() => onSelectReviewDetail(review)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 text-[11px] font-medium shrink-0"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>深入檢視</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

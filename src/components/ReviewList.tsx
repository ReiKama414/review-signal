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
  Smartphone, 
  Calendar, 
  CheckSquare, 
  Square,
  HelpCircle,
  ExternalLink,
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
  onUpdateReviewNotes,
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

  // 關鍵字高亮工具函式
  const renderHighlightedContent = (text: string) => {
    if (!highlightToken || !highlightToken.trim()) return text;
    const parts = text.split(new RegExp(`(${highlightToken})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === highlightToken.toLowerCase() ? (
        <mark key={i} className="bg-amber-400 text-slate-950 font-semibold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-3">
      
      {/* Batch Action Bar if any items selected */}
      {selectedIds.size > 0 && (
        <div className="sticky top-20 z-30 p-3 rounded-xl bg-indigo-950 border border-indigo-700 shadow-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center space-x-2 text-indigo-200">
            <span className="font-bold">已選取 {selectedIds.size} 則評論</span>
            <button
              onClick={onDeselectAll}
              className="text-slate-400 hover:text-white underline ml-2"
            >
              取消選取
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {showBatchTagInput ? (
              <div className="flex items-center space-x-1.5">
                <input
                  type="text"
                  value={batchTagInput}
                  onChange={(e) => setBatchTagInput(e.target.value)}
                  placeholder="輸入批量標籤名稱..."
                  className="bg-slate-900 border border-indigo-500 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleBatchTagSubmit()}
                  autoFocus
                />
                <button
                  onClick={handleBatchTagSubmit}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
                >
                  套用
                </button>
                <button
                  onClick={() => setShowBatchTagInput(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowBatchTagInput(true)}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 flex items-center space-x-1"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>批量加上手動標籤</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Select All Row */}
      <div className="flex items-center justify-between px-2 text-xs text-slate-400">
        <button
          onClick={selectedIds.size === reviews.length ? onDeselectAll : onSelectAll}
          className="flex items-center space-x-1.5 hover:text-white transition-colors"
        >
          {selectedIds.size === reviews.length && reviews.length > 0 ? (
            <CheckSquare className="w-4 h-4 text-indigo-400" />
          ) : (
            <Square className="w-4 h-4 text-slate-500" />
          )}
          <span>全選本頁評論 ({reviews.length})</span>
        </button>

        <span className="text-slate-500 text-[11px]">
          點選卡片可展開完整規則計分樹狀圖與研究員筆記
        </span>
      </div>

      {/* Reviews Cards List */}
      {reviews.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
          <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-300">查無符合條件之評論</p>
          <p className="text-xs text-slate-500 mt-1">請嘗試放寬篩選條件或清除關鍵字搜尋</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => {
            const isSelected = selectedIds.has(review.id);
            const sentiment = review.sentiment;

            return (
              <div
                key={review.id}
                className={`p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900/90 border-indigo-500 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                {/* Top Row: Checkbox, Stars, Category, Sentiment, Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center space-x-2.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleSelectId(review.id)}
                      className="text-slate-500 hover:text-indigo-400"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Star Rating Badge */}
                    <div className="flex items-center space-x-0.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                      <span>{review.rating}</span>
                      <Star className="w-3 h-3 fill-current" />
                    </div>

                    {/* Category Selector */}
                    <select
                      value={review.category}
                      onChange={(e) => onUpdateReviewCategory(review.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-950 border border-slate-800 rounded-md px-2 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[200px] truncate"
                    >
                      {PRESET_CATEGORIES.map(c => (
                        <option key={c.category} value={c.category}>{c.category}</option>
                      ))}
                    </select>

                    {/* Sentiment Badge (Rule-Based Indicator) */}
                    <div
                      className={`flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                        sentiment.label === 'positive'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : sentiment.label === 'negative'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                      title={sentiment.summary}
                    >
                      {sentiment.label === 'positive' && <Smile className="w-3 h-3 text-emerald-400" />}
                      {sentiment.label === 'negative' && <Frown className="w-3 h-3 text-rose-400" />}
                      {sentiment.label === 'neutral' && <Meh className="w-3 h-3 text-slate-400" />}
                      <span>
                        {sentiment.label === 'positive' ? '規則正向' :
                         sentiment.label === 'negative' ? '規則負向' : '中性'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        ({sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score})
                      </span>
                    </div>
                  </div>

                  {/* Metadata: Date, Author, Device */}
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                    {review.author && <span>{review.author}</span>}
                    {review.device && (
                      <span className="hidden sm:inline bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {review.device}
                      </span>
                    )}
                    <span>{review.date}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div 
                  onClick={() => onSelectReviewDetail(review)}
                  className="cursor-pointer group/text"
                >
                  <p className="text-sm text-slate-200 leading-relaxed group-hover/text:text-indigo-200 transition-colors">
                    {renderHighlightedContent(review.content)}
                  </p>
                </div>

                {/* Sentiment Evidence Chips */}
                {sentiment.evidence.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500 text-[10px]">詞典比對特徵：</span>
                    {sentiment.evidence.map((ev, i) => (
                      <span
                        key={i}
                        className={`px-1.5 py-0.2 rounded font-mono text-[10px] border ${
                          ev.weight > 0
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                            : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                        }`}
                        title={ev.explanation}
                      >
                        {ev.token} ({ev.weight > 0 ? `+${ev.weight.toFixed(1)}` : ev.weight.toFixed(1)})
                      </span>
                    ))}
                  </div>
                )}

                {/* Manual Tags & Notes Row */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Tags list */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {review.tags && review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-indigo-300 flex items-center space-x-1 group/tag"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => handleRemoveTag(review.id, review.tags, tag)}
                          className="text-slate-500 hover:text-rose-400"
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
                          placeholder="標籤名稱..."
                          className="bg-slate-950 border border-indigo-500 rounded px-2 py-0.5 text-xs text-white focus:outline-none w-24"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTagSubmit(review.id, review.tags);
                            if (e.key === 'Escape') setAddingTagId(null);
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleAddTagSubmit(review.id, review.tags)}
                          className="px-1.5 py-0.5 bg-indigo-600 rounded text-xs text-white"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setAddingTagId(null)}
                          className="p-0.5 text-slate-400 hover:text-white"
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
                        className="px-2 py-0.5 rounded-md border border-dashed border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-500 text-xs flex items-center space-x-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>標籤</span>
                      </button>
                    )}
                  </div>

                  {/* Researcher Note Preview & Detail Trigger */}
                  <div className="flex items-center space-x-2 text-xs">
                    {review.notes && (
                      <span className="text-amber-300/80 italic text-[11px] truncate max-w-[200px]" title={review.notes}>
                        筆記：{review.notes}
                      </span>
                    )}

                    <button
                      onClick={() => onSelectReviewDetail(review)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
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

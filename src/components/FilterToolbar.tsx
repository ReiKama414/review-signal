import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  ArrowUpDown, 
  Star, 
  Smile, 
  Frown, 
  Meh
} from 'lucide-react';
import { FilterState, SentimentType } from '@/types';

interface FilterToolbarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  availableTags: string[];
  availableCategories: string[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalCount,
  filteredCount,
  availableTags,
  availableCategories,
}) => {
  const isFiltered = 
    Boolean(filters.searchQuery) ||
    filters.ratings.length > 0 ||
    filters.sentiment.length > 0 ||
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    Boolean(filters.selectedToken);

  const toggleRating = (r: number) => {
    const next = filters.ratings.includes(r)
      ? filters.ratings.filter(x => x !== r)
      : [...filters.ratings, r];
    onFilterChange({ ratings: next });
  };

  const toggleSentiment = (s: SentimentType) => {
    const next = filters.sentiment.includes(s)
      ? filters.sentiment.filter(x => x !== s)
      : [...filters.sentiment, s];
    onFilterChange({ sentiment: next });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 shadow-sm space-y-3 transition-colors min-w-0">
      
      {/* Top Search & Sort Row */}
      <div className="toolbar-row justify-between gap-y-2">
        <div className="toolbar-field flex-1 min-w-0">
          <span className="toolbar-field-label text-slate-400 dark:text-slate-500">全文搜尋</span>
          <div className="relative toolbar-control-height">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
              placeholder="搜尋評論內文、作者、裝置或關鍵字..."
              className="toolbar-control-height w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-8 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded"
                aria-label="清除搜尋"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <div className="toolbar-field shrink-0 sm:min-w-[168px]">
          <span className="toolbar-field-label text-slate-400 dark:text-slate-500">排序方式</span>
          <div className="toolbar-control-height flex items-center gap-1.5">
            <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="toolbar-control-height w-full min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="date_desc">最新發布</option>
              <option value="date_asc">最早發布</option>
              <option value="rating_asc">評分由低至高</option>
              <option value="rating_desc">評分由高至低</option>
              <option value="sentiment_asc">負向優先</option>
              <option value="sentiment_desc">正向優先</option>
            </select>
          </div>
        </div>
      </div>

      {/* Multi-Select Filters Row */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs px-0.5">
        
        {/* Star Rating Pills */}
        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mr-0.5">星等：</span>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = filters.ratings.includes(star);
          return (
            <button
              key={star}
              onClick={() => toggleRating(star)}
              className={`px-1.5 py-0.5 rounded flex items-center space-x-0.5 border text-xs font-medium transition-all ${
                active
                  ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-300 dark:border-amber-500 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span>{star}</span>
              <Star className="w-2.5 h-2.5 fill-current text-amber-500" />
            </button>
          );
        })}

        <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Sentiment Pills */}
        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium mr-0.5">情緒：</span>
        {(['negative', 'neutral', 'positive'] as SentimentType[]).map((sent) => {
          const active = filters.sentiment.includes(sent);
          return (
            <button
              key={sent}
              onClick={() => toggleSentiment(sent)}
              className={`px-1.5 py-0.5 rounded flex items-center space-x-1 border text-xs font-medium transition-all ${
                active
                  ? sent === 'negative'
                    ? 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500 text-rose-800 dark:text-rose-300'
                    : sent === 'positive'
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-800 dark:text-slate-200'
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              {sent === 'negative' && <Frown className="w-3 h-3 text-rose-500" />}
              {sent === 'neutral' && <Meh className="w-3 h-3 text-slate-400" />}
              {sent === 'positive' && <Smile className="w-3 h-3 text-emerald-500" />}
              <span>{sent === 'negative' ? '負向' : sent === 'neutral' ? '中性' : '正向'}</span>
            </button>
          );
        })}

        <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

        {/* Category Dropdown Filter */}
        {availableCategories.length > 0 && (
          <select
            value={filters.categories[0] || ''}
            onChange={(e) => onFilterChange({ categories: e.target.value ? [e.target.value] : [] })}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 max-w-[140px] truncate"
          >
            <option value="">所有問題類別</option>
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        )}

        {/* Tag Dropdown Filter */}
        {availableTags.length > 0 && (
          <select
            value={filters.tags[0] || ''}
            onChange={(e) => onFilterChange({ tags: e.target.value ? [e.target.value] : [] })}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded px-2 py-0.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 max-w-[120px] truncate"
          >
            <option value="">所有標籤</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        )}

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="ml-auto px-2 py-0.5 rounded text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 transition-all flex items-center space-x-1"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>清除篩選</span>
          </button>
        )}

      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
        <div>
          當前篩選顯示：<strong className="text-slate-900 dark:text-white font-mono">{filteredCount}</strong> / {totalCount} 則評論
        </div>
      </div>

    </div>
  );
};

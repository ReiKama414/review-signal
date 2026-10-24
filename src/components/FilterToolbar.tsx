import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw, 
  Filter, 
  ArrowUpDown, 
  Star, 
  Smile, 
  Frown, 
  Meh, 
  Tag
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
      
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="搜尋評論內文、作者、裝置或關鍵字..."
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>排序：</span>
          </div>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="date_desc">最新發布 (日期降冪)</option>
            <option value="date_asc">最早發布 (日期升冪)</option>
            <option value="rating_asc">評分由低至高 (差評優先)</option>
            <option value="rating_desc">評分由高至低 (好評優先)</option>
            <option value="sentiment_asc">情緒最負向 (優先修復)</option>
            <option value="sentiment_desc">情緒最正向 (讚譽優先)</option>
          </select>
        </div>

      </div>

      {/* Multi-Select Filters Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80 text-xs">
        
        {/* Star Rating Pills */}
        <span className="text-slate-400 text-[11px] font-medium mr-1">星等：</span>
        {[1, 2, 3, 4, 5].map((star) => {
          const active = filters.ratings.includes(star);
          return (
            <button
              key={star}
              onClick={() => toggleRating(star)}
              className={`px-2 py-1 rounded-lg flex items-center space-x-1 border font-medium transition-all ${
                active
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current text-amber-400" />
            </button>
          );
        })}

        <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

        {/* Sentiment Pills */}
        <span className="text-slate-400 text-[11px] font-medium mr-1">情緒：</span>
        {(['negative', 'neutral', 'positive'] as SentimentType[]).map((sent) => {
          const active = filters.sentiment.includes(sent);
          return (
            <button
              key={sent}
              onClick={() => toggleSentiment(sent)}
              className={`px-2 py-1 rounded-lg flex items-center space-x-1 border font-medium transition-all ${
                active
                  ? sent === 'negative'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : sent === 'positive'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-700 border-slate-500 text-slate-200'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {sent === 'negative' && <Frown className="w-3 h-3 text-rose-400" />}
              {sent === 'neutral' && <Meh className="w-3 h-3 text-slate-400" />}
              {sent === 'positive' && <Smile className="w-3 h-3 text-emerald-400" />}
              <span>{sent === 'negative' ? '負向' : sent === 'neutral' ? '中性' : '正向'}</span>
            </button>
          );
        })}

        <div className="h-4 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

        {/* Category Dropdown Filter */}
        {availableCategories.length > 0 && (
          <select
            value={filters.categories[0] || ''}
            onChange={(e) => onFilterChange({ categories: e.target.value ? [e.target.value] : [] })}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
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
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">所有手動標籤</option>
            {availableTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        )}

        {/* Reset Filter Button */}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="ml-auto px-2.5 py-1 rounded-lg text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-all flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>清除所有篩選</span>
          </button>
        )}

      </div>

      {/* Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div>
          當前篩選顯示：<strong className="text-white font-mono">{filteredCount}</strong> / {totalCount} 則評論
          {isFiltered && <span className="ml-2 text-indigo-400 font-mono">(已啟用過濾條件)</span>}
        </div>
      </div>

    </div>
  );
};

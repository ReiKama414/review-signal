import React from 'react';
import { Star, Filter, RotateCcw } from 'lucide-react';
import { RatingStats } from '@/types';

interface RatingDistributionChartProps {
  stats: RatingStats;
  selectedRatings: number[];
  onToggleRating: (rating: number) => void;
  onClearRatingFilter: () => void;
}

export const RatingDistributionChart: React.FC<RatingDistributionChartProps> = ({
  stats,
  selectedRatings,
  onToggleRating,
  onClearRatingFilter,
}) => {
  const total = stats.total || 1;

  const starConfig = [
    { star: 5, color: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-400' },
    { star: 4, color: '#84cc16', bgClass: 'bg-lime-500', textClass: 'text-lime-400' },
    { star: 3, color: '#eab308', bgClass: 'bg-amber-500', textClass: 'text-amber-400' },
    { star: 2, color: '#f97316', bgClass: 'bg-orange-500', textClass: 'text-orange-400' },
    { star: 1, color: '#ef4444', bgClass: 'bg-rose-500', textClass: 'text-rose-400' },
  ];

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white tracking-tight">評分星等分佈</h3>
            <span className="text-[11px] text-slate-400 font-mono">1~5 星級</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">點擊任意星等可快速聯動篩選評論清單</p>
        </div>

        {selectedRatings.length > 0 && (
          <button
            onClick={onClearRatingFilter}
            className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重設星等 ({selectedRatings.join(', ')} 星)</span>
          </button>
        )}
      </div>

      {/* Star Bars Breakdown */}
      <div className="space-y-2.5">
        {starConfig.map(({ star, bgClass, textClass }) => {
          const count = stats[star as 1 | 2 | 3 | 4 | 5] || 0;
          const percentage = ((count / total) * 100).toFixed(1);
          const isSelected = selectedRatings.includes(star);
          const isAnySelected = selectedRatings.length > 0;

          return (
            <div
              key={star}
              onClick={() => onToggleRating(star)}
              className={`group flex items-center space-x-3 p-1.5 rounded-lg cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-indigo-600/20 border border-indigo-500/40' 
                  : isAnySelected
                    ? 'opacity-40 hover:opacity-100 hover:bg-slate-800/50'
                    : 'hover:bg-slate-800/60'
              }`}
            >
              {/* Star Label */}
              <div className="flex items-center space-x-1 w-14 shrink-0">
                <span className="text-xs font-bold text-slate-200">{star}</span>
                <Star className={`w-3.5 h-3.5 fill-current ${textClass}`} />
              </div>

              {/* Progress Track */}
              <div className="flex-1 h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/80">
                <div
                  style={{ width: `${percentage}%` }}
                  className={`h-full rounded-full transition-all duration-500 ${bgClass}`}
                />
              </div>

              {/* Count & Percentage */}
              <div className="w-20 text-right shrink-0 flex items-center justify-end space-x-1.5">
                <span className="text-xs font-semibold text-slate-200 font-mono">{count} 則</span>
                <span className="text-[11px] text-slate-500 font-mono w-10">({percentage}%)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>評分中位數：<strong className="text-slate-200">{stats.median} 星</strong></span>
        <span>總樣本：<strong className="text-slate-200">{stats.total} 則</strong></span>
      </div>

    </div>
  );
};

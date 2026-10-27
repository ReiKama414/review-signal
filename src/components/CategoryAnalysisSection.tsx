import React, { useMemo } from 'react';
import { 
  Flame, 
  Star, 
  RotateCcw,
} from 'lucide-react';
import { Review, CategorySummary } from '@/types';
import { calculateCategorySummaries } from '@/lib/categories';

interface CategoryAnalysisSectionProps {
  reviews: Review[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryAnalysisSection: React.FC<CategoryAnalysisSectionProps> = ({
  reviews,
  selectedCategory,
  onSelectCategory,
}) => {
  const summaries = useMemo(() => {
    return calculateCategorySummaries(reviews);
  }, [reviews]);

  const criticalIssues = summaries.filter(s => s.priority === 'critical' || s.priority === 'high');

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors min-w-0">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight break-words">
              問題分類統計與修復優先矩陣
            </h3>
            <span className="text-[10px] font-mono px-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900 shrink-0">
              優先級
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words mt-0.5">
            基於評論量（Volume）與星等滿意度（Rating）之四象限優先級判定
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded transition-colors self-start sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重設分類篩選</span>
          </button>
        )}
      </div>

      {/* Urgent Warning Banner if Critical Issues Exist */}
      {criticalIssues.length > 0 && (
        <div className="mb-2.5 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 flex flex-wrap items-start gap-1.5 text-xs">
          <div className="flex items-center space-x-1 shrink-0">
            <Flame className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span className="font-semibold text-rose-800 dark:text-rose-300">急迫修復項目：</span>
          </div>
          <div className="min-w-0 flex-1 break-words">
            <span className="text-rose-700 dark:text-rose-300/80">
              {criticalIssues.map(c => `${c.category.split('(')[0]} (⭐${c.avgRating})`).join('、 ')}
            </span>
          </div>
        </div>
      )}

      {/* Category List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
        {summaries.map((cat) => {
          const isSelected = selectedCategory === cat.category;
          const isCritical = cat.priority === 'critical';
          const isHigh = cat.priority === 'high';

          return (
            <div
              key={cat.category}
              onClick={() => onSelectCategory(isSelected ? null : cat.category)}
              className={`p-2.5 sm:p-3 rounded-lg border cursor-pointer transition-all min-w-0 flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-500 shadow-sm'
                  : isCritical
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                    : isHigh
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                      : 'bg-slate-50/50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-1 mb-1.5">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white tracking-tight break-words">
                    {cat.category}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {cat.count} 則 ({cat.percentage}%)
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className={`text-[10px] font-bold flex items-center space-x-0.5 ${
                      cat.avgRating < 3 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-500'
                    }`}>
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{cat.avgRating}</span>
                    </span>
                  </div>
                </div>

                {/* Priority Badge */}
                <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                  cat.priority === 'critical'
                    ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                    : cat.priority === 'high'
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
                      : cat.priority === 'medium'
                        ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                }`}>
                  {cat.priority === 'critical' ? '緊急修復' :
                   cat.priority === 'high' ? '重點關注' :
                   cat.priority === 'medium' ? '持續優化' : '表現良好'}
                </span>
              </div>

              {/* Progress bar of Sentiment */}
              <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
                <div 
                  style={{ width: `${((cat.positiveCount / cat.count) * 100).toFixed(0)}%` }} 
                  className="bg-emerald-500 h-full" 
                  title={`正面: ${cat.positiveCount}`}
                />
                <div 
                  style={{ width: `${((cat.neutralCount / cat.count) * 100).toFixed(0)}%` }} 
                  className="bg-slate-400 dark:bg-slate-600 h-full" 
                  title={`中性: ${cat.neutralCount}`}
                />
                <div 
                  style={{ width: `${((cat.negativeCount / cat.count) * 100).toFixed(0)}%` }} 
                  className="bg-rose-500 h-full" 
                  title={`負面: ${cat.negativeCount}`}
                />
              </div>

              {/* Sample Review Excerpt */}
              {cat.sampleReviews.length > 0 && (
                <p className="mt-1.5 text-[10px] text-slate-500 dark:text-slate-400 italic truncate border-t border-slate-100 dark:border-slate-800/80 pt-1">
                  &ldquo;{cat.sampleReviews[0]}&rdquo;
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

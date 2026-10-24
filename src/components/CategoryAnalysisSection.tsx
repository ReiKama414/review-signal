import React, { useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Flame, 
  Star, 
  FolderTree, 
  RotateCcw,
  TrendingDown
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
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white tracking-tight">問題分類統計與修復優先矩陣</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              優先級分析
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            基於評論量（Volume）與星等滿意度（Rating）之四象限優先級判定
          </p>
        </div>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重設分類篩選</span>
          </button>
        )}
      </div>

      {/* Urgent Warning Banner if Critical Issues Exist */}
      {criticalIssues.length > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-xs">
          <Flame className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
          <div className="flex-1">
            <span className="font-bold text-rose-300">🚨 偵測到急迫修復項目 (Critical Actions)：</span>
            <span className="text-rose-200/90 ml-1">
              {criticalIssues.map(c => `【${c.category.split('(')[0]}】(⭐ ${c.avgRating})`).join('、 ')}
            </span>
          </div>
        </div>
      )}

      {/* Category List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {summaries.map((cat) => {
          const isSelected = selectedCategory === cat.category;
          const isCritical = cat.priority === 'critical';
          const isHigh = cat.priority === 'high';

          return (
            <div
              key={cat.category}
              onClick={() => onSelectCategory(isSelected ? null : cat.category)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-600/20'
                  : isCritical
                    ? 'bg-rose-950/20 border-rose-800/60 hover:bg-rose-900/30'
                    : isHigh
                      ? 'bg-amber-950/20 border-amber-800/60 hover:bg-amber-900/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {cat.category}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[11px] font-mono text-slate-400">
                      {cat.count} 則 ({cat.percentage}%)
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className={`text-[11px] font-bold flex items-center space-x-0.5 ${
                      cat.avgRating < 3 ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      <Star className="w-3 h-3 fill-current" />
                      <span>{cat.avgRating}</span>
                    </span>
                  </div>
                </div>

                {/* Priority Badge */}
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  cat.priority === 'critical'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : cat.priority === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : cat.priority === 'medium'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {cat.priority === 'critical' ? '🔴 緊急修復' :
                   cat.priority === 'high' ? '🟠 重點關注' :
                   cat.priority === 'medium' ? '🔵 持續優化' : '🟢 表現良好'}
                </span>
              </div>

              {/* Progress bar of Sentiment */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full flex overflow-hidden">
                <div 
                  style={{ width: `${((cat.positiveCount / cat.count) * 100).toFixed(0)}%` }} 
                  className="bg-emerald-500 h-full" 
                  title={`正面: ${cat.positiveCount}`}
                />
                <div 
                  style={{ width: `${((cat.neutralCount / cat.count) * 100).toFixed(0)}%` }} 
                  className="bg-slate-600 h-full" 
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
                <p className="mt-2 text-[11px] text-slate-400 italic line-clamp-1 border-t border-slate-800/60 pt-1.5">
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

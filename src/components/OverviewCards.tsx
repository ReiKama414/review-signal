import React from 'react';
import { 
  Star, 
  Smile, 
  TrendingUp, 
  MessageSquare, 
  Tag, 
  Award,
} from 'lucide-react';
import { Review, RatingStats } from '@/types';

interface OverviewCardsProps {
  reviews: Review[];
  ratingStats: RatingStats;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ reviews, ratingStats }) => {
  const total = reviews.length;
  if (total === 0) return null;

  const posCount = reviews.filter(r => r.sentiment.label === 'positive').length;
  const neuCount = reviews.filter(r => r.sentiment.label === 'neutral').length;
  const negCount = reviews.filter(r => r.sentiment.label === 'negative').length;

  const posPercent = ((posCount / total) * 100).toFixed(1);
  const negPercent = ((negCount / total) * 100).toFixed(1);

  const taggedCount = reviews.filter(r => r.tags && r.tags.length > 0).length;
  const taggedPercent = ((taggedCount / total) * 100).toFixed(0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3.5">
      
      {/* 1. 總評論數 */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-medium break-words">總樣本數</span>
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{total}</span>
            <span className="text-[11px] text-slate-500 font-mono">則</span>
          </div>
        </div>
        <div className="mt-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 break-words">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span>本地即時分析</span>
        </div>
      </div>

      {/* 2. 平均評分 */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-medium break-words">平均星等</span>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {ratingStats.average.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400">/ 5.0</span>
          </div>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-0.5 text-amber-500">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                s <= Math.round(ratingStats.average)
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-slate-300 dark:text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 3. 滿意度 CSAT */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-medium break-words">滿意度 (CSAT)</span>
            <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-bold tracking-tight ${
              ratingStats.csat >= 70 ? 'text-emerald-600 dark:text-emerald-400' :
              ratingStats.csat >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {ratingStats.csat.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="mt-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 break-words">
          {ratingStats[5] + ratingStats[4]} 則給予 4~5 星
        </div>
      </div>

      {/* 4. 淨推薦指數評估 NPS */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-medium break-words">推薦差額 NPS</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-bold tracking-tight ${
              ratingStats.npsScore > 0 ? 'text-emerald-600 dark:text-emerald-400' :
              ratingStats.npsScore === 0 ? 'text-slate-700 dark:text-slate-300' : 'text-rose-600 dark:text-rose-400'
            }`}>
              {ratingStats.npsScore > 0 ? `+${ratingStats.npsScore.toFixed(0)}` : ratingStats.npsScore.toFixed(0)}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">pts</span>
          </div>
        </div>
        <div className="mt-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 break-words">
          推廣者 - 批評者指標
        </div>
      </div>

      {/* 5. 規則詞典情緒比例 */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-medium break-words">規則情緒極性</span>
            <Smile className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-1.5 my-0.5">
            <span className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{posPercent}%</span>
            <span className="text-[10px] text-slate-500">正</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">{negPercent}%</span>
            <span className="text-[10px] text-slate-500">負</span>
          </div>
        </div>
        {/* Visual Bar */}
        <div className="mt-1.5 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full flex overflow-hidden">
          <div style={{ width: `${posPercent}%` }} className="bg-emerald-500 h-full" />
          <div style={{ width: `${((neuCount / total) * 100).toFixed(0)}%` }} className="bg-slate-400 dark:bg-slate-600 h-full" />
          <div style={{ width: `${negPercent}%` }} className="bg-rose-500 h-full" />
        </div>
      </div>

      {/* 6. 標籤註記率 */}
      <div className="p-3 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 gap-1">
            <span className="text-[11px] sm:text-xs font-medium break-words">研究標籤註記</span>
            <Tag className="w-3.5 h-3.5 text-violet-500 shrink-0" />
          </div>
          <div className="flex flex-wrap items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{taggedPercent}%</span>
            <span className="text-[11px] text-slate-500 font-mono">覆蓋</span>
          </div>
        </div>
        <div className="mt-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 break-words">
          {taggedCount} / {total} 則已打標
        </div>
      </div>

    </div>
  );
};

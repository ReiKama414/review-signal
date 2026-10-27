import React from 'react';
import ReactECharts from 'echarts-for-react';
import { RotateCcw } from 'lucide-react';
import { RatingStats } from '@/types';

interface RatingDistributionEChartProps {
  stats: RatingStats;
  selectedRatings: number[];
  onToggleRating: (rating: number) => void;
  onClearRatingFilter: () => void;
  isDark?: boolean;
}

export const RatingDistributionEChart: React.FC<RatingDistributionEChartProps> = ({
  stats,
  selectedRatings,
  onToggleRating,
  onClearRatingFilter,
  isDark = true,
}) => {
  const total = stats.total || 1;

  const starCounts = [
    { star: 1, count: stats[1] || 0, color: '#ef4444' },
    { star: 2, count: stats[2] || 0, color: '#f97316' },
    { star: 3, count: stats[3] || 0, color: '#eab308' },
    { star: 4, count: stats[4] || 0, color: '#84cc16' },
    { star: 5, count: stats[5] || 0, color: '#10b981' },
  ];

  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 12,
      right: 32,
      bottom: 24,
      left: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: isDark ? '#334155' : '#cbd5e1',
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        const count = item.value;
        const pct = ((count / total) * 100).toFixed(1);
        return `<strong>${item.name}</strong><br/>評論數：${count} 則 (${pct}%)`;
      },
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
      splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: ['1 星', '2 星', '3 星', '4 星', '5 星'],
      axisLine: { lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
      axisTick: { show: false },
      axisLabel: { color: isDark ? '#cbd5e1' : '#334155', fontSize: 11, fontWeight: 600 },
    },
    series: [
      {
        name: '評論數',
        type: 'bar',
        barWidth: '55%',
        data: starCounts.map(item => ({
          value: item.count,
          itemStyle: {
            color: selectedRatings.length > 0 && !selectedRatings.includes(item.star)
              ? (isDark ? '#334155' : '#e2e8f0')
              : item.color,
            borderRadius: [0, 4, 4, 0],
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: isDark ? '#cbd5e1' : '#334155',
          fontSize: 10,
          formatter: (params: any) => `${params.value}`,
        },
      },
    ],
  };

  const onChartClick = (params: any) => {
    if (params && params.dataIndex !== undefined) {
      const star = params.dataIndex + 1;
      onToggleRating(star);
    }
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors min-w-0">
      
      {/* 1. Header: 標題區 */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <div className="flex items-center space-x-1.5 min-w-0">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight break-words">
            評分星等分佈
          </h3>
          <span className="text-[10px] text-slate-500 font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 shrink-0">
            ECharts
          </span>
        </div>

        {selectedRatings.length > 0 && (
          <button
            onClick={onClearRatingFilter}
            className="flex items-center space-x-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded shrink-0 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重設 ({selectedRatings.join(', ')}星)</span>
          </button>
        )}
      </div>

      {/* 2. Description: 說明區 */}
      <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words mb-2">
        點擊柱狀圖可即時過濾對應星等，觀察各評分區間客訴原因
      </p>

      {/* 3. Statistics: 獨立統計數值區 */}
      <div className="py-2 px-2.5 mb-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-baseline space-x-1 min-w-[75px]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">中位數：</span>
          <strong className="text-slate-900 dark:text-white font-semibold">{stats.median} 星</strong>
        </div>
        <div className="flex items-baseline space-x-1 min-w-[75px]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">平均：</span>
          <strong className="text-amber-500 font-mono font-bold">⭐ {stats.average.toFixed(2)}</strong>
        </div>
        <div className="flex items-baseline space-x-1 min-w-[85px]">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">滿意度 (CSAT)：</span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{stats.csat.toFixed(1)}%</strong>
        </div>
      </div>

      {/* 4. Chart: 圖表繪製區 */}
      <div className="min-h-[190px] h-48 sm:h-52 w-full min-w-0">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: onChartClick }}
          opts={{ renderer: 'svg' }}
          notMerge={true}
        />
      </div>

      {/* 5. Legend / Footer: 圖例與補充資訊 */}
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="break-words">
          5 個星等梯度 • 依評論量繪製橫向長條
        </span>
        <span className="text-indigo-600 dark:text-indigo-400 font-medium shrink-0">
          支援雙向聯動鑽取
        </span>
      </div>
    </div>
  );
};

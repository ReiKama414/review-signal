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
      top: 15,
      right: 45,
      bottom: 20,
      left: 45,
      containLabel: false,
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
      {/* Header */}
      <div className="flex items-center justify-between mb-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight truncate">
              評分星等分佈
            </h3>
            <span className="text-[10px] text-slate-500 font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">
              ECharts
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            點擊柱狀圖可即時過濾對應星等
          </p>
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

      {/* EChart Canvas */}
      <div className="h-44 sm:h-48 w-full min-w-0 overflow-hidden">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: onChartClick }}
          opts={{ renderer: 'svg' }}
          notMerge={true}
        />
      </div>

      {/* Footer Metrics */}
      <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>中位數：<strong className="text-slate-800 dark:text-white">{stats.median} 星</strong></span>
        <span>平均：<strong className="text-amber-500 font-mono font-bold">⭐ {stats.average.toFixed(2)}</strong></span>
        <span>CSAT：<strong className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{stats.csat.toFixed(1)}%</strong></span>
      </div>
    </div>
  );
};

import React from 'react';
import ReactECharts from 'echarts-for-react';
import { Star, RotateCcw } from 'lucide-react';
import { RatingStats } from '@/types';

interface RatingDistributionEChartProps {
  stats: RatingStats;
  selectedRatings: number[];
  onToggleRating: (rating: number) => void;
  onClearRatingFilter: () => void;
}

export const RatingDistributionEChart: React.FC<RatingDistributionEChartProps> = ({
  stats,
  selectedRatings,
  onToggleRating,
  onClearRatingFilter,
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
      right: 35,
      bottom: 25,
      left: 55,
      containLabel: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0];
        const count = item.value;
        const pct = ((count / total) * 100).toFixed(1);
        return `<strong>${item.name}</strong><br/>評論數：${count} 則 (${pct}%)`;
      },
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#334155' } },
      splitLine: { lineStyle: { color: '#1e293b' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: ['1 星', '2 星', '3 星', '4 星', '5 星'],
      axisLine: { lineStyle: { color: '#334155' } },
      axisTick: { show: false },
      axisLabel: { color: '#cbd5e1', fontSize: 12, fontWeight: 600 },
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
              ? '#334155'
              : item.color,
            borderRadius: [0, 4, 4, 0],
          },
        })),
        label: {
          show: true,
          position: 'right',
          color: '#cbd5e1',
          fontSize: 11,
          formatter: (params: any) => `${params.value} 則`,
        },
      },
    ],
  };

  const onChartClick = (params: any) => {
    if (params && params.dataIndex !== undefined) {
      const star = params.dataIndex + 1; // 0 -> 1 star, 4 -> 5 star
      onToggleRating(star);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">評分星等分佈</h3>
            <span className="text-[11px] text-slate-400 font-mono">ECharts</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">點擊柱狀圖可即時過濾對應星等之評論</p>
        </div>

        {selectedRatings.length > 0 && (
          <button
            onClick={onClearRatingFilter}
            className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>重設 ({selectedRatings.join(', ')} 星)</span>
          </button>
        )}
      </div>

      {/* EChart Canvas */}
      <div className="h-48 w-full">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          onEvents={{ click: onChartClick }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Footer Metrics */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>評分中位數：<strong className="text-white">{stats.median} 星</strong></span>
        <span>平均星等：<strong className="text-amber-400 font-mono">⭐ {stats.average.toFixed(2)}</strong></span>
        <span>滿意度 CSAT：<strong className="text-emerald-400 font-mono">{stats.csat.toFixed(1)}%</strong></span>
      </div>
    </div>
  );
};

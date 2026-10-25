import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Calendar } from 'lucide-react';
import { Review, TrendPoint } from '@/types';

interface TrendTimelineEChartProps {
  reviews: Review[];
  isDark?: boolean;
}

export const TrendTimelineEChart: React.FC<TrendTimelineEChartProps> = ({ reviews, isDark = true }) => {
  const trendData = useMemo(() => {
    const map = new Map<string, {
      count: number;
      totalRating: number;
      positiveCount: number;
      neutralCount: number;
      negativeCount: number;
    }>();

    reviews.forEach(r => {
      const date = r.date || '未知日期';
      let entry = map.get(date);
      if (!entry) {
        entry = {
          count: 0,
          totalRating: 0,
          positiveCount: 0,
          neutralCount: 0,
          negativeCount: 0,
        };
        map.set(date, entry);
      }
      entry.count += 1;
      entry.totalRating += r.rating;
      if (r.sentiment.label === 'positive') entry.positiveCount += 1;
      else if (r.sentiment.label === 'negative') entry.negativeCount += 1;
      else entry.neutralCount += 1;
    });

    const points: (TrendPoint & { avgRatingNum: number })[] = [];
    map.forEach((val, date) => {
      const avg = Number((val.totalRating / val.count).toFixed(2));
      points.push({
        date,
        label: date.slice(5),
        count: val.count,
        avgRating: avg,
        avgRatingNum: avg,
        positiveCount: val.positiveCount,
        neutralCount: val.neutralCount,
        negativeCount: val.negativeCount,
      });
    });

    return points.sort((a, b) => a.date.localeCompare(b.date));
  }, [reviews]);

  const dates = trendData.map(d => d.label);
  const posCounts = trendData.map(d => d.positiveCount);
  const neuCounts = trendData.map(d => d.neutralCount);
  const negCounts = trendData.map(d => d.negativeCount);
  const avgRatings = trendData.map(d => d.avgRatingNum);

  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 35,
      right: 35,
      bottom: 20,
      left: 35,
      containLabel: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: isDark ? '#334155' : '#cbd5e1',
      textStyle: { color: isDark ? '#f8fafc' : '#0f172a', fontSize: 12 },
    },
    legend: {
      data: ['正面評論', '中性評論', '負面評論', '平均星等'],
      top: 0,
      textStyle: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 10 },
      itemWidth: 10,
      itemHeight: 7,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: isDark ? '#334155' : '#cbd5e1' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 10 },
    },
    yAxis: [
      {
        type: 'value',
        name: '量',
        nameTextStyle: { color: isDark ? '#64748b' : '#94a3b8', fontSize: 9 },
        splitLine: { lineStyle: { color: isDark ? '#1e293b' : '#f1f5f9' } },
        axisLabel: { color: isDark ? '#94a3b8' : '#64748b', fontSize: 10 },
        minInterval: 1,
      },
      {
        type: 'value',
        name: '星等',
        nameTextStyle: { color: '#f59e0b', fontSize: 9 },
        min: 1,
        max: 5,
        splitLine: { show: false },
        axisLabel: { color: '#f59e0b', fontSize: 10 },
      },
    ],
    series: [
      {
        name: '正面評論',
        type: 'bar',
        stack: 'volume',
        barWidth: '40%',
        data: posCounts,
        itemStyle: { color: '#10b981' },
      },
      {
        name: '中性評論',
        type: 'bar',
        stack: 'volume',
        data: neuCounts,
        itemStyle: { color: isDark ? '#475569' : '#94a3b8' },
      },
      {
        name: '負面評論',
        type: 'bar',
        stack: 'volume',
        data: negCounts,
        itemStyle: { color: '#f43f5e', borderRadius: [2, 2, 0, 0] },
      },
      {
        name: '平均星等',
        type: 'line',
        yAxisIndex: 1,
        data: avgRatings,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { width: 2.5, color: '#f59e0b' },
        symbol: 'circle',
        symbolSize: 5,
      },
    ],
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-1 gap-2">
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight truncate">
              時間趨勢與星等走勢
            </h3>
            <span className="text-[10px] text-slate-500 font-mono px-1 rounded bg-slate-100 dark:bg-slate-800">
              ECharts
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            堆疊柱狀呈現各情緒量、折線呈現每日平均星等
          </p>
        </div>
        <div className="flex items-center space-x-1 text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>{trendData.length} 節點</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-44 sm:h-48 w-full min-w-0 overflow-hidden">
        {trendData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400">
            目前無足夠日期資料
          </div>
        ) : (
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
            notMerge={true}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="truncate">
          紅條突起通常對應改版異常或物流延遲
        </span>
        <span className="text-amber-500 font-mono shrink-0 ml-2">
          黃線：平均星等
        </span>
      </div>
    </div>
  );
};

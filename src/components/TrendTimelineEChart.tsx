import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Calendar } from 'lucide-react';
import { Review, TrendPoint } from '@/types';

interface TrendTimelineEChartProps {
  reviews: Review[];
}

export const TrendTimelineEChart: React.FC<TrendTimelineEChartProps> = ({ reviews }) => {
  // 聚合日期走勢資料
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
        label: date.slice(5), // e.g. 10-25
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
      right: 40,
      bottom: 25,
      left: 40,
      containLabel: false,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      textStyle: { color: '#f8fafc', fontSize: 12 },
    },
    legend: {
      data: ['正面評論', '中性評論', '負面評論', '平均星等'],
      top: 0,
      textStyle: { color: '#94a3b8', fontSize: 11 },
      itemWidth: 12,
      itemHeight: 8,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: '評論量',
        nameTextStyle: { color: '#64748b', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1e293b' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        minInterval: 1,
      },
      {
        type: 'value',
        name: '星等',
        nameTextStyle: { color: '#f59e0b', fontSize: 10 },
        min: 1,
        max: 5,
        splitLine: { show: false },
        axisLabel: { color: '#f59e0b', fontSize: 11 },
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
        itemStyle: { color: '#64748b' },
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
        symbolSize: 6,
      },
    ],
  };

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-white tracking-tight">時間趨勢與星等波動</h3>
            <span className="text-[11px] text-slate-400 font-mono">ECharts</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">堆疊柱狀呈現正負向評論量、折線呈現每日平均星等</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{trendData.length} 個時間點</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-48 w-full">
        {trendData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500">
            目前無足夠日期資料
          </div>
        ) : (
          <ReactECharts
            option={option}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px] text-slate-400">
          負面紅條突起通常對應重大改版異常或物流延誤事件
        </span>
        <span className="text-[11px] text-amber-400 font-mono">
          黃線：平均星等走勢 (1~5)
        </span>
      </div>
    </div>
  );
};

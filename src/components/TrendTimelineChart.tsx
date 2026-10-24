import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { Review, TrendPoint } from '@/types';

interface TrendTimelineChartProps {
  reviews: Review[];
}

export const TrendTimelineChart: React.FC<TrendTimelineChartProps> = ({ reviews }) => {
  // 依日期分組聚合資料
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

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white tracking-tight">時間趨勢與滿意度走勢</h3>
            <span className="text-[11px] text-slate-400 font-mono">時間軸</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">評論數量增長與每日平均星等波動</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{trendData.length} 個統計日期節點</span>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-56">
        {trendData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
            目前無足夠日期資料進行趨勢繪製
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
              />
              <YAxis 
                yAxisId="left" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                domain={[1, 5]} 
                stroke="#f59e0b" 
                fontSize={11} 
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem', 
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                labelFormatter={(label) => `日期: ${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={28}
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
              />
              <Bar 
                yAxisId="left" 
                dataKey="positiveCount" 
                name="正面評論數" 
                stackId="a" 
                fill="#10b981" 
                radius={[0, 0, 0, 0]} 
              />
              <Bar 
                yAxisId="left" 
                dataKey="neutralCount" 
                name="中性評論數" 
                stackId="a" 
                fill="#64748b" 
              />
              <Bar 
                yAxisId="left" 
                dataKey="negativeCount" 
                name="負面評論數" 
                stackId="a" 
                fill="#f43f5e" 
                radius={[4, 4, 0, 0]} 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="avgRatingNum" 
                name="平均星等 (1-5)" 
                stroke="#f59e0b" 
                strokeWidth={2.5} 
                dot={{ r: 3, fill: '#f59e0b' }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>正面</span>
          <span className="w-2 h-2 rounded-full bg-slate-500 ml-2"></span>
          <span>中性</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 ml-2"></span>
          <span>負面 (紅條高處需關注)</span>
        </span>
        <span className="text-amber-400 font-medium">黃線：平均星等走勢</span>
      </div>

    </div>
  );
};

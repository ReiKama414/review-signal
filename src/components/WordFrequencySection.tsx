import React, { useState, useMemo } from 'react';
import { 
  Hash, 
  Layers, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  Star, 
  TrendingDown, 
  TrendingUp, 
  X,
  ExternalLink
} from 'lucide-react';
import { TokenStat, Review } from '@/types';
import { extractTokenStats, DEFAULT_STOPWORDS } from '@/lib/tokenizer';

interface WordFrequencySectionProps {
  reviews: Review[];
  selectedToken: string | null | undefined;
  onSelectToken: (token: string | null) => void;
}

export const WordFrequencySection: React.FC<WordFrequencySectionProps> = ({
  reviews,
  selectedToken,
  onSelectToken,
}) => {
  const [ngramType, setNgramType] = useState<1 | 2 | 3>(1);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [showStopwordsDrawer, setShowStopwordsDrawer] = useState(false);
  const [customStopwords, setCustomStopwords] = useState<Set<string>>(new Set(DEFAULT_STOPWORDS));
  const [newStopwordInput, setNewStopwordInput] = useState('');

  // 提取字詞頻率
  const stats = useMemo(() => {
    return extractTokenStats(reviews, ngramType, 60, customStopwords);
  }, [reviews, ngramType, customStopwords]);

  // 過濾搜尋
  const filteredStats = useMemo(() => {
    if (!filterKeyword.trim()) return stats;
    const lower = filterKeyword.toLowerCase().trim();
    return stats.filter(s => s.word.toLowerCase().includes(lower));
  }, [stats, filterKeyword]);

  const handleAddStopword = () => {
    const word = newStopwordInput.trim().toLowerCase();
    if (!word) return;
    const next = new Set(customStopwords);
    next.add(word);
    setCustomStopwords(next);
    setNewStopwordInput('');
  };

  const handleRemoveStopword = (word: string) => {
    const next = new Set(customStopwords);
    next.delete(word);
    setCustomStopwords(next);
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white tracking-tight">字詞頻率與 N-gram 挖掘</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Intl.Segmenter + 複合詞
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            點擊任一詞彙可鑽取（Drill-down）篩選包含該語句的所有評論
          </p>
        </div>

        {/* N-gram Selector & Stopwords Config */}
        <div className="flex items-center space-x-2">
          
          {/* 1-gram / 2-gram / 3-gram toggle */}
          <div className="flex p-0.5 bg-slate-950 border border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setNgramType(1)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                ngramType === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              單字詞 (1-gram)
            </button>
            <button
              onClick={() => setNgramType(2)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                ngramType === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              二元組 (2-gram)
            </button>
            <button
              onClick={() => setNgramType(3)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                ngramType === 3 ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              三元組 (3-gram)
            </button>
          </div>

          {/* Stopwords Drawer Button */}
          <button
            onClick={() => setShowStopwordsDrawer(true)}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="管理自訂停用詞"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Filter and Selected Indicator */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterKeyword}
            onChange={(e) => setFilterKeyword(e.target.value)}
            placeholder="搜尋字詞..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {selectedToken && (
          <div className="flex items-center space-x-1.5 bg-indigo-500/20 border border-indigo-500/40 px-2.5 py-1 rounded-lg text-xs text-indigo-300">
            <span>篩選字詞：<strong>「{selectedToken}」</strong></span>
            <button 
              onClick={() => onSelectToken(null)}
              className="hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Word Cloud / Chips List */}
      <div className="flex-1 max-h-72 overflow-y-auto pr-1">
        {filteredStats.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            無符合搜尋條件之字詞
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredStats.map((stat) => {
              const isSelected = selectedToken === stat.word;
              const isNegative = stat.sentimentScore <= -0.15 || stat.avgRating < 3.0;
              const isPositive = stat.sentimentScore >= 0.15 && stat.avgRating >= 4.0;

              return (
                <button
                  key={stat.word}
                  onClick={() => onSelectToken(isSelected ? null : stat.word)}
                  className={`group px-3 py-1.5 rounded-xl border text-xs flex items-center space-x-2 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : isNegative
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                        : isPositive
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-semibold">{stat.word}</span>

                  <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                    isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {stat.reviewCount} 則
                  </span>

                  <span className={`text-[10px] flex items-center space-x-0.5 ${
                    isSelected ? 'text-indigo-200' : stat.avgRating < 3 ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>{stat.avgRating}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>負向/低評痛點詞</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>正面滿意詞</span>
          </span>
        </div>
        <span>共計提取 {stats.length} 組高頻語塊</span>
      </div>

      {/* Stopwords Drawer Modal */}
      {showStopwordsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>自訂停用詞管理 (Stopwords)</span>
              </h3>
              <button 
                onClick={() => setShowStopwordsDrawer(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 text-xs text-slate-400">
              停用詞將在分詞與 N-gram 計算中被過濾，排除無分析價值的虛詞或特定口頭禪。
            </div>

            {/* Add Stopword */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newStopwordInput}
                onChange={(e) => setNewStopwordInput(e.target.value)}
                placeholder="輸入欲過濾之詞（例：請問、謝謝）"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStopword()}
              />
              <button
                onClick={handleAddStopword}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>

            {/* Stopwords Chips */}
            <div className="flex-1 overflow-y-auto max-h-60 p-2 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap gap-1.5">
              {Array.from(customStopwords).map((sw) => (
                <span
                  key={sw}
                  className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300 flex items-center space-x-1 group"
                >
                  <span>{sw}</span>
                  <button
                    onClick={() => handleRemoveStopword(sw)}
                    className="text-slate-500 hover:text-rose-400 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowStopwordsDrawer(false)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500"
              >
                完成設定
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

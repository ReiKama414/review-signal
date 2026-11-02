import React, { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Plus, 
  Star, 
  X,
  Search
} from 'lucide-react';
import { TokenStat, Review } from '@/types';
import { extractTokenStats, DEFAULT_STOPWORDS } from '@/lib/tokenizer';
import { useEscapeKey } from '@/lib/useEscapeKey';

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

  useEscapeKey(showStopwordsDrawer, () => setShowStopwordsDrawer(false));

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
    <div className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors min-w-0">
      
      {/* Header & Controls */}
      <div className="card-section-head border-b border-slate-100 dark:border-slate-800/80 mb-3 pb-3 min-w-0">
        <div className="min-w-0 pr-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white tracking-tight break-words">
              字詞頻率與 N-gram 挖掘
            </h3>
            <span className="text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
              分詞探勘
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 break-words mt-0.5">
            點擊任一詞彙可鑽取（Drill-down）篩選評論清單
          </p>
        </div>

        {/* N-gram Selector & Stopwords Config */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap pl-0.5">
          {/* 1-gram / 2-gram / 3-gram toggle */}
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setNgramType(1)}
              className={`px-2 py-1 rounded-md font-medium text-[11px] transition-colors ${
                ngramType === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              單詞
            </button>
            <button
              onClick={() => setNgramType(2)}
              className={`px-2 py-1 rounded-md font-medium text-[11px] transition-colors ${
                ngramType === 2 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              2-gram
            </button>
            <button
              onClick={() => setNgramType(3)}
              className={`px-2 py-1 rounded-md font-medium text-[11px] transition-colors ${
                ngramType === 3 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3-gram
            </button>
          </div>

          {/* Stopwords Drawer Button */}
          <button
            onClick={() => setShowStopwordsDrawer(true)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="管理停用詞"
            aria-label="管理停用詞"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Selected Indicator */}
      <div className="toolbar-row mb-3">
        <div className="toolbar-field flex-1 min-w-[140px] max-w-md">
          <span className="toolbar-field-label text-slate-400 dark:text-slate-500">探勘詞篩選</span>
          <div className="relative toolbar-control-height">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterKeyword}
              onChange={(e) => setFilterKeyword(e.target.value)}
              placeholder="搜尋探勘詞..."
              className="toolbar-control-height w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

        {selectedToken && (
          <div className="flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/40 px-2.5 py-1 rounded-lg text-xs text-indigo-700 dark:text-indigo-300 mb-2.5">
            <span>「{selectedToken}」</span>
            <button 
              onClick={() => onSelectToken(null)}
              className="hover:text-slate-900 dark:hover:text-white p-0.5"
              aria-label="清除字詞篩選"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

      {/* Word Cloud / Chips List */}
      <div className="flex-1 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
        {filteredStats.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            無符合搜尋之字詞
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {filteredStats.map((stat) => {
              const isSelected = selectedToken === stat.word;
              const isNegative = stat.sentimentScore <= -0.15 || stat.avgRating < 3.0;
              const isPositive = stat.sentimentScore >= 0.15 && stat.avgRating >= 4.0;

              return (
                <button
                  key={stat.word}
                  onClick={() => onSelectToken(isSelected ? null : stat.word)}
                  className={`group px-2.5 py-1 rounded-lg border text-xs flex items-center space-x-1.5 transition-all max-w-full truncate ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : isNegative
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100'
                        : isPositive
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-medium truncate">{stat.word}</span>

                  <span className={`px-1 py-px rounded font-mono text-[9px] ${
                    isSelected 
                      ? 'bg-indigo-700 text-indigo-100' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {stat.reviewCount}
                  </span>

                  <span className={`text-[9px] flex items-center space-x-0.5 ${
                    isSelected ? 'text-indigo-200' : stat.avgRating < 3 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-500'
                  }`}>
                    <Star className="w-2 h-2 fill-current" />
                    <span>{stat.avgRating}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>負向痛點</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>滿意讚譽</span>
          </span>
        </div>
        <span>提取 {stats.length} 組高頻語塊</span>
      </div>

      {/* Stopwords Drawer Modal */}
      {showStopwordsDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setShowStopwordsDrawer(false); }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-md p-4 shadow-xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                <span>自訂停用詞管理 (Stopwords)</span>
              </h3>
              <button 
                onClick={() => setShowStopwordsDrawer(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
                aria-label="關閉"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-2 text-[11px] text-slate-500 dark:text-slate-400">
              停用詞將在分詞與 N-gram 計算中被過濾，排除無分析價值的虛詞。
            </div>

            {/* Add Stopword */}
            <div className="flex gap-1.5 mb-2.5">
              <input
                type="text"
                value={newStopwordInput}
                onChange={(e) => setNewStopwordInput(e.target.value)}
                placeholder="輸入欲過濾之詞（例：請問、謝謝）"
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleAddStopword()}
              />
              <button
                onClick={handleAddStopword}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 shrink-0"
              >
                新增
              </button>
            </div>

            {/* Stopwords Chips */}
            <div className="flex-1 overflow-y-auto max-h-52 p-2 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap gap-1">
              {Array.from(customStopwords).map((sw) => (
                <span
                  key={sw}
                  className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 flex items-center space-x-1"
                >
                  <span>{sw}</span>
                  <button
                    onClick={() => handleRemoveStopword(sw)}
                    className="text-slate-400 hover:text-rose-500 ml-1"
                    aria-label={`移除停用詞 ${sw}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setShowStopwordsDrawer(false)}
                className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

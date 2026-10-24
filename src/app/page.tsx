'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Review, 
  FilterState, 
  RatingStats, 
  SentimentType 
} from '@/types';
import { Header } from '@/components/Header';
import { OverviewCards } from '@/components/OverviewCards';
import { RatingDistributionChart } from '@/components/RatingDistributionChart';
import { TrendTimelineChart } from '@/components/TrendTimelineChart';
import { WordFrequencySection } from '@/components/WordFrequencySection';
import { CategoryAnalysisSection } from '@/components/CategoryAnalysisSection';
import { FilterToolbar } from '@/components/FilterToolbar';
import { ReviewList } from '@/components/ReviewList';
import { MethodologyModal } from '@/components/MethodologyModal';
import { ImportModal } from '@/components/ImportModal';
import { ExportModal } from '@/components/ExportModal';
import { ReviewDetailModal } from '@/components/ReviewDetailModal';
import { SAMPLE_DATASETS, getSampleDataset } from '@/lib/samples';
import { tokenizeText, extractTokenStats } from '@/lib/tokenizer';
import { analyzeSentimentRuleBased } from '@/lib/sentiment';
import { classifyReviewRuleBased, calculateCategorySummaries } from '@/lib/categories';
import { 
  Sparkles, 
  BarChart3, 
  Activity, 
  Layers, 
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  ratings: [],
  sentiment: [],
  categories: [],
  tags: [],
  dateStart: null,
  dateEnd: null,
  minWordCount: 0,
  hasNotesOnly: false,
  selectedToken: null,
  sortBy: 'date_desc',
};

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeDatasetName, setActiveDatasetName] = useState<string>('電商購物平台顧客真實反饋');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedReviewIds, setSelectedReviewIds] = useState<Set<string>>(new Set());

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [inspectingReview, setInspectingReview] = useState<Review | null>(null);

  // 初始化載入電商樣本資料
  useEffect(() => {
    loadSampleById('ecommerce_tw');
  }, []);

  const loadSampleById = (sampleId: string) => {
    const sample = getSampleDataset(sampleId);
    if (!sample) return;

    // 將樣本文本進行標準分詞與規則情緒分析
    const processedReviews: Review[] = sample.reviews.map((r, index) => {
      const tokens = tokenizeText(r.content);
      const sentiment = analyzeSentimentRuleBased(tokens, r.content);
      return {
        ...r,
        tokens,
        sentiment,
        id: r.id || `sample-${sampleId}-${index}`
      };
    });

    setReviews(processedReviews);
    setActiveDatasetName(sample.name);
    setFilters(INITIAL_FILTERS);
    setSelectedReviewIds(new Set());
  };

  // 當使用者匯入自訂 CSV/JSON 時觸發
  const handleImportSuccess = (importedReviews: Review[], datasetName: string) => {
    setReviews(importedReviews);
    setActiveDatasetName(datasetName);
    setFilters(INITIAL_FILTERS);
    setSelectedReviewIds(new Set());
  };

  // 評論標籤更新 (手動標籤)
  const handleUpdateReviewTags = (reviewId: string, tags: string[]) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, tags } : r));
    if (inspectingReview && inspectingReview.id === reviewId) {
      setInspectingReview(prev => prev ? { ...prev, tags } : null);
    }
  };

  // 評論分類更新
  const handleUpdateReviewCategory = (reviewId: string, category: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, category } : r));
    if (inspectingReview && inspectingReview.id === reviewId) {
      setInspectingReview(prev => prev ? { ...prev, category } : null);
    }
  };

  // 評論研究員筆記更新
  const handleUpdateReviewNotes = (reviewId: string, notes: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, notes } : r));
    if (inspectingReview && inspectingReview.id === reviewId) {
      setInspectingReview(prev => prev ? { ...prev, notes } : null);
    }
  };

  // 批次新增標籤
  const handleBatchAddTag = (newTag: string) => {
    setReviews(prev => prev.map(r => {
      if (selectedReviewIds.has(r.id)) {
        const nextTags = r.tags.includes(newTag) ? r.tags : [...r.tags, newTag];
        return { ...r, tags: nextTags };
      }
      return r;
    }));
    setSelectedReviewIds(new Set());
  };

  // 取得現有資料中的所有標籤與分類
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach(r => r.tags?.forEach(t => set.add(t)));
    return Array.from(set).sort();
  }, [reviews]);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach(r => {
      if (r.category) set.add(r.category);
    });
    return Array.from(set).sort();
  }, [reviews]);

  // 多條件篩選與排序邏輯
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // 1. 搜尋字串
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        r.content.toLowerCase().includes(q) ||
        (r.author && r.author.toLowerCase().includes(q)) ||
        (r.device && r.device.toLowerCase().includes(q)) ||
        (r.version && r.version.toLowerCase().includes(q)) ||
        (r.notes && r.notes.toLowerCase().includes(q)) ||
        (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // 2. 星等篩選
    if (filters.ratings.length > 0) {
      result = result.filter(r => filters.ratings.includes(r.rating));
    }

    // 3. 情緒極性篩選
    if (filters.sentiment.length > 0) {
      result = result.filter(r => filters.sentiment.includes(r.sentiment.label));
    }

    // 4. 問題分類篩選
    if (filters.categories.length > 0) {
      result = result.filter(r => filters.categories.includes(r.category));
    }

    // 5. 標籤篩選
    if (filters.tags.length > 0) {
      result = result.filter(r => filters.tags.some(t => r.tags.includes(t)));
    }

    // 6. 字詞與 N-gram 篩選
    if (filters.selectedToken) {
      const token = filters.selectedToken.toLowerCase();
      result = result.filter(r => r.content.toLowerCase().includes(token));
    }

    // 7. 排序
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_desc':
          return (b.date || '').localeCompare(a.date || '');
        case 'date_asc':
          return (a.date || '').localeCompare(b.date || '');
        case 'rating_asc':
          return a.rating - b.rating;
        case 'rating_desc':
          return b.rating - a.rating;
        case 'sentiment_asc':
          return a.sentiment.score - b.sentiment.score;
        case 'sentiment_desc':
          return b.sentiment.score - a.sentiment.score;
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, filters]);

  // 計算評分統計數據 (Rating Statistics)
  const ratingStats: RatingStats = useMemo(() => {
    const stats: RatingStats = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      total: reviews.length,
      average: 0,
      median: 3,
      csat: 0,
      npsScore: 0,
    };

    if (reviews.length === 0) return stats;

    let totalRating = 0;
    const ratingValues: number[] = [];

    reviews.forEach(r => {
      const star = r.rating as 1 | 2 | 3 | 4 | 5;
      if (stats[star] !== undefined) {
        stats[star] += 1;
      }
      totalRating += r.rating;
      ratingValues.push(r.rating);
    });

    stats.average = Number((totalRating / reviews.length).toFixed(2));

    // 計算中位數
    ratingValues.sort((a, b) => a - b);
    const mid = Math.floor(ratingValues.length / 2);
    stats.median = ratingValues.length % 2 !== 0 
      ? ratingValues[mid] 
      : Math.round((ratingValues[mid - 1] + ratingValues[mid]) / 2);

    // CSAT (% of 4-5 stars)
    const satisfied = stats[4] + stats[5];
    stats.csat = Number(((satisfied / reviews.length) * 100).toFixed(1));

    // NPS 估算 (% promoters 4-5 - % detractors 1-2)
    const detractors = stats[1] + stats[2];
    const nps = ((satisfied - detractors) / reviews.length) * 100;
    stats.npsScore = Number(nps.toFixed(1));

    return stats;
  }, [reviews]);

  // 計算分類與高頻字詞 (供報表使用)
  const categorySummaries = useMemo(() => {
    return calculateCategorySummaries(reviews);
  }, [reviews]);

  const topKeywords = useMemo(() => {
    return extractTokenStats(reviews, 1, 20);
  }, [reviews]);

  // 單則評論深層檢視 Navigation
  const inspectingIndex = useMemo(() => {
    if (!inspectingReview) return -1;
    return filteredReviews.findIndex(r => r.id === inspectingReview.id);
  }, [inspectingReview, filteredReviews]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onLoadSample={loadSampleById}
        activeDatasetName={activeDatasetName}
        totalReviewCount={reviews.length}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Banner: Transparent Methodology Disclosure Notice */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200">
                本系統完全基於本地詞典規則與確定性斷詞運算
              </span>
              <span className="text-slate-400 ml-1.5 hidden md:inline">
                • 100% 資料保密、零黑箱預測、不消耗 Token、拒絕偽裝 AI
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="text-amber-400 hover:text-amber-300 font-medium underline shrink-0 text-left sm:text-right"
          >
            檢視算法透明度報告與公式 →
          </button>
        </div>

        {/* 1. Overview Metric KPI Cards */}
        <OverviewCards 
          reviews={reviews} 
          ratingStats={ratingStats} 
        />

        {/* 2. Top Charts Row: Rating Distribution & Timeline Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RatingDistributionChart
            stats={ratingStats}
            selectedRatings={filters.ratings}
            onToggleRating={(star) => {
              const next = filters.ratings.includes(star)
                ? filters.ratings.filter(x => x !== star)
                : [...filters.ratings, star];
              setFilters(prev => ({ ...prev, ratings: next }));
            }}
            onClearRatingFilter={() => setFilters(prev => ({ ...prev, ratings: [] }))}
          />

          <TrendTimelineChart
            reviews={reviews}
          />
        </div>

        {/* 3. Deep Analysis Row: Word Frequency (N-gram) & Category Priority Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WordFrequencySection
            reviews={reviews}
            selectedToken={filters.selectedToken}
            onSelectToken={(token) => setFilters(prev => ({ ...prev, selectedToken: token }))}
          />

          <CategoryAnalysisSection
            reviews={reviews}
            selectedCategory={filters.categories[0] || null}
            onSelectCategory={(cat) => setFilters(prev => ({ ...prev, categories: cat ? [cat] : [] }))}
          />
        </div>

        {/* 4. Filter Toolbar */}
        <FilterToolbar
          filters={filters}
          onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          totalCount={reviews.length}
          filteredCount={filteredReviews.length}
          availableTags={availableTags}
          availableCategories={availableCategories}
        />

        {/* 5. Review Cards List */}
        <ReviewList
          reviews={filteredReviews}
          highlightToken={filters.selectedToken || filters.searchQuery}
          onUpdateReviewTags={handleUpdateReviewTags}
          onUpdateReviewCategory={handleUpdateReviewCategory}
          onUpdateReviewNotes={handleUpdateReviewNotes}
          onSelectReviewDetail={(review) => setInspectingReview(review)}
          selectedIds={selectedReviewIds}
          onToggleSelectId={(id) => {
            const next = new Set(selectedReviewIds);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setSelectedReviewIds(next);
          }}
          onSelectAll={() => setSelectedReviewIds(new Set(filteredReviews.map(r => r.id)))}
          onDeselectAll={() => setSelectedReviewIds(new Set())}
          onBatchAddTag={handleBatchAddTag}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">Review Signal</span>
            <span>— 現代化顧客之聲與評論研究工作台</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-500">
            <span>支援 Vercel 零配置部署</span>
            <span>•</span>
            <span>Intl.Segmenter 斷詞</span>
            <span>•</span>
            <span>可解釋情緒規則</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportSuccess={handleImportSuccess}
        onLoadSample={loadSampleById}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        reviews={filteredReviews}
        ratingStats={ratingStats}
        categories={categorySummaries}
        topKeywords={topKeywords}
        datasetName={activeDatasetName}
      />

      <ReviewDetailModal
        review={inspectingReview}
        onClose={() => setInspectingReview(null)}
        onUpdateTags={(tags) => inspectingReview && handleUpdateReviewTags(inspectingReview.id, tags)}
        onUpdateCategory={(cat) => inspectingReview && handleUpdateReviewCategory(inspectingReview.id, cat)}
        onUpdateNotes={(notes) => inspectingReview && handleUpdateReviewNotes(inspectingReview.id, notes)}
        onPrev={() => inspectingIndex > 0 && setInspectingReview(filteredReviews[inspectingIndex - 1])}
        onNext={() => inspectingIndex < filteredReviews.length - 1 && setInspectingReview(filteredReviews[inspectingIndex + 1])}
        hasPrev={inspectingIndex > 0}
        hasNext={inspectingIndex < filteredReviews.length - 1}
      />

    </div>
  );
}

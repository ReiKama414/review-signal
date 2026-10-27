import React, { useState, useMemo, useEffect } from 'react';
import { 
  Review, 
  FilterState, 
  RatingStats 
} from '@/types';
import { Header } from '@/components/Header';
import { OverviewCards } from '@/components/OverviewCards';
import { RatingDistributionEChart } from '@/components/RatingDistributionEChart';
import { TrendTimelineEChart } from '@/components/TrendTimelineEChart';
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
import { calculateCategorySummaries } from '@/lib/categories';
import { 
  saveReviewsToDB, 
  loadReviewsFromDB, 
  updateReviewInDB 
} from '@/lib/db';
import { useTheme } from '@/lib/theme';
import { ShieldCheck } from 'lucide-react';

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

export default function App() {
  const { theme, isDark, setTheme } = useTheme();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeDatasetName, setActiveDatasetName] = useState<string>('電商購物平台顧客真實反饋');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedReviewIds, setSelectedReviewIds] = useState<Set<string>>(new Set());
  const [isDbSynced, setIsDbSynced] = useState<boolean>(false);

  // Modals state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [inspectingReview, setInspectingReview] = useState<Review | null>(null);

  // 初始化：優先自 IndexedDB 讀取，若無則載入預設電商資料並持久化
  useEffect(() => {
    let isMounted = true;

    async function initWorkspace() {
      try {
        const stored = await loadReviewsFromDB();
        if (stored && stored.reviews.length > 0 && isMounted) {
          setReviews(stored.reviews);
          if (stored.datasetName) setActiveDatasetName(stored.datasetName);
          setIsDbSynced(true);
          return;
        }
      } catch (err) {
        console.warn('Initial IndexedDB check failed, loading fallback:', err);
      }

      if (isMounted) {
        loadSampleById('ecommerce_tw');
      }
    }

    initWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  const loadSampleById = async (sampleId: string) => {
    const sample = getSampleDataset(sampleId);
    if (!sample) return;

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

    const success = await saveReviewsToDB(processedReviews, sample.name);
    setIsDbSynced(success);
  };

  const handleImportSuccess = async (importedReviews: Review[], datasetName: string) => {
    setReviews(importedReviews);
    setActiveDatasetName(datasetName);
    setFilters(INITIAL_FILTERS);
    setSelectedReviewIds(new Set());

    const success = await saveReviewsToDB(importedReviews, datasetName);
    setIsDbSynced(success);
  };

  // 評論標籤更新 (手動標籤)
  const handleUpdateReviewTags = async (reviewId: string, tags: string[]) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, tags } : r));
    if (inspectingReview && inspectingReview.id === reviewId) {
      setInspectingReview(prev => prev ? { ...prev, tags } : null);
    }
    await updateReviewInDB(reviewId, { tags });
  };

  // 評論分類更新
  const handleUpdateReviewCategory = async (reviewId: string, category: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, category } : r));
    if (inspectingReview && inspectingReview.id === reviewId) {
      setInspectingReview(prev => prev ? { ...prev, category } : null);
    }
    await updateReviewInDB(reviewId, { category });
  };

  // 評論研究員筆記更新
  const handleUpdateReviewNotes = async (reviewId: string, notes: string) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, notes } : r));
    if (inspectingReview && inspectingReview.id === reviewId) {
      setInspectingReview(prev => prev ? { ...prev, notes } : null);
    }
    await updateReviewInDB(reviewId, { notes });
  };

  // 批次新增標籤
  const handleBatchAddTag = async (newTag: string) => {
    const updatedIds: string[] = [];
    setReviews(prev => prev.map(r => {
      if (selectedReviewIds.has(r.id)) {
        updatedIds.push(r.id);
        const nextTags = r.tags.includes(newTag) ? r.tags : [...r.tags, newTag];
        return { ...r, tags: nextTags };
      }
      return r;
    }));

    for (const id of updatedIds) {
      const target = reviews.find(r => r.id === id);
      if (target) {
        const nextTags = target.tags.includes(newTag) ? target.tags : [...target.tags, newTag];
        await updateReviewInDB(id, { tags: nextTags });
      }
    }

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

    if (filters.ratings.length > 0) {
      result = result.filter(r => filters.ratings.includes(r.rating));
    }

    if (filters.sentiment.length > 0) {
      result = result.filter(r => filters.sentiment.includes(r.sentiment.label));
    }

    if (filters.categories.length > 0) {
      result = result.filter(r => filters.categories.includes(r.category));
    }

    if (filters.tags.length > 0) {
      result = result.filter(r => filters.tags.some(t => r.tags.includes(t)));
    }

    if (filters.selectedToken) {
      const token = filters.selectedToken.toLowerCase();
      result = result.filter(r => r.content.toLowerCase().includes(token));
    }

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

  // 評分統計數據
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

    ratingValues.sort((a, b) => a - b);
    const mid = Math.floor(ratingValues.length / 2);
    stats.median = ratingValues.length % 2 !== 0 
      ? ratingValues[mid] 
      : Math.round((ratingValues[mid - 1] + ratingValues[mid]) / 2);

    const satisfied = stats[4] + stats[5];
    stats.csat = Number(((satisfied / reviews.length) * 100).toFixed(1));

    const detractors = stats[1] + stats[2];
    const nps = ((satisfied - detractors) / reviews.length) * 100;
    stats.npsScore = Number(nps.toFixed(1));

    return stats;
  }, [reviews]);

  const categorySummaries = useMemo(() => {
    return calculateCategorySummaries(reviews);
  }, [reviews]);

  const topKeywords = useMemo(() => {
    return extractTokenStats(reviews, 1, 20);
  }, [reviews]);

  const inspectingIndex = useMemo(() => {
    if (!inspectingReview) return -1;
    return filteredReviews.findIndex(r => r.id === inspectingReview.id);
  }, [inspectingReview, filteredReviews]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Header */}
      <Header
        onOpenImport={() => setIsImportOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenMethodology={() => setIsMethodologyOpen(true)}
        onLoadSample={loadSampleById}
        activeDatasetName={activeDatasetName}
        totalReviewCount={reviews.length}
        isDbSynced={isDbSynced}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-5 space-y-3.5 sm:space-y-4 min-w-0">
        
        {/* Transparency Banner */}
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-sm min-w-0">
          <div className="flex items-start sm:items-center space-x-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-slate-700 dark:text-slate-300 break-words">
              <strong>確定性規則引擎</strong>：採用瀏覽器原生 Intl.Segmenter 斷詞與客觀詞典，100% 本地 IndexedDB 運算，無假 AI 偽裝。
            </span>
          </div>
          <button
            onClick={() => setIsMethodologyOpen(true)}
            className="text-amber-700 dark:text-amber-400 hover:underline font-medium text-left sm:text-right shrink-0"
          >
            檢視算法透明度報告 →
          </button>
        </div>

        {/* 1. Overview Metric KPI Cards */}
        <OverviewCards 
          reviews={reviews} 
          ratingStats={ratingStats} 
        />

        {/* 2. ECharts Row: Rating Distribution & Timeline Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 min-w-0">
          <RatingDistributionEChart
            stats={ratingStats}
            selectedRatings={filters.ratings}
            onToggleRating={(star) => {
              const next = filters.ratings.includes(star)
                ? filters.ratings.filter(x => x !== star)
                : [...filters.ratings, star];
              setFilters(prev => ({ ...prev, ratings: next }));
            }}
            onClearRatingFilter={() => setFilters(prev => ({ ...prev, ratings: [] }))}
            isDark={isDark}
          />

          <TrendTimelineEChart
            reviews={reviews}
            isDark={isDark}
          />
        </div>

        {/* 3. Deep Analysis Row: Word Frequency (N-gram) & Category Priority Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 min-w-0">
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
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Review Signal</span>
            <span>— 評論研究與顧客之聲專業工作台</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-slate-400">
            <span>React 18 + Vite + ECharts + IndexedDB</span>
            <span>•</span>
            <span>支援雙主題與 9 種尺寸 RWD</span>
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

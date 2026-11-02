import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
} from 'lucide-react';
import { Review, RatingStats, CategorySummary, TokenStat } from '@/types';
import { exportToCSV, exportToJSON, exportToMarkdown, generateMarkdownReport } from '@/lib/export';
import { useEscapeKey } from '@/lib/useEscapeKey';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  ratingStats: RatingStats;
  categories: CategorySummary[];
  topKeywords: TokenStat[];
  datasetName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  reviews,
  ratingStats,
  categories,
  topKeywords,
  datasetName,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'options' | 'preview'>('options');

  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  const markdownContent = generateMarkdownReport(
    reviews,
    ratingStats,
    categories,
    topKeywords,
    datasetName
  );

  const handleCopyMarkdown = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(markdownContent).then(done).catch(() => {
        window.alert('無法存取剪貼簿，請手動選取預覽內容後複製。');
      });
    } else {
      window.alert('此瀏覽器不支援剪貼簿 API，請手動選取預覽內容後複製。');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-start space-x-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words">
                匯出研究資料與報告
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 break-words mt-0.5">
                包含已篩選之 {reviews.length} 則評論、手動標籤與分類統計
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-4 sm:px-6 pt-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('options')}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'options'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            匯出格式選擇
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors shrink-0 ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Markdown 報告即時預覽
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1 min-w-0">
          {activeTab === 'options' ? (
            <div className="space-y-2.5">
              
              {/* Option 1: CSV with UTF-8 BOM */}
              <div 
                onClick={() => {
                  exportToCSV(reviews, `${datasetName}-reviews.csv`);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition-all group flex items-start space-x-3"
              >
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      CSV 試算表 (UTF-8 BOM)
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                      Excel 繁中不亂碼
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    包含評論 ID、星等、原聲內文、分類、規則情緒得分、標籤與研究員筆記等完整欄位。
                  </p>
                </div>
              </div>

              {/* Option 2: Structured JSON */}
              <div 
                onClick={() => {
                  exportToJSON(reviews, `${datasetName}-reviews.json`);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer transition-all group flex items-start space-x-3"
              >
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      結構化 JSON 資料庫
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 shrink-0">
                      開發者 / Pipeline
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    包含斷詞 tokens、否定詞修飾元資料與完整陣列結構。
                  </p>
                </div>
              </div>

              {/* Option 3: Markdown Executive Report */}
              <div 
                onClick={() => {
                  exportToMarkdown(reviews, ratingStats, categories, topKeywords, `${datasetName}-report.md`, datasetName);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500 cursor-pointer transition-all group flex items-start space-x-3"
              >
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      Markdown 研究洞察摘要報告 (.md)
                    </h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shrink-0">
                      Notion / Jira 隨附
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    排版精美之研究簡報，自動計算 CSAT、NPS、緊急修復象限、高頻痛點詞與倫理聲明。
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>報告預覽（支援 GitHub Flavored Markdown）：</span>
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center space-x-1 transition-colors text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已複製！' : '一鍵複製 Markdown'}</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto max-h-56 sm:max-h-64 leading-relaxed whitespace-pre-wrap break-all select-all">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>匯出資料僅包含當前篩選之評論</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
  Sparkles,
  Layers
} from 'lucide-react';
import { Review, RatingStats, CategorySummary, TokenStat } from '@/types';
import { exportToCSV, exportToJSON, exportToMarkdown, generateMarkdownReport } from '@/lib/export';

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

  if (!isOpen) return null;

  const markdownContent = generateMarkdownReport(
    reviews,
    ratingStats,
    categories,
    topKeywords,
    datasetName
  );

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">匯出研究資料與報告</h2>
              <p className="text-xs text-slate-400">包含已篩選之 {reviews.length} 則評論、手動標籤與分類統計</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('options')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'options'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            匯出格式選擇
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Markdown 報告即時預覽
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'options' ? (
            <div className="space-y-3">
              
              {/* Option 1: CSV with UTF-8 BOM */}
              <div 
                onClick={() => {
                  exportToCSV(reviews, `${datasetName}-reviews.csv`);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 cursor-pointer transition-all group flex items-start space-x-3.5"
              >
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      CSV 試算表 (UTF-8 BOM)
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Excel 完美開啟不亂碼
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    包含評論 ID、星等、原聲內文、分類、規則情緒得分、手動標籤與研究員筆記等完整欄位。
                  </p>
                </div>
              </div>

              {/* Option 2: Structured JSON */}
              <div 
                onClick={() => {
                  exportToJSON(reviews, `${datasetName}-reviews.json`);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 cursor-pointer transition-all group flex items-start space-x-3.5"
              >
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  <FileCode className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                      結構化 JSON 資料庫
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      開發者 / Pipeline 適用
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    包含斷詞 tokens、否定詞修飾元資料與完整陣列結構，方便接入其他分析工具。
                  </p>
                </div>
              </div>

              {/* Option 3: Markdown Executive Report */}
              <div 
                onClick={() => {
                  exportToMarkdown(reviews, ratingStats, categories, topKeywords, `${datasetName}-report.md`);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 cursor-pointer transition-all group flex items-start space-x-3.5"
              >
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      Markdown 研究洞察摘要報告 (.md)
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      Notion / Slack / Jira 隨附
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    排版精美之研究簡報，自動計算 CSAT、NPS、緊急修復象限、高頻痛點詞與倫理聲明。
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>報告預覽（支援 GitHub Flavored Markdown）：</span>
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center space-x-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已複製到剪貼簿！' : '一鍵複製 Markdown'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap select-all">
                {markdownContent}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>匯出資料僅包含當前篩選條件下的評論</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            關閉
          </button>
        </div>

      </div>
    </div>
  );
};

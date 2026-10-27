import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Database, 
  AlertCircle, 
  ArrowRight,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { parseCSV, parseJSON } from '@/lib/parser';
import { SAMPLE_DATASETS } from '@/lib/samples';
import { Review } from '@/types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (reviews: Review[], datasetName: string) => void;
  onLoadSample: (sampleId: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
  onLoadSample,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [pasteContent, setPasteContent] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      if (file.size === 0) {
        throw new Error('上傳的檔案為空檔案 (0 bytes)，請選擇包含評論資料的檔案。');
      }

      const text = await file.text();
      const filename = file.name.toLowerCase();
      
      let reviews: Review[] = [];
      if (filename.endsWith('.json')) {
        const result = parseJSON(text);
        reviews = result.reviews;
      } else {
        const result = await parseCSV(text);
        reviews = result.reviews;
      }

      if (reviews.length === 0) {
        throw new Error('未在檔案中找到任何有效評論列，請確認包含評論內文欄位。');
      }

      onImportSuccess(reviews, file.name.replace(/\.[^/.]+$/, ''));
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || '檔案解析失敗，請確認檔案格式是否正確。');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePasteProcess = async () => {
    if (!pasteContent.trim()) {
      setErrorMsg('請貼上 CSV 或 JSON 文字內容');
      return;
    }
    setErrorMsg(null);
    setIsProcessing(true);
    try {
      const trimmed = pasteContent.trim();
      let reviews: Review[] = [];

      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        const result = parseJSON(trimmed);
        reviews = result.reviews;
      } else {
        const result = await parseCSV(trimmed);
        reviews = result.reviews;
      }

      if (reviews.length === 0) {
        throw new Error('未解析出任何有效評論列');
      }

      onImportSuccess(reviews, `自訂剪貼簿匯入 (${reviews.length} 筆)`);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || '文字解析失敗');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-[calc(100vw-1.5rem)] sm:max-w-2xl max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-start space-x-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words">
                匯入評論資料 (CSV / JSON)
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 break-words mt-0.5">
                支援顧客評語、星等評分、日期與類別欄位自動對應
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-4 sm:px-6 pt-2 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('upload'); setErrorMsg(null); }}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>檔案上傳</span>
          </button>
          <button
            onClick={() => { setActiveTab('paste'); setErrorMsg(null); }}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'paste'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>貼上文字</span>
          </button>
          <button
            onClick={() => { setActiveTab('samples'); setErrorMsg(null); }}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition-colors flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'samples'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-700 dark:text-amber-400">內建範例資料</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 min-w-0">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="break-words">{errorMsg}</span>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileProcess(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/40 hover:border-slate-400'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-600/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2.5">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  點擊選擇檔案，或將 CSV / JSON 檔案拖曳至此處
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  支援 UTF-8 編碼、多行文字評論與標準評分欄位（1~5 星）
                </p>
                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3 text-emerald-500" /> CSV 檔案
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-indigo-500" /> JSON 檔案
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">自動欄位偵測支援：</span>
                <p>• <strong>評論內容</strong>：content, text, comment, review, 評論, 內文, 反饋</p>
                <p>• <strong>星等評分</strong>：rating, score, stars, 評分, 星等 (自動標準化為 1~5)</p>
                <p>• <strong>日期時間</strong>：date, created_at, timestamp, 日期 (ISO / 常見時間格式)</p>
              </div>
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                可直接貼上 CSV 逗號分隔字串或 JSON 陣列物件：
              </p>
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                rows={8}
                placeholder={`id,rating,content,date\n1,5,"出貨速度超快，包裝完整品質好！",2026-10-25\n2,1,"更新後一直閃退，太爛了無法結帳",2026-10-24`}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={handlePasteProcess}
                disabled={isProcessing}
                className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-all flex items-center justify-center space-x-1.5"
              >
                <span>開始解析並載入</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {activeTab === 'samples' && (
            <div className="space-y-2.5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                立即載入精心編製的台灣在地繁體中文真實風格評語資料庫：
              </p>

              {SAMPLE_DATASETS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    onLoadSample(sample.id);
                    onClose();
                  }}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                        {sample.industry}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {sample.name}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {sample.count} 則
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {sample.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-500">
          <span>所有資料於使用者本機 IndexedDB 運算儲存</span>
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

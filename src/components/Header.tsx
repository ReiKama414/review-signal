import React from 'react';
import { 
  Activity, 
  Upload, 
  Download, 
  HelpCircle, 
  Database, 
  HardDrive
} from 'lucide-react';
import { SAMPLE_DATASETS } from '@/lib/samples';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenMethodology: () => void;
  onLoadSample: (sampleId: string) => void;
  activeDatasetName: string;
  totalReviewCount: number;
  isDbSynced: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  onOpenMethodology,
  onLoadSample,
  activeDatasetName,
  totalReviewCount,
  isDbSynced,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-white tracking-tight">Review Signal</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                VoC Workbench
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1" title="IndexedDB 本機持久化已啟用">
                <HardDrive className="w-2.5 h-2.5" />
                <span>IndexedDB {isDbSynced ? '已同步' : '同步中'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Central Dataset Indicator & Quick Sample Switcher */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1 rounded text-xs">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">目前資料：</span>
          <span className="font-semibold text-slate-200 truncate max-w-[150px]">{activeDatasetName}</span>
          <span className="text-slate-500 font-mono">({totalReviewCount} 筆)</span>

          <div className="h-3 w-[1px] bg-slate-800 mx-1" />

          {/* Quick Sample Selector */}
          <div className="flex items-center space-x-1">
            {SAMPLE_DATASETS.map(sample => (
              <button
                key={sample.id}
                onClick={() => onLoadSample(sample.id)}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={sample.description}
              >
                {sample.name.replace(/平台|真實|用戶|顧客|評論|反饋/g, '')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Methodology & Transparency Disclosure */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
            title="查看情緒分析規則與算法透明度"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">算法透明度</span>
            <span className="text-[10px] bg-amber-400/20 px-1 rounded">規則詞典</span>
          </button>

          {/* Import Button */}
          <button
            onClick={onOpenImport}
            className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>匯入</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出</span>
          </button>
        </div>

      </div>
    </header>
  );
};

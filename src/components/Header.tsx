import React from 'react';
import { 
  Activity, 
  Upload, 
  Download, 
  HelpCircle, 
  Database, 
  Layers, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { SAMPLE_DATASETS } from '@/lib/samples';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenMethodology: () => void;
  onLoadSample: (sampleId: string) => void;
  activeDatasetName: string;
  totalReviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  onOpenMethodology,
  onLoadSample,
  activeDatasetName,
  totalReviewCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-white tracking-tight">Review Signal</h1>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                評論研究平台
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              客觀字詞規則 • N-gram 挖掘 • 問題分類統計 • 零假 AI 偽裝
            </p>
          </div>
        </div>

        {/* Central Dataset Indicator & Quick Sample Switcher */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <Database className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">當前資料：</span>
          <span className="font-semibold text-slate-200 truncate max-w-[160px]">{activeDatasetName}</span>
          <span className="text-slate-500">({totalReviewCount} 筆)</span>

          <div className="h-3 w-[1px] bg-slate-700 mx-1" />

          {/* Quick Sample Selector */}
          <div className="flex items-center space-x-1">
            {SAMPLE_DATASETS.map(sample => (
              <button
                key={sample.id}
                onClick={() => onLoadSample(sample.id)}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                title={sample.description}
              >
                {sample.name.split('顧客')[0].split('反饋')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Methodology & Transparency Disclosure */}
          <button
            onClick={onOpenMethodology}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-sm"
            title="查看情緒分析規則與算法透明度"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">算法透明度</span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">規則詞典</span>
          </button>

          {/* Import Button */}
          <button
            onClick={onOpenImport}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>匯入資料</span>
          </button>

          {/* Export Button */}
          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出報告</span>
          </button>

        </div>
      </div>
    </header>
  );
};

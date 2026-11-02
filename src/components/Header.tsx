import React, { useState } from 'react';
import {
  Activity,
  Upload,
  Download,
  HelpCircle,
  Database,
  HardDrive,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { SAMPLE_DATASETS } from '@/lib/samples';
import { ThemeMode } from '@/lib/theme';
import { useEscapeKey } from '@/lib/useEscapeKey';

interface HeaderProps {
  onOpenImport: () => void;
  onOpenExport: () => void;
  onOpenMethodology: () => void;
  onLoadSample: (sampleId: string) => void;
  activeDatasetName: string;
  totalReviewCount: number;
  isDbSynced: boolean;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const SAMPLE_SHORT_LABELS: Record<string, string> = {
  ecommerce_tw: '電商',
  saas_tool: 'SaaS',
  food_delivery: '外送',
};

export const Header: React.FC<HeaderProps> = ({
  onOpenImport,
  onOpenExport,
  onOpenMethodology,
  onLoadSample,
  activeDatasetName,
  totalReviewCount,
  isDbSynced,
  theme,
  onThemeChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);

  useEscapeKey(themeDropdownOpen || mobileMenuOpen || datasetDropdownOpen, () => {
    setThemeDropdownOpen(false);
    setMobileMenuOpen(false);
    setDatasetDropdownOpen(false);
  });

  const cycleTheme = () => {
    if (theme === 'system') onThemeChange('light');
    else if (theme === 'light') onThemeChange('dark');
    else onThemeChange('system');
  };

  const activeSample = SAMPLE_DATASETS.find((s) => s.name === activeDatasetName);

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-14 sm:min-h-16 py-2 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
              Review Signal
            </h1>
            <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              VoC
            </span>
            <span
              className="hidden 2xl:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              title="IndexedDB 本機持久化已啟用"
            >
              <HardDrive className="w-2.5 h-2.5" />
              <span>{isDbSynced ? 'IndexedDB 同步' : '同步中'}</span>
            </span>
          </div>
        </div>

        {/* Dataset switcher — compact dropdown, never overflows row */}
        <div className="hidden md:flex items-center min-w-0 flex-1 justify-center px-2">
          <div className="relative max-w-full">
            <button
              type="button"
              onClick={() => {
                setDatasetDropdownOpen((v) => !v);
                setThemeDropdownOpen(false);
              }}
              className="flex items-center gap-2 max-w-[min(100%,420px)] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              title={activeDatasetName}
            >
              <Database className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              <span className="text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">目前資料</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                {activeSample
                  ? SAMPLE_SHORT_LABELS[activeSample.id] || activeDatasetName
                  : activeDatasetName}
              </span>
              <span className="text-slate-500 font-mono shrink-0 whitespace-nowrap">({totalReviewCount})</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {datasetDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                aria-hidden="true"
                onClick={() => setDatasetDropdownOpen(false)}
              />
            )}

            {datasetDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-1 w-64 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1 z-50 text-xs">
                {SAMPLE_DATASETS.map((sample) => {
                  const short = SAMPLE_SHORT_LABELS[sample.id] || sample.name;
                  const selected = sample.name === activeDatasetName;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        onLoadSample(sample.id);
                        setDatasetDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                        selected
                          ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/70 dark:bg-indigo-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate">{short}</span>
                        <span className="font-mono text-slate-400 shrink-0">{sample.count} 筆</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400 truncate font-normal">
                        {sample.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenMethodology}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors whitespace-nowrap"
            title="查看情緒分析規則與算法透明度"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>算法透明度</span>
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>匯入</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>匯出</span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setThemeDropdownOpen((v) => !v);
                setDatasetDropdownOpen(false);
              }}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
              title={`目前主題：${theme === 'system' ? '跟隨系統' : theme === 'light' ? '淺色模式' : '深色模式'}`}
              aria-label="切換主題"
            >
              {theme === 'system' ? (
                <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              ) : theme === 'light' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {themeDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                aria-hidden="true"
                onClick={() => setThemeDropdownOpen(false)}
              />
            )}

            {themeDropdownOpen && (
              <div
                className="absolute right-0 mt-1 w-32 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1 z-50 text-xs"
                onClick={() => setThemeDropdownOpen(false)}
              >
                <button
                  onClick={() => onThemeChange('system')}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    theme === 'system'
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>跟隨系統</span>
                </button>
                <button
                  onClick={() => onThemeChange('light')}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    theme === 'light'
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>淺色模式</span>
                </button>
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                    theme === 'dark'
                      ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>深色模式</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile / tablet controls */}
        <div className="flex lg:hidden items-center gap-1.5 shrink-0">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            title="切換主題"
            aria-label="切換主題"
          >
            {theme === 'system' ? (
              <Monitor className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            aria-label="開啟選單"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-3">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
              <span className="text-slate-500 dark:text-slate-400">目前資料集</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {totalReviewCount} 筆
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2 break-words">
              {activeDatasetName}
            </p>
            <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-200 dark:border-slate-800">
              {SAMPLE_DATASETS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onLoadSample(sample.id);
                    setMobileMenuOpen(false);
                  }}
                  className="px-1.5 py-1.5 rounded text-[11px] font-medium text-center bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  {SAMPLE_SHORT_LABELS[sample.id] || sample.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => {
                onOpenMethodology();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-2 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 text-center flex flex-col items-center justify-center gap-1"
            >
              <HelpCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>算法透明度</span>
            </button>

            <button
              onClick={() => {
                onOpenImport();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-2 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-center flex flex-col items-center justify-center gap-1"
            >
              <Upload className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>匯入資料</span>
            </button>

            <button
              onClick={() => {
                onOpenExport();
                setMobileMenuOpen(false);
              }}
              className="py-2 px-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white text-center flex flex-col items-center justify-center gap-1"
            >
              <Download className="w-4 h-4" />
              <span>匯出報告</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-500 dark:text-slate-400">介面主題風格</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button
                onClick={() => onThemeChange('system')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  theme === 'system'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                系統
              </button>
              <button
                onClick={() => onThemeChange('light')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  theme === 'light'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                淺色
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  theme === 'dark'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                深色
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

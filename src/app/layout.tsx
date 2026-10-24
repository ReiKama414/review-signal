import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Review Signal - 評論研究與顧客之聲分析平台',
  description: '專業級評論研究平台：CSV/JSON 評論匯入、評分分布、時間趨勢、字詞頻率、N-gram 挖掘、手動標籤與問題分類統計。清楚區分字詞規則與真 AI 模型，100% 本地隱私分析。',
  keywords: ['評論分析', 'Review Analysis', '顧客之聲', 'VoC', 'N-gram', '中文斷詞', 'UX Research', '顧客滿意度'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

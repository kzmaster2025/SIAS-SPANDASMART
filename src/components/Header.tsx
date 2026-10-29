import React from 'react';
import { ActiveTab } from '../types';
import { Printer, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickPrint
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => setActiveTab('profil')}
        className="text-left group cursor-pointer focus:outline-none"
      >
        <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 block">
          SMP Negeri 2 Kota Sukabumi
        </span>
      </button>

      {/* Zone 2: 4–5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'dashboard' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('profil')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'profil' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Profil Sekolah
        </button>
        <button
          onClick={() => setActiveTab('kesiswaan')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'kesiswaan' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Kesiswaan
        </button>
        <button
          onClick={() => setActiveTab('dokumen')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'dokumen' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Kelola Dokumen
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
            activeTab === 'drive' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Google Drive
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono tabular-nums">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NPSN 20221614 · Terverifikasi</span>
        </div>
        <button
          onClick={onOpenQuickPrint}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak Surat / Dokumen</span>
        </button>
      </div>
    </header>
  );
};

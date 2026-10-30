import React from 'react';
import { ActiveTab, ProfilSekolahData } from '../types';
import { Printer, ShieldCheck, Lock, Unlock, Settings, LogOut, Edit3, Cloud } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickPrint: () => void;
  profil: ProfilSekolahData;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenChangePassword: () => void;
  onOpenEditProfil: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuickPrint,
  profil,
  isAdmin,
  onOpenLogin,
  onLogout,
  onOpenChangePassword,
  onOpenEditProfil
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white border-b border-slate-200">
      {/* Zone 1: Brand Wordmark with Logo */}
      <button
        onClick={() => setActiveTab('profil')}
        className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
      >
        {profil.logoUrl ? (
          <img
            src={profil.logoUrl}
            alt="Logo Sekolah"
            className="w-8 h-8 rounded-lg object-contain border border-slate-200 p-0.5 bg-white shadow-xs shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
            2
          </div>
        )}
        <div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 block leading-tight">
            {profil.nama}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:block">
            {profil.sebutan} · {profil.alamat.split(',')[0]}
          </span>
        </div>
      </button>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden xl:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'dashboard' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('profil')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'profil' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Profil Sekolah
        </button>
        <button
          onClick={() => setActiveTab('kesiswaan')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'kesiswaan' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Kesiswaan
        </button>
        <button
          onClick={() => setActiveTab('dokumen')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'dokumen' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Kelola Dokumen
        </button>
        <button
          onClick={() => setActiveTab('drive')}
          className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
            activeTab === 'drive' ? 'text-blue-700 font-semibold border-b-2 border-blue-600' : ''
          }`}
        >
          Google Drive
        </button>
      </nav>

      {/* Zone 3: Actions & Admin Authentication Status */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Real-time Cloud Sync Badge */}
        <div
          title="Database Cloud Firestore aktif: Sinkronisasi otomatis ke semua perangkat & browser publik"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg select-none"
        >
          <Cloud className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="font-semibold">Cloud Sync</span>
        </div>

        {/* Admin status pill */}
        {isAdmin ? (
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-emerald-800 hidden sm:inline">Admin</span>
            
            <button
              onClick={onOpenEditProfil}
              title="Edit Profil, Logo & Foto Sekolah"
              className="p-1 text-emerald-800 hover:text-blue-700 hover:bg-emerald-100 rounded transition-colors cursor-pointer ml-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenChangePassword}
              title="Ubah Password Admin"
              className="p-1 text-emerald-800 hover:text-slate-900 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              title="Keluar dari Mode Admin"
              className="p-1 text-emerald-800 hover:text-rose-700 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            title="Klik untuk membuka akses admin dengan password"
          >
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>Mode Admin</span>
          </button>
        )}

        {/* Quick Print Button */}
        <button
          onClick={onOpenQuickPrint}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 shadow-xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Cetak Surat</span>
        </button>
      </div>
    </header>
  );
};

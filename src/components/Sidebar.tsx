import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  School,
  Users,
  GraduationCap,
  BookOpen,
  CalendarCheck2,
  FileText,
  FolderKanban,
  Cloud,
  Wallet,
  Bell,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard Utama', icon: LayoutDashboard },
    { id: 'profil' as ActiveTab, label: 'Profil SMPN 2 Sukabumi', icon: School },
    { id: 'kesiswaan' as ActiveTab, label: 'Buku Induk Siswa', icon: Users },
    { id: 'guru' as ActiveTab, label: 'Pendidik & Tendik (GTK)', icon: GraduationCap },
    { id: 'akademik' as ActiveTab, label: 'Rapor & Asesmen', icon: BookOpen },
    { id: 'presensi' as ActiveTab, label: 'Presensi Kehadiran', icon: CalendarCheck2 },
    { id: 'persuratan' as ActiveTab, label: 'Tata Usaha & E-Surat', icon: FileText },
    { id: 'dokumen' as ActiveTab, label: 'Kelola Dokumen & SK', icon: FolderKanban },
    { id: 'drive' as ActiveTab, label: 'Google Drive Sekolah', icon: Cloud },
    { id: 'keuangan' as ActiveTab, label: 'Keuangan BOS & Komite', icon: Wallet },
    { id: 'agenda' as ActiveTab, label: 'Agenda & Pengumuman', icon: Bell }
  ];

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-[57px] left-0 z-50 md:z-20 h-screen md:h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col gap-5 overflow-y-auto">
          {/* Logo Brand in Sidebar */}
          <div className="px-2 pt-1 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0">
                2
              </div>
              <div>
                <p className="text-xs font-semibold text-blue-900 leading-tight">SIAS DIGITAL</p>
                <p className="text-sm font-bold text-slate-900 tracking-tight">SMPN 2 Sukabumi</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>Jl. Ir. H. Juanda No. 14</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1">
            <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
              Menu Administrasi
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Meta */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="text-[11px] text-slate-500 leading-relaxed">
            <p className="font-medium text-slate-700">Dinas Dikbud Kota Sukabumi</p>
            <p className="mt-0.5">Kecamatan Cikole · Akreditasi A</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">Tahun Ajaran 2025/2026</p>
          </div>
        </div>
      </aside>
    </>
  );
};

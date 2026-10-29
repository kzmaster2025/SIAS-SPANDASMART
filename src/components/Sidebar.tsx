import React from 'react';
import { ActiveTab, ProfilSekolahData, CustomMenu } from '../types';
import { getCustomMenuIcon } from '../utils/customIconHelper';
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
  MapPin,
  Lock,
  ShieldCheck,
  Edit3,
  Plus,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  profil: ProfilSekolahData;
  isAdmin: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenEditProfil: () => void;
  customMenus: CustomMenu[];
  onOpenAddCustomMenu: () => void;
  onOpenEditCustomMenu: (menu: CustomMenu) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  profil,
  isAdmin,
  onOpenLogin,
  onLogout,
  onOpenEditProfil,
  customMenus,
  onOpenAddCustomMenu,
  onOpenEditCustomMenu
}) => {
  const menuItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard Utama', icon: LayoutDashboard, adminOnly: false },
    { id: 'profil' as ActiveTab, label: 'Profil Sekolah & Fasilitas', icon: School, adminOnly: false },
    { id: 'kesiswaan' as ActiveTab, label: 'Buku Induk Siswa', icon: Users, adminOnly: false },
    { id: 'guru' as ActiveTab, label: 'Pendidik & Tendik (GTK)', icon: GraduationCap, adminOnly: false },
    { id: 'akademik' as ActiveTab, label: 'Rapor & Asesmen', icon: BookOpen, adminOnly: false },
    { id: 'presensi' as ActiveTab, label: 'Presensi Kehadiran', icon: CalendarCheck2, adminOnly: false },
    { id: 'persuratan' as ActiveTab, label: 'Tata Usaha & E-Surat', icon: FileText, adminOnly: false },
    { id: 'dokumen' as ActiveTab, label: 'Kelola Dokumen & SK', icon: FolderKanban, adminOnly: true },
    { id: 'drive' as ActiveTab, label: 'Google Drive Sekolah', icon: Cloud, adminOnly: true },
    { id: 'keuangan' as ActiveTab, label: 'Keuangan BOS & Komite', icon: Wallet, adminOnly: true },
    { id: 'agenda' as ActiveTab, label: 'Agenda & Pengumuman', icon: Bell, adminOnly: false }
  ];

  const handleSelect = (id: ActiveTab, adminOnly: boolean) => {
    if (adminOnly && !isAdmin) {
      onOpenLogin();
      return;
    }
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
        <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* Logo Brand in Sidebar */}
          <div className="px-2 pt-1 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {profil.logoUrl ? (
                <img
                  src={profil.logoUrl}
                  alt="Logo Sekolah"
                  className="w-10 h-10 rounded-xl object-contain border border-slate-200 p-0.5 bg-white shadow-xs shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-xs shrink-0">
                  2
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-blue-900 leading-tight tracking-wider uppercase">SIAS DIGITAL</p>
                <p className="text-xs font-bold text-slate-900 tracking-tight truncate">{profil.sebutan || profil.nama}</p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                  <span className="truncate">{profil.alamat.split(',')[0]}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex flex-col gap-1">
            <div className="px-3 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
              <span>Menu Administrasi</span>
              {!isAdmin && <span className="text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded font-medium">Tamu</span>}
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isLocked = item.adminOnly && !isAdmin;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id, item.adminOnly)}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {isLocked && (
                    <span title="Perlu password admin">
                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    </span>
                  )}
                </button>
              );
            })}

            {/* Custom Menus Section */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-1">
              <div className="px-3 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
                <span>Menu Kustom ({customMenus.length})</span>
                {isAdmin ? (
                  <button
                    onClick={onOpenAddCustomMenu}
                    className="text-[10px] text-blue-700 hover:text-blue-800 font-bold flex items-center gap-0.5 cursor-pointer"
                    title="Tambah tombol menu baru"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tambah</span>
                  </button>
                ) : (
                  <span className="text-[9px] text-slate-400 font-normal">Kustom</span>
                )}
              </div>

              {customMenus.map((custom) => {
                const CustomIcon = getCustomMenuIcon(custom.iconName);
                const isActive = activeTab === custom.id;
                const isLocked = custom.adminOnly && !isAdmin;

                return (
                  <div key={custom.id} className="relative group/custom flex items-center">
                    <button
                      onClick={() => handleSelect(custom.id, custom.adminOnly)}
                      className={`flex-1 flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <CustomIcon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                        <span className="truncate">{custom.label}</span>
                      </div>

                      {isLocked && (
                        <span title="Perlu password admin">
                          <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                        </span>
                      )}
                    </button>

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditCustomMenu(custom);
                        }}
                        title="Pengaturan Menu Ini"
                        className="opacity-0 group-hover/custom:opacity-100 absolute right-2 p-1 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded transition-opacity cursor-pointer"
                      >
                        <Settings className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Add Custom Menu Shortcut Button */}
              <button
                onClick={isAdmin ? onOpenAddCustomMenu : onOpenLogin}
                className="mt-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 text-[11px] font-semibold text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Tombol Menu</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer Meta & Admin Mode Switch */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50/80 space-y-2">
          {isAdmin ? (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Admin Terbuka</span>
                </div>
                <button
                  onClick={onOpenEditProfil}
                  title="Edit Tampilan & Logo"
                  className="p-1 text-emerald-800 hover:text-blue-700 hover:bg-emerald-100 rounded cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[10px] text-emerald-700 mt-1">Hak akses penuh aktif.</p>
              <button
                onClick={onLogout}
                className="mt-2 w-full py-1 text-[11px] font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
              >
                Kunci / Keluar Admin
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-blue-700" />
              <span>Buka Menu Admin</span>
            </button>
          )}

          <div className="text-[10px] text-slate-400 px-1 pt-1 flex items-center justify-between">
            <span>{profil.dinas.split(' ')[0]} {profil.dinas.split(' ')[1]}</span>
            <span className="font-mono">{profil.npsn}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

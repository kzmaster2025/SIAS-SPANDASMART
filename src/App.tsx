/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Siswa,
  GuruTendik,
  SuratResmi,
  TransaksiKeuangan,
  AgendaSekolah,
  RaporSiswa,
  DokumenSekolah,
  ProfilSekolahData,
  CustomMenu,
  CustomMenuItem
} from './types';
import {
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_SURAT,
  INITIAL_TRANSAKSI,
  INITIAL_AGENDA,
  INITIAL_DOKUMEN,
  PROFIL_SEKOLAH
} from './data/mockData';
import {
  INITIAL_CUSTOM_MENUS,
  INITIAL_CUSTOM_ITEMS
} from './data/mockCustomData';
import {
  subscribeProfilSekolah,
  subscribeGuru,
  subscribeSiswa,
  subscribeCustomMenus,
  subscribeCustomItems,
  subscribeDokumen,
  subscribeSurat,
  subscribeTransaksi,
  subscribeAgenda,
  saveProfilSekolahCloud,
  saveSiswaCloud,
  deleteSiswaCloud,
  saveGuruCloud,
  deleteGuruCloud,
  batchImportGuruCloud,
  saveDokumenCloud,
  deleteDokumenCloud,
  saveSuratCloud,
  saveTransaksiCloud,
  saveAgendaCloud,
  saveCustomMenuCloud,
  deleteCustomMenuCloud,
  saveCustomMenuItemCloud,
  deleteCustomMenuItemCloud
} from './services/firestoreService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ProfileSekolah } from './components/ProfileSekolah';
import { DashboardOverview } from './components/DashboardOverview';
import { AdministrasiKesiswaan } from './components/AdministrasiKesiswaan';
import { AdministrasiGuru } from './components/AdministrasiGuru';
import { AdministrasiAkademik } from './components/AdministrasiAkademik';
import { AdministrasiPresensi } from './components/AdministrasiPresensi';
import { TataUsahaSurat } from './components/TataUsahaSurat';
import { PanelKelolaDokumen } from './components/PanelKelolaDokumen';
import { GoogleDriveSekolah } from './components/GoogleDriveSekolah';
import { AdministrasiKeuangan } from './components/AdministrasiKeuangan';
import { AgendaPengumuman } from './components/AgendaPengumuman';
import { CustomMenuPage } from './components/CustomMenuPage';
import { CustomMenuModal } from './components/CustomMenuModal';
import { CustomItemUploadModal } from './components/CustomItemUploadModal';
import { KartuPelajarModal } from './components/KartuPelajarModal';
import { CetakSuratModal } from './components/CetakSuratModal';
import { CetakRaporModal } from './components/CetakRaporModal';
import { PreviewDokumenModal } from './components/PreviewDokumenModal';
import { EditProfilModal } from './components/EditProfilModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Menu, ChevronRight, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profil');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // School Profile Store with LocalStorage Persistence
  const [profilSekolah, setProfilSekolah] = useState<ProfilSekolahData>(() => {
    try {
      const saved = localStorage.getItem('sias_profil_sekolah');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Gagal memuat profil sekolah dari cache local', e);
    }
    return PROFIL_SEKOLAH as unknown as ProfilSekolahData;
  });

  // Admin Authentication State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sias_is_admin') === 'true';
    } catch {
      return false;
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('sias_admin_password') || 'admin123';
    } catch {
      return 'admin123';
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'change_password'>('login');
  const [isEditProfilModalOpen, setIsEditProfilModalOpen] = useState(false);

  // Core Data Stores
  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [guruList, setGuruList] = useState<GuruTendik[]>(() => {
    try {
      const saved = localStorage.getItem('sias_guru_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Gagal memuat cache data guru:', e);
    }
    return INITIAL_GURU;
  });
  const [suratList, setSuratList] = useState<SuratResmi[]>(INITIAL_SURAT);
  const [dokumenList, setDokumenList] = useState<DokumenSekolah[]>(INITIAL_DOKUMEN);
  const [transaksiList, setTransaksiList] = useState<TransaksiKeuangan[]>(INITIAL_TRANSAKSI);
  const [agendaList, setAgendaList] = useState<AgendaSekolah[]>(INITIAL_AGENDA);

  // Custom Menus & Multimedia/Links Stores
  const [customMenus, setCustomMenus] = useState<CustomMenu[]>(() => {
    try {
      const saved = localStorage.getItem('sias_custom_menus');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Gagal memuat cache menu kustom:', e);
    }
    return INITIAL_CUSTOM_MENUS;
  });

  const [customMenuItems, setCustomMenuItems] = useState<CustomMenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('sias_custom_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Gagal memuat cache konten menu kustom:', e);
    }
    return INITIAL_CUSTOM_ITEMS;
  });

  // Modals for Custom Menu & Uploads
  const [isCustomMenuModalOpen, setIsCustomMenuModalOpen] = useState(false);
  const [editingCustomMenu, setEditingCustomMenu] = useState<CustomMenu | null>(null);
  const [isUploadItemModalOpen, setIsUploadItemModalOpen] = useState(false);
  const [uploadItemMenuId, setUploadItemMenuId] = useState<string | null>(null);
  const [editingCustomItem, setEditingCustomItem] = useState<CustomMenuItem | null>(null);

  // Modals for Printing & Preview
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Siswa | null>(null);
  const [selectedSuratForPrint, setSelectedSuratForPrint] = useState<SuratResmi | null>(null);
  const [selectedRaporForPrint, setSelectedRaporForPrint] = useState<{ rapor: RaporSiswa; siswa: Siswa } | null>(null);
  const [selectedDokumenForPreview, setSelectedDokumenForPreview] = useState<DokumenSekolah | null>(null);

  // Auth Handlers
  const handleSuccessLogin = () => {
    setIsAdmin(true);
    try {
      localStorage.setItem('sias_is_admin', 'true');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    try {
      localStorage.setItem('sias_is_admin', 'false');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleUpdatePassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem('sias_admin_password', newPass);
    } catch (e) {
      console.warn(e);
    }
  };

  // Real-time synchronization across devices and browsers via Firestore
  useEffect(() => {
    const unsubProfil = subscribeProfilSekolah((p) => {
      setProfilSekolah(p);
      try {
        localStorage.setItem('sias_profil_sekolah', JSON.stringify(p));
      } catch (e) {
        console.warn(e);
      }
    });

    const unsubGuru = subscribeGuru((g) => {
      setGuruList(g);
      try {
        localStorage.setItem('sias_guru_list', JSON.stringify(g));
      } catch (e) {
        console.warn(e);
      }
    });

    const unsubSiswa = subscribeSiswa((s) => {
      setSiswaList(s);
    });

    const unsubMenus = subscribeCustomMenus((m) => {
      setCustomMenus(m);
      try {
        localStorage.setItem('sias_custom_menus', JSON.stringify(m));
      } catch (e) {
        console.warn(e);
      }
    });

    const unsubItems = subscribeCustomItems((it) => {
      setCustomMenuItems(it);
      try {
        localStorage.setItem('sias_custom_items', JSON.stringify(it));
      } catch (e) {
        console.warn(e);
      }
    });

    const unsubDok = subscribeDokumen((d) => {
      setDokumenList(d);
    });

    const unsubSurat = subscribeSurat((sr) => {
      setSuratList(sr);
    });

    const unsubTrx = subscribeTransaksi((trx) => {
      setTransaksiList(trx);
    });

    const unsubAgenda = subscribeAgenda((ag) => {
      setAgendaList(ag);
    });

    return () => {
      unsubProfil();
      unsubGuru();
      unsubSiswa();
      unsubMenus();
      unsubItems();
      unsubDok();
      unsubSurat();
      unsubTrx();
      unsubAgenda();
    };
  }, []);

  // Profile Handlers
  const handleSaveProfil = async (updated: ProfilSekolahData) => {
    setProfilSekolah(updated);
    try {
      localStorage.setItem('sias_profil_sekolah', JSON.stringify(updated));
      await saveProfilSekolahCloud(updated);
    } catch (e) {
      console.warn('Gagal menyimpan profil ke cloud:', e);
    }
  };

  const handleResetDefaultProfil = async () => {
    const defaultData = PROFIL_SEKOLAH as unknown as ProfilSekolahData;
    setProfilSekolah(defaultData);
    try {
      localStorage.removeItem('sias_profil_sekolah');
      await saveProfilSekolahCloud(defaultData);
    } catch (e) {
      console.warn(e);
    }
  };

  // Student Handlers
  const handleAddSiswa = async (siswa: Siswa) => {
    setSiswaList(prev => [siswa, ...prev]);
    await saveSiswaCloud(siswa);
  };

  const handleUpdateSiswa = async (siswa: Siswa) => {
    setSiswaList(prev => prev.map(s => s.id === siswa.id ? siswa : s));
    await saveSiswaCloud(siswa);
  };

  const handleDeleteSiswa = async (id: string) => {
    setSiswaList(prev => prev.filter(s => s.id !== id));
    await deleteSiswaCloud(id);
  };

  // Guru Handlers
  const saveGuruListToStorage = (list: GuruTendik[]) => {
    try {
      localStorage.setItem('sias_guru_list', JSON.stringify(list));
    } catch (e) {
      console.warn('Gagal menyimpan data GTK ke local storage', e);
    }
  };

  const handleAddGuru = async (guru: GuruTendik) => {
    setGuruList(prev => {
      const updated = [guru, ...prev];
      saveGuruListToStorage(updated);
      return updated;
    });
    await saveGuruCloud(guru);
  };

  const handleUpdateGuru = async (guru: GuruTendik) => {
    setGuruList(prev => {
      const updated = prev.map(g => g.id === guru.id ? guru : g);
      saveGuruListToStorage(updated);
      return updated;
    });
    await saveGuruCloud(guru);
  };

  const handleDeleteGuru = async (id: string) => {
    setGuruList(prev => {
      const updated = prev.filter(g => g.id !== id);
      saveGuruListToStorage(updated);
      return updated;
    });
    await deleteGuruCloud(id);
  };

  const handleBatchImportGuru = async (imported: GuruTendik[], mode: 'append' | 'replace') => {
    let updated: GuruTendik[];
    if (mode === 'replace') {
      updated = [...imported];
    } else {
      const existingIds = new Set(guruList.map(g => g.id));
      const filteredImport = imported.filter(g => !existingIds.has(g.id));
      updated = [...filteredImport, ...guruList];
    }
    setGuruList(updated);
    saveGuruListToStorage(updated);
    await batchImportGuruCloud(updated, mode);
  };

  // Surat Handlers
  const handleAddSurat = async (surat: SuratResmi) => {
    setSuratList(prev => [surat, ...prev]);
    await saveSuratCloud(surat);
  };

  // Dokumen Handlers
  const handleAddDokumen = async (docItem: DokumenSekolah) => {
    setDokumenList(prev => [docItem, ...prev]);
    await saveDokumenCloud(docItem);
  };

  const handleUpdateDokumen = async (docItem: DokumenSekolah) => {
    setDokumenList(prev => prev.map(d => d.id === docItem.id ? docItem : d));
    await saveDokumenCloud(docItem);
  };

  const handleDeleteDokumen = async (id: string) => {
    setDokumenList(prev => prev.filter(d => d.id !== id));
    await deleteDokumenCloud(id);
  };

  // Transaksi Handlers
  const handleAddTransaksi = async (trx: TransaksiKeuangan) => {
    setTransaksiList(prev => [trx, ...prev]);
    await saveTransaksiCloud(trx);
  };

  // Agenda Handlers
  const handleAddAgenda = async (ag: AgendaSekolah) => {
    setAgendaList(prev => [ag, ...prev]);
    await saveAgendaCloud(ag);
  };

  // Custom Menu Handlers
  const saveCustomMenusToStorage = (menus: CustomMenu[]) => {
    try {
      localStorage.setItem('sias_custom_menus', JSON.stringify(menus));
    } catch (e) {
      console.warn('Gagal menyimpan menu kustom ke local storage', e);
    }
  };

  const saveCustomItemsToStorage = (items: CustomMenuItem[]) => {
    try {
      localStorage.setItem('sias_custom_items', JSON.stringify(items));
    } catch (e) {
      console.warn('Gagal menyimpan konten menu kustom ke local storage', e);
    }
  };

  const handleSaveCustomMenu = async (menu: CustomMenu) => {
    setCustomMenus(prev => {
      const exists = prev.some(m => m.id === menu.id);
      const updated = exists ? prev.map(m => m.id === menu.id ? menu : m) : [...prev, menu];
      saveCustomMenusToStorage(updated);
      return updated;
    });
    setActiveTab(menu.id);
    await saveCustomMenuCloud(menu);
  };

  const handleDeleteCustomMenu = async (id: string) => {
    setCustomMenus(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveCustomMenusToStorage(updated);
      return updated;
    });
    setCustomMenuItems(prev => {
      const updated = prev.filter(i => i.menuId !== id);
      saveCustomItemsToStorage(updated);
      return updated;
    });
    if (activeTab === id) {
      setActiveTab('profil');
    }
    await deleteCustomMenuCloud(id);
  };

  const handleSaveCustomItem = async (item: CustomMenuItem) => {
    setCustomMenuItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      const updated = exists ? prev.map(i => i.id === item.id ? item : i) : [item, ...prev];
      saveCustomItemsToStorage(updated);
      return updated;
    });
    await saveCustomMenuItemCloud(item);
  };

  const handleDeleteCustomItem = async (id: string) => {
    setCustomMenuItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveCustomItemsToStorage(updated);
      return updated;
    });
    await deleteCustomMenuItemCloud(id);
  };

  const getBreadcrumbTitle = () => {
    const customMatch = customMenus.find(m => m.id === activeTab);
    if (customMatch) return customMatch.label;

    switch (activeTab) {
      case 'dashboard': return 'Dashboard Utama';
      case 'profil': return 'Profil Lembaga & Fasilitas';
      case 'kesiswaan': return 'Buku Induk Kesiswaan';
      case 'guru': return 'Kepegawaian (GTK)';
      case 'akademik': return 'Rapor & Kurikulum Merdeka';
      case 'presensi': return 'Presensi Kehadiran';
      case 'persuratan': return 'Tata Usaha & E-Surat';
      case 'dokumen': return 'Panel Kelola Dokumen & SK';
      case 'drive': return 'Google Drive Sekolah & Cloud';
      case 'keuangan': return 'Buku Kas Umum BOS & Komite';
      case 'agenda': return 'Agenda & Pengumuman';
      default: return 'Portal Administrasi';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickPrint={() => {
          if (suratList[0]) {
            setSelectedSuratForPrint(suratList[0]);
          }
        }}
        profil={profilSekolah}
        isAdmin={isAdmin}
        onOpenLogin={() => {
          setLoginModalMode('login');
          setIsLoginModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenChangePassword={() => {
          setLoginModalMode('change_password');
          setIsLoginModalOpen(true);
        }}
        onOpenEditProfil={() => setIsEditProfilModalOpen(true)}
      />

      {/* Main Administrative Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
          profil={profilSekolah}
          isAdmin={isAdmin}
          onOpenLogin={() => {
            setLoginModalMode('login');
            setIsLoginModalOpen(true);
          }}
          onLogout={handleLogout}
          onOpenEditProfil={() => setIsEditProfilModalOpen(true)}
          customMenus={customMenus}
          onOpenAddCustomMenu={() => {
            setEditingCustomMenu(null);
            setIsCustomMenuModalOpen(true);
          }}
          onOpenEditCustomMenu={(menu) => {
            setEditingCustomMenu(menu);
            setIsCustomMenuModalOpen(true);
          }}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {/* Mobile hamburger & Contextual Breadcrumb */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                onClick={() => setIsOpenMobile(true)}
                className="p-1.5 -ml-1.5 mr-1 rounded-md text-slate-600 hover:bg-slate-200 md:hidden cursor-pointer"
                title="Buka Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-medium text-slate-800">{profilSekolah.sebutan || 'SMPN 2 Sukabumi'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-700 font-semibold">{getBreadcrumbTitle()}</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span className="truncate max-w-xs">{profilSekolah.alamat.split(',')[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">Akreditasi {profilSekolah.akreditasi}</span>
            </div>
          </div>

          {/* Active View */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onNavigateTab={(tab) => setActiveTab(tab)}
              siswaList={siswaList}
              guruList={guruList}
              suratList={suratList}
              dokumenList={dokumenList}
              transaksiList={transaksiList}
              agendaList={agendaList}
              onOpenCreateSurat={() => setActiveTab('persuratan')}
              onOpenAddSiswa={() => setActiveTab('kesiswaan')}
            />
          )}

          {activeTab === 'profil' && (
            <ProfileSekolah
              onNavigateToTab={(tab) => setActiveTab(tab)}
              profil={profilSekolah}
              isAdmin={isAdmin}
              onOpenEdit={() => setIsEditProfilModalOpen(true)}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
            />
          )}

          {activeTab === 'kesiswaan' && (
            <AdministrasiKesiswaan
              siswaList={siswaList}
              onAddSiswa={handleAddSiswa}
              onUpdateSiswa={handleUpdateSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              onPrintKartuPelajar={(siswa) => setSelectedStudentForCard(siswa)}
            />
          )}

          {activeTab === 'guru' && (
            <AdministrasiGuru
              guruList={guruList}
              onAddGuru={handleAddGuru}
              onUpdateGuru={handleUpdateGuru}
              onDeleteGuru={handleDeleteGuru}
              onBatchImportGuru={handleBatchImportGuru}
            />
          )}

          {activeTab === 'akademik' && (
            <AdministrasiAkademik
              siswaList={siswaList}
              onPrintRapor={(rapor, siswa) => setSelectedRaporForPrint({ rapor, siswa })}
            />
          )}

          {activeTab === 'presensi' && (
            <AdministrasiPresensi siswaList={siswaList} />
          )}

          {activeTab === 'persuratan' && (
            <TataUsahaSurat
              suratList={suratList}
              siswaList={siswaList}
              guruList={guruList}
              onAddSurat={handleAddSurat}
              onPrintSurat={(surat) => setSelectedSuratForPrint(surat)}
            />
          )}

          {activeTab === 'dokumen' && (
            <PanelKelolaDokumen
              dokumenList={dokumenList}
              onAddDokumen={handleAddDokumen}
              onUpdateDokumen={handleUpdateDokumen}
              onDeleteDokumen={handleDeleteDokumen}
              onPreviewDokumen={(doc) => setSelectedDokumenForPreview(doc)}
              onNavigateToDrive={() => setActiveTab('drive')}
              onUploadToDrive={() => setActiveTab('drive')}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
            />
          )}

          {activeTab === 'drive' && (
            <GoogleDriveSekolah dokumenSekolahList={dokumenList} />
          )}

          {activeTab === 'keuangan' && (
            <AdministrasiKeuangan
              transaksiList={transaksiList}
              onAddTransaksi={handleAddTransaksi}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaPengumuman
              agendaList={agendaList}
              onAddAgenda={handleAddAgenda}
            />
          )}

          {/* Dynamic Custom Menu Pages (Videos, Images, and Links) */}
          {(() => {
            const activeCustom = customMenus.find(m => m.id === activeTab);
            if (!activeCustom) return null;
            return (
              <CustomMenuPage
                menu={activeCustom}
                items={customMenuItems}
                isAdmin={isAdmin}
                onOpenEditMenu={(menu) => {
                  setEditingCustomMenu(menu);
                  setIsCustomMenuModalOpen(true);
                }}
                onOpenAddItem={(menuId) => {
                  setUploadItemMenuId(menuId);
                  setEditingCustomItem(null);
                  setIsUploadItemModalOpen(true);
                }}
                onOpenEditItem={(item) => {
                  setUploadItemMenuId(item.menuId);
                  setEditingCustomItem(item);
                  setIsUploadItemModalOpen(true);
                }}
                onDeleteItem={handleDeleteCustomItem}
                onOpenAdminLogin={() => {
                  setLoginModalMode('login');
                  setIsLoginModalOpen(true);
                }}
              />
            );
          })()}
        </main>
      </div>

      {/* Custom Menu Modal (Tambah / Edit Tombol Menu Sidebar) */}
      <CustomMenuModal
        isOpen={isCustomMenuModalOpen}
        onClose={() => setIsCustomMenuModalOpen(false)}
        editingMenu={editingCustomMenu}
        onSaveMenu={handleSaveCustomMenu}
        onDeleteMenu={handleDeleteCustomMenu}
      />

      {/* Custom Item Upload Modal (Upload Video, Gambar, Tautan) */}
      <CustomItemUploadModal
        isOpen={isUploadItemModalOpen}
        onClose={() => {
          setIsUploadItemModalOpen(false);
          setEditingCustomItem(null);
          setUploadItemMenuId(null);
        }}
        menuId={uploadItemMenuId || customMenus[0]?.id || ''}
        menuLabel={customMenus.find(m => m.id === uploadItemMenuId)?.label || 'Menu Kustom'}
        editingItem={editingCustomItem}
        onSaveItem={handleSaveCustomItem}
        onDeleteItem={handleDeleteCustomItem}
      />

      {/* Admin Modals */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
        currentPassword={adminPassword}
        onUpdatePassword={handleUpdatePassword}
        initialMode={loginModalMode}
      />

      <EditProfilModal
        isOpen={isEditProfilModalOpen}
        onClose={() => setIsEditProfilModalOpen(false)}
        profilData={profilSekolah}
        onSave={handleSaveProfil}
        onResetDefault={handleResetDefaultProfil}
      />

      {/* Printable & Preview Modals */}
      <KartuPelajarModal
        siswa={selectedStudentForCard}
        onClose={() => setSelectedStudentForCard(null)}
      />

      <CetakSuratModal
        surat={selectedSuratForPrint}
        onClose={() => setSelectedSuratForPrint(null)}
        profil={profilSekolah}
      />

      <CetakRaporModal
        rapor={selectedRaporForPrint?.rapor || null}
        siswa={selectedRaporForPrint?.siswa || null}
        onClose={() => setSelectedRaporForPrint(null)}
      />

      <PreviewDokumenModal
        dokumen={selectedDokumenForPreview}
        onClose={() => setSelectedDokumenForPreview(null)}
      />
    </div>
  );
}

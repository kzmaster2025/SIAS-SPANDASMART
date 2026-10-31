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
  PROFIL_SEKOLAH,
  MOCK_RAPOR_CONTOH,
  RAPOR_ADELIA
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
  batchImportSiswaCloud,
  saveGuruCloud,
  deleteGuruCloud,
  batchImportGuruCloud,
  saveDokumenCloud,
  deleteDokumenCloud,
  saveSuratCloud,
  deleteSuratCloud,
  saveTransaksiCloud,
  deleteTransaksiCloud,
  batchImportTransaksiCloud,
  saveAgendaCloud,
  deleteAgendaCloud,
  saveCustomMenuCloud,
  deleteCustomMenuCloud,
  saveCustomMenuItemCloud,
  deleteCustomMenuItemCloud,
  subscribeRapor,
  saveRaporCloud,
  subscribePresensi,
  savePresensiDateCloud
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
  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    try {
      const saved = localStorage.getItem('sias_siswa_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Gagal memuat cache data siswa:', e);
    }
    return INITIAL_SISWA;
  });
  const [guruList, setGuruList] = useState<GuruTendik[]>(() => {
    try {
      const saved = localStorage.getItem('sias_guru_list');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Gagal memuat cache data guru:', e);
    }
    return INITIAL_GURU;
  });
  const [suratList, setSuratList] = useState<SuratResmi[]>(() => {
    try {
      const saved = localStorage.getItem('sias_surat_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SURAT;
  });
  const [dokumenList, setDokumenList] = useState<DokumenSekolah[]>(() => {
    try {
      const saved = localStorage.getItem('sias_dokumen_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DOKUMEN;
  });
  const [transaksiList, setTransaksiList] = useState<TransaksiKeuangan[]>(() => {
    try {
      const saved = localStorage.getItem('sias_transaksi_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_TRANSAKSI;
  });
  const [agendaList, setAgendaList] = useState<AgendaSekolah[]>(() => {
    try {
      const saved = localStorage.getItem('sias_agenda_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_AGENDA;
  });

  // Rapor & Asesmen Store
  const [raporStore, setRaporStore] = useState<Record<string, RaporSiswa>>(() => {
    try {
      const saved = localStorage.getItem('sias_rapor_store');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { 'sis-01': MOCK_RAPOR_CONTOH, 'sis-10': RAPOR_ADELIA, ...parsed };
      }
    } catch (e) {
      console.warn('Gagal memuat cache rapor:', e);
    }
    return { 'sis-01': MOCK_RAPOR_CONTOH, 'sis-10': RAPOR_ADELIA };
  });

  // Presensi Kehadiran Store (Keyed by date YYYY-MM-DD)
  const [presensiStore, setPresensiStore] = useState<Record<string, { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }>>(() => {
    try {
      const saved = localStorage.getItem('sias_presensi_store');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Gagal memuat cache presensi:', e);
    }
    return {};
  });

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
      if (s && s.length > 0) {
        setSiswaList(s);
        try {
          localStorage.setItem('sias_siswa_list', JSON.stringify(s));
        } catch (e) {
          console.warn(e);
        }
      }
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
      if (sr && sr.length > 0) {
        setSuratList(sr);
        try {
          localStorage.setItem('sias_surat_list', JSON.stringify(sr));
        } catch (e) {
          console.warn(e);
        }
      }
    });

    const unsubTrx = subscribeTransaksi((trx) => {
      setTransaksiList(trx);
    });

    const unsubAgenda = subscribeAgenda((ag) => {
      setAgendaList(ag);
    });

    const unsubRapor = subscribeRapor((r) => {
      setRaporStore(prev => {
        const merged = { ...prev, ...r };
        try {
          localStorage.setItem('sias_rapor_store', JSON.stringify(merged));
        } catch (e) {
          console.warn(e);
        }
        return merged;
      });
    });

    const unsubPresensi = subscribePresensi((p) => {
      setPresensiStore(prev => ({ ...prev, ...p }));
      try {
        localStorage.setItem('sias_presensi_store', JSON.stringify(p));
      } catch (e) {
        console.warn(e);
      }
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
      unsubRapor();
      unsubPresensi();
    };
  }, []);

  // Profile Handlers
  const handleSaveProfil = async (updated: ProfilSekolahData) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setProfilSekolah(updated);
    try {
      localStorage.setItem('sias_profil_sekolah', JSON.stringify(updated));
      await saveProfilSekolahCloud(updated);
    } catch (e) {
      console.warn('Gagal menyimpan profil ke cloud:', e);
    }
  };

  const handleSaveRapor = async (rapor: RaporSiswa) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setRaporStore(prev => {
      const updated = { ...prev, [rapor.siswaId]: rapor };
      try {
        localStorage.setItem('sias_rapor_store', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveRaporCloud(rapor);
  };

  const handleSavePresensi = async (
    tanggal: string,
    data: { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }
  ) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setPresensiStore(prev => {
      const updated = { ...prev, [tanggal]: data };
      try {
        localStorage.setItem('sias_presensi_store', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await savePresensiDateCloud(tanggal, data);
  };

  const handleResetDefaultProfil = async () => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
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
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setSiswaList(prev => [siswa, ...prev]);
    await saveSiswaCloud(siswa);
  };

  const handleUpdateSiswa = async (siswa: Siswa) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setSiswaList(prev => prev.map(s => s.id === siswa.id ? siswa : s));
    await saveSiswaCloud(siswa);
  };

  const handleDeleteSiswa = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setSiswaList(prev => prev.filter(s => s.id !== id));
    await deleteSiswaCloud(id);
  };

  const handleBatchImportSiswa = async (imported: Siswa[], mode: 'append' | 'replace') => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    let updated: Siswa[];
    if (mode === 'replace') {
      updated = [...imported];
    } else {
      const existingIds = new Set(siswaList.map(s => s.id));
      const filteredImport = imported.filter(s => !existingIds.has(s.id));
      updated = [...filteredImport, ...siswaList];
    }
    setSiswaList(updated);
    try {
      localStorage.setItem('sias_siswa_list', JSON.stringify(updated));
    } catch (e) {
      console.warn('Gagal menyimpan data siswa ke local storage', e);
    }
    await batchImportSiswaCloud(updated, mode);
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
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setGuruList(prev => {
      const updated = [guru, ...prev];
      saveGuruListToStorage(updated);
      return updated;
    });
    await saveGuruCloud(guru);
  };

  const handleUpdateGuru = async (guru: GuruTendik) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setGuruList(prev => {
      const updated = prev.map(g => g.id === guru.id ? guru : g);
      saveGuruListToStorage(updated);
      return updated;
    });
    await saveGuruCloud(guru);
  };

  const handleDeleteGuru = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setGuruList(prev => {
      const updated = prev.filter(g => g.id !== id);
      saveGuruListToStorage(updated);
      return updated;
    });
    await deleteGuruCloud(id);
  };

  const handleBatchImportGuru = async (imported: GuruTendik[], mode: 'append' | 'replace') => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
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
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setSuratList(prev => {
      const updated = [surat, ...prev];
      try {
        localStorage.setItem('sias_surat_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveSuratCloud(surat);
  };

  const handleUpdateSurat = async (surat: SuratResmi) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setSuratList(prev => {
      const updated = prev.map(s => s.id === surat.id ? surat : s);
      try {
        localStorage.setItem('sias_surat_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveSuratCloud(surat);
  };

  const handleDeleteSurat = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setSuratList(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('sias_surat_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await deleteSuratCloud(id);
  };

  // Dokumen Handlers
  const handleAddDokumen = async (docItem: DokumenSekolah) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setDokumenList(prev => [docItem, ...prev]);
    await saveDokumenCloud(docItem);
  };

  const handleUpdateDokumen = async (docItem: DokumenSekolah) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setDokumenList(prev => prev.map(d => d.id === docItem.id ? docItem : d));
    await saveDokumenCloud(docItem);
  };

  const handleDeleteDokumen = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setDokumenList(prev => prev.filter(d => d.id !== id));
    await deleteDokumenCloud(id);
  };

  // Transaksi Handlers
  const handleAddTransaksi = async (trx: TransaksiKeuangan) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setTransaksiList(prev => {
      const updated = [trx, ...prev];
      try {
        localStorage.setItem('sias_transaksi_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveTransaksiCloud(trx);
  };

  const handleUpdateTransaksi = async (trx: TransaksiKeuangan) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setTransaksiList(prev => {
      const updated = prev.map(t => t.id === trx.id ? trx : t);
      try {
        localStorage.setItem('sias_transaksi_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveTransaksiCloud(trx);
  };

  const handleDeleteTransaksi = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setTransaksiList(prev => {
      const updated = prev.filter(t => t.id !== id);
      try {
        localStorage.setItem('sias_transaksi_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await deleteTransaksiCloud(id);
  };

  const handleBatchImportTransaksi = async (imported: TransaksiKeuangan[]) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setTransaksiList(prev => {
      const updated = [...imported, ...prev];
      try {
        localStorage.setItem('sias_transaksi_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await batchImportTransaksiCloud(imported);
  };

  // Agenda Handlers
  const handleAddAgenda = async (ag: AgendaSekolah) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setAgendaList(prev => {
      const updated = [ag, ...prev];
      try {
        localStorage.setItem('sias_agenda_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveAgendaCloud(ag);
  };

  const handleUpdateAgenda = async (ag: AgendaSekolah) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setAgendaList(prev => {
      const updated = prev.map(a => a.id === ag.id ? ag : a);
      try {
        localStorage.setItem('sias_agenda_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await saveAgendaCloud(ag);
  };

  const handleDeleteAgenda = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setAgendaList(prev => {
      const updated = prev.filter(a => a.id !== id);
      try {
        localStorage.setItem('sias_agenda_list', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    await deleteAgendaCloud(id);
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
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
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
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
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
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
    setCustomMenuItems(prev => {
      const exists = prev.some(i => i.id === item.id);
      const updated = exists ? prev.map(i => i.id === item.id ? item : i) : [item, ...prev];
      saveCustomItemsToStorage(updated);
      return updated;
    });
    await saveCustomMenuItemCloud(item);
  };

  const handleDeleteCustomItem = async (id: string) => {
    if (!isAdmin) {
      setLoginModalMode('login');
      setIsLoginModalOpen(true);
      return;
    }
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
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
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
              onBatchImportSiswa={handleBatchImportSiswa}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
            />
          )}

          {activeTab === 'guru' && (
            <AdministrasiGuru
              guruList={guruList}
              onAddGuru={handleAddGuru}
              onUpdateGuru={handleUpdateGuru}
              onDeleteGuru={handleDeleteGuru}
              onBatchImportGuru={handleBatchImportGuru}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
            />
          )}

          {activeTab === 'akademik' && (
            <AdministrasiAkademik
              siswaList={siswaList}
              onPrintRapor={(rapor, siswa) => setSelectedRaporForPrint({ rapor, siswa })}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
              raporStore={raporStore}
              onSaveRapor={handleSaveRapor}
            />
          )}

          {activeTab === 'presensi' && (
            <AdministrasiPresensi
              siswaList={siswaList}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
              presensiStore={presensiStore}
              onSavePresensi={handleSavePresensi}
            />
          )}

          {activeTab === 'persuratan' && (
            <TataUsahaSurat
              suratList={suratList}
              siswaList={siswaList}
              guruList={guruList}
              onAddSurat={handleAddSurat}
              onUpdateSurat={handleUpdateSurat}
              onDeleteSurat={handleDeleteSurat}
              onPrintSurat={(surat) => setSelectedSuratForPrint(surat)}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
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
              onUpdateTransaksi={handleUpdateTransaksi}
              onDeleteTransaksi={handleDeleteTransaksi}
              onBatchImportTransaksi={handleBatchImportTransaksi}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaPengumuman
              agendaList={agendaList}
              onAddAgenda={handleAddAgenda}
              onUpdateAgenda={handleUpdateAgenda}
              onDeleteAgenda={handleDeleteAgenda}
              isAdmin={isAdmin}
              onOpenAdminLogin={() => {
                setLoginModalMode('login');
                setIsLoginModalOpen(true);
              }}
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
        profil={profilSekolah}
        isAdmin={isAdmin}
        onOpenEditProfil={() => setIsEditProfilModalOpen(true)}
        onOpenAdminLogin={() => {
          setLoginModalMode('login');
          setIsLoginModalOpen(true);
        }}
        onUpdateProfil={handleSaveProfil}
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
        profil={profilSekolah}
        guruList={guruList}
        isAdmin={isAdmin}
        onSaveRapor={handleSaveRapor}
      />

      <PreviewDokumenModal
        dokumen={selectedDokumenForPreview}
        onClose={() => setSelectedDokumenForPreview(null)}
      />
    </div>
  );
}

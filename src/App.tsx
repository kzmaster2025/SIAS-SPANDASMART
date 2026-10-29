/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, Siswa, GuruTendik, SuratResmi, TransaksiKeuangan, AgendaSekolah, RaporSiswa, DokumenSekolah } from './types';
import {
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_SURAT,
  INITIAL_TRANSAKSI,
  INITIAL_AGENDA,
  INITIAL_DOKUMEN,
  MOCK_RAPOR_CONTOH,
  PROFIL_SEKOLAH
} from './data/mockData';
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
import { KartuPelajarModal } from './components/KartuPelajarModal';
import { CetakSuratModal } from './components/CetakSuratModal';
import { CetakRaporModal } from './components/CetakRaporModal';
import { PreviewDokumenModal } from './components/PreviewDokumenModal';
import { Menu, ChevronRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('profil');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  // Core Data Stores
  const [siswaList, setSiswaList] = useState<Siswa[]>(INITIAL_SISWA);
  const [guruList, setGuruList] = useState<GuruTendik[]>(INITIAL_GURU);
  const [suratList, setSuratList] = useState<SuratResmi[]>(INITIAL_SURAT);
  const [dokumenList, setDokumenList] = useState<DokumenSekolah[]>(INITIAL_DOKUMEN);
  const [transaksiList, setTransaksiList] = useState<TransaksiKeuangan[]>(INITIAL_TRANSAKSI);
  const [agendaList, setAgendaList] = useState<AgendaSekolah[]>(INITIAL_AGENDA);

  // Modals for Printing & Preview
  const [selectedStudentForCard, setSelectedStudentForCard] = useState<Siswa | null>(null);
  const [selectedSuratForPrint, setSelectedSuratForPrint] = useState<SuratResmi | null>(null);
  const [selectedRaporForPrint, setSelectedRaporForPrint] = useState<{ rapor: RaporSiswa; siswa: Siswa } | null>(null);
  const [selectedDokumenForPreview, setSelectedDokumenForPreview] = useState<DokumenSekolah | null>(null);

  // Student Handlers
  const handleAddSiswa = (siswa: Siswa) => {
    setSiswaList(prev => [siswa, ...prev]);
  };

  const handleUpdateSiswa = (siswa: Siswa) => {
    setSiswaList(prev => prev.map(s => s.id === siswa.id ? siswa : s));
  };

  const handleDeleteSiswa = (id: string) => {
    setSiswaList(prev => prev.filter(s => s.id !== id));
  };

  // Guru Handlers
  const handleAddGuru = (guru: GuruTendik) => {
    setGuruList(prev => [guru, ...prev]);
  };

  const handleUpdateGuru = (guru: GuruTendik) => {
    setGuruList(prev => prev.map(g => g.id === guru.id ? guru : g));
  };

  const handleDeleteGuru = (id: string) => {
    setGuruList(prev => prev.filter(g => g.id !== id));
  };

  // Surat Handlers
  const handleAddSurat = (surat: SuratResmi) => {
    setSuratList(prev => [surat, ...prev]);
  };

  // Dokumen Handlers
  const handleAddDokumen = (doc: DokumenSekolah) => {
    setDokumenList(prev => [doc, ...prev]);
  };

  const handleUpdateDokumen = (doc: DokumenSekolah) => {
    setDokumenList(prev => prev.map(d => d.id === doc.id ? doc : d));
  };

  const handleDeleteDokumen = (id: string) => {
    setDokumenList(prev => prev.filter(d => d.id !== id));
  };

  // Transaksi Handlers
  const handleAddTransaksi = (trx: TransaksiKeuangan) => {
    setTransaksiList(prev => [trx, ...prev]);
  };

  // Agenda Handlers
  const handleAddAgenda = (ag: AgendaSekolah) => {
    setAgendaList(prev => [ag, ...prev]);
  };

  const getBreadcrumbTitle = () => {
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
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar following contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickPrint={() => {
          if (suratList[0]) {
            setSelectedSuratForPrint(suratList[0]);
          }
        }}
      />

      {/* Main Administrative Container */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpenMobile={isOpenMobile}
          setIsOpenMobile={setIsOpenMobile}
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
              <span className="font-medium text-slate-800">SMPN 2 Sukabumi</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-blue-700 font-semibold">{getBreadcrumbTitle()}</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>Jl. Ir. H. Juanda No. 14 Cikole</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">Akreditasi A</span>
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
            <ProfileSekolah onNavigateToTab={(tab) => setActiveTab(tab)} />
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
        </main>
      </div>

      {/* Printable & Preview Modals */}
      <KartuPelajarModal
        siswa={selectedStudentForCard}
        onClose={() => setSelectedStudentForCard(null)}
      />

      <CetakSuratModal
        surat={selectedSuratForPrint}
        onClose={() => setSelectedSuratForPrint(null)}
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

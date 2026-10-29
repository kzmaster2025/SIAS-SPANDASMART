import React from 'react';
import { ActiveTab, Siswa, GuruTendik, SuratResmi, TransaksiKeuangan, AgendaSekolah, DokumenSekolah } from '../types';
import {
  Users,
  GraduationCap,
  CalendarCheck2,
  FileText,
  FolderKanban,
  Wallet,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  siswaList: Siswa[];
  guruList: GuruTendik[];
  suratList: SuratResmi[];
  dokumenList?: DokumenSekolah[];
  transaksiList: TransaksiKeuangan[];
  agendaList: AgendaSekolah[];
  onOpenCreateSurat: () => void;
  onOpenAddSiswa: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateTab,
  siswaList,
  guruList,
  suratList,
  transaksiList,
  agendaList,
  onOpenCreateSurat,
  onOpenAddSiswa
}) => {
  // Calculations
  const totalSiswa = siswaList.length;
  const totalGuru = guruList.filter(g => g.kategori === 'Pendidik').length;
  const totalTendik = guruList.filter(g => g.kategori === 'Tenaga Kependidikan').length;
  
  const totalPemasukan = transaksiList
    .filter(t => t.jenis === 'Pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0);
  const totalPengeluaran = transaksiList
    .filter(t => t.jenis === 'Pengeluaran')
    .reduce((sum, t) => sum + t.jumlah, 0);
  const saldoKas = totalPemasukan - totalPengeluaran;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700">Tahun Ajaran 2025/2026</span>
            <span aria-hidden="true">·</span>
            <span>Semester Ganjil</span>
            <span aria-hidden="true">·</span>
            <span>Kota Sukabumi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pusat Kendali Administrasi Digital SMPN 2
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Selamat datang di sistem informasi dan tata kelola digital terpadu SMP Negeri 2 Kota Sukabumi, Jl. Ir. H. Juanda No. 14 Cikole.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenAddSiswa}
            className="px-3.5 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
          >
            + Siswa Baru
          </button>
          <button
            onClick={onOpenCreateSurat}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            + Terbitkan Surat TU
          </button>
        </div>
      </div>

      {/* KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa */}
        <div
          onClick={() => onNavigateTab('kesiswaan')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium text-slate-500">Total Peserta Didik</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            948
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span>27 Rombel</span>
            <span aria-hidden="true">·</span>
            <span>Kelas 7, 8 & 9</span>
          </div>
        </div>

        {/* Guru & Tendik */}
        <div
          onClick={() => onNavigateTab('guru')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium text-slate-500">Pendidik & Tendik (GTK)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            56
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span>44 Guru</span>
            <span aria-hidden="true">·</span>
            <span>12 Tenaga Kependidikan</span>
          </div>
        </div>

        {/* Tingkat Kehadiran */}
        <div
          onClick={() => onNavigateTab('presensi')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium text-slate-500">Kehadiran Hari Ini</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            97.8%
          </div>
          <div className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Kategori Sangat Disiplin</span>
          </div>
        </div>

        {/* Saldo Kas BKU */}
        <div
          onClick={() => onNavigateTab('keuangan')}
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium text-slate-500">Saldo BKU BOS & Kas</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums truncate">
            {formatRupiah(saldoKas)}
          </div>
          <div className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <span>Dana BOS Tahap II</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700">Sehat</span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Kolom Konten (Agenda Terdekat & Aktivitas Persuratan TU) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agenda & Pengumuman Sekolah */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Agenda & Kalender Pendidikan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Kegiatan terdekat semester ganjil 2025/2026</p>
            </div>
            <button
              onClick={() => onNavigateTab('agenda')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {agendaList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-900">{item.judul}</span>
                  <span className="font-mono text-[11px] text-slate-500">{item.tanggal}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {item.deskripsi}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.lokasi}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>PJ: {item.penanggungJawab}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E-Surat & Tata Usaha */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Persuratan Resmi Terakhir</h2>
                <p className="text-xs text-slate-500 mt-0.5">Buku register surat keluar Tata Usaha</p>
              </div>
              <button
                onClick={() => onNavigateTab('persuratan')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Arsip TU</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {suratList.slice(0, 4).map((srt) => (
                <div key={srt.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs">
                  <div className="flex items-center justify-between text-slate-900 font-medium mb-0.5">
                    <span className="truncate pr-2 font-semibold">{srt.perihal}</span>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold shrink-0">
                      {srt.statusArsip}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {srt.nomorSurat}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center justify-between">
                    <span>Ybs: {srt.namaTerkait}</span>
                    <span className="text-slate-400">{srt.tanggalSurat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Total {suratList.length} Surat Teregistrasi
            </span>
            <button
              onClick={onOpenCreateSurat}
              className="text-xs font-medium text-blue-700 hover:text-blue-800 cursor-pointer"
            >
              + Buat Surat Baru
            </button>
          </div>
        </div>
      </div>

      {/* Akses Cepat Menu Administrasi */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-4">Modul Cepat Administrasi Digital</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigateTab('profil')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Profil Sekolah
            </span>
            <span className="text-[11px] text-slate-500 block">Identitas & Fasilitas</span>
          </button>

          <button
            onClick={() => onNavigateTab('kesiswaan')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Buku Induk
            </span>
            <span className="text-[11px] text-slate-500 block">Data Siswa & NISN</span>
          </button>

          <button
            onClick={() => onNavigateTab('guru')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Kepegawaian
            </span>
            <span className="text-[11px] text-slate-500 block">GTK & Jam Mengajar</span>
          </button>

          <button
            onClick={() => onNavigateTab('akademik')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Rapor Merdeka
            </span>
            <span className="text-[11px] text-slate-500 block">Asesmen & Capaian</span>
          </button>

          <button
            onClick={() => onNavigateTab('presensi')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Presensi Harian
            </span>
            <span className="text-[11px] text-slate-500 block">Absensi Siswa & GTK</span>
          </button>

          <button
            onClick={() => onNavigateTab('persuratan')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Tata Usaha
            </span>
            <span className="text-[11px] text-slate-500 block">Kop Surat & Cetak</span>
          </button>

          <button
            onClick={() => onNavigateTab('dokumen')}
            className="p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 text-left transition-colors cursor-pointer group"
          >
            <span className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 block mb-0.5">
              Kelola Dokumen
            </span>
            <span className="text-[11px] text-slate-500 block">KOSP, SK & SOP</span>
          </button>
        </div>
      </div>
    </div>
  );
};

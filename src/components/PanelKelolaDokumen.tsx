import React, { useState, useMemo } from 'react';
import { DokumenSekolah } from '../types';
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Edit2,
  Trash2,
  Lock,
  Globe,
  Users,
  CheckCircle2,
  AlertCircle,
  Archive,
  Filter,
  FileCheck,
  FolderOpen,
  X,
  UploadCloud,
  Cloud
} from 'lucide-react';

interface PanelKelolaDokumenProps {
  dokumenList: DokumenSekolah[];
  onAddDokumen: (dokumen: DokumenSekolah) => void;
  onUpdateDokumen: (dokumen: DokumenSekolah) => void;
  onDeleteDokumen: (id: string) => void;
  onPreviewDokumen: (dokumen: DokumenSekolah) => void;
  onNavigateToDrive?: () => void;
  onUploadToDrive?: (doc: DokumenSekolah) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const PanelKelolaDokumen: React.FC<PanelKelolaDokumenProps> = ({
  dokumenList,
  onAddDokumen,
  onUpdateDokumen,
  onDeleteDokumen,
  onPreviewDokumen,
  onNavigateToDrive,
  onUploadToDrive,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAkses, setFilterAkses] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDokumen, setEditingDokumen] = useState<DokumenSekolah | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<DokumenSekolah>>({
    judul: '',
    nomorDokumen: '',
    kategori: 'Kurikulum & KOSP',
    tahunAjaran: '2025/2026',
    tanggalTerbit: new Date().toISOString().slice(0, 10),
    pengesah: 'H. Yusuf Hidayat, M.Pd. (Kepala Sekolah)',
    status: 'Berlaku',
    akses: 'Publik Sekolah',
    deskripsi: '',
    fileNama: '',
    fileTipe: 'PDF',
    fileUkuran: '1.5 MB',
    isiRingkasan: ''
  });

  const kategoriList = [
    'Kurikulum & KOSP',
    'Kesiswaan & Tata Tertib',
    'Kepegawaian & SK',
    'Tata Usaha & SOP',
    'Sarpras & Aset',
    'Keuangan & BOS',
    'Panduan & Modul'
  ];

  // Filtering
  const filteredDokumen = useMemo(() => {
    return dokumenList.filter((doc) => {
      const matchSearch =
        doc.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.nomorDokumen.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.pengesah.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileNama.toLowerCase().includes(searchQuery.toLowerCase());

      const matchKat = filterKategori === 'all' || doc.kategori === filterKategori;
      const matchStat = filterStatus === 'all' || doc.status === filterStatus;
      const matchAkses = filterAkses === 'all' || doc.akses === filterAkses;

      return matchSearch && matchKat && matchStat && matchAkses;
    });
  }, [dokumenList, searchQuery, filterKategori, filterStatus, filterAkses]);

  // Statistics
  const totalBerlaku = dokumenList.filter(d => d.status === 'Berlaku').length;
  const totalDraft = dokumenList.filter(d => d.status === 'Draft').length;
  const totalInternal = dokumenList.filter(d => d.akses === 'Internal GTK').length;
  const totalTerbatas = dokumenList.filter(d => d.akses === 'Terbatas Pimpinan & TU').length;

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingDokumen(null);
    setFormData({
      judul: '',
      nomorDokumen: `421.3/0${dokumenList.length + 12}-SMPN.2/Disdikbud/2026`,
      kategori: 'Kurikulum & KOSP',
      tahunAjaran: '2025/2026',
      tanggalTerbit: new Date().toISOString().slice(0, 10),
      pengesah: 'H. Yusuf Hidayat, M.Pd. (Kepala Sekolah)',
      status: 'Berlaku',
      akses: 'Publik Sekolah',
      deskripsi: '',
      fileNama: 'Dokumen_Resmi_SMPN2_Sukabumi.pdf',
      fileTipe: 'PDF',
      fileUkuran: '1.8 MB',
      isiRingkasan: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: DokumenSekolah) => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingDokumen(doc);
    setFormData({ ...doc });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.nomorDokumen) return;

    if (editingDokumen) {
      onUpdateDokumen({
        ...editingDokumen,
        ...(formData as DokumenSekolah)
      });
    } else {
      const newDoc: DokumenSekolah = {
        ...(formData as DokumenSekolah),
        id: `dok-${Date.now()}`
      };
      onAddDokumen(newDoc);
    }
    setIsModalOpen(false);
  };

  const handleDownload = (doc: DokumenSekolah) => {
    const element = document.createElement('a');
    const content = `=====================================================
SMP NEGERI 2 KOTA SUKABUMI - DOKUMEN RESMI TATA USAHA
Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi
=====================================================

JUDUL: ${doc.judul}
NOMOR: ${doc.nomorDokumen}
KATEGORI: ${doc.kategori}
TAHUN AJARAN: ${doc.tahunAjaran}
TANGGAL: ${doc.tanggalTerbit}
PENGESAH: ${doc.pengesah}
STATUS: ${doc.status}
HAK AKSES: ${doc.akses}

DESKRIPSI DOKUMEN:
${doc.deskripsi}

ISI RINGKASAN & REGULASI:
${doc.isiRingkasan}
`;
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = doc.fileNama || `${doc.judul.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Pusat Regulasi & Dokumen</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{dokumenList.length} Dokumen Terdaftar</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Panel Pengelola Dokumen Sekolah
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manajemen arsip KOSP, SK pembagian tugas, tata tertib, SOP pelayanan TU, RKAS, dan modul pembelajaran digital.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <>
              {onNavigateToDrive && (
                <button
                  onClick={onNavigateToDrive}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Google Drive Sekolah</span>
                </button>
              )}
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Dokumen Baru</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Masuk sebagai Administrator untuk menambah atau mengedit dokumen"
            >
              <Lock className="w-3.5 h-3.5 text-blue-700" />
              <span>Masuk Admin untuk Kelola Dokumen</span>
            </button>
          )}
        </div>
      </div>

      {/* Visitor Mode Notice Banner */}
      {!isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Mode Pengunjung (Hanya Lihat):</span>
              <span className="ml-1 text-amber-800">
                Anda dapat membaca pratinjau dan mengunduh berkas SK & regulasi sekolah secara resmi. Penambahan, pengeditan, penghapusan, dan pencadangan dokumen dibatasi khusus Administrator.
              </span>
            </div>
          </div>
          {onOpenAdminLogin && (
            <button
              type="button"
              onClick={onOpenAdminLogin}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>Masuk Admin</span>
            </button>
          )}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Arsip Dokumen</span>
            <FolderOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {dokumenList.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>7 Kategori Manajemen</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Dokumen Sah & Berlaku</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
            {totalBerlaku}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">
            <span>Regulasi Aktif Sekolah</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Internal GTK (Guru)</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800 font-mono tabular-nums">
            {totalInternal}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>Beban Mengajar & Rapat</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Terbatas Pimpinan & TU</span>
            <Lock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-800 font-mono tabular-nums">
            {totalTerbatas}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>RKAS, Anggaran & Aset</span>
          </div>
        </div>
      </div>

      {/* Filter Bar & Kategori Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Search & Status Filter */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul dokumen, nomor SK, pengesah, atau nama file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Semua Status</option>
              <option value="Berlaku">Status: Berlaku</option>
              <option value="Draft">Status: Draft</option>
              <option value="Diarsipkan">Status: Diarsipkan</option>
            </select>

            <select
              value={filterAkses}
              onChange={(e) => setFilterAkses(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">Semua Akses</option>
              <option value="Publik Sekolah">Akses: Publik Sekolah</option>
              <option value="Internal GTK">Akses: Internal GTK</option>
              <option value="Terbatas Pimpinan & TU">Akses: Terbatas Pimpinan & TU</option>
            </select>
          </div>
        </div>

        {/* Kategori Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold shrink-0 uppercase mr-1">
            Kategori:
          </span>
          <button
            onClick={() => setFilterKategori('all')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterKategori === 'all'
                ? 'bg-blue-700 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({dokumenList.length})
          </button>
          {kategoriList.map((kat) => {
            const count = dokumenList.filter(d => d.kategori === kat).length;
            return (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterKategori === kat
                    ? 'bg-blue-700 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {kat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dokumen Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">Judul Dokumen & File</th>
                <th className="py-3 px-4 whitespace-nowrap">Nomor Surat / SK</th>
                <th className="py-3 px-4 whitespace-nowrap">Kategori</th>
                <th className="py-3 px-4 whitespace-nowrap">Pengesah & Tanggal</th>
                <th className="py-3 px-4 whitespace-nowrap">Akses</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredDokumen.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-600">Tidak ada dokumen yang sesuai kriteria pencarian</p>
                    <p className="text-[11px] text-slate-400 mt-1">Gunakan tombol "+ Tambah Dokumen Baru" untuk membuat dokumen baru.</p>
                  </td>
                </tr>
              ) : (
                filteredDokumen.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Judul & File */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 leading-snug max-w-sm">
                        {doc.judul}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span className="font-semibold text-blue-700">{doc.fileTipe}</span>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[200px]">{doc.fileNama}</span>
                        <span aria-hidden="true">·</span>
                        <span>{doc.fileUkuran}</span>
                      </div>
                    </td>

                    {/* Nomor Dokumen */}
                    <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                      {doc.nomorDokumen}
                    </td>

                    {/* Kategori */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-medium text-blue-900 bg-blue-50 px-2.5 py-1 rounded text-[11px]">
                        {doc.kategori}
                      </span>
                    </td>

                    {/* Pengesah & Tanggal */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium truncate max-w-[180px]">{doc.pengesah}</div>
                      <div className="text-[11px] font-mono text-slate-400">{doc.tanggalTerbit}</div>
                    </td>

                    {/* Hak Akses */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px]">
                        {doc.akses === 'Publik Sekolah' && (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            <span>Publik</span>
                          </span>
                        )}
                        {doc.akses === 'Internal GTK' && (
                          <span className="text-amber-700 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>Internal GTK</span>
                          </span>
                        )}
                        {doc.akses === 'Terbatas Pimpinan & TU' && (
                          <span className="text-indigo-700 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" />
                            <span>Terbatas TU</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold text-[11px] px-2 py-0.5 rounded ${
                          doc.status === 'Berlaku'
                            ? 'bg-emerald-50 text-emerald-700'
                            : doc.status === 'Draft'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    {/* Aksi */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewDokumen(doc)}
                          title="Baca / Pratinjau Dokumen"
                          className="p-1.5 rounded-md hover:bg-blue-50 text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Unduh Berkas"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            {onUploadToDrive && (
                              <button
                                onClick={() => onUploadToDrive(doc)}
                                title="Cadangkan / Unggah ke Google Drive"
                                className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                              >
                                <Cloud className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenEdit(doc)}
                              title="Edit Dokumen"
                              className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteDokumen(doc.id)}
                              title="Hapus Dokumen"
                              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Menampilkan {filteredDokumen.length} dari {dokumenList.length} arsip dokumen digital</span>
          <span>Sistem Informasi Administrasi Sekolah (SIAS) SMPN 2 Sukabumi</span>
        </div>
      </div>

      {/* Modal Input & Edit Dokumen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingDokumen ? 'Edit Metadata & Konten Dokumen' : 'Input Dokumen & Regulasi Sekolah Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Judul Lengkap Dokumen / Regulasi*
                </label>
                <input
                  type="text"
                  required
                  value={formData.judul || ''}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                  placeholder="Misal: Kurikulum Operasional Satuan Pendidikan (KOSP) Tahun 2025/2026"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nomor Dokumen / SK Resmi*
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nomorDokumen || ''}
                    onChange={(e) => setFormData({ ...formData, nomorDokumen: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                    placeholder="421.3/xxx-SK/SMPN.2/2026"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Kategori Dokumen*
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
                  >
                    {kategoriList.map((kat) => (
                      <option key={kat} value={kat}>
                        {kat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tahun Ajaran
                  </label>
                  <input
                    type="text"
                    value={formData.tahunAjaran || ''}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tanggal Terbit / Pengesahan
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalTerbit || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalTerbit: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Status Dokumen
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Berlaku">Berlaku (Aktif)</option>
                    <option value="Draft">Draft (Dalam Penyusunan)</option>
                    <option value="Diarsipkan">Diarsipkan (Kadaluarsa)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pejabat Pengesah / Penandatangan
                  </label>
                  <input
                    type="text"
                    value={formData.pengesah || ''}
                    onChange={(e) => setFormData({ ...formData, pengesah: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="H. Yusuf Hidayat, M.Pd. (Kepala Sekolah)"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tingkat Hak Akses
                  </label>
                  <select
                    value={formData.akses}
                    onChange={(e) => setFormData({ ...formData, akses: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Publik Sekolah">Publik Sekolah (Siswa & Guru)</option>
                    <option value="Internal GTK">Internal GTK (Guru & Tendik)</option>
                    <option value="Terbatas Pimpinan & TU">Terbatas Pimpinan & Tata Usaha</option>
                  </select>
                </div>
              </div>

              {/* Lampiran File */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Format File
                  </label>
                  <select
                    value={formData.fileTipe}
                    onChange={(e) => setFormData({ ...formData, fileTipe: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="DOCX">DOCX (.docx)</option>
                    <option value="XLSX">XLSX (.xlsx)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama File Berkas Lampiran
                  </label>
                  <input
                    type="text"
                    value={formData.fileNama || ''}
                    onChange={(e) => setFormData({ ...formData, fileNama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                    placeholder="Dokumen_SK_2026.pdf"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Estimasi Ukuran File
                  </label>
                  <input
                    type="text"
                    value={formData.fileUkuran || ''}
                    onChange={(e) => setFormData({ ...formData, fileUkuran: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                    placeholder="2.4 MB"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Deskripsi Singkat / Tujuan Dokumen
                </label>
                <textarea
                  rows={2}
                  value={formData.deskripsi || ''}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  placeholder="Jelaskan ruang lingkup, latar belakang, dan pihak sasaran dari dokumen ini..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Isi Ringkasan / Ketentuan Regulasi Pokok
                </label>
                <textarea
                  rows={5}
                  value={formData.isiRingkasan || ''}
                  onChange={(e) => setFormData({ ...formData, isiRingkasan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono text-[11px]"
                  placeholder="Ketikkan butir-butir keputusan, pasal tata tertib, atau uraian regulasi yang akan tercantum dalam pratinjau dan lembar cetak..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingDokumen ? 'Simpan Perubahan Dokumen' : 'Tambahkan ke Panel Dokumen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

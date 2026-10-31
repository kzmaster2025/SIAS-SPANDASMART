import React, { useState } from 'react';
import { TransaksiKeuangan } from '../types';
import {
  Wallet,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Receipt,
  Printer,
  Lock,
  Eye,
  Edit2,
  Trash2,
  Upload,
  FileText,
  Download,
  AlertCircle,
  UploadCloud,
  Paperclip
} from 'lucide-react';

interface AdministrasiKeuanganProps {
  transaksiList: TransaksiKeuangan[];
  onAddTransaksi: (trx: TransaksiKeuangan) => void;
  onUpdateTransaksi?: (trx: TransaksiKeuangan) => void;
  onDeleteTransaksi?: (id: string) => void;
  onBatchImportTransaksi?: (imported: TransaksiKeuangan[]) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const AdministrasiKeuangan: React.FC<AdministrasiKeuanganProps> = ({
  transaksiList,
  onAddTransaksi,
  onUpdateTransaksi,
  onDeleteTransaksi,
  onBatchImportTransaksi,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrx, setEditingTrx] = useState<TransaksiKeuangan | null>(null);
  const [trxToDelete, setTrxToDelete] = useState<TransaksiKeuangan | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<TransaksiKeuangan | null>(null);

  // Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedPreview, setImportedPreview] = useState<TransaksiKeuangan[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TransaksiKeuangan>>({
    kodeTransaksi: `TRX-BOS-26-00${transaksiList.length + 1}`,
    tanggal: new Date().toISOString().slice(0, 10),
    kategori: 'BOS Reguler',
    jenis: 'Pengeluaran',
    uraian: '',
    jumlah: 0,
    buktiRef: `BKK-${Math.floor(100 + Math.random() * 900)}`,
    penanggungJawab: 'Bendahara BOS',
    fileBuktiNama: '',
    fileBuktiUrl: '',
    fileBuktiUkuran: ''
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const totalPemasukan = transaksiList
    .filter(t => t.jenis === 'Pemasukan')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const totalPengeluaran = transaksiList
    .filter(t => t.jenis === 'Pengeluaran')
    .reduce((sum, t) => sum + t.jumlah, 0);

  const saldoKas = totalPemasukan - totalPengeluaran;

  const filteredTransaksi = transaksiList.filter((t) => {
    const matchSearch =
      t.uraian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.kodeTransaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.buktiRef.toLowerCase().includes(searchQuery.toLowerCase());
    const matchKat = filterKategori === 'all' || t.kategori === filterKategori;
    return matchSearch && matchKat;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingTrx(null);
    setFormData({
      kodeTransaksi: `TRX-BOS-26-0${transaksiList.length + 10}`,
      tanggal: new Date().toISOString().slice(0, 10),
      kategori: 'BOS Reguler',
      jenis: 'Pengeluaran',
      uraian: '',
      jumlah: 0,
      buktiRef: `BKK-${Math.floor(100 + Math.random() * 900)}`,
      penanggungJawab: 'Bendahara BOS',
      fileBuktiNama: '',
      fileBuktiUrl: '',
      fileBuktiUkuran: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (trx: TransaksiKeuangan) => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingTrx(trx);
    setFormData({ ...trx });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.uraian || !formData.jumlah) return;

    if (editingTrx) {
      const updated: TransaksiKeuangan = {
        ...editingTrx,
        ...(formData as TransaksiKeuangan),
        jumlah: Number(formData.jumlah)
      };
      onUpdateTransaksi?.(updated);
    } else {
      const newTrx: TransaksiKeuangan = {
        ...(formData as TransaksiKeuangan),
        id: `tr-${Date.now()}`,
        jumlah: Number(formData.jumlah)
      };
      onAddTransaksi(newTrx);
    }
    setIsModalOpen(false);
  };

  // Handle parsing CSV/Excel text file
  const handleFileUploadImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    setImportError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length <= 1) {
          setImportError('File kosong atau hanya berisi header tabel.');
          return;
        }

        const parsed: TransaksiKeuangan[] = [];
        // skip header (index 0)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];
          // Support semicolon, comma, or tab delimiter
          let parts = line.split(';');
          if (parts.length < 4) parts = line.split(',');
          if (parts.length < 4) parts = line.split('\t');

          if (parts.length >= 4) {
            const rawKode = parts[0]?.trim() || `TRX-BOS-26-${Date.now().toString().slice(-4)}${i}`;
            const rawTgl = parts[1]?.trim() || new Date().toISOString().slice(0, 10);
            const rawKat = (parts[2]?.trim() || 'BOS Reguler') as any;
            const rawJenis = parts[3]?.trim().toLowerCase().includes('masuk') ? 'Pemasukan' : 'Pengeluaran';
            const rawUraian = parts[4]?.trim() || 'Transaksi impor BKU';
            const rawJumlah = Number((parts[5]?.replace(/[^0-9]/g, '')) || 0);
            const rawBukti = parts[6]?.trim() || `BKK-${Math.floor(100 + Math.random() * 900)}`;
            const rawPJ = parts[7]?.trim() || 'Bendahara Sekolah';

            parsed.push({
              id: `tr-imp-${Date.now()}-${i}`,
              kodeTransaksi: rawKode,
              tanggal: rawTgl,
              kategori: ['BOS Reguler', 'BOS Kinerja', 'Komite Sekolah', 'Kegiatan Siswa'].includes(rawKat) ? rawKat : 'BOS Reguler',
              jenis: rawJenis,
              uraian: rawUraian,
              jumlah: rawJumlah > 0 ? rawJumlah : 500000,
              buktiRef: rawBukti,
              penanggungJawab: rawPJ
            });
          }
        }

        if (parsed.length === 0) {
          setImportError('Gagal membaca format baris transaksi. Pastikan kolom sesuai petunjuk.');
        } else {
          setImportedPreview(parsed);
        }
      } catch (err: any) {
        setImportError(`Gagal membaca file: ${err.message || 'Format tidak valid'}`);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (importedPreview.length === 0) return;
    onBatchImportTransaksi?.(importedPreview);
    setIsImportModalOpen(false);
    setImportedPreview([]);
    setImportFileName('');
  };

  const downloadCsvTemplate = () => {
    const csvContent = `Kode BKU;Tanggal;Sumber Anggaran;Jenis;Uraian Penggunaan;Jumlah;No Bukti;Penanggung Jawab\nTRX-BOS-26-021;2026-10-15;BOS Reguler;Pengeluaran;Pengadaan kertas HVS & tinta toner cetak ujian;1850000;KWT-ATK-2026;Kaur Sarpras\nTRX-BOS-26-022;2026-10-18;Komite Sekolah;Pemasukan;Sumbangan sukarela orang tua siswa perbaikan kanopi;4500000;KMT-MASUK-09;Ketua Komite\nTRX-BOS-26-023;2026-10-20;BOS Reguler;Pengeluaran;Langganan internet dedicated 200 Mbps bulan Oktober;3200000;INV-TELKOM-10;PJ Lab Komputer`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Format_Import_Transaksi_BKU_SMPN2.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Buku Kas Umum (BKU) Digital</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Anggaran 2026</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Administrasi Keuangan BOS & Komite
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Pencatatan realisasi dana BOS Kemenkeu/Kemendikbud, partisipasi komite, dan kuitansi pertanggungjawaban.
          </p>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setImportedPreview([]);
                setImportFileName('');
                setImportError(null);
                setIsImportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              title="Import transaksi dari file Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import File Transaksi</span>
            </button>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Transaksi BKU</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Masuk sebagai Administrator untuk mencatat transaksi keuangan"
          >
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>Masuk Admin untuk Catat Kas</span>
          </button>
        )}
      </div>

      {/* Visitor Mode Notice Banner */}
      {!isAdmin && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold">Mode Pengunjung (Transparansi Publik):</span>
              <span className="ml-1 text-amber-800">
                Anda dapat melihat rincian transparansi realisasi anggaran BOS & Komite sekolah serta mencetak lembar kuitansi. Pencatatan transaksi buku kas baru dibatasi khusus Bendahara / Administrator.
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

      {/* KPI Cards: Pemasukan, Pengeluaran, Saldo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Pemasukan (BOS & Komite)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
            {formatRupiah(totalPemasukan)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Akumulasi penerimaan tahap I & II</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Total Realisasi Pengeluaran</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-700 font-mono tabular-nums">
            {formatRupiah(totalPengeluaran)}
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Belanja operasional & mutu siswa</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-slate-500">Sisa Saldo Kas & Bank</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums">
            {formatRupiah(saldoKas)}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium block mt-1">Kondisi kas tertib & akuntabel</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari uraian belanja, nomor bukti, atau kode transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full md:w-auto">
          <button
            onClick={() => setFilterKategori('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterKategori === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Sumber
          </button>
          <button
            onClick={() => setFilterKategori('BOS Reguler')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterKategori === 'BOS Reguler' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            BOS Reguler
          </button>
          <button
            onClick={() => setFilterKategori('Komite Sekolah')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterKategori === 'Komite Sekolah' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Komite Sekolah
          </button>
          <button
            onClick={() => setFilterKategori('Kegiatan Siswa')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterKategori === 'Kegiatan Siswa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kegiatan Siswa
          </button>
        </div>
      </div>

      {/* Table Transaksi BKU */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">Kode BKU</th>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
                <th className="py-3 px-4 whitespace-nowrap">Sumber Anggaran</th>
                <th className="py-3 px-4 min-w-[220px]">Uraian Penggunaan</th>
                <th className="py-3 px-4 whitespace-nowrap">No. Bukti / Kuitansi</th>
                <th className="py-3 px-4 whitespace-nowrap">Jenis</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Jumlah (Rp)</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransaksi.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                    {trx.kodeTransaksi}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                    {trx.tanggal}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-medium text-slate-800">{trx.kategori}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-800">
                    <div className="font-medium leading-relaxed">{trx.uraian}</div>
                    <span className="text-[11px] text-slate-400">PJ: {trx.penanggungJawab}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {trx.buktiRef}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                        trx.jenis === 'Pemasukan'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {trx.jenis}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold whitespace-nowrap tabular-nums">
                    <span
                      className={
                        trx.jenis === 'Pemasukan' ? 'text-emerald-700' : 'text-slate-900'
                      }
                    >
                      {trx.jenis === 'Pengeluaran' ? '-' : '+'}
                      {formatRupiah(trx.jumlah)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReceipt(trx)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                        title="Lihat & Cetak Kuitansi Resmi"
                      >
                        <Receipt className="w-3 h-3" />
                        <span>Kuitansi</span>
                      </button>

                      {trx.fileBuktiUrl && (
                        <a
                          href={trx.fileBuktiUrl}
                          download={trx.fileBuktiNama || `Bukti_${trx.kodeTransaksi}`}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                          title={`Unduh Dokumen Bukti: ${trx.fileBuktiNama || 'Berkas Lampiran'}`}
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>Bukti</span>
                        </a>
                      )}

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(trx)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-blue-700 transition-colors cursor-pointer"
                            title="Edit Data Transaksi"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTrxToDelete(trx)}
                            className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                            title="Hapus Transaksi BKU"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah & Edit Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingTrx ? 'Edit Data Transaksi BKU' : 'Catat Transaksi BKU Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kode Transaksi</label>
                  <input
                    type="text"
                    required
                    value={formData.kodeTransaksi}
                    onChange={(e) => setFormData({ ...formData, kodeTransaksi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Transaksi</label>
                  <select
                    value={formData.jenis}
                    onChange={(e) => setFormData({ ...formData, jenis: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Pengeluaran">Pengeluaran (Belanja)</option>
                    <option value="Pemasukan">Pemasukan (Dana Masuk)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori Anggaran</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="BOS Reguler">BOS Reguler</option>
                    <option value="BOS Kinerja">BOS Kinerja</option>
                    <option value="Komite Sekolah">Komite Sekolah</option>
                    <option value="Kegiatan Siswa">Kegiatan Siswa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Uraian Transaksi / Belanja*</label>
                <textarea
                  rows={2}
                  required
                  value={formData.uraian}
                  onChange={(e) => setFormData({ ...formData, uraian: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  placeholder="Misal: Pembelian buku teks Kurikulum Merdeka atau pemeliharaan lab komputer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jumlah Nominal (Rp)*</label>
                  <input
                    type="number"
                    required
                    value={formData.jumlah || ''}
                    onChange={(e) => setFormData({ ...formData, jumlah: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. Bukti / Kuitansi</label>
                  <input
                    type="text"
                    value={formData.buktiRef}
                    onChange={(e) => setFormData({ ...formData, buktiRef: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Penanggung Jawab</label>
                <input
                  type="text"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Upload Berkas Bukti / Kuitansi */}
              <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-blue-700" />
                    <span>Upload Bukti Transaksi / Faktur / Nota (PDF, Excel, Foto)</span>
                  </label>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-medium">Opsional</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData(prev => ({
                        ...prev,
                        fileBuktiUrl: reader.result as string,
                        fileBuktiNama: file.name,
                        fileBuktiUkuran: formatFileSize(file.size)
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800 cursor-pointer"
                />
                {formData.fileBuktiNama && (
                  <div className="flex items-center justify-between text-[11px] p-2 bg-white rounded border border-slate-200">
                    <span className="truncate font-mono font-medium text-slate-700">{formData.fileBuktiNama} ({formData.fileBuktiUkuran})</span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, fileBuktiNama: '', fileBuktiUrl: '', fileBuktiUkuran: '' }))}
                      className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                    >
                      Hapus Lampiran
                    </button>
                  </div>
                )}
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
                  {editingTrx ? 'Simpan Perubahan Transaksi' : 'Simpan Transaksi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Transaksi */}
      {trxToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Hapus Transaksi BKU?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus catatan transaksi <strong className="text-slate-900">{trxToDelete.kodeTransaksi}</strong> ({trxToDelete.uraian} - {formatRupiah(trxToDelete.jumlah)})? Data saldo kas akan diperbarui secara otomatis.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setTrxToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteTransaksi?.(trxToDelete.id);
                  setTrxToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Transaksi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Transaksi (Excel / CSV) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full p-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Import File Transaksi BKU (Excel / CSV)</h2>
                <p className="text-xs text-slate-500 mt-0.5">Unggah berkas rekap kas dalam format CSV atau Excel spreadsheet.</p>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-800">Contoh Format Kolom Excel/CSV:</p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    Kode BKU ; Tanggal ; Sumber Anggaran ; Jenis ; Uraian ; Jumlah ; No Bukti ; Penanggung Jawab
                  </p>
                </div>
                <button
                  onClick={downloadCsvTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold text-[11px] shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Contoh</span>
                </button>
              </div>

              <div className="relative border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-lg p-6 text-center bg-white transition-colors">
                <input
                  type="file"
                  accept=".csv,.txt,.xlsx,.xls"
                  onChange={handleFileUploadImport}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <FileSpreadsheet className="w-9 h-9 text-blue-600 mb-1" />
                  <p className="text-xs font-semibold text-slate-800">
                    Klik atau tarik file CSV / Excel ke sini untuk diunggah
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {importFileName ? `File terpilih: ${importFileName}` : 'Format yang didukung: .csv, .txt, .xlsx, .xls'}
                  </p>
                </div>
              </div>

              {importError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {importedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">
                      Pratinjau Hasil Pembacaan ({importedPreview.length} Transaksi)
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold">Format Terverifikasi</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold sticky top-0">
                        <tr>
                          <th className="p-2">Kode BKU</th>
                          <th className="p-2">Tanggal</th>
                          <th className="p-2">Jenis</th>
                          <th className="p-2">Uraian</th>
                          <th className="p-2 text-right">Jumlah (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {importedPreview.slice(0, 10).map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-semibold text-slate-800">{t.kodeTransaksi}</td>
                            <td className="p-2">{t.tanggal}</td>
                            <td className="p-2">
                              <span className={t.jenis === 'Pemasukan' ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                                {t.jenis}
                              </span>
                            </td>
                            <td className="p-2 truncate max-w-[180px] font-sans">{t.uraian}</td>
                            <td className="p-2 text-right font-bold">{formatRupiah(t.jumlah)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {importedPreview.length > 10 && (
                    <p className="text-[11px] text-slate-400 text-right italic">
                      + {importedPreview.length - 10} transaksi lainnya siap diimpor.
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={importedPreview.length === 0}
                  onClick={handleApplyImport}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Impor {importedPreview.length} Transaksi ke Sistem</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kuitansi Print Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 no-print">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Bukti Pengeluaran Kas Sekolah</span>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Kuitansi Paper Layout */}
            <div className="border border-slate-300 p-5 rounded-lg space-y-4 text-xs font-sans bg-slate-50/40">
              <div className="text-center pb-2 border-b border-slate-300">
                <h3 className="font-bold text-sm tracking-wide">SMP NEGERI 2 KOTA SUKABUMI</h3>
                <p className="text-[11px] text-slate-600">Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi · Telp. (0266) 221584</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">BUKTI KAS UMUM (BKU): {selectedReceipt.kodeTransaksi}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tahun Anggaran:</span>
                  <span className="font-semibold font-mono">2026 ({selectedReceipt.kategori})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Bukti:</span>
                  <span className="font-mono font-semibold">{selectedReceipt.buktiRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal:</span>
                  <span className="font-mono">{selectedReceipt.tanggal}</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1">Sudah Terima Dari:</span>
                  <span className="font-semibold text-slate-800">Bendahara SMP Negeri 2 Kota Sukabumi</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block mb-1">Untuk Keperluan:</span>
                  <p className="font-medium text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-200">
                    {selectedReceipt.uraian}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded flex justify-between items-center">
                  <span className="font-semibold text-blue-900">Jumlah Uang:</span>
                  <span className="font-bold text-base font-mono text-blue-950">
                    {formatRupiah(selectedReceipt.jumlah)}
                  </span>
                </div>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 border-t border-slate-300 grid grid-cols-2 text-center text-[11px]">
                <div>
                  <p className="text-slate-500">Mengetahui,</p>
                  <p className="font-medium text-slate-700">Kepala Sekolah</p>
                  <div className="h-12" />
                  <p className="font-bold text-slate-900 underline">H. Yusuf Hidayat, M.Pd.</p>
                  <p className="text-[10px] font-mono text-slate-500">NIP 19680512 199412 1 002</p>
                </div>
                <div>
                  <p className="text-slate-500">Sukabumi, {selectedReceipt.tanggal}</p>
                  <p className="font-medium text-slate-700">Penerima / Pelaksana,</p>
                  <div className="h-12" />
                  <p className="font-bold text-slate-900 underline">{selectedReceipt.penanggungJawab}</p>
                  <p className="text-[10px] font-mono text-slate-500">Lunas Dibayar</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 no-print">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Kuitansi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

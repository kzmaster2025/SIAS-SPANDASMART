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
  Printer
} from 'lucide-react';

interface AdministrasiKeuanganProps {
  transaksiList: TransaksiKeuangan[];
  onAddTransaksi: (trx: TransaksiKeuangan) => void;
}

export const AdministrasiKeuangan: React.FC<AdministrasiKeuanganProps> = ({
  transaksiList,
  onAddTransaksi
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<TransaksiKeuangan | null>(null);

  const [formData, setFormData] = useState<Partial<TransaksiKeuangan>>({
    kodeTransaksi: `TRX-BOS-26-00${transaksiList.length + 1}`,
    tanggal: new Date().toISOString().slice(0, 10),
    kategori: 'BOS Reguler',
    jenis: 'Pengeluaran',
    uraian: '',
    jumlah: 0,
    buktiRef: `BKK-${Math.floor(100 + Math.random() * 900)}`,
    penanggungJawab: 'Bendahara BOS'
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.uraian || !formData.jumlah) return;

    const newTrx: TransaksiKeuangan = {
      ...(formData as TransaksiKeuangan),
      id: `tr-${Date.now()}`,
      jumlah: Number(formData.jumlah)
    };
    onAddTransaksi(newTrx);
    setIsModalOpen(false);
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Transaksi BKU</span>
        </button>
      </div>

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
                    <button
                      onClick={() => setSelectedReceipt(trx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                    >
                      <Receipt className="w-3 h-3" />
                      <span>Kuitansi</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Transaksi */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Catat Transaksi BKU Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                  Simpan Transaksi
                </button>
              </div>
            </form>
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

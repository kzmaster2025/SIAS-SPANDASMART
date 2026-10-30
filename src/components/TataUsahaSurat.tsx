import React, { useState } from 'react';
import { SuratResmi, Siswa, GuruTendik } from '../types';
import {
  FileText,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  Calendar,
  X,
  FileCheck,
  Lock,
  Eye,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface TataUsahaSuratProps {
  suratList: SuratResmi[];
  siswaList: Siswa[];
  guruList: GuruTendik[];
  onAddSurat: (surat: SuratResmi) => void;
  onUpdateSurat?: (surat: SuratResmi) => void;
  onDeleteSurat?: (id: string) => void;
  onPrintSurat: (surat: SuratResmi) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const TataUsahaSurat: React.FC<TataUsahaSuratProps> = ({
  suratList,
  siswaList,
  guruList,
  onAddSurat,
  onUpdateSurat,
  onDeleteSurat,
  onPrintSurat,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSurat, setEditingSurat] = useState<SuratResmi | null>(null);
  const [deletingSurat, setDeletingSurat] = useState<SuratResmi | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SuratResmi>>({
    nomorSurat: `421.3/0${suratList.length + 88}-SMPN.2/Disdikbud/2026`,
    jenisSurat: 'Keterangan Aktif',
    tanggalSurat: new Date().toISOString().slice(0, 10),
    perihal: 'Surat Keterangan Siswa Aktif',
    tujuan: 'Kepala Kantor Cabang Bank / Lembaga Beasiswa',
    namaTerkait: siswaList[0]?.nama || '',
    nisnNipTerkait: siswaList[0]?.nisn || '',
    statusArsip: 'Terbit',
    isiSuratKhusus: 'Menerangkan bahwa peserta didik tersebut adalah benar-benar siswa aktif terdaftar pada Tahun Pelajaran 2025/2026 di SMP Negeri 2 Kota Sukabumi.'
  });

  const filteredSurat = suratList.filter((s) => {
    const matchSearch =
      s.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.namaTerkait.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tujuan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchJenis = filterJenis === 'all' || s.jenisSurat === filterJenis;
    return matchSearch && matchJenis;
  });

  const handleOpenCreate = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingSurat(null);
    setFormData({
      nomorSurat: `421.3/0${suratList.length + 88}-SMPN.2/Disdikbud/2026`,
      jenisSurat: 'Keterangan Aktif',
      tanggalSurat: new Date().toISOString().slice(0, 10),
      perihal: 'Surat Keterangan Masih Aktif Belajar',
      tujuan: 'Pihak yang Berkepentingan',
      namaTerkait: siswaList[0]?.nama || '',
      nisnNipTerkait: siswaList[0]?.nisn || '',
      statusArsip: 'Terbit',
      isiSuratKhusus: 'Menerangkan bahwa nama yang tercantum di atas adalah benar-benar peserta didik aktif pada SMP Negeri 2 Kota Sukabumi Kelas 7 pada Tahun Ajaran 2025/2026 dan berkelakuan baik.'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (surat: SuratResmi) => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingSurat(surat);
    setFormData({
      nomorSurat: surat.nomorSurat,
      jenisSurat: surat.jenisSurat,
      tanggalSurat: surat.tanggalSurat,
      perihal: surat.perihal,
      tujuan: surat.tujuan,
      namaTerkait: surat.namaTerkait,
      nisnNipTerkait: surat.nisnNipTerkait,
      statusArsip: surat.statusArsip,
      isiSuratKhusus: surat.isiSuratKhusus
    });
    setIsModalOpen(true);
  };

  const handleOpenDelete = (surat: SuratResmi) => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setDeletingSurat(surat);
  };

  const handleConfirmDelete = () => {
    if (!deletingSurat) return;
    if (onDeleteSurat) {
      onDeleteSurat(deletingSurat.id);
    }
    setDeletingSurat(null);
  };

  const handleJenisChange = (jenis: SuratResmi['jenisSurat']) => {
    if (jenis === 'Tugas Guru') {
      const guru = guruList[1] || guruList[0];
      setFormData({
        ...formData,
        jenisSurat: jenis,
        perihal: 'Surat Perintah Tugas (SPT) Pelatihan Pembelajaran Berdiferensiasi',
        tujuan: 'Dinas Pendidikan dan Kebudayaan Kota Sukabumi',
        namaTerkait: guru ? `${guru.nama}, ${guru.gelar}` : '',
        nisnNipTerkait: guru?.nip || '',
        isiSuratKhusus: 'Ditugaskan untuk menghadiri Bimbingan Teknis Implementasi Pembelajaran Digital Kurikulum Merdeka yang diadakan di Balai Penjaminan Mutu Pendidikan.'
      });
    } else if (jenis === 'Mutasi Keluar') {
      const sis = siswaList[2] || siswaList[0];
      setFormData({
        ...formData,
        jenisSurat: jenis,
        perihal: 'Surat Keterangan Pindah / Mutasi Sekolah',
        tujuan: 'Kepala SMP Tujuan',
        namaTerkait: sis?.nama || '',
        nisnNipTerkait: sis?.nisn || '',
        isiSuratKhusus: 'Berdasarkan surat permohonan orang tua/wali siswa, dengan ini menerangkan bahwa siswa tersebut mengajukan mutasi keluar dari SMP Negeri 2 Kota Sukabumi ke sekolah tujuan.'
      });
    } else {
      const sis = siswaList[0];
      setFormData({
        ...formData,
        jenisSurat: jenis,
        perihal: 'Surat Keterangan Masih Aktif Belajar',
        tujuan: 'Lembaga Pengusul PIP / Keperluan Administrasi',
        namaTerkait: sis?.nama || '',
        nisnNipTerkait: sis?.nisn || '',
        isiSuratKhusus: 'Menerangkan dengan sebenarnya bahwa yang bersangkutan adalah peserta didik aktif SMP Negeri 2 Kota Sukabumi Tahun Pelajaran 2025/2026.'
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.nomorSurat || !formData.perihal) return;

    if (editingSurat) {
      const updated: SuratResmi = {
        ...editingSurat,
        ...(formData as SuratResmi),
        id: editingSurat.id
      };
      if (onUpdateSurat) {
        onUpdateSurat(updated);
      }
    } else {
      const newSurat: SuratResmi = {
        ...(formData as SuratResmi),
        id: `srt-${Date.now()}`
      };
      onAddSurat(newSurat);
    }
    setIsModalOpen(false);
    setEditingSurat(null);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Tata Usaha & Administrasi Persuratan</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{suratList.length} Surat Terarsip</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Persuratan & E-Arsip Digital TU
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Penerbitan surat dinas resmi dengan nomor agenda baku, cetak kop surat resmi, stempel digital, dan verifikasi barcode.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat Resmi Baru</span>
          </button>
        ) : (
          <button
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Masuk sebagai Administrator untuk menerbitkan surat baru"
          >
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>Masuk Admin untuk Buat Surat</span>
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
              <span className="font-bold">Mode Pengunjung (Hanya Lihat):</span>
              <span className="ml-1 text-amber-800">
                Anda dapat melihat buku agenda persuratan dinas dan mencetak surat resmi. Penerbitan dan pembuatan surat baru dibatasi khusus Staf Tata Usaha / Administrator.
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

      {/* Filter and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nomor surat, perihal, atau nama terkait..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full md:w-auto">
          <button
            onClick={() => setFilterJenis('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterJenis === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Format
          </button>
          <button
            onClick={() => setFilterJenis('Keterangan Aktif')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterJenis === 'Keterangan Aktif' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Keterangan Aktif
          </button>
          <button
            onClick={() => setFilterJenis('Tugas Guru')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterJenis === 'Tugas Guru' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tugas Guru (SPT)
          </button>
          <button
            onClick={() => setFilterJenis('Dispensasi')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
              filterJenis === 'Dispensasi' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dispensasi
          </button>
        </div>
      </div>

      {/* Surat Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">Nomor Surat Agenda</th>
                <th className="py-3 px-4 whitespace-nowrap">Perihal / Jenis</th>
                <th className="py-3 px-4 whitespace-nowrap">Tanggal</th>
                <th className="py-3 px-4 whitespace-nowrap">Nama Terkait</th>
                <th className="py-3 px-4 whitespace-nowrap">Tujuan Surat</th>
                <th className="py-3 px-4 whitespace-nowrap">Status Arsip</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSurat.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-600">Tidak ada arsip surat ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredSurat.map((surat) => (
                  <tr key={surat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {surat.nomorSurat}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{surat.perihal}</div>
                      <span className="text-[11px] text-blue-700 font-medium">{surat.jenisSurat}</span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                      {surat.tanggalSurat}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{surat.namaTerkait}</div>
                      <div className="text-[11px] font-mono text-slate-400">{surat.nisnNipTerkait}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap max-w-xs truncate">
                      {surat.tujuan}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{surat.statusArsip}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintSurat(surat)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Lihat Pratinjau & Cetak Surat Resmi"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Lihat & Cetak</span>
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(surat)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                              title="Edit Data Surat"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleOpenDelete(surat)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Surat dari Arsip"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Hapus</span>
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
      </div>

      {/* Modal Tambah / Edit Surat */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-700" />
                <span>
                  {editingSurat ? 'Edit & Perbarui Surat Resmi TU' : 'Penerbitan Surat Resmi Tata Usaha'}
                </span>
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingSurat(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Registrasi Surat Dinas*</label>
                  <input
                    type="text"
                    required
                    value={formData.nomorSurat || ''}
                    onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Format Surat</label>
                  <select
                    value={formData.jenisSurat}
                    onChange={(e) => handleJenisChange(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold"
                  >
                    <option value="Keterangan Aktif">Surat Keterangan Aktif Belajar</option>
                    <option value="Tugas Guru">Surat Perintah Tugas Guru (SPT)</option>
                    <option value="Mutasi Keluar">Surat Keterangan Pindah Sekolah</option>
                    <option value="Dispensasi">Surat Dispensasi Mengikuti Lomba</option>
                    <option value="Panggilan Ortu">Surat Undangan / Panggilan Orang Tua</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Perihal Surat*</label>
                  <input
                    type="text"
                    required
                    value={formData.perihal || ''}
                    onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Surat</label>
                  <input
                    type="date"
                    value={formData.tanggalSurat || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Siswa / Guru Terkait*</label>
                  <input
                    type="text"
                    required
                    value={formData.namaTerkait || ''}
                    onChange={(e) => setFormData({ ...formData, namaTerkait: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NISN / NIP Terkait</label>
                  <input
                    type="text"
                    value={formData.nisnNipTerkait || ''}
                    onChange={(e) => setFormData({ ...formData, nisnNipTerkait: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tujuan Surat / Instansi Tujuan</label>
                <input
                  type="text"
                  value={formData.tujuan || ''}
                  onChange={(e) => setFormData({ ...formData, tujuan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  placeholder="Contoh: Kepala Bank BRI Cabang Sukabumi / Kepala SMPN 1 Bandung"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Keterangan Khusus / Isi Paragraf Surat</label>
                <textarea
                  rows={3}
                  value={formData.isiSuratKhusus || ''}
                  onChange={(e) => setFormData({ ...formData, isiSuratKhusus: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSurat(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  {editingSurat ? 'Simpan Perubahan Surat' : 'Terbitkan & Simpan ke Arsip TU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Surat */}
      {deletingSurat && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-xs">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Hapus Arsip Surat Resmi?</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mb-4 space-y-1 font-mono text-[11px]">
              <div><strong className="font-semibold text-slate-700 font-sans">Nomor:</strong> {deletingSurat.nomorSurat}</div>
              <div><strong className="font-semibold text-slate-700 font-sans">Perihal:</strong> {deletingSurat.perihal}</div>
              <div><strong className="font-semibold text-slate-700 font-sans">Nama Terkait:</strong> {deletingSurat.namaTerkait}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingSurat(null)}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Ya, Hapus Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

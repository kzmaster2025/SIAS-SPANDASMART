import React, { useState, useMemo } from 'react';
import { Siswa } from '../types';
import {
  Search,
  Plus,
  Download,
  IdCard,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  X
} from 'lucide-react';

interface AdministrasiKesiswaanProps {
  siswaList: Siswa[];
  onAddSiswa: (siswa: Siswa) => void;
  onUpdateSiswa: (siswa: Siswa) => void;
  onDeleteSiswa: (id: string) => void;
  onPrintKartuPelajar: (siswa: Siswa) => void;
}

export const AdministrasiKesiswaan: React.FC<AdministrasiKesiswaanProps> = ({
  siswaList,
  onAddSiswa,
  onUpdateSiswa,
  onDeleteSiswa,
  onPrintKartuPelajar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTingkat, setFilterTingkat] = useState<string>('all');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Siswa>>({
    nisn: '',
    nis: '',
    nama: '',
    kelas: '7-A',
    tingkat: '7',
    jenisKelamin: 'L',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2012-01-01',
    agama: 'Islam',
    alamat: '',
    namaAyah: '',
    namaIbu: '',
    kontakOrtu: '',
    status: 'Aktif'
  });

  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      const matchSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery) ||
        s.nis.includes(searchQuery) ||
        s.alamat.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchTingkat = filterTingkat === 'all' || s.tingkat === filterTingkat;
      const matchKelas = filterKelas === 'all' || s.kelas === filterKelas;

      return matchSearch && matchTingkat && matchKelas;
    });
  }, [siswaList, searchQuery, filterTingkat, filterKelas]);

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setFormData({
      nisn: `009${Math.floor(1000000 + Math.random() * 9000000)}`,
      nis: `23240${Math.floor(7000 + Math.random() * 999)}`,
      nama: '',
      kelas: '7-A',
      tingkat: '7',
      jenisKelamin: 'L',
      tempatLahir: 'Sukabumi',
      tanggalLahir: '2012-05-10',
      agama: 'Islam',
      alamat: 'Kota Sukabumi',
      namaAyah: '',
      namaIbu: '',
      kontakOrtu: '08',
      status: 'Aktif'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setFormData({ ...siswa });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nisn || !formData.nis) return;

    if (editingSiswa) {
      onUpdateSiswa({
        ...editingSiswa,
        ...(formData as Siswa)
      });
    } else {
      const newSiswa: Siswa = {
        ...(formData as Siswa),
        id: `sis-${Date.now()}`
      };
      onAddSiswa(newSiswa);
    }
    setIsModalOpen(false);
  };

  const exportCSV = () => {
    const headers = ['NISN', 'NIS', 'Nama Lengkap', 'Kelas', 'JK', 'Tempat Lahir', 'Tgl Lahir', 'Agama', 'Alamat', 'Nama Ayah', 'Nama Ibu', 'Kontak Ortu', 'Status'];
    const rows = filteredSiswa.map(s => [
      s.nisn,
      s.nis,
      `"${s.nama}"`,
      s.kelas,
      s.jenisKelamin,
      s.tempatLahir,
      s.tanggalLahir,
      s.agama,
      `"${s.alamat}"`,
      `"${s.namaAyah}"`,
      `"${s.namaIbu}"`,
      s.kontakOrtu,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buku_induk_smpn2_sukabumi_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Buku Induk Kesiswaan</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{siswaList.length} Siswa Terdaftar</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Administrasi Peserta Didik
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Pengelolaan data induk siswa, mutasi, pencetakan kartu pelajar digital, dan pelaporan Dapodik.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama siswa, NISN, NIS, atau alamat domisili..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterTingkat('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTingkat === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua Tingkat
            </button>
            <button
              onClick={() => setFilterTingkat('7')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTingkat === '7' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas 7
            </button>
            <button
              onClick={() => setFilterTingkat('8')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTingkat === '8' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas 8
            </button>
            <button
              onClick={() => setFilterTingkat('9')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterTingkat === '9' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kelas 9
            </button>
          </div>
        </div>
      </div>

      {/* High-density Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">NISN & NIS</th>
                <th className="py-3 px-4 whitespace-nowrap">Nama Peserta Didik</th>
                <th className="py-3 px-4 whitespace-nowrap">Rombel</th>
                <th className="py-3 px-4 whitespace-nowrap">JK</th>
                <th className="py-3 px-4 whitespace-nowrap">TTL & Agama</th>
                <th className="py-3 px-4 whitespace-nowrap">Nama Orang Tua</th>
                <th className="py-3 px-4 whitespace-nowrap">Kontak</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-600">Tidak ada data siswa ditemukan</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter kelas.</p>
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{siswa.nisn}</div>
                      <div className="text-[11px] text-slate-400">{siswa.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {siswa.nama}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                        {siswa.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono whitespace-nowrap">
                      {siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div>{siswa.tempatLahir}, {siswa.tanggalLahir}</div>
                      <div className="text-[11px] text-slate-400">{siswa.agama}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div>{siswa.namaAyah}</div>
                      <div className="text-[11px] text-slate-400">{siswa.namaIbu}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {siswa.kontakOrtu}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{siswa.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPrintKartuPelajar(siswa)}
                          title="Cetak Kartu Pelajar"
                          className="p-1.5 rounded-md hover:bg-blue-50 text-blue-700 hover:text-blue-800 transition-colors cursor-pointer"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(siswa)}
                          title="Edit Siswa"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSiswa(siswa.id)}
                          title="Hapus"
                          className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Menampilkan {filteredSiswa.length} dari {siswaList.length} data siswa</span>
          <span>Dapodik Kemendikbudristek 2026</span>
        </div>
      </div>

      {/* Modal Tambah / Edit Siswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingSiswa ? 'Edit Data Siswa' : 'Tambah Peserta Didik Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NISN (10 Digit)*</label>
                  <input
                    type="text"
                    required
                    value={formData.nisn || ''}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIS Sekolah*</label>
                  <input
                    type="text"
                    required
                    value={formData.nis || ''}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap Siswa*</label>
                <input
                  type="text"
                  required
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tingkat</label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="7">Kelas 7</option>
                    <option value="8">Kelas 8</option>
                    <option value="9">Kelas 9</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Rombel</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="7-A">7-A</option>
                    <option value="7-B">7-B</option>
                    <option value="7-C">7-C</option>
                    <option value="8-A">8-A</option>
                    <option value="8-B">8-B</option>
                    <option value="8-C">8-C</option>
                    <option value="9-A">9-A</option>
                    <option value="9-B">9-B</option>
                    <option value="9-C">9-C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir || ''}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Alamat Lengkap Domisili</label>
                <textarea
                  rows={2}
                  value={formData.alamat || ''}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  placeholder="Jl. / Gang, RT/RW, Kelurahan, Kecamatan, Kota Sukabumi"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Ayah Kandung</label>
                  <input
                    type="text"
                    value={formData.namaAyah || ''}
                    onChange={(e) => setFormData({ ...formData, namaAyah: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Ibu Kandung</label>
                  <input
                    type="text"
                    value={formData.namaIbu || ''}
                    onChange={(e) => setFormData({ ...formData, namaIbu: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">No. WhatsApp / Kontak Ortu</label>
                <input
                  type="text"
                  value={formData.kontakOrtu || ''}
                  onChange={(e) => setFormData({ ...formData, kontakOrtu: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  placeholder="0812xxxxxxx"
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
                  {editingSiswa ? 'Simpan Perubahan' : 'Daftarkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

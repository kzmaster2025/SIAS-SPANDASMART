import React, { useState, useMemo } from 'react';
import { GuruTendik } from '../types';
import {
  Search,
  Plus,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Edit2,
  Trash2,
  X,
  Award
} from 'lucide-react';

interface AdministrasiGuruProps {
  guruList: GuruTendik[];
  onAddGuru: (guru: GuruTendik) => void;
  onUpdateGuru: (guru: GuruTendik) => void;
  onDeleteGuru: (id: string) => void;
}

export const AdministrasiGuru: React.FC<AdministrasiGuruProps> = ({
  guruList,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<GuruTendik | null>(null);

  const [formData, setFormData] = useState<Partial<GuruTendik>>({
    nip: '',
    nuptk: '',
    nama: '',
    gelar: '',
    jabatan: '',
    kategori: 'Pendidik',
    statusKepegawaian: 'PNS',
    golongan: 'Penata / III-c',
    mapel: '',
    jamMengajar: 24,
    email: '',
    telepon: '',
    pendidikanTerakhir: 'S1 Pendidikan'
  });

  const filteredGuru = useMemo(() => {
    return guruList.filter((g) => {
      const matchSearch =
        g.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.nip.includes(searchQuery) ||
        g.jabatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (g.mapel && g.mapel.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchKat = filterKategori === 'all' || g.kategori === filterKategori;
      const matchStat = filterStatus === 'all' || g.statusKepegawaian === filterStatus;

      return matchSearch && matchKat && matchStat;
    });
  }, [guruList, searchQuery, filterKategori, filterStatus]);

  const handleOpenAdd = () => {
    setEditingGuru(null);
    setFormData({
      nip: '198' + Math.floor(10000000000000 + Math.random() * 9000000000000),
      nuptk: '5' + Math.floor(100000000000000 + Math.random() * 900000000000000),
      nama: '',
      gelar: 'S.Pd.',
      jabatan: 'Guru Mata Pelajaran',
      kategori: 'Pendidik',
      statusKepegawaian: 'PNS',
      golongan: 'Penata / III-c',
      mapel: 'Ilmu Pengetahuan Alam',
      jamMengajar: 24,
      email: '@smpn2kotasukabumi.sch.id',
      telepon: '08',
      pendidikanTerakhir: 'S1 Pendidikan - UPI'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guru: GuruTendik) => {
    setEditingGuru(guru);
    setFormData({ ...guru });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    if (editingGuru) {
      onUpdateGuru({
        ...editingGuru,
        ...(formData as GuruTendik)
      });
    } else {
      const newGuru: GuruTendik = {
        ...(formData as GuruTendik),
        id: `gtk-${Date.now()}`
      };
      onAddGuru(newGuru);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Kepegawaian & GTK</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{guruList.length} Personel Aktif</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pendidik & Tenaga Kependidikan
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Daftar profil pengajar, kualifikasi akademik, beban jam mengajar, dan staf Tata Usaha sekolah.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah GTK Baru</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama guru, NIP, mapel, atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterKategori('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterKategori === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua GTK
            </button>
            <button
              onClick={() => setFilterKategori('Pendidik')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterKategori === 'Pendidik' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guru (Pendidik)
            </button>
            <button
              onClick={() => setFilterKategori('Tenaga Kependidikan')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                filterKategori === 'Tenaga Kependidikan' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tendik / TU
            </button>
          </div>
        </div>
      </div>

      {/* GTK Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">Nama & Gelar</th>
                <th className="py-3 px-4 whitespace-nowrap">NIP & NUPTK</th>
                <th className="py-3 px-4 whitespace-nowrap">Tugas / Jabatan</th>
                <th className="py-3 px-4 whitespace-nowrap">Status & Golongan</th>
                <th className="py-3 px-4 whitespace-nowrap">Beban Mengajar</th>
                <th className="py-3 px-4 whitespace-nowrap">Pendidikan</th>
                <th className="py-3 px-4 whitespace-nowrap">Kontak</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGuru.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="font-medium text-slate-600">Tidak ada data GTK ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredGuru.map((guru) => (
                  <tr key={guru.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      <div>{guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}</div>
                      <span className="text-[11px] font-normal text-slate-500">{guru.kategori}</span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                      <div className="text-slate-800">{guru.nip}</div>
                      <div className="text-[11px] text-slate-400">NUPTK: {guru.nuptk}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                      <div className="font-medium text-slate-900">{guru.jabatan}</div>
                      {guru.mapel && <div className="text-[11px] text-blue-700">{guru.mapel}</div>}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{guru.statusKepegawaian}</span>
                      {guru.golongan && (
                        <div className="text-[11px] text-slate-500">{guru.golongan}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                      {guru.jamMengajar ? `${guru.jamMengajar} Jam / Minggu` : '-'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {guru.pendidikanTerakhir}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{guru.telepon}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[140px]">{guru.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(guru)}
                          title="Edit GTK"
                          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteGuru(guru.id)}
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
      </div>

      {/* Modal Add / Edit GTK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingGuru ? 'Edit Data Pendidik & Tendik' : 'Tambah Tenaga Pendidik / GTK Baru'}
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
                  <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap (tanpa gelar)*</label>
                  <input
                    type="text"
                    required
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gelar Akademik</label>
                  <input
                    type="text"
                    value={formData.gelar || ''}
                    onChange={(e) => setFormData({ ...formData, gelar: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="S.Pd. / M.Pd."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIP (atau '-' jika non-PNS)</label>
                  <input
                    type="text"
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={formData.nuptk || ''}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Pendidik">Pendidik (Guru)</option>
                    <option value="Tenaga Kependidikan">Tenaga Kependidikan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="PNS">PNS</option>
                    <option value="PPPK">PPPK</option>
                    <option value="GTT">GTT (Guru Tidak Tetap)</option>
                    <option value="PTT">PTT (Pegawai Tidak Tetap)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={formData.golongan || ''}
                    onChange={(e) => setFormData({ ...formData, golongan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="Pembina / IV-a"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jabatan & Tugas</label>
                  <input
                    type="text"
                    value={formData.jabatan || ''}
                    onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="Wakasek Kurikulum / Wali Kelas 7-B"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Mata Pelajaran (Mapel)</label>
                  <input
                    type="text"
                    value={formData.mapel || ''}
                    onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="Matematika / IPA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Resmi Sekolah</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">No. Handphone / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.telepon || ''}
                    onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
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
                  {editingGuru ? 'Simpan Perubahan' : 'Tambahkan GTK'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

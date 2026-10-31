import React, { useState } from 'react';
import { AgendaSekolah } from '../types';
import {
  Bell,
  Plus,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle2,
  X,
  Lock,
  Eye,
  Edit2,
  Trash2,
  UploadCloud,
  Paperclip,
  Download,
  AlertCircle,
  FileText
} from 'lucide-react';

interface AgendaPengumumanProps {
  agendaList: AgendaSekolah[];
  onAddAgenda: (agenda: AgendaSekolah) => void;
  onUpdateAgenda?: (agenda: AgendaSekolah) => void;
  onDeleteAgenda?: (id: string) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const AgendaPengumuman: React.FC<AgendaPengumumanProps> = ({
  agendaList,
  onAddAgenda,
  onUpdateAgenda,
  onDeleteAgenda,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgenda, setEditingAgenda] = useState<AgendaSekolah | null>(null);
  const [agendaToDelete, setAgendaToDelete] = useState<AgendaSekolah | null>(null);

  const [formData, setFormData] = useState<Partial<AgendaSekolah>>({
    judul: '',
    tanggal: '',
    kategori: 'Akademik',
    lokasi: 'SMP Negeri 2 Kota Sukabumi',
    deskripsi: '',
    penanggungJawab: 'Wakasek',
    status: 'Akan Datang',
    fileLampiranNama: '',
    fileLampiranUrl: '',
    fileLampiranTipe: '',
    fileLampiranUkuran: ''
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const detectFileType = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['doc', 'docx'].includes(ext || '')) return 'DOCX';
    if (['xls', 'xlsx'].includes(ext || '')) return 'XLSX';
    if (['ppt', 'pptx'].includes(ext || '')) return 'PPTX';
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) return 'Gambar';
    return (ext || 'FILE').toUpperCase();
  };

  const handleOpenAdd = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingAgenda(null);
    setFormData({
      judul: '',
      tanggal: new Date().toISOString().slice(0, 10),
      kategori: 'Akademik',
      lokasi: 'SMP Negeri 2 Kota Sukabumi',
      deskripsi: '',
      penanggungJawab: 'Wakasek Kesiswaan / Panitia',
      status: 'Akan Datang',
      fileLampiranNama: '',
      fileLampiranUrl: '',
      fileLampiranTipe: '',
      fileLampiranUkuran: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AgendaSekolah) => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setEditingAgenda(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const filteredAgenda = agendaList.filter((a) => {
    return filterKategori === 'all' || a.kategori === filterKategori;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.judul || !formData.tanggal) return;

    if (editingAgenda) {
      const updated: AgendaSekolah = {
        ...editingAgenda,
        ...(formData as AgendaSekolah)
      };
      onUpdateAgenda?.(updated);
    } else {
      const newAgenda: AgendaSekolah = {
        ...(formData as AgendaSekolah),
        id: `ag-${Date.now()}`
      };
      onAddAgenda(newAgenda);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Papan Informasi Digital</span>
            <span aria-hidden="true">·</span>
            <span>Kalender Akademik & Kesiswaan</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Agenda & Pengumuman Sekolah
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Jadwal kegiatan kesiswaan, peringatan hari besar, asesmen sumatif, dan rapat koordinasi dinas.
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Agenda Kegiatan</span>
          </button>
        ) : (
          <button
            onClick={onOpenAdminLogin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Masuk sebagai Administrator untuk menambah agenda baru"
          >
            <Lock className="w-3.5 h-3.5 text-blue-700" />
            <span>Masuk Admin untuk Tambah Agenda</span>
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
                Menampilkan kalender kegiatan kesiswaan dan pengumuman resmi SMPN 2 Kota Sukabumi. Penambahan dan pengelolaan agenda hanya dapat dilakukan oleh Administrator / Wakasek.
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

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-medium">
        <button
          onClick={() => setFilterKategori('all')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterKategori === 'all' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Semua Agenda ({agendaList.length})
        </button>
        <button
          onClick={() => setFilterKategori('Akademik')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterKategori === 'Akademik' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Akademik & Ujian
        </button>
        <button
          onClick={() => setFilterKategori('Kesiswaan')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterKategori === 'Kesiswaan' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Kesiswaan & Lomba
        </button>
        <button
          onClick={() => setFilterKategori('Komite')}
          className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
            filterKategori === 'Komite' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Komite & Orang Tua
        </button>
      </div>

      {/* Grid of Agenda Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAgenda.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-blue-300 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                  {item.kategori}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-500 font-medium">{item.status}</span>
                  {isAdmin && (
                    <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-blue-700 transition-colors cursor-pointer"
                        title="Edit Agenda Kegiatan"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setAgendaToDelete(item)}
                        className="p-1 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                {item.judul}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.deskripsi}
              </p>

              {/* Lampiran Dokumen jika ada */}
              {item.fileLampiranUrl && (
                <div className="mt-2 mb-3">
                  <a
                    href={item.fileLampiranUrl}
                    download={item.fileLampiranNama || `Lampiran_${item.judul}`}
                    className="inline-flex items-center gap-2 p-2 bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 rounded-lg text-xs font-semibold text-blue-800 transition-colors w-full cursor-pointer"
                    title={`Unduh Berkas Lampiran: ${item.fileLampiranNama}`}
                  >
                    <Paperclip className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span className="truncate flex-1 text-left">{item.fileLampiranNama || 'Dokumen / Juknis Lampiran'}</span>
                    <span className="text-[10px] text-blue-600 font-mono shrink-0">({item.fileLampiranUkuran || item.fileLampiranTipe || 'Dokumen'})</span>
                    <Download className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  </a>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-medium text-slate-700">{item.tanggal}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{item.lokasi}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>PJ: {item.penanggungJawab}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah & Edit Agenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6 my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingAgenda ? 'Edit Agenda & Pengumuman Sekolah' : 'Tambah Agenda Sekolah Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Judul Kegiatan / Agenda*</label>
                <input
                  type="text"
                  required
                  value={formData.judul}
                  onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  placeholder="Contoh: Try Out ANBK atau Peringatan Maulid Nabi"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tanggal / Periode*</label>
                  <input
                    type="text"
                    required
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                    placeholder="Contoh: 2026-11-10 s.d 2026-11-12"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kategori</label>
                  <select
                    value={formData.kategori}
                    onChange={(e) => setFormData({ ...formData, kategori: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Kedinasan">Kedinasan</option>
                    <option value="Komite">Komite</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lokasi Kegiatan</label>
                  <input
                    type="text"
                    value={formData.lokasi}
                    onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Kegiatan</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Akan Datang">Akan Datang</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deskripsi & Rincian Agenda</label>
                <textarea
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Penanggung Jawab (PJ)</label>
                <input
                  type="text"
                  value={formData.penanggungJawab}
                  onChange={(e) => setFormData({ ...formData, penanggungJawab: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Upload Berkas / Edaran / Juknis */}
              <div className="p-3 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold text-xs flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-blue-700" />
                    <span>Upload Berkas / Edaran / Juknis (PDF, Word, Excel, Foto)</span>
                  </label>
                  <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded font-medium">Opsional</span>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFormData(prev => ({
                        ...prev,
                        fileLampiranUrl: reader.result as string,
                        fileLampiranNama: file.name,
                        fileLampiranUkuran: formatFileSize(file.size),
                        fileLampiranTipe: detectFileType(file.name)
                      }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-700 file:text-white hover:file:bg-blue-800 cursor-pointer"
                />
                {formData.fileLampiranNama && (
                  <div className="flex items-center justify-between text-[11px] p-2 bg-white rounded border border-slate-200">
                    <span className="truncate font-mono font-medium text-slate-700">
                      {formData.fileLampiranNama} ({formData.fileLampiranUkuran})
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, fileLampiranNama: '', fileLampiranUrl: '', fileLampiranTipe: '', fileLampiranUkuran: '' }))}
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
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
                >
                  {editingAgenda ? 'Simpan Perubahan Agenda' : 'Publikasikan ke Mading'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Agenda */}
      {agendaToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-900">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Hapus Agenda Sekolah?</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus agenda <strong className="text-slate-900">{agendaToDelete.judul}</strong> ({agendaToDelete.tanggal})? Kegiatan ini akan dihapus dari papan pengumuman.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setAgendaToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAgenda?.(agendaToDelete.id);
                  setAgendaToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Ya, Hapus Agenda</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

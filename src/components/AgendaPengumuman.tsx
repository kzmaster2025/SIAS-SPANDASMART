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
  X
} from 'lucide-react';

interface AgendaPengumumanProps {
  agendaList: AgendaSekolah[];
  onAddAgenda: (agenda: AgendaSekolah) => void;
}

export const AgendaPengumuman: React.FC<AgendaPengumumanProps> = ({
  agendaList,
  onAddAgenda
}) => {
  const [filterKategori, setFilterKategori] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<AgendaSekolah>>({
    judul: '',
    tanggal: '',
    kategori: 'Akademik',
    lokasi: 'SMP Negeri 2 Kota Sukabumi',
    deskripsi: '',
    penanggungJawab: 'Wakasek',
    status: 'Akan Datang'
  });

  const filteredAgenda = agendaList.filter((a) => {
    return filterKategori === 'all' || a.kategori === filterKategori;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul || !formData.tanggal) return;

    const newAgenda: AgendaSekolah = {
      ...(formData as AgendaSekolah),
      id: `ag-${Date.now()}`
    };
    onAddAgenda(newAgenda);
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

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Agenda Kegiatan</span>
        </button>
      </div>

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
                <span className="font-mono text-[11px] text-slate-500 font-medium">{item.status}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-2 leading-snug">
                {item.judul}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {item.deskripsi}
              </p>
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

      {/* Modal Tambah Agenda */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Tambah Agenda Sekolah Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                  Publikasikan ke Mading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

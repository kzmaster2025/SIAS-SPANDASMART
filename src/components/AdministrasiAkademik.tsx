import React, { useState } from 'react';
import { Siswa, RaporSiswa, NilaiMapel } from '../types';
import { MOCK_RAPOR_CONTOH } from '../data/mockData';
import {
  BookOpen,
  Printer,
  Calendar,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  FileCheck,
  Lock,
  Eye
} from 'lucide-react';

interface AdministrasiAkademikProps {
  siswaList: Siswa[];
  onPrintRapor: (rapor: RaporSiswa, siswa: Siswa) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const AdministrasiAkademik: React.FC<AdministrasiAkademikProps> = ({
  siswaList,
  onPrintRapor,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [selectedSiswaId, setSelectedSiswaId] = useState<string>(siswaList[0]?.id || 'sis-01');
  const [activeTab, setActiveTab] = useState<'rapor' | 'jadwal'>('rapor');
  const [raporData, setRaporData] = useState<RaporSiswa>(MOCK_RAPOR_CONTOH);

  const selectedSiswa = siswaList.find(s => s.id === selectedSiswaId) || siswaList[0];

  const handleUpdateNilai = (index: number, field: keyof NilaiMapel, value: any) => {
    if (!isAdmin) return;
    const updated = [...raporData.nilai];
    (updated[index] as any)[field] = value;
    // Auto recalculate Nilai Akhir if formatif or sumatif changed
    if (field === 'formatif' || field === 'sumatif') {
      const f = field === 'formatif' ? Number(value) : updated[index].formatif;
      const s = field === 'sumatif' ? Number(value) : updated[index].sumatif;
      updated[index].nilaiAkhir = Math.round((f + s) / 2);
    }
    setRaporData({ ...raporData, nilai: updated });
  };

  const rataRataNilai = Math.round(
    raporData.nilai.reduce((sum, n) => sum + n.nilaiAkhir, 0) / (raporData.nilai.length || 1)
  );

  const jadwalPelajaran7A = [
    { hari: 'Senin', mapel: ['Upacara Bendera', 'Pendidikan Agama Islam (3 JP)', 'Bahasa Indonesia (3 JP)', 'Matematika (2 JP)'] },
    { hari: 'Selasa', mapel: ['Matematika (2 JP)', 'Ilmu Pengetahuan Alam (3 JP)', 'Informatika (3 JP)', 'Seni Musik/Rupa (2 JP)'] },
    { hari: 'Rabu', mapel: ['Bahasa Inggris (3 JP)', 'Pendidikan Pancasila (2 JP)', 'PJOK / Olahraga (3 JP)', 'Bahasa Sunda (2 JP)'] },
    { hari: 'Kamis', mapel: ['Ilmu Pengetahuan Sosial (3 JP)', 'IPA Praktikum Lab (2 JP)', 'Bahasa Indonesia (3 JP)', 'Bimbingan Konseling (1 JP)'] },
    { hari: 'Jumat', mapel: ['Senam Profil Pelajar Pancasila & Dhuha', 'Projek Penguatan Profil Pelajar Pancasila / P5 (4 JP)', 'Kepanduan Pramuka'] }
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Kurikulum Merdeka (Fase D)</span>
            <span aria-hidden="true">·</span>
            <span>Semester Ganjil 2025/2026</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Asesmen Pembelajaran & Rapor Siswa
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Penginputan asesmen formatif, sumatif materi, capaian kompetensi, dan cetak rapor hasil belajar resmi.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onPrintRapor(raporData, selectedSiswa)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rapor Kurikulum Merdeka</span>
          </button>
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
                Buku rapor siswa dan jadwal pelajaran dapat dilihat dan dicetak lengkap. Penginputan nilai asesmen formatif, sumatif, dan deskripsi capaian dibatasi khusus Guru & Administrator.
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

      {/* Selector & Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-700 shrink-0">Pilih Siswa:</label>
          <select
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 min-w-[240px]"
          >
            {siswaList.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.kelas} - NISN: {s.nisn})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('rapor')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'rapor' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Asesmen Nilai Rapor
          </button>
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'jadwal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jadwal Pelajaran KBM
          </button>
        </div>
      </div>

      {activeTab === 'rapor' ? (
        <div className="space-y-6">
          {/* Ringkasan Siswa Terpilih */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base shrink-0">
                {selectedSiswa.nama.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedSiswa.nama}</h3>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                  <span>NISN: {selectedSiswa.nisn}</span>
                  <span aria-hidden="true">·</span>
                  <span>NIS: {selectedSiswa.nis}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-blue-700 font-semibold">{selectedSiswa.kelas}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Rata-rata Nilai Akhir</span>
                <span className="text-lg font-bold text-slate-900 font-mono tabular-nums">{rataRataNilai}</span>
              </div>
              <div className="text-right border-l border-slate-100 pl-4">
                <span className="text-slate-400 block text-[11px]">Predikat Capaian</span>
                <span className="text-sm font-bold text-emerald-700">Amat Baik (A)</span>
              </div>
            </div>
          </div>

          {/* Tabel Nilai Asesmen */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Rekap Nilai Capaian Kompetensi Kurikulum Merdeka</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAdmin
                    ? 'Edit nilai formatif dan sumatif secara langsung untuk menghitung nilai akhir'
                    : 'Mode lihat saja: Menampilkan nilai formatif, sumatif, dan deskripsi capaian pembelajaran'}
                </p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">KKM Satuan Pendidikan: 75</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4 whitespace-nowrap">No</th>
                    <th className="py-3 px-4 whitespace-nowrap">Mata Pelajaran</th>
                    <th className="py-3 px-4 whitespace-nowrap">Guru Pengampu</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">Formatif</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">Sumatif</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">Nilai Akhir</th>
                    <th className="py-3 px-4 min-w-[280px]">Deskripsi Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {raporData.nilai.map((n, idx) => (
                    <tr key={n.kodeMapel} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {n.namaMapel}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap text-[11px]">
                        {n.guruPengampu}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isAdmin ? (
                          <input
                            type="number"
                            value={n.formatif}
                            onChange={(e) => handleUpdateNilai(idx, 'formatif', e.target.value)}
                            className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                          />
                        ) : (
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">{n.formatif}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isAdmin ? (
                          <input
                            type="number"
                            value={n.sumatif}
                            onChange={(e) => handleUpdateNilai(idx, 'sumatif', e.target.value)}
                            className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold"
                          />
                        ) : (
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">{n.sumatif}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 tabular-nums">
                        <span className={`px-2 py-0.5 rounded ${n.nilaiAkhir >= 85 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                          {n.nilaiAkhir}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] text-slate-600 leading-relaxed">
                        {isAdmin ? (
                          <input
                            type="text"
                            value={n.capaianKompetensi}
                            onChange={(e) => handleUpdateNilai(idx, 'capaianKompetensi', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                          />
                        ) : (
                          <span className="text-slate-700 leading-relaxed block">{n.capaianKompetensi}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ekstrakurikuler & Catatan */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-800 mb-2">Kegiatan Ekstrakurikuler</h4>
                <div className="space-y-2">
                  {raporData.ekskul.map((e, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                        <span>{e.nama}</span>
                        <span className="text-[11px] text-blue-700 font-mono">{e.predikat}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{e.keterangan}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">Catatan Wali Kelas & Kehadiran</h4>
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600 pb-2 border-b border-slate-100">
                    <span>Sakit: {raporData.kehadiran.sakit} Hari</span>
                    <span aria-hidden="true">·</span>
                    <span>Izin: {raporData.kehadiran.izin} Hari</span>
                    <span aria-hidden="true">·</span>
                    <span>Tanpa Keterangan: {raporData.kehadiran.alpa} Hari</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed italic">
                    "{raporData.catatanWaliKelas}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Jadwal Pelajaran */
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Jadwal Pelajaran KBM Kelas 7-A</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tahun Ajaran 2025/2026 · Kurikulum Merdeka</p>
            </div>
            <span className="text-xs text-blue-700 font-medium">Wali Kelas: Rina Marlina, S.Pd.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {jadwalPelajaran7A.map((j) => (
              <div key={j.hari} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-200 flex items-center justify-between">
                  <span>{j.hari}</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="space-y-1.5">
                  {j.mapel.map((m, idx) => (
                    <div key={idx} className="p-2 rounded bg-white border border-slate-100 text-[11px] text-slate-700 leading-tight">
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

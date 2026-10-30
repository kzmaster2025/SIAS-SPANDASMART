import React, { useState } from 'react';
import { Siswa } from '../types';
import {
  CalendarCheck2,
  CheckCircle2,
  Calendar,
  Download,
  AlertCircle,
  Clock,
  Printer,
  Lock,
  Eye
} from 'lucide-react';

interface AdministrasiPresensiProps {
  siswaList: Siswa[];
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const AdministrasiPresensi: React.FC<AdministrasiPresensiProps> = ({
  siswaList,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [selectedTanggal, setSelectedTanggal] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedKelas, setSelectedKelas] = useState<string>('7-A');
  
  // State presensi per siswa id: 'H' | 'S' | 'I' | 'A'
  const [presensiMap, setPresensiMap] = useState<Record<string, 'H' | 'S' | 'I' | 'A'>>(() => {
    const initial: Record<string, 'H' | 'S' | 'I' | 'A'> = {};
    siswaList.forEach((s, idx) => {
      initial[s.id] = idx === 3 ? 'S' : idx === 5 ? 'I' : 'H';
    });
    return initial;
  });

  const [keteranganMap, setKeteranganMap] = useState<Record<string, string>>({
    'sis-04': 'Demam flu disertai batuk',
    'sis-06': 'Izin urusan keluarga ke Bandung'
  });

  const studentsInKelas = siswaList.filter(s => selectedKelas === 'all' || s.kelas === selectedKelas);

  const handleSetStatus = (siswaId: string, status: 'H' | 'S' | 'I' | 'A') => {
    if (!isAdmin) return;
    setPresensiMap(prev => ({ ...prev, [siswaId]: status }));
  };

  const handleMarkAllHadir = () => {
    if (!isAdmin) return;
    const updated = { ...presensiMap };
    studentsInKelas.forEach(s => {
      updated[s.id] = 'H';
    });
    setPresensiMap(updated);
  };

  // Stats calculation
  const totalInView = studentsInKelas.length;
  const countHadir = studentsInKelas.filter(s => (presensiMap[s.id] || 'H') === 'H').length;
  const countSakit = studentsInKelas.filter(s => presensiMap[s.id] === 'S').length;
  const countIzin = studentsInKelas.filter(s => presensiMap[s.id] === 'I').length;
  const countAlpa = studentsInKelas.filter(s => presensiMap[s.id] === 'A').length;
  const persentaseHadir = totalInView > 0 ? ((countHadir / totalInView) * 100).toFixed(1) : '100';

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Presensi Harian Sekolah</span>
            <span aria-hidden="true">·</span>
            <span>Tahun Ajaran 2025/2026</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Administrasi Presensi & Kehadiran
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Pencatatan daftar hadir harian kelas, rekapitulasi ketidakhadiran, dan sinkronisasi ke buku rapor.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin ? (
            <button
              onClick={handleMarkAllHadir}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tandai Semua Hadir</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="Masuk sebagai Administrator untuk menginput kehadiran"
            >
              <Lock className="w-3.5 h-3.5 text-blue-700" />
              <span>Masuk Admin untuk Absensi</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
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
                Jurnal rekapitulasi presensi harian siswa ditampilkan dalam mode lihat saja. Penginputan kehadiran dan catatan sakit/izin dibatasi khusus Guru Kelas / Administrator.
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

      {/* Filter Row & KPI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pengaturan Jurnal Presensi
          </h3>
          
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tanggal Absensi</label>
              <input
                type="date"
                value={selectedTanggal}
                onChange={(e) => setSelectedTanggal(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Pilih Rombongan Belajar</label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              >
                <option value="7-A">Kelas 7-A (Wali Kelas: Rina Marlina, S.Pd.)</option>
                <option value="7-B">Kelas 7-B</option>
                <option value="8-C">Kelas 8-C (Wali Kelas: Sri Wahyuni, S.Pd.)</option>
                <option value="9-A">Kelas 9-A (Wali Kelas: Cecep Sunandar, S.Pd.)</option>
                <option value="9-B">Kelas 9-B</option>
                <option value="all">Semua Siswa Terdaftar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Attendance Stats */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900">
              Statistik Kehadiran Rombel {selectedKelas === 'all' ? 'Seluruh Sekolah' : selectedKelas} ({selectedTanggal})
            </span>
            <span className="text-xs font-mono font-semibold text-blue-700">
              Tingkat: {persentaseHadir}%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] text-emerald-700 font-semibold block">Hadir (H)</span>
              <span className="text-2xl font-bold text-emerald-800 font-mono tabular-nums">{countHadir}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Siswa Mengikuti KBM</span>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100">
              <span className="text-[11px] text-blue-700 font-semibold block">Sakit (S)</span>
              <span className="text-2xl font-bold text-blue-800 font-mono tabular-nums">{countSakit}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Surat Keterangan Dokter</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
              <span className="text-[11px] text-amber-700 font-semibold block">Izin (I)</span>
              <span className="text-2xl font-bold text-amber-800 font-mono tabular-nums">{countIzin}</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Surat Orang Tua</span>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100">
              <span className="text-[11px] text-rose-700 font-semibold block">Alpa (A)</span>
              <span className="text-2xl font-bold text-rose-800 font-mono tabular-nums">{countAlpa}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Tanpa Keterangan</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Data terhubung otomatis dengan laporan berkala ke Pengawas Pembina Disdikbud Kota Sukabumi.
          </div>
        </div>
      </div>

      {/* Table Presensi Siswa */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Daftar Presensi Peserta Didik ({studentsInKelas.length} Siswa)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Tanggal: {selectedTanggal}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 whitespace-nowrap">No</th>
                <th className="py-3 px-4 whitespace-nowrap">NISN & NIS</th>
                <th className="py-3 px-4 whitespace-nowrap">Nama Peserta Didik</th>
                <th className="py-3 px-4 whitespace-nowrap">Kelas</th>
                <th className="py-3 px-4 whitespace-nowrap text-center">Status Kehadiran</th>
                <th className="py-3 px-4 min-w-[200px]">Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentsInKelas.map((siswa, idx) => {
                const currentStatus = presensiMap[siswa.id] || 'H';
                return (
                  <tr key={siswa.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono tabular-nums whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{siswa.nisn}</div>
                      <div className="text-[10px] text-slate-400">{siswa.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                      {siswa.nama}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-600">
                      {siswa.kelas}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
                        <button
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => handleSetStatus(siswa.id, 'H')}
                          className={`w-7 h-7 rounded-md transition-colors ${
                            currentStatus === 'H'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          } ${isAdmin ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                          title={isAdmin ? 'Hadir' : 'Hadir (Mode Lihat Saja)'}
                        >
                          H
                        </button>
                        <button
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => handleSetStatus(siswa.id, 'S')}
                          className={`w-7 h-7 rounded-md transition-colors ${
                            currentStatus === 'S'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          } ${isAdmin ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                          title={isAdmin ? 'Sakit' : 'Sakit (Mode Lihat Saja)'}
                        >
                          S
                        </button>
                        <button
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => handleSetStatus(siswa.id, 'I')}
                          className={`w-7 h-7 rounded-md transition-colors ${
                            currentStatus === 'I'
                              ? 'bg-amber-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          } ${isAdmin ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                          title={isAdmin ? 'Izin' : 'Izin (Mode Lihat Saja)'}
                        >
                          I
                        </button>
                        <button
                          type="button"
                          disabled={!isAdmin}
                          onClick={() => handleSetStatus(siswa.id, 'A')}
                          className={`w-7 h-7 rounded-md transition-colors ${
                            currentStatus === 'A'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          } ${isAdmin ? 'cursor-pointer' : 'cursor-default opacity-85'}`}
                          title={isAdmin ? 'Alpa' : 'Alpa (Mode Lihat Saja)'}
                        >
                          A
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        disabled={!isAdmin}
                        readOnly={!isAdmin}
                        placeholder={isAdmin ? 'Tambahkan catatan jika sakit/izin...' : '-'}
                        value={keteranganMap[siswa.id] || ''}
                        onChange={(e) =>
                          setKeteranganMap(prev => ({ ...prev, [siswa.id]: e.target.value }))
                        }
                        className={`w-full px-2.5 py-1 text-xs border rounded text-slate-800 ${
                          isAdmin
                            ? 'bg-slate-50 border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600'
                            : 'bg-transparent border-transparent text-slate-600 cursor-default'
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

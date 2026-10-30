import React, { useState, useEffect } from 'react';
import { Siswa } from '../types';
import {
  CalendarCheck2,
  CheckCircle2,
  Calendar,
  Clock,
  Printer,
  Lock,
  Eye,
  Save,
  Check,
  Filter,
  UserCheck,
  AlertCircle
} from 'lucide-react';

interface AdministrasiPresensiProps {
  siswaList: Siswa[];
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  presensiStore?: Record<string, { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }>;
  onSavePresensi?: (tanggal: string, data: { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }) => void;
}

export const AdministrasiPresensi: React.FC<AdministrasiPresensiProps> = ({
  siswaList,
  isAdmin = false,
  onOpenAdminLogin,
  presensiStore = {},
  onSavePresensi
}) => {
  const [selectedTanggal, setSelectedTanggal] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedKelas, setSelectedKelas] = useState<string>('7-A');
  const [filterStatus, setFilterStatus] = useState<'all' | 'non-hadir'>('all');
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Attendance status & notes map
  const [presensiMap, setPresensiMap] = useState<Record<string, 'H' | 'S' | 'I' | 'A'>>({});
  const [keteranganMap, setKeteranganMap] = useState<Record<string, string>>({});

  // Sync state whenever selectedTanggal changes or presensiStore updates
  useEffect(() => {
    const existing = presensiStore[selectedTanggal];
    if (existing) {
      setPresensiMap({ ...existing.status });
      setKeteranganMap({ ...existing.keterangan });
    } else {
      // Initialize all students as 'H' (Hadir) by default
      const initial: Record<string, 'H' | 'S' | 'I' | 'A'> = {};
      const initialKet: Record<string, string> = {};
      siswaList.forEach((s) => {
        initial[s.id] = 'H';
      });
      setPresensiMap(initial);
      setKeteranganMap(initialKet);
    }
    setHasUnsavedChanges(false);
  }, [selectedTanggal, presensiStore, siswaList]);

  // Filter students by selected class
  const studentsInKelas = siswaList.filter(s => {
    const matchKelas = selectedKelas === 'all' || s.kelas === selectedKelas;
    if (!matchKelas) return false;

    if (filterStatus === 'non-hadir') {
      const st = presensiMap[s.id] || 'H';
      return st !== 'H';
    }
    return true;
  });

  const handleSetStatus = (siswaId: string, status: 'H' | 'S' | 'I' | 'A') => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setPresensiMap(prev => ({ ...prev, [siswaId]: status }));
    setHasUnsavedChanges(true);
  };

  const handleKeteranganChange = (siswaId: string, val: string) => {
    if (!isAdmin) return;
    setKeteranganMap(prev => ({ ...prev, [siswaId]: val }));
    setHasUnsavedChanges(true);
  };

  const handleMarkAllHadir = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    const updated = { ...presensiMap };
    siswaList.filter(s => selectedKelas === 'all' || s.kelas === selectedKelas).forEach(s => {
      updated[s.id] = 'H';
    });
    setPresensiMap(updated);
    setHasUnsavedChanges(true);
  };

  const handleSavePresensi = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    if (onSavePresensi) {
      onSavePresensi(selectedTanggal, {
        status: presensiMap,
        keterangan: keteranganMap
      });
    }
    setHasUnsavedChanges(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Stats calculation for the chosen class
  const allInClass = siswaList.filter(s => selectedKelas === 'all' || s.kelas === selectedKelas);
  const totalInView = allInClass.length;
  const countHadir = allInClass.filter(s => (presensiMap[s.id] || 'H') === 'H').length;
  const countSakit = allInClass.filter(s => presensiMap[s.id] === 'S').length;
  const countIzin = allInClass.filter(s => presensiMap[s.id] === 'I').length;
  const countAlpa = allInClass.filter(s => presensiMap[s.id] === 'A').length;
  const persentaseHadir = totalInView > 0 ? ((countHadir / totalInView) * 100).toFixed(1) : '100';

  // Distinct classes list from actual student data
  const distinctClasses = Array.from(new Set(siswaList.map(s => s.kelas))).sort();

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {isAdmin ? (
            <>
              <button
                onClick={handleMarkAllHadir}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
                title="Tandai semua siswa dalam rombel ini hadir"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Tandai Semua Hadir</span>
              </button>

              <button
                onClick={handleSavePresensi}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-xs cursor-pointer ${
                  hasUnsavedChanges
                    ? 'bg-blue-700 hover:bg-blue-800 animate-pulse'
                    : 'bg-blue-700 hover:bg-blue-800'
                }`}
                title="Simpan data kehadiran hari ini ke database"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Presensi Harian</span>
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
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

      {/* Success Notification Banner */}
      {showSaveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Data Presensi tanggal <strong>{selectedTanggal}</strong> untuk kelas <strong>{selectedKelas === 'all' ? 'Seluruh Kelas' : selectedKelas}</strong> berhasil disimpan ke Cloud Database!
          </span>
        </div>
      )}

      {/* Filter Row & KPI Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-700" />
            <span>Pengaturan Jurnal Presensi</span>
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
                {distinctClasses.map(k => (
                  <option key={k} value={k}>
                    Kelas {k} ({siswaList.filter(s => s.kelas === k).length} Siswa)
                  </option>
                ))}
                <option value="all">Semua Siswa Terdaftar ({siswaList.length} Siswa)</option>
              </select>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Filter Tampilan:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    filterStatus === 'all' ? 'bg-blue-100 text-blue-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('non-hadir')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                    filterStatus === 'non-hadir' ? 'bg-amber-100 text-amber-800' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Sakit/Izin/Alpa ({countSakit + countIzin + countAlpa})
                </button>
              </div>
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
              <span className="text-[10px] text-blue-600 block mt-0.5">Keterangan Sakit</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100">
              <span className="text-[11px] text-amber-700 font-semibold block">Izin (I)</span>
              <span className="text-2xl font-bold text-amber-800 font-mono tabular-nums">{countIzin}</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Surat Dispensasi/Izin</span>
            </div>

            <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100">
              <span className="text-[11px] text-rose-700 font-semibold block">Alpa (A)</span>
              <span className="text-2xl font-bold text-rose-800 font-mono tabular-nums">{countAlpa}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Tanpa Keterangan</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Sinkronisasi otomatis dengan rapor akhir semester.</span>
            {hasUnsavedChanges && (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Ada perubahan belum disimpan</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table Presensi Siswa */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Daftar Presensi Peserta Didik ({studentsInKelas.length} Siswa Ditampilkan)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik tombol <strong>H (Hadir)</strong>, <strong>S (Sakit)</strong>, <strong>I (Izin)</strong>, atau <strong>A (Alpa)</strong> untuk mengubah status kehadiran siswa.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleSavePresensi}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer shrink-0"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Presensi</span>
            </button>
          )}
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
                <th className="py-3 px-4 min-w-[240px]">Catatan / Keterangan Sakit & Izin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentsInKelas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada siswa yang sesuai dengan filter ini.
                  </td>
                </tr>
              ) : (
                studentsInKelas.map((siswa, idx) => {
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
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                          {siswa.kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-center">
                        <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg text-xs font-semibold">
                          <button
                            type="button"
                            onClick={() => handleSetStatus(siswa.id, 'H')}
                            className={`w-7 h-7 rounded-md transition-colors cursor-pointer ${
                              currentStatus === 'H'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Hadir"
                          >
                            H
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(siswa.id, 'S')}
                            className={`w-7 h-7 rounded-md transition-colors cursor-pointer ${
                              currentStatus === 'S'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Sakit"
                          >
                            S
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(siswa.id, 'I')}
                            className={`w-7 h-7 rounded-md transition-colors cursor-pointer ${
                              currentStatus === 'I'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Izin"
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetStatus(siswa.id, 'A')}
                            className={`w-7 h-7 rounded-md transition-colors cursor-pointer ${
                              currentStatus === 'A'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Alpa (Tanpa Keterangan)"
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
                          placeholder={isAdmin ? 'Tambahkan keterangan alasan sakit/izin...' : '-'}
                          value={keteranganMap[siswa.id] || ''}
                          onChange={(e) => handleKeteranganChange(siswa.id, e.target.value)}
                          className={`w-full px-2.5 py-1 text-xs border rounded text-slate-800 ${
                            isAdmin
                              ? 'bg-slate-50 border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600'
                              : 'bg-transparent border-transparent text-slate-600 cursor-default'
                          }`}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

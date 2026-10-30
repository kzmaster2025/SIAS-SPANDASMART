import React, { useState, useEffect } from 'react';
import { Siswa, RaporSiswa, NilaiMapel } from '../types';
import { MOCK_RAPOR_CONTOH } from '../data/mockData';
import { InputRaporModal } from './InputRaporModal';
import {
  BookOpen,
  Printer,
  Calendar,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  Lock,
  Eye,
  Plus,
  Edit3,
  Save,
  Trash2,
  FileCheck
} from 'lucide-react';

interface AdministrasiAkademikProps {
  siswaList: Siswa[];
  onPrintRapor: (rapor: RaporSiswa, siswa: Siswa) => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  raporStore?: Record<string, RaporSiswa>;
  onSaveRapor?: (rapor: RaporSiswa) => void;
}

export const AdministrasiAkademik: React.FC<AdministrasiAkademikProps> = ({
  siswaList,
  onPrintRapor,
  isAdmin = false,
  onOpenAdminLogin,
  raporStore = {},
  onSaveRapor
}) => {
  const [selectedSiswaId, setSelectedSiswaId] = useState<string>(siswaList[0]?.id || 'sis-01');
  const [activeTab, setActiveTab] = useState<'rapor' | 'jadwal'>('rapor');
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Active student's rapor
  const selectedSiswa = siswaList.find(s => s.id === selectedSiswaId) || siswaList[0];

  // Helper to get or generate initial student rapor
  const getInitialRapor = (siswaId: string): RaporSiswa => {
    if (raporStore && raporStore[siswaId]) {
      return { ...raporStore[siswaId] };
    }
    // Default clone of mock template
    return {
      ...MOCK_RAPOR_CONTOH,
      siswaId: siswaId,
      catatanWaliKelas: `Peserta didik menunjukkan partisipasi aktif dalam pembelajaran Kurikulum Merdeka. Terus kembangkan potensi dan integritas.`
    };
  };

  const [currentRapor, setCurrentRapor] = useState<RaporSiswa>(() => getInitialRapor(selectedSiswaId));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update currentRapor when selected student changes or raporStore updates
  useEffect(() => {
    if (selectedSiswaId) {
      setCurrentRapor(getInitialRapor(selectedSiswaId));
      setHasUnsavedChanges(false);
    }
  }, [selectedSiswaId, raporStore]);

  const handleUpdateNilai = (index: number, field: keyof NilaiMapel, value: any) => {
    if (!isAdmin) return;
    const updatedNilai = [...currentRapor.nilai];
    (updatedNilai[index] as any)[field] = value;

    if (field === 'formatif' || field === 'sumatif') {
      const f = field === 'formatif' ? Number(value) : updatedNilai[index].formatif;
      const s = field === 'sumatif' ? Number(value) : updatedNilai[index].sumatif;
      updatedNilai[index].nilaiAkhir = Math.round(((f || 0) + (s || 0)) / 2);
    }

    setCurrentRapor({ ...currentRapor, nilai: updatedNilai });
    setHasUnsavedChanges(true);
  };

  const handleAddMapelInline = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    const newMapel: NilaiMapel = {
      kodeMapel: `MP-${currentRapor.nilai.length + 1}`,
      namaMapel: 'Mata Pelajaran Baru',
      guruPengampu: 'Guru Pengampu',
      kkm: 75,
      formatif: 85,
      sumatif: 85,
      nilaiAkhir: 85,
      capaianKompetensi: 'Mencapai kriteria ketuntasan tujuan pembelajaran materi dengan baik.'
    };
    setCurrentRapor(prev => ({
      ...prev,
      nilai: [...prev.nilai, newMapel]
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteMapelInline = (idx: number) => {
    if (!isAdmin) return;
    setCurrentRapor(prev => ({
      ...prev,
      nilai: prev.nilai.filter((_, i) => i !== idx)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAllChanges = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    if (onSaveRapor) {
      onSaveRapor(currentRapor);
    }
    setHasUnsavedChanges(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const handleModalSave = (savedRapor: RaporSiswa) => {
    setCurrentRapor(savedRapor);
    if (onSaveRapor) {
      onSaveRapor(savedRapor);
    }
    setHasUnsavedChanges(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2500);
  };

  const rataRataNilai = Math.round(
    currentRapor.nilai.reduce((sum, n) => sum + (Number(n.nilaiAkhir) || 0), 0) / (currentRapor.nilai.length || 1)
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
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
            Fasilitas lengkap penginputan asesmen formatif, sumatif materi, capaian kompetensi, dan cetak buku rapor resmi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (!isAdmin) {
                onOpenAdminLogin?.();
                return;
              }
              setIsInputModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            title={isAdmin ? "Buka formulir input nilai lengkap" : "Masuk admin untuk input nilai"}
          >
            {isAdmin ? <Edit3 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>+ Input / Edit Nilai Rapor Siswa</span>
          </button>

          {isAdmin && hasUnsavedChanges && (
            <button
              onClick={handleSaveAllChanges}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs cursor-pointer animate-pulse"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Nilai</span>
            </button>
          )}

          <button
            onClick={() => onPrintRapor(currentRapor, selectedSiswa)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-700" />
            <span>Cetak Rapor</span>
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
                Data nilai dan capaian siswa dapat dilihat dan dicetak. Untuk menginput, menambah mapel, atau mengedit nilai formatif/sumatif, silakan masuk sebagai Administrator atau Guru.
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

      {/* Save Success Alert Banner */}
      {showSaveToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Nilai rapor untuk <strong>{selectedSiswa.nama}</strong> ({selectedSiswa.kelas}) berhasil disimpan ke database cloud!
          </span>
        </div>
      )}

      {/* Selector & Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-700 shrink-0">Pilih Peserta Didik:</label>
          <select
            value={selectedSiswaId}
            onChange={(e) => setSelectedSiswaId(e.target.value)}
            className="text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 min-w-[260px]"
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
                <span className="text-sm font-bold text-emerald-700">
                  {rataRataNilai >= 85 ? 'Amat Baik (A)' : rataRataNilai >= 75 ? 'Baik (B)' : 'Cukup (C)'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabel Nilai Asesmen */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Rekap Nilai Capaian Kompetensi Kurikulum Merdeka ({currentRapor.nilai.length} Mapel)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAdmin
                    ? 'Anda dapat mengedit angka nilai langsung pada tabel ini atau menggunakan tombol "+ Input / Edit Nilai Rapor Siswa".'
                    : 'Mode lihat saja: Menampilkan nilai formatif, sumatif, dan deskripsi capaian pembelajaran.'}
                </p>
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddMapelInline}
                    className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Mapel</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveAllChanges}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Nilai</span>
                  </button>
                </div>
              )}
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
                    {isAdmin && <th className="py-3 px-3 text-center w-12">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentRapor.nilai.map((n, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400 tabular-nums">{idx + 1}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {isAdmin ? (
                          <input
                            type="text"
                            value={n.namaMapel}
                            onChange={(e) => handleUpdateNilai(idx, 'namaMapel', e.target.value)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-semibold text-slate-900 focus:bg-white text-xs w-full max-w-[220px]"
                          />
                        ) : (
                          n.namaMapel
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap text-[11px]">
                        {isAdmin ? (
                          <input
                            type="text"
                            value={n.guruPengampu}
                            onChange={(e) => handleUpdateNilai(idx, 'guruPengampu', e.target.value)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 focus:bg-white text-[11px] w-full max-w-[180px]"
                          />
                        ) : (
                          n.guruPengampu
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isAdmin ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={n.formatif}
                            onChange={(e) => handleUpdateNilai(idx, 'formatif', e.target.value)}
                            className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold text-blue-700"
                          />
                        ) : (
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">{n.formatif}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isAdmin ? (
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={n.sumatif}
                            onChange={(e) => handleUpdateNilai(idx, 'sumatif', e.target.value)}
                            className="w-14 px-1.5 py-1 text-center font-mono text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold text-indigo-700"
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
                      {isAdmin && (
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteMapelInline(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                            title="Hapus Mapel Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ekstrakurikuler & Catatan */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">Kegiatan Ekstrakurikuler</h4>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsInputModalOpen(true)}
                      className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Ekskul</span>
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {currentRapor.ekskul.map((e, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-white border border-slate-200">
                      <div className="flex items-center justify-between font-semibold text-slate-900 mb-0.5">
                        <span>{e.nama}</span>
                        <span className="text-[11px] text-blue-700 font-mono font-bold">{e.predikat}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{e.keterangan}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800">Catatan Wali Kelas & Kehadiran</h4>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsInputModalOpen(true)}
                      className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Catatan & Absen</span>
                    </button>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-600 pb-2 border-b border-slate-100">
                    <span>Sakit: <strong className="text-blue-700">{currentRapor.kehadiran.sakit} Hari</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Izin: <strong className="text-amber-700">{currentRapor.kehadiran.izin} Hari</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Tanpa Keterangan: <strong className="text-rose-700">{currentRapor.kehadiran.alpa} Hari</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed italic">
                    "{currentRapor.catatanWaliKelas}"
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

      {/* Input Rapor Modal */}
      <InputRaporModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        siswaList={siswaList}
        currentSiswaId={selectedSiswaId}
        existingRapor={currentRapor}
        onSaveRapor={handleModalSave}
      />
    </div>
  );
};

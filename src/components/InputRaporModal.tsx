import React, { useState, useEffect } from 'react';
import { Siswa, RaporSiswa, NilaiMapel } from '../types';
import {
  X,
  Save,
  Plus,
  Trash2,
  BookOpen,
  Award,
  CalendarCheck2,
  CheckCircle2,
  Sparkles,
  Calculator
} from 'lucide-react';

interface InputRaporModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswaList: Siswa[];
  currentSiswaId: string;
  existingRapor: RaporSiswa | null;
  onSaveRapor: (rapor: RaporSiswa) => void;
}

const DEFAULT_MAPEL_TEMPLATES: NilaiMapel[] = [
  {
    kodeMapel: 'PAI',
    namaMapel: 'Pendidikan Agama Islam dan Budi Pekerti',
    guruPengampu: 'H. Yusuf Hidayat, M.Pd.',
    kkm: 75,
    formatif: 85,
    sumatif: 88,
    nilaiAkhir: 87,
    capaianKompetensi: 'Memahami makna nilai keimanan dan berakhlak mulia dalam interaksi sosial.'
  },
  {
    kodeMapel: 'PPKN',
    namaMapel: 'Pendidikan Pancasila',
    guruPengampu: 'Dra. Hj. Nurbaeti',
    kkm: 75,
    formatif: 86,
    sumatif: 88,
    nilaiAkhir: 87,
    capaianKompetensi: 'Mampu menjelaskan penerapan nilai-nilai Pancasila dalam norma hukum bermasyarakat.'
  },
  {
    kodeMapel: 'BIN',
    namaMapel: 'Bahasa Indonesia',
    guruPengampu: 'Rina Marlina, S.Pd.',
    kkm: 75,
    formatif: 90,
    sumatif: 92,
    nilaiAkhir: 91,
    capaianKompetensi: 'Sangat terampil menganalisis teks deskripsi dan menyajikan pidato persuasif.'
  },
  {
    kodeMapel: 'MAT',
    namaMapel: 'Matematika',
    guruPengampu: 'Dra. Hj. Nunung Nurbaeti, M.M.Pd.',
    kkm: 75,
    formatif: 88,
    sumatif: 90,
    nilaiAkhir: 89,
    capaianKompetensi: 'Menunjukkan pemahaman tinggi aljabar linier dan pemecahan masalah geometri.'
  },
  {
    kodeMapel: 'IPA',
    namaMapel: 'Ilmu Pengetahuan Alam (IPA)',
    guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
    kkm: 75,
    formatif: 89,
    sumatif: 91,
    nilaiAkhir: 90,
    capaianKompetensi: 'Memahami konsep metode ilmiah mikroskopis dan klasifikasi materi zat dengan baik.'
  },
  {
    kodeMapel: 'IPS',
    namaMapel: 'Ilmu Pengetahuan Sosial (IPS)',
    guruPengampu: 'Dedi Suhendi, S.Sos.',
    kkm: 75,
    formatif: 85,
    sumatif: 87,
    nilaiAkhir: 86,
    capaianKompetensi: 'Mampu menganalisis dinamika interaksi antarruang dan kelembagaan sosial ekonomi.'
  },
  {
    kodeMapel: 'ING',
    namaMapel: 'Bahasa Inggris',
    guruPengampu: 'Sri Wahyuni, S.Pd.',
    kkm: 75,
    formatif: 87,
    sumatif: 89,
    nilaiAkhir: 88,
    capaianKompetensi: 'Fluent in expressing self-introduction, giving instruction, and descriptive procedural texts.'
  },
  {
    kodeMapel: 'INF',
    namaMapel: 'Informatika',
    guruPengampu: 'Wildan Ramdani, S.Kom., Gr.',
    kkm: 75,
    formatif: 92,
    sumatif: 94,
    nilaiAkhir: 93,
    capaianKompetensi: 'Sangat mahir berpikir komputasional, algoritma flowchart, dan pemrograman dasar visual.'
  },
  {
    kodeMapel: 'PJOK',
    namaMapel: 'Pendidikan Jasmani, Olahraga & Kesehatan (PJOK)',
    guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
    kkm: 75,
    formatif: 88,
    sumatif: 90,
    nilaiAkhir: 89,
    capaianKompetensi: 'Mempraktikkan keterampilan gerak dasar atletik dan kebugaran jasmani teratur.'
  },
  {
    kodeMapel: 'SND',
    namaMapel: 'Muatan Lokal Bahasa Sunda',
    guruPengampu: 'Rina Marlina, S.Pd.',
    kkm: 75,
    formatif: 88,
    sumatif: 88,
    nilaiAkhir: 88,
    capaianKompetensi: 'Mahir ngalarapkeun undak-usuk basa Sunda dina paguneman sapopoe sarta maca aksara Sunda.'
  }
];

export const InputRaporModal: React.FC<InputRaporModalProps> = ({
  isOpen,
  onClose,
  siswaList,
  currentSiswaId,
  existingRapor,
  onSaveRapor
}) => {
  const [targetSiswaId, setTargetSiswaId] = useState<string>(currentSiswaId || siswaList[0]?.id || '');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(existingRapor?.semester || 'Ganjil');
  const [tahunAjaran, setTahunAjaran] = useState<string>(existingRapor?.tahunAjaran || '2025/2026');
  
  const [nilaiList, setNilaiList] = useState<NilaiMapel[]>([]);
  const [kehadiran, setKehadiran] = useState({ sakit: 0, izin: 0, alpa: 0 });
  const [catatanWaliKelas, setCatatanWaliKelas] = useState('');
  const [ekskulList, setEkskulList] = useState<{ nama: string; predikat: 'Sangat Baik' | 'Baik' | 'Cukup'; keterangan: string }[]>([]);
  const [showToast, setShowToast] = useState(false);

  // Sync state on open or change
  useEffect(() => {
    if (existingRapor) {
      setSemester(existingRapor.semester);
      setTahunAjaran(existingRapor.tahunAjaran);
      setNilaiList(existingRapor.nilai && existingRapor.nilai.length > 0 ? [...existingRapor.nilai] : [...DEFAULT_MAPEL_TEMPLATES]);
      setKehadiran({ ...existingRapor.kehadiran });
      setCatatanWaliKelas(existingRapor.catatanWaliKelas || 'Menunjukkan perkembangan belajar yang baik dan aktif dalam kegiatan kokurikuler.');
      setEkskulList(existingRapor.ekskul && existingRapor.ekskul.length > 0 ? [...existingRapor.ekskul] : [
        { nama: 'Pramuka Penggalang', predikat: 'Sangat Baik', keterangan: 'Aktif mengikuti kegiatan kepanduan' }
      ]);
    } else {
      setNilaiList([...DEFAULT_MAPEL_TEMPLATES]);
      setKehadiran({ sakit: 1, izin: 0, alpa: 0 });
      setCatatanWaliKelas('Menunjukkan kesungguhan dan antusiasme tinggi dalam pembelajaran berbasis projek (P5). Terus tingkatkan kemampuan kolaborasi.');
      setEkskulList([
        { nama: 'Pramuka Penggalang', predikat: 'Sangat Baik', keterangan: 'Aktif mengikuti kepanduan' },
        { nama: 'Palang Merah Remaja (PMR)', predikat: 'Baik', keterangan: 'Siaga dan peduli sosial' }
      ]);
    }
  }, [existingRapor, targetSiswaId, isOpen]);

  useEffect(() => {
    if (currentSiswaId) {
      setTargetSiswaId(currentSiswaId);
    }
  }, [currentSiswaId]);

  if (!isOpen) return null;

  const currentSiswa = siswaList.find(s => s.id === targetSiswaId) || siswaList[0];

  const handleNilaiChange = (index: number, field: keyof NilaiMapel, val: any) => {
    const updated = [...nilaiList];
    (updated[index] as any)[field] = val;

    if (field === 'formatif' || field === 'sumatif') {
      const f = field === 'formatif' ? Number(val) : updated[index].formatif;
      const s = field === 'sumatif' ? Number(val) : updated[index].sumatif;
      updated[index].nilaiAkhir = Math.round(((f || 0) + (s || 0)) / 2);
    }
    setNilaiList(updated);
  };

  const handleAddMapel = () => {
    setNilaiList(prev => [
      ...prev,
      {
        kodeMapel: `MAPEL-${prev.length + 1}`,
        namaMapel: 'Mata Pelajaran Pilihan',
        guruPengampu: 'Guru Pengampu',
        kkm: 75,
        formatif: 85,
        sumatif: 85,
        nilaiAkhir: 85,
        capaianKompetensi: 'Mampu mencapai capaian kompetensi dasar materi dengan baik.'
      }
    ]);
  };

  const handleRemoveMapel = (index: number) => {
    setNilaiList(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddEkskul = () => {
    setEkskulList(prev => [
      ...prev,
      { nama: 'Ekstrakurikuler Baru', predikat: 'Baik', keterangan: 'Berpartisipasi aktif dalam latihan rutin' }
    ]);
  };

  const handleRemoveEkskul = (index: number) => {
    setEkskulList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRapor: RaporSiswa = {
      siswaId: targetSiswaId,
      semester,
      tahunAjaran,
      nilai: nilaiList,
      kehadiran,
      catatanWaliKelas,
      ekskul: ekskulList
    };

    onSaveRapor(finalRapor);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      onClose();
    }, 1000);
  };

  const rataRataNilai = Math.round(
    nilaiList.reduce((sum, n) => sum + (Number(n.nilaiAkhir) || 0), 0) / (nilaiList.length || 1)
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-5 sm:p-6 my-auto max-h-[92vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Input & Edit Nilai Rapor Siswa (Kurikulum Merdeka)
              </h3>
              <p className="text-xs text-slate-500">
                Pengelolaan asesmen formatif, sumatif, capaian pembelajaran, kehadiran, dan ekstrakurikuler
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-6 text-xs">
          {/* Section 1: Data Identitas Rapor */}
          <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
            <h4 className="font-bold text-blue-950 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>1. Identitas Peserta Didik & Periode Asesmen</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pilih Siswa</label>
                <select
                  value={targetSiswaId}
                  onChange={(e) => setTargetSiswaId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900"
                  required
                >
                  {siswaList.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas} - NISN: {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tahun Ajaran</label>
                <input
                  type="text"
                  value={tahunAjaran}
                  onChange={(e) => setTahunAjaran(e.target.value)}
                  placeholder="2025/2026"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                  required
                />
              </div>
            </div>

            {currentSiswa && (
              <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-600 border-t border-blue-200/60">
                <span>Nama Siswa: <strong className="text-slate-900">{currentSiswa.nama}</strong></span>
                <span>NISN: <strong className="font-mono">{currentSiswa.nisn}</strong></span>
                <span>Kelas: <strong className="text-blue-700">{currentSiswa.kelas}</strong></span>
                <span>Rata-rata Nilai: <strong className="text-emerald-700 font-mono text-xs">{rataRataNilai}</strong></span>
              </div>
            )}
          </div>

          {/* Section 2: Nilai Mata Pelajaran */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  2. Nilai Formatif, Sumatif & Capaian Kompetensi ({nilaiList.length} Mapel)
                </h4>
                <p className="text-slate-500">Nilai Akhir dihitung otomatis: (Formatif + Sumatif) / 2</p>
              </div>
              <button
                type="button"
                onClick={handleAddMapel}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Mata Pelajaran</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Mata Pelajaran</th>
                    <th className="py-2.5 px-3">Guru Pengampu</th>
                    <th className="py-2.5 px-2 text-center w-16">KKM</th>
                    <th className="py-2.5 px-2 text-center w-20">Formatif</th>
                    <th className="py-2.5 px-2 text-center w-20">Sumatif</th>
                    <th className="py-2.5 px-2 text-center w-20">Nilai Akhir</th>
                    <th className="py-2.5 px-3 min-w-[260px]">Deskripsi Capaian Kompetensi</th>
                    <th className="py-2.5 px-2 text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {nilaiList.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={m.namaMapel}
                          onChange={(e) => handleNilaiChange(idx, 'namaMapel', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-200 bg-white font-medium"
                          required
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={m.guruPengampu}
                          onChange={(e) => handleNilaiChange(idx, 'guruPengampu', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-200 bg-white text-[11px]"
                          placeholder="Nama Guru"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={m.kkm}
                          onChange={(e) => handleNilaiChange(idx, 'kkm', Number(e.target.value))}
                          className="w-14 text-center px-1.5 py-1 rounded border border-slate-200 bg-white font-mono"
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={m.formatif}
                          onChange={(e) => handleNilaiChange(idx, 'formatif', Number(e.target.value))}
                          className="w-16 text-center px-1.5 py-1 rounded border border-slate-200 bg-white font-mono font-semibold text-blue-700"
                          min={0}
                          max={100}
                          required
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <input
                          type="number"
                          value={m.sumatif}
                          onChange={(e) => handleNilaiChange(idx, 'sumatif', Number(e.target.value))}
                          className="w-16 text-center px-1.5 py-1 rounded border border-slate-200 bg-white font-mono font-semibold text-indigo-700"
                          min={0}
                          max={100}
                          required
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-block w-14 py-1 text-center font-bold rounded font-mono ${
                          m.nilaiAkhir >= (m.kkm || 75) ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {m.nilaiAkhir}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <textarea
                          rows={2}
                          value={m.capaianKompetensi}
                          onChange={(e) => handleNilaiChange(idx, 'capaianKompetensi', e.target.value)}
                          className="w-full px-2 py-1 rounded border border-slate-200 bg-white text-[11px] leading-tight"
                          placeholder="Deskripsi pencapaian kompetensi siswa..."
                        />
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveMapel(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                          title="Hapus Mapel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Rekap Kehadiran & Catatan Wali Kelas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kehadiran */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-blue-700" />
                <span>3. Rekapitulasi Kehadiran Siswa</span>
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Sakit (Hari)</label>
                  <input
                    type="number"
                    min={0}
                    value={kehadiran.sakit}
                    onChange={(e) => setKehadiran(prev => ({ ...prev, sakit: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Izin (Hari)</label>
                  <input
                    type="number"
                    min={0}
                    value={kehadiran.izin}
                    onChange={(e) => setKehadiran(prev => ({ ...prev, izin: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono font-bold text-amber-700"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Alpa (Hari)</label>
                  <input
                    type="number"
                    min={0}
                    value={kehadiran.alpa}
                    onChange={(e) => setKehadiran(prev => ({ ...prev, alpa: Number(e.target.value) }))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white font-mono font-bold text-rose-700"
                  />
                </div>
              </div>
            </div>

            {/* Catatan Wali Kelas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h4 className="font-bold text-slate-900">4. Catatan Wali Kelas</h4>
              <textarea
                rows={3}
                value={catatanWaliKelas}
                onChange={(e) => setCatatanWaliKelas(e.target.value)}
                placeholder="Tuliskan motivasi, perkembangan karakter, dan rekomendasi bagi siswa..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 4: Ekstrakurikuler */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-700" />
                <span>5. Kegiatan Ekstrakurikuler</span>
              </h4>
              <button
                type="button"
                onClick={handleAddEkskul}
                className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-md font-semibold text-[11px] inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Ekskul</span>
              </button>
            </div>

            <div className="space-y-2">
              {ekskulList.map((ek, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                  <input
                    type="text"
                    value={ek.nama}
                    onChange={(e) => {
                      const updated = [...ekskulList];
                      updated[idx].nama = e.target.value;
                      setEkskulList(updated);
                    }}
                    placeholder="Nama Ekstrakurikuler (contoh: Pramuka)"
                    className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200"
                    required
                  />
                  <select
                    value={ek.predikat}
                    onChange={(e) => {
                      const updated = [...ekskulList];
                      updated[idx].predikat = e.target.value as any;
                      setEkskulList(updated);
                    }}
                    className="px-2.5 py-1 text-xs rounded border border-slate-200 bg-slate-50 font-semibold"
                  >
                    <option value="Sangat Baik">Sangat Baik (A)</option>
                    <option value="Baik">Baik (B)</option>
                    <option value="Cukup">Cukup (C)</option>
                  </select>
                  <input
                    type="text"
                    value={ek.keterangan}
                    onChange={(e) => {
                      const updated = [...ekskulList];
                      updated[idx].keterangan = e.target.value;
                      setEkskulList(updated);
                    }}
                    placeholder="Keterangan pencapaian / keaktifan"
                    className="flex-1 px-2.5 py-1 text-xs rounded border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveEkskul(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer shrink-0"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Kurikulum Merdeka Fase D · SMPN 2 Kota Sukabumi
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Nilai Rapor Siswa</span>
              </button>
            </div>
          </div>
        </form>

        {showToast && (
          <div className="absolute top-4 right-4 bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Nilai Rapor Siswa Berhasil Disimpan ke Database!</span>
          </div>
        )}
      </div>
    </div>
  );
};

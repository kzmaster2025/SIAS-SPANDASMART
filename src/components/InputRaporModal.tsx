import React, { useState, useEffect } from 'react';
import { Siswa, RaporSiswa, NilaiMapel, CapaianKokurikuler, PredikatKokurikuler } from '../types';
import { DELAPAN_DIMENSI_PROFIL_LULUSAN, getDefaultKokurikuler } from '../data/dimensiProfilLulusan';
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
  Compass,
  Check,
  RotateCcw
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
  const [modalTab, setModalTab] = useState<'mapel' | 'kokurikuler' | 'ekskul'>('kokurikuler');
  const [targetSiswaId, setTargetSiswaId] = useState<string>(currentSiswaId || siswaList[0]?.id || '');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(existingRapor?.semester || 'Ganjil');
  const [tahunAjaran, setTahunAjaran] = useState<string>(existingRapor?.tahunAjaran || '2025/2026');
  
  const [nilaiList, setNilaiList] = useState<NilaiMapel[]>([]);
  const [kokurikulerList, setKokurikulerList] = useState<CapaianKokurikuler[]>([]);
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
      setKokurikulerList(
        existingRapor.kokurikuler && existingRapor.kokurikuler.length === 8
          ? [...existingRapor.kokurikuler]
          : getDefaultKokurikuler()
      );
      setKehadiran({ ...existingRapor.kehadiran });
      setCatatanWaliKelas(existingRapor.catatanWaliKelas || 'Menunjukkan perkembangan belajar yang baik dan aktif dalam kegiatan kokurikuler.');
      setEkskulList(existingRapor.ekskul && existingRapor.ekskul.length > 0 ? [...existingRapor.ekskul] : [
        { nama: 'Pramuka Penggalang', predikat: 'Sangat Baik', keterangan: 'Aktif mengikuti kegiatan kepanduan' }
      ]);
    } else {
      setNilaiList([...DEFAULT_MAPEL_TEMPLATES]);
      setKokurikulerList(getDefaultKokurikuler());
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

  // Kokurikuler update handlers
  const handleKokurikulerChange = (index: number, field: keyof CapaianKokurikuler, val: any) => {
    const updated = [...kokurikulerList];
    (updated[index] as any)[field] = val;
    setKokurikulerList(updated);
  };

  const handleSetAllPredikat = (predikat: PredikatKokurikuler) => {
    setKokurikulerList(prev => prev.map(k => ({ ...k, predikat })));
  };

  const handleResetKokurikulerStandard = () => {
    setKokurikulerList(getDefaultKokurikuler());
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
      kokurikuler: kokurikulerList,
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full p-5 sm:p-6 my-auto max-h-[92vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Input & Edit Rapor Siswa · Kurikulum Merdeka
              </h3>
              <p className="text-xs text-slate-500">
                Asesmen mata pelajaran, kegiatan kokurikuler 8 dimensi profil lulusan, ekstrakurikuler, dan kehadiran
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

        {/* Global Student & Period Bar */}
        <div className="py-3 px-4 bg-slate-50 border-b border-slate-200 shrink-0 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Peserta Didik</label>
            <select
              value={targetSiswaId}
              onChange={(e) => setTargetSiswaId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-900"
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
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
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
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-medium"
              required
            />
          </div>
        </div>

        {/* Tab Navigation in Modal */}
        <div className="flex items-center gap-2 px-1 pt-3 border-b border-slate-200 shrink-0 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setModalTab('kokurikuler')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              modalTab === 'kokurikuler'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-600" />
            <span>1. Kokurikuler (8 Dimensi Profil Lulusan)</span>
            <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px]">8 Dimensi</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('mapel')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              modalTab === 'mapel'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span>2. Nilai Mata Pelajaran ({nilaiList.length} Mapel)</span>
          </button>

          <button
            type="button"
            onClick={() => setModalTab('ekskul')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              modalTab === 'ekskul'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-slate-600" />
            <span>3. Ekstrakurikuler, Catatan & Kehadiran</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-6 text-xs pr-1">
          {/* TAB 1: KOKURIKULER (8 DIMENSI PROFIL LULUSAN) */}
          {modalTab === 'kokurikuler' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-700" />
                    <span>Asesmen Kokurikuler Berdasarkan 8 Dimensi Profil Lulusan</span>
                  </h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    Standar Kompetensi Lulusan terpadu mencakup 8 dimensi karakter & kecakapan hidup peserta didik.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetAllPredikat('Berkembang Sesuai Harapan')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-800 bg-white border border-blue-300 hover:bg-blue-100 rounded-md shadow-2xs cursor-pointer"
                  >
                    Setel Semua BSH
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAllPredikat('Sangat Berkembang')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-md shadow-2xs cursor-pointer"
                  >
                    Setel Semua SB
                  </button>
                  <button
                    type="button"
                    onClick={handleResetKokurikulerStandard}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-md shadow-2xs cursor-pointer flex items-center gap-1"
                    title="Kembalikan narasi dan tema standar"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Reset Narasi Standar</span>
                  </button>
                </div>
              </div>

              {/* 8 Dimensi Cards */}
              <div className="space-y-3">
                {kokurikulerList.map((k, idx) => {
                  const meta = DELAPAN_DIMENSI_PROFIL_LULUSAN[idx] || { nomor: idx + 1, fokus: '' };

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-blue-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm">
                              {k.dimensi}
                            </h5>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {k.deskripsiDimensi || meta.fokus}
                            </p>
                          </div>
                        </div>

                        {/* Predikat Selector */}
                        <div className="flex items-center gap-2 shrink-0">
                          <label className="text-[11px] text-slate-600 font-semibold">Predikat:</label>
                          <select
                            value={k.predikat}
                            onChange={(e) => handleKokurikulerChange(idx, 'predikat', e.target.value as PredikatKokurikuler)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:ring-2 focus:ring-blue-600 cursor-pointer ${
                              k.predikat === 'Sangat Berkembang'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : k.predikat === 'Berkembang Sesuai Harapan'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : k.predikat === 'Mulai Berkembang'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="Sangat Berkembang">Sangat Berkembang (SB)</option>
                            <option value="Berkembang Sesuai Harapan">Berkembang Sesuai Harapan (BSH)</option>
                            <option value="Mulai Berkembang">Mulai Berkembang (MB)</option>
                            <option value="Belum Berkembang">Belum Berkembang (BB)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Tema Projek / Fokus Kokurikuler
                          </label>
                          <input
                            type="text"
                            value={k.temaProjek || ''}
                            onChange={(e) => handleKokurikulerChange(idx, 'temaProjek', e.target.value)}
                            placeholder="Contoh: Projek Gaya Hidup Berkelanjutan"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Catatan Capaian / Deskripsi Observasi Karakter
                          </label>
                          <textarea
                            rows={2}
                            value={k.catatan}
                            onChange={(e) => handleKokurikulerChange(idx, 'catatan', e.target.value)}
                            placeholder="Tuliskan catatan perkembangan dan bukti perilaku siswa pada dimensi ini..."
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white leading-relaxed"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: NILAI MAPEL */}
          {modalTab === 'mapel' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Nilai Formatif, Sumatif & Capaian Kompetensi ({nilaiList.length} Mapel)
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
          )}

          {/* TAB 3: EKSKUL, CATATAN & ABSEN */}
          {modalTab === 'ekskul' && (
            <div className="space-y-4">
              {/* Rekap Kehadiran */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <CalendarCheck2 className="w-4 h-4 text-blue-700" />
                  <span>Rekapitulasi Ketidakhadiran Siswa</span>
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Sakit (Hari)</label>
                    <input
                      type="number"
                      min={0}
                      value={kehadiran.sakit}
                      onChange={(e) => setKehadiran(prev => ({ ...prev, sakit: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-blue-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Izin (Hari)</label>
                    <input
                      type="number"
                      min={0}
                      value={kehadiran.izin}
                      onChange={(e) => setKehadiran(prev => ({ ...prev, izin: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-amber-700 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Alpa / Tanpa Keterangan (Hari)</label>
                    <input
                      type="number"
                      min={0}
                      value={kehadiran.alpa}
                      onChange={(e) => setKehadiran(prev => ({ ...prev, alpa: Number(e.target.value) }))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-rose-700 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Catatan Wali Kelas */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <h4 className="font-bold text-slate-900">Catatan & Motivasi Wali Kelas</h4>
                <textarea
                  rows={3}
                  value={catatanWaliKelas}
                  onChange={(e) => setCatatanWaliKelas(e.target.value)}
                  placeholder="Tuliskan motivasi, perkembangan karakter, dan rekomendasi bagi siswa..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Ekstrakurikuler */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-700" />
                    <span>Kegiatan Ekstrakurikuler</span>
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
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-mono">
              Kurikulum Merdeka · 8 Dimensi Profil Lulusan & Capaian Belajar
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
                <span>Simpan Rapor & 8 Dimensi</span>
              </button>
            </div>
          </div>
        </form>

        {showToast && (
          <div className="absolute top-4 right-4 bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Nilai Rapor & 8 Dimensi Profil Lulusan Berhasil Disimpan!</span>
          </div>
        )}
      </div>
    </div>
  );
};

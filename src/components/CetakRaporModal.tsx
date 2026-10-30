import React, { useState, useEffect } from 'react';
import { RaporSiswa, Siswa, ProfilSekolahData, GuruTendik } from '../types';
import { getDefaultKokurikuler } from '../data/dimensiProfilLulusan';
import {
  X,
  Printer,
  Award,
  Settings,
  Save,
  CheckCircle2,
  UserCheck,
  Calendar,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface CetakRaporModalProps {
  rapor: RaporSiswa | null;
  siswa: Siswa | null;
  onClose: () => void;
  profil?: ProfilSekolahData;
  guruList?: GuruTendik[];
  isAdmin?: boolean;
  onSaveRapor?: (rapor: RaporSiswa) => void;
}

export const CetakRaporModal: React.FC<CetakRaporModalProps> = ({
  rapor,
  siswa,
  onClose,
  profil,
  guruList = [],
  isAdmin = false,
  onSaveRapor
}) => {
  if (!rapor || !siswa) return null;

  // Find Wali Kelas based on student class from database
  const findDatabaseWaliKelas = () => {
    if (!guruList || guruList.length === 0) {
      return { nama: 'Rina Marlina, S.Pd.', nip: '19821104 200902 2 003' };
    }
    const targetClass = siswa.kelas.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Look for matching teacher with 'wali' and class name in their jabatan
    const match = guruList.find(g => {
      const jab = (g.jabatan || '').toLowerCase();
      if (!jab.includes('wali')) return false;
      const jabClean = jab.replace(/[^a-z0-9]/g, '');
      return jabClean.includes(targetClass) ||
             (targetClass === '7a' && (jab.includes('7-a') || jab.includes('7 a') || jab.includes('vii a'))) ||
             (targetClass === '7b' && (jab.includes('7-b') || jab.includes('7 b') || jab.includes('vii b'))) ||
             (targetClass === '8c' && (jab.includes('8-c') || jab.includes('8 c') || jab.includes('viii c'))) ||
             (targetClass === '9a' && (jab.includes('9-a') || jab.includes('9 a') || jab.includes('ix a')));
    });

    if (match) {
      const fullNama = match.gelar ? `${match.nama}, ${match.gelar}` : match.nama;
      return { nama: fullNama, nip: match.nip };
    }

    // Fallback to first educator with wali or first teacher
    const anyWali = guruList.find(g => (g.jabatan || '').toLowerCase().includes('wali'));
    if (anyWali) {
      const fullNama = anyWali.gelar ? `${anyWali.nama}, ${anyWali.gelar}` : anyWali.nama;
      return { nama: fullNama, nip: anyWali.nip };
    }

    return { nama: 'Rina Marlina, S.Pd.', nip: '19821104 200902 2 003' };
  };

  // Find Kepala Sekolah based on database profil or guruList
  const findDatabaseKepsek = () => {
    if (profil?.kepalaSekolah?.nama) {
      return {
        nama: profil.kepalaSekolah.nama,
        nip: profil.kepalaSekolah.nip || '19680512 199412 1 002'
      };
    }
    const match = guruList.find(g => (g.jabatan || '').toLowerCase().includes('kepala sekolah'));
    if (match) {
      const fullNama = match.gelar ? `${match.nama}, ${match.gelar}` : match.nama;
      return { nama: fullNama, nip: match.nip };
    }
    return { nama: 'H. Yusuf Hidayat, M.Pd.', nip: '19680512 199412 1 002' };
  };

  const defaultWali = findDatabaseWaliKelas();
  const defaultKepsek = findDatabaseKepsek();

  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [waliKelasNama, setWaliKelasNama] = useState(rapor.waliKelas?.nama || defaultWali.nama);
  const [waliKelasNip, setWaliKelasNip] = useState(rapor.waliKelas?.nip || defaultWali.nip);
  const [kepsekNama, setKepsekNama] = useState(rapor.kepalaSekolah?.nama || defaultKepsek.nama);
  const [kepsekNip, setKepsekNip] = useState(rapor.kepalaSekolah?.nip || defaultKepsek.nip);
  const [titimangsa, setTitimangsa] = useState(
    rapor.titimangsa || (rapor.semester === 'Genap' ? 'Sukabumi, 24 Juni 2026' : 'Sukabumi, 20 Desember 2025')
  );
  const [fase, setFase] = useState(rapor.fase || 'D');
  const [semesterFormatted, setSemesterFormatted] = useState(
    rapor.semester === 'Genap' ? '2' : '1'
  );
  const [kenaikanKelas, setKenaikanKelas] = useState(
    rapor.kenaikanKelas ||
    (siswa.tingkat === '7' ? 'Naik ke kelas VIII' : siswa.tingkat === '8' ? 'Naik ke kelas IX' : 'Lulus dari Satuan Pendidikan SMP')
  );

  // Auto-generate or load Kokurikuler narrative matching image_ffff6f2b.png
  const buildDefaultNarasiKokurikuler = (): string => {
    if (rapor.narasiKokurikuler) return rapor.narasiKokurikuler;

    const kokur = rapor.kokurikuler && rapor.kokurikuler.length === 8
      ? rapor.kokurikuler
      : getDefaultKokurikuler();

    // Pick top themes
    const t1 = kokur[1]?.temaProjek || 'Eksplorasi keberagaman budaya lokal dan nasional';
    const t2 = kokur[0]?.temaProjek || 'melestarikan kekayaan warisan budaya Indonesia';

    return `Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler "${t1}" serta "${t2}".\n` +
      `Pada dimensi kewargaan, ananda cakap dalam subdimensi kewargaan lokal.\n` +
      `Pada dimensi kreativitas, ananda cakap dalam subdimensi gagasan baru.\n` +
      `Pada dimensi kolaborasi, ananda cakap dalam subdimensi kerja sama.`;
  };

  const [narasiKokurikuler, setNarasiKokurikuler] = useState(buildDefaultNarasiKokurikuler());
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state if student changes
  useEffect(() => {
    const w = findDatabaseWaliKelas();
    const k = findDatabaseKepsek();
    setWaliKelasNama(rapor.waliKelas?.nama || w.nama);
    setWaliKelasNip(rapor.waliKelas?.nip || w.nip);
    setKepsekNama(rapor.kepalaSekolah?.nama || k.nama);
    setKepsekNip(rapor.kepalaSekolah?.nip || k.nip);
    setNarasiKokurikuler(buildDefaultNarasiKokurikuler());
  }, [siswa.id, rapor.siswaId]);

  const handleSelectWaliFromDatabase = (guruId: string) => {
    const g = guruList.find(item => item.id === guruId);
    if (g) {
      const fullNama = g.gelar ? `${g.nama}, ${g.gelar}` : g.nama;
      setWaliKelasNama(fullNama);
      setWaliKelasNip(g.nip);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRapor: RaporSiswa = {
      ...rapor,
      fase,
      kenaikanKelas,
      narasiKokurikuler,
      titimangsa,
      waliKelas: {
        nama: waliKelasNama,
        nip: waliKelasNip
      },
      kepalaSekolah: {
        nama: kepsekNama,
        nip: kepsekNip
      }
    };

    if (onSaveRapor) {
      onSaveRapor(updatedRapor);
    }
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
    setIsSettingsOpen(false);
  };

  const namaSekolah = profil?.nama || 'SMP N 2 KOTA SUKABUMI';
  const alamatSekolah = profil?.alamat ? profil.alamat.split(',')[0] : 'Jl. Ir. H. Juanda No. 14';

  // Format Class Display (e.g. "Kelas VII A" or "Kelas 7-A")
  const formatKelasRomawi = (kelas: string) => {
    if (!kelas) return 'Kelas VII A';
    if (kelas.toLowerCase().includes('kelas')) return kelas;
    const parts = kelas.split(/[- ]/);
    const tingkat = parts[0];
    const romawi = tingkat === '7' ? 'VII' : tingkat === '8' ? 'VIII' : tingkat === '9' ? 'IX' : tingkat;
    const suffix = parts.slice(1).join(' ');
    return `Kelas ${romawi} ${suffix}`.trim();
  };

  const displayKelas = formatKelasRomawi(siswa.kelas);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-4 sm:p-6 my-auto max-h-[96vh] flex flex-col">
        {/* Modal Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 no-print shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Format Resmi Rapor Hasil Belajar (Sesuai Berkas Sekolah)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {siswa.nama} · {displayKelas} · NIS: {siswa.nis} · NISN: {siswa.nisn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                isSettingsOpen
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
              title="Sesuaikan Data Tanda Tangan & Kenaikan Kelas"
            >
              <Settings className="w-3.5 h-3.5 text-blue-700" />
              <span>{isSettingsOpen ? 'Tutup Pengaturan' : 'Sesuaikan Data TTD & Kokurikuler'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SETTINGS DRAWER (For Admin/User to configure TTD & metadata from database) */}
        {isSettingsOpen && (
          <div className="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50/70 space-y-3 no-print text-xs shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-700" />
                <span>Pengaturan Penandatangan (Database Guru & Kepala Sekolah)</span>
              </h4>
              <span className="text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full font-semibold">
                Sinkronisasi Database
              </span>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* WALI KELAS CONFIGURATION */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">1. Data Wali Kelas ({displayKelas})</label>
                  </div>

                  {guruList.length > 0 && (
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Pilih dari Database Guru:</span>
                      <select
                        onChange={(e) => handleSelectWaliFromDatabase(e.target.value)}
                        className="w-full px-2 py-1 text-[11px] rounded border border-slate-300 bg-slate-50"
                      >
                        <option value="">-- Pilih Guru / Wali Kelas --</option>
                        {guruList.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.nama}, {g.gelar || ''} ({g.jabatan || 'Guru'})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Nama & Gelar:</span>
                      <input
                        type="text"
                        value={waliKelasNama}
                        onChange={(e) => setWaliKelasNama(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">NIP:</span>
                      <input
                        type="text"
                        value={waliKelasNip}
                        onChange={(e) => setWaliKelasNip(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* KEPALA SEKOLAH CONFIGURATION */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">2. Data Kepala Sekolah</label>
                    <span className="text-[10px] text-slate-400 font-mono">Profil Sekolah</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">Nama Kepala Sekolah:</span>
                      <input
                        type="text"
                        value={kepsekNama}
                        onChange={(e) => setKepsekNama(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-0.5">NIP:</span>
                      <input
                        type="text"
                        value={kepsekNip}
                        onChange={(e) => setKepsekNip(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5">Kota & Tanggal Titimangsa:</span>
                    <input
                      type="text"
                      value={titimangsa}
                      onChange={(e) => setTitimangsa(e.target.value)}
                      placeholder="Sukabumi, 24 Juni 2026"
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Kenaikan Kelas & Narasi Kokurikuler */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                    Keterangan Kenaikan Kelas:
                  </label>
                  <input
                    type="text"
                    value={kenaikanKelas}
                    onChange={(e) => setKenaikanKelas(e.target.value)}
                    placeholder="Contoh: Naik ke kelas VIII"
                    className="w-full px-2.5 py-1 text-xs rounded border border-slate-300 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">
                    Narasi Box Kokurikuler (Halaman 2):
                  </label>
                  <textarea
                    rows={2}
                    value={narasiKokurikuler}
                    onChange={(e) => setNarasiKokurikuler(e.target.value)}
                    className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Terapkan ke Dokumen Rapor</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {showSavedToast && (
          <div className="mb-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Wali Kelas, Kepala Sekolah, dan Kokurikuler berhasil diterapkan!</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* RAPOR DOKUMEN PRINTABLE AREA (A4 Standard Format Kurikulum Merdeka) */}
        {/* ============================================================== */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-8 bg-slate-100/60 p-2 sm:p-4 rounded-xl print:p-0 print:bg-white print:overflow-visible">
          
          {/* -------------------- HALAMAN 1 -------------------- */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-300 shadow-sm text-slate-900 font-sans text-xs leading-relaxed max-w-[780px] mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:break-after-page">
            {/* Header Biodata Box */}
            <div className="grid grid-cols-2 gap-4 pb-3 border-b-2 border-black text-[11px]">
              <div className="space-y-0.5">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Nama Murid</span>
                  <span className="col-span-8 font-bold uppercase">: {siswa.nama}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">NIS/NISN</span>
                  <span className="col-span-8 font-mono">: {siswa.nis} / {siswa.nisn}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Sekolah</span>
                  <span className="col-span-8 font-bold uppercase">: {namaSekolah}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Alamat</span>
                  <span className="col-span-8">: {alamatSekolah}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Kelas</span>
                  <span className="col-span-8 font-semibold">: {displayKelas}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Fase</span>
                  <span className="col-span-8 font-semibold">: {fase}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Semester</span>
                  <span className="col-span-8 font-semibold">: {semesterFormatted}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Tahun Ajaran</span>
                  <span className="col-span-8 font-mono">: {rapor.tahunAjaran}</span>
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center py-4">
              <h2 className="text-sm font-black tracking-wider uppercase text-black">
                LAPORAN HASIL BELAJAR
              </h2>
            </div>

            {/* Tabel Nilai Mata Pelajaran */}
            <table className="w-full text-left border-collapse border border-black text-[10.5px]">
              <thead>
                <tr className="bg-slate-100/70 border-b border-black text-black font-bold">
                  <th className="p-1.5 border-r border-black w-8 text-center">No</th>
                  <th className="p-1.5 border-r border-black w-48 text-center">Mata Pelajaran</th>
                  <th className="p-1.5 border-r border-black w-16 text-center">Nilai Akhir</th>
                  <th className="p-1.5 text-center">Capaian Kompetensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {rapor.nilai.map((n, i) => (
                  <tr key={i} className="border-b border-black align-top">
                    <td className="p-1.5 border-r border-black text-center font-mono">{i + 1}</td>
                    <td className="p-1.5 border-r border-black font-medium leading-tight">
                      {n.namaMapel}
                    </td>
                    <td className="p-1.5 border-r border-black text-center font-bold font-mono">
                      {n.nilaiAkhir}
                    </td>
                    <td className="p-1.5 text-slate-900 leading-tight text-[10px]">
                      {n.capaianKompetensi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Running Footer Halaman 1 */}
            <div className="pt-6 mt-4 border-t border-slate-300 flex items-center justify-between text-[9px] font-mono text-slate-600">
              <span>{displayKelas}  |  {siswa.nama}  |  {siswa.nis}</span>
              <span>Halaman 1 / 2</span>
            </div>
          </div>


          {/* -------------------- HALAMAN 2 -------------------- */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-300 shadow-sm text-slate-900 font-sans text-xs leading-relaxed max-w-[780px] mx-auto print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:break-before-page">
            {/* Header Biodata Box (Identical on Page 2) */}
            <div className="grid grid-cols-2 gap-4 pb-3 border-b-2 border-black text-[11px] mb-4">
              <div className="space-y-0.5">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Nama Murid</span>
                  <span className="col-span-8 font-bold uppercase">: {siswa.nama}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">NIS/NISN</span>
                  <span className="col-span-8 font-mono">: {siswa.nis} / {siswa.nisn}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Sekolah</span>
                  <span className="col-span-8 font-bold uppercase">: {namaSekolah}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Alamat</span>
                  <span className="col-span-8">: {alamatSekolah}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Kelas</span>
                  <span className="col-span-8 font-semibold">: {displayKelas}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Fase</span>
                  <span className="col-span-8 font-semibold">: {fase}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Semester</span>
                  <span className="col-span-8 font-semibold">: {semesterFormatted}</span>
                </div>
                <div className="grid grid-cols-12">
                  <span className="col-span-4 text-slate-800">Tahun Ajaran</span>
                  <span className="col-span-8 font-mono">: {rapor.tahunAjaran}</span>
                </div>
              </div>
            </div>

            {/* 1. Box Kokurikuler (Exact Format from image) */}
            <div className="border border-black mb-4">
              <div className="border-b border-black text-center py-1 font-bold text-xs bg-slate-100/70">
                Kokurikuler
              </div>
              <div className="p-3 text-[10.5px] leading-relaxed whitespace-pre-line text-slate-900">
                {narasiKokurikuler}
              </div>
            </div>

            {/* 2. Box Ekstrakurikuler (Exact Format from image) */}
            <div className="mb-4">
              <table className="w-full text-left border-collapse border border-black text-[10.5px]">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-black font-bold">
                    <th className="p-1.5 border-r border-black w-8 text-center">No</th>
                    <th className="p-1.5 border-r border-black w-56 text-center">Ekstrakurikuler</th>
                    <th className="p-1.5 text-center">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black">
                  {rapor.ekskul && rapor.ekskul.length > 0 ? (
                    rapor.ekskul.map((e, idx) => (
                      <tr key={idx} className="border-b border-black">
                        <td className="p-1.5 border-r border-black text-center font-mono">{idx + 1}</td>
                        <td className="p-1.5 border-r border-black font-medium">{e.nama}</td>
                        <td className="p-1.5 text-[10px] leading-tight">
                          {e.keterangan || `Mempunyai keaktifan yang ${e.predikat.toLowerCase()} dalam kegiatan ini.`}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-black">
                      <td className="p-1.5 border-r border-black text-center font-mono">1</td>
                      <td className="p-1.5 border-r border-black font-medium">Ekstrakurikuler Pramuka / Tari</td>
                      <td className="p-1.5 text-[10px]">Mempunyai keterampilan dan kedisiplinan yang baik. Terus kembangkan potensi diri.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 3. Ketidakhadiran & Catatan Wali Kelas (Side by Side Exact Format) */}
            <div className="grid grid-cols-12 gap-3 mb-4">
              {/* Box Ketidakhadiran */}
              <div className="col-span-5 border border-black">
                <div className="border-b border-black text-center py-1 font-bold text-xs bg-slate-100/70">
                  Ketidakhadiran
                </div>
                <div className="p-2 space-y-1 text-[10.5px] font-mono">
                  <div className="flex justify-between">
                    <span>Sakit</span>
                    <span>: {rapor.kehadiran.sakit} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Izin</span>
                    <span>: {rapor.kehadiran.izin} hari</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanpa Keterangan</span>
                    <span>: {rapor.kehadiran.alpa} hari</span>
                  </div>
                </div>
              </div>

              {/* Box Catatan Wali Kelas */}
              <div className="col-span-7 border border-black">
                <div className="border-b border-black text-center py-1 font-bold text-xs bg-slate-100/70">
                  Catatan Wali Kelas
                </div>
                <div className="p-2.5 text-[10.5px] leading-relaxed text-slate-900">
                  {rapor.catatanWaliKelas || 'Selamat atas prestasimu. Tingkatkan terus motivasi dalam belajar serta kedisiplinan untuk meraih prestasi yang lebih tinggi.'}
                </div>
              </div>
            </div>

            {/* 4. Keterangan Kenaikan Kelas (Exact Format from image) */}
            <div className="border border-black p-2 mb-4 text-center font-bold text-xs">
              Keterangan Kenaikan Kelas : {kenaikanKelas}
            </div>

            {/* 5. Tanggapan Orang Tua/Wali Murid (Exact Format from image) */}
            <div className="border border-black mb-6">
              <div className="border-b border-black text-center py-1 font-bold text-xs bg-slate-100/70">
                Tanggapan Orang Tua/Wali Murid
              </div>
              <div className="h-16 p-2 text-[10px] text-slate-400 italic">
                {/* Blank handwritten space for parent feedback */}
              </div>
            </div>

            {/* 6. Area Tanda Tangan 3 Pihak (Exact Layout from image_ffff6f2b.png) */}
            <div className="pt-2 text-[11px] leading-tight text-black">
              {/* Row 1: Orang Tua Murid (Kiri) & Wali Kelas (Kanan) */}
              <div className="flex justify-between items-start">
                <div className="text-center w-56">
                  <p className="font-medium">Orang Tua Murid</p>
                  <div className="h-16" />
                  <p className="font-bold underline text-slate-900">
                    ....................................
                  </p>
                </div>

                <div className="text-center w-64">
                  <p className="text-slate-800">{titimangsa}</p>
                  <p className="font-medium">Wali Kelas</p>
                  <div className="h-16" />
                  <p className="font-bold underline text-black">
                    {waliKelasNama}
                  </p>
                  <p className="font-mono text-[10px]">
                    NIP {waliKelasNip}
                  </p>
                </div>
              </div>

              {/* Row 2: Kepala Sekolah (Tengah Bawah) */}
              <div className="text-center pt-2">
                <p className="font-medium">Kepala Sekolah</p>
                <div className="h-16" />
                <p className="font-bold underline text-black">
                  {kepsekNama}
                </p>
                <p className="font-mono text-[10px]">
                  NIP {kepsekNip}
                </p>
              </div>
            </div>

            {/* Running Footer Halaman 2 */}
            <div className="pt-6 mt-4 border-t border-slate-300 flex items-center justify-between text-[9px] font-mono text-slate-600">
              <span>{displayKelas}  |  {siswa.nama}  |  {siswa.nis}</span>
              <span>Halaman 2 / 2</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Standar Format Kurikulum Merdeka SMPN 2 Kota Sukabumi (A4 2-Halaman)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor (Halaman 1 & 2)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

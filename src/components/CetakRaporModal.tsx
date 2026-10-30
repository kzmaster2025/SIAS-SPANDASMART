import React from 'react';
import { RaporSiswa, Siswa } from '../types';
import { getDefaultKokurikuler } from '../data/dimensiProfilLulusan';
import { X, Printer, Award, BookOpen, Compass } from 'lucide-react';

interface CetakRaporModalProps {
  rapor: RaporSiswa | null;
  siswa: Siswa | null;
  onClose: () => void;
}

export const CetakRaporModal: React.FC<CetakRaporModalProps> = ({ rapor, siswa, onClose }) => {
  if (!rapor || !siswa) return null;

  const kokurikulerData = rapor.kokurikuler && rapor.kokurikuler.length === 8
    ? rapor.kokurikuler
    : getDefaultKokurikuler();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Lembar Rapor Hasil Belajar Kurikulum Merdeka</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lembar Rapor A4 Layout */}
        <div className="p-8 border border-slate-300 rounded-lg bg-white text-slate-900 font-sans text-xs space-y-4 print:p-0 print:border-none">
          {/* Header Rapor */}
          <div className="text-center pb-3 border-b-2 border-slate-900">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
              Pemerintah Kota Sukabumi · Dinas Pendidikan dan Kebudayaan
            </h4>
            <h2 className="text-base font-bold uppercase tracking-tight text-blue-950">
              SMP NEGERI 2 KOTA SUKABUMI
            </h2>
            <p className="text-[10px] text-slate-500">
              Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi 43113 · NPSN: 20221614
            </p>
            <h3 className="text-xs font-bold uppercase tracking-widest mt-2 bg-slate-100 py-1 rounded">
              LAPORAN CAPAIAN HASIL BELAJAR (RAPOR PESERTA DIDIK)
            </h3>
          </div>

          {/* Biodata Siswa */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div className="space-y-1">
              <div className="flex">
                <span className="w-28 text-slate-600">Nama Siswa</span>
                <span className="font-bold">: {siswa.nama}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">NISN / NIS</span>
                <span className="font-mono">: {siswa.nisn} / {siswa.nis}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">Sekolah</span>
                <span>: SMP Negeri 2 Kota Sukabumi</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex">
                <span className="w-28 text-slate-600">Kelas / Fase</span>
                <span className="font-semibold">: {siswa.kelas} / Fase D</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">Semester</span>
                <span>: {rapor.semester}</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-600">Tahun Ajaran</span>
                <span className="font-mono">: {rapor.tahunAjaran}</span>
              </div>
            </div>
          </div>

          {/* Tabel A: Nilai Mata Pelajaran */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
              A. Nilai Asesmen & Capaian Kompetensi Mata Pelajaran
            </h4>
            <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-8 text-center">No</th>
                  <th className="p-2 border-r border-slate-300 w-52">Mata Pelajaran</th>
                  <th className="p-2 border-r border-slate-300 w-16 text-center">Nilai Akhir</th>
                  <th className="p-2">Capaian Kompetensi Pembelajaran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {rapor.nilai.map((n, i) => (
                  <tr key={i}>
                    <td className="p-2 border-r border-slate-300 text-center font-mono">{i + 1}</td>
                    <td className="p-2 border-r border-slate-300 font-semibold">{n.namaMapel}</td>
                    <td className="p-2 border-r border-slate-300 text-center font-bold font-mono">{n.nilaiAkhir}</td>
                    <td className="p-2 text-slate-700 leading-tight">{n.capaianKompetensi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tabel B: Kegiatan Kokurikuler (8 Dimensi Profil Lulusan) */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-700" />
                <span>B. Asesmen Kokurikuler (8 Dimensi Profil Lulusan)</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-medium">Standar Kompetensi Lulusan (Deep Learning)</span>
            </div>
            <table className="w-full text-left border-collapse border border-slate-300 text-[10px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300 w-7 text-center">No</th>
                  <th className="p-1.5 border-r border-slate-300 w-48">Dimensi & Tema Projek Kokurikuler</th>
                  <th className="p-1.5 border-r border-slate-300 w-36 text-center">Predikat Capaian</th>
                  <th className="p-1.5">Catatan Perkembangan & Observasi Karakter</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {kokurikulerData.map((k, i) => (
                  <tr key={i}>
                    <td className="p-1.5 border-r border-slate-300 text-center font-mono">{i + 1}</td>
                    <td className="p-1.5 border-r border-slate-300">
                      <p className="font-bold text-slate-900">{k.dimensi}</p>
                      {k.temaProjek && (
                        <p className="text-[9px] text-blue-800 italic mt-0.5">Tema: {k.temaProjek}</p>
                      )}
                    </td>
                    <td className="p-1.5 border-r border-slate-300 text-center font-semibold">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] ${
                        k.predikat === 'Sangat Berkembang'
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : k.predikat === 'Berkembang Sesuai Harapan'
                          ? 'bg-blue-50 text-blue-800 font-bold'
                          : k.predikat === 'Mulai Berkembang'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-rose-50 text-rose-800'
                      }`}>
                        {k.predikat}
                      </span>
                    </td>
                    <td className="p-1.5 text-slate-700 leading-tight text-[10px]">
                      {k.catatan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ekstrakurikuler & Kehadiran */}
          <div className="grid grid-cols-2 gap-4 text-xs pt-1">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 mb-1.5">
                C. Kegiatan Ekstrakurikuler
              </h4>
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-1.5 border-r border-slate-300">Kegiatan</th>
                    <th className="p-1.5 border-r border-slate-300 w-24 text-center">Predikat</th>
                    <th className="p-1.5">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {rapor.ekskul.map((e, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 border-r border-slate-300 font-medium">{e.nama}</td>
                      <td className="p-1.5 border-r border-slate-300 text-center font-semibold">{e.predikat}</td>
                      <td className="p-1.5 text-slate-600 text-[10px]">{e.keterangan || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 mb-1.5">
                D. Ketidakhadiran
              </h4>
              <div className="border border-slate-300 rounded p-2 bg-slate-50 text-[11px] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Sakit (S)</span>
                  <span className="font-bold text-blue-700">{rapor.kehadiran.sakit} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span>Izin (I)</span>
                  <span className="font-bold text-amber-700">{rapor.kehadiran.izin} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanpa Keterangan (A)</span>
                  <span className="font-bold text-rose-700">{rapor.kehadiran.alpa} Hari</span>
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Wali Kelas */}
          <div className="pt-1 border-t border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800 mb-1">
              E. Catatan Wali Kelas
            </h4>
            <div className="p-2.5 rounded bg-slate-50 border border-slate-300 italic text-[11px] text-slate-800 leading-relaxed">
              "{rapor.catatanWaliKelas}"
            </div>
          </div>

          {/* Tanda Tangan 3 Kolom */}
          <div className="pt-6 grid grid-cols-3 text-center text-xs">
            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-semibold">Orang Tua / Wali Siswa</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-800">({siswa.namaAyah || 'Orang Tua / Wali'})</p>
            </div>

            <div>
              <p className="text-slate-600">Sukabumi, 20 Desember 2025</p>
              <p className="font-semibold">Wali Kelas {siswa.kelas}</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-800">Rina Marlina, S.Pd.</p>
              <p className="text-[10px] font-mono text-slate-500">NIP 19821104 200902 2 003</p>
            </div>

            <div>
              <p className="text-slate-600">Mengetahui,</p>
              <p className="font-semibold">Kepala SMPN 2 Kota Sukabumi</p>
              <div className="h-16" />
              <p className="font-bold underline text-slate-800">H. Yusuf Hidayat, M.Pd.</p>
              <p className="text-[10px] font-mono text-slate-500">NIP 19680512 199412 1 002</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500 font-mono">
            Format Resmi Rapor Hasil Belajar Kurikulum Merdeka & 8 Dimensi Profil Lulusan
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rapor Siswa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

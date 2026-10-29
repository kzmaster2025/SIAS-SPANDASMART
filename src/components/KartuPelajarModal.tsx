import React from 'react';
import { Siswa } from '../types';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface KartuPelajarModalProps {
  siswa: Siswa | null;
  onClose: () => void;
}

export const KartuPelajarModal: React.FC<KartuPelajarModalProps> = ({ siswa, onClose }) => {
  if (!siswa) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kartu Pelajar Digital Resmi</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kartu Pelajar Front Layout */}
        <div className="relative rounded-xl overflow-hidden border-2 border-blue-900 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-5 shadow-lg">
          {/* Subtle watermark background */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <div className="w-48 h-48 rounded-full border-8 border-white flex items-center justify-center text-8xl font-black">
              2
            </div>
          </div>

          {/* Header Kartu */}
          <div className="relative z-10 flex items-center gap-3 pb-3 border-b border-white/20">
            <div className="w-10 h-10 rounded-lg bg-white text-blue-900 font-extrabold flex items-center justify-center text-xl shrink-0 shadow-xs">
              2
            </div>
            <div>
              <p className="text-[10px] tracking-wider uppercase text-blue-200 leading-tight">
                Pemerintah Kota Sukabumi · Dinas Pendidikan & Kebudayaan
              </p>
              <h3 className="text-sm font-bold tracking-tight text-white uppercase">
                SMP Negeri 2 Kota Sukabumi
              </h3>
              <p className="text-[9px] text-blue-100 font-mono">
                Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi · NPSN 20221614
              </p>
            </div>
          </div>

          <div className="relative z-10 text-center my-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400 text-blue-950 px-3 py-0.5 rounded-full inline-block">
              KARTU TANDA PELAJAR
            </span>
          </div>

          {/* Body Kartu */}
          <div className="relative z-10 flex gap-4 items-start pt-1">
            {/* Foto Siswa */}
            <div className="w-24 h-32 rounded-lg bg-blue-100/10 border-2 border-white/40 flex flex-col items-center justify-center text-center p-2 shrink-0">
              <div className="w-12 h-12 rounded-full bg-blue-700/80 text-white flex items-center justify-center font-bold text-lg mb-1">
                {siswa.nama.slice(0, 1)}
              </div>
              <span className="text-[9px] text-white/80 uppercase font-mono">Pasfoto 3x4</span>
            </div>

            {/* Biodata Siswa */}
            <div className="flex-1 space-y-1 text-xs">
              <div>
                <span className="text-[9px] text-blue-200 block uppercase">Nama Lengkap</span>
                <span className="font-bold text-white text-sm">{siswa.nama}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">NISN</span>
                  <span className="font-mono font-bold text-white">{siswa.nisn}</span>
                </div>
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">NIS / Kelas</span>
                  <span className="font-mono font-semibold text-white">{siswa.nis} ({siswa.kelas})</span>
                </div>
              </div>
              <div>
                <span className="text-[9px] text-blue-200 block uppercase">Tempat, Tanggal Lahir</span>
                <span className="text-white text-[11px]">{siswa.tempatLahir}, {siswa.tanggalLahir}</span>
              </div>
              <div>
                <span className="text-[9px] text-blue-200 block uppercase">Alamat</span>
                <span className="text-white/90 text-[10px] line-clamp-1">{siswa.alamat}</span>
              </div>
            </div>
          </div>

          {/* Footer Kartu & Barcode */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/20 flex items-end justify-between">
            <div>
              <div className="font-mono tracking-widest text-[10px] text-white/70">
                ||| | |||| | ||||| ||| |||| ||||
              </div>
              <span className="text-[9px] text-blue-200 font-mono">BARCODE VERIFIKASI ID #{siswa.nisn}</span>
            </div>

            <div className="text-right text-[9px] leading-tight text-white/90">
              <p>Sukabumi, Juli 2025</p>
              <p className="font-semibold">Kepala SMPN 2 Kota Sukabumi</p>
              <div className="h-6" />
              <p className="font-bold underline text-white">H. Yusuf Hidayat, M.Pd.</p>
              <p className="font-mono text-white/70">NIP 19680512 199412 1 002</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500 font-mono">
            Format Cetak Standar Kartu ID PVC 85 x 54 mm
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
              <span>Cetak Kartu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

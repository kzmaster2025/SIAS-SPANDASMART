import React from 'react';
import { DokumenSekolah } from '../types';
import { X, Printer, Download, FileText, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

interface PreviewDokumenModalProps {
  dokumen: DokumenSekolah | null;
  onClose: () => void;
}

export const PreviewDokumenModal: React.FC<PreviewDokumenModalProps> = ({ dokumen, onClose }) => {
  if (!dokumen) return null;

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const fileContent = `=====================================================
PEMERINTAH KOTA SUKABUMI - DINAS PENDIDIKAN DAN KEBUDAYAAN
SMP NEGERI 2 KOTA SUKABUMI
Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi 43113
=====================================================

DOKUMEN RESMI SEKOLAH
Judul: ${dokumen.judul}
Nomor Dokumen: ${dokumen.nomorDokumen}
Kategori: ${dokumen.kategori}
Tahun Ajaran: ${dokumen.tahunAjaran}
Tanggal Terbit: ${dokumen.tanggalTerbit}
Pejabat Pengesah: ${dokumen.pengesah}
Status: ${dokumen.status}
Tingkat Akses: ${dokumen.akses}

DESKRIPSI:
${dokumen.deskripsi}

ISI RINGKASAN & KETENTUAN:
${dokumen.isiRingkasan}

-----------------------------------------------------
Disahkan secara digital melalui SIAS Digital SMPN 2 Kota Sukabumi.
`;
    const file = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = dokumen.fileNama;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Pratinjau Dokumen & Regulasi Resmi</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Paper Document Layout */}
        <div className="p-8 border border-slate-300 rounded-lg bg-white text-slate-900 font-sans text-xs space-y-4">
          {/* KOP RESMI SEKOLAH */}
          <div className="text-center pb-3 border-b-4 border-double border-slate-900">
            <h4 className="text-xs tracking-widest font-semibold uppercase text-slate-700">
              PEMERINTAH KOTA SUKABUMI
            </h4>
            <h3 className="text-sm tracking-wider font-bold uppercase text-slate-800">
              DINAS PENDIDIKAN DAN KEBUDAYAAN
            </h3>
            <h2 className="text-base sm:text-lg font-black tracking-tight uppercase text-blue-950">
              SMP NEGERI 2 KOTA SUKABUMI
            </h2>
            <p className="text-[11px] text-slate-600">
              Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi 43113 · Telp. (0266) 221584
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Website: smpn2kotasukabumi.sch.id · Pos-el: info@smpn2kotasukabumi.sch.id
            </p>
          </div>

          {/* Judul & Nomor Dokumen */}
          <div className="text-center py-2 space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase">
              {dokumen.judul}
            </h3>
            <p className="font-mono text-xs text-blue-900 font-semibold">
              NOMOR: {dokumen.nomorDokumen}
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <span>Tahun Ajaran {dokumen.tahunAjaran}</span>
              <span aria-hidden="true">·</span>
              <span>Kategori: {dokumen.kategori}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-emerald-700">Status: {dokumen.status}</span>
            </div>
          </div>

          {/* Meta Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pejabat Pengesah</span>
              <span className="font-medium text-slate-800">{dokumen.pengesah}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tanggal Pengesahan</span>
              <span className="font-mono text-slate-800">{dokumen.tanggalTerbit}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Tingkat Hak Akses</span>
              <span className="inline-flex items-center gap-1 font-medium text-blue-800">
                <Lock className="w-3 h-3 text-blue-600" />
                <span>{dokumen.akses}</span>
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Lampiran Berkas Asli</span>
              <span className="font-mono text-slate-700">{dokumen.fileNama} ({dokumen.fileUkuran})</span>
            </div>
          </div>

          {/* Ringkasan & Deskripsi */}
          <div className="space-y-1.5 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
              I. Ringkasan & Tujuan Dokumen
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed text-justify bg-white p-3 rounded border border-slate-200">
              {dokumen.deskripsi}
            </p>
          </div>

          {/* Isi Dokumen / Regulasi */}
          <div className="space-y-1.5 pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
              II. Ketentuan Pokok & Isi Regulasi
            </h4>
            <div className="p-4 rounded border border-slate-200 bg-slate-50/60 font-mono text-[11px] text-slate-800 whitespace-pre-wrap leading-relaxed">
              {dokumen.isiRingkasan}
            </div>
          </div>

          {/* Tanda Tangan & Pengesahan */}
          <div className="pt-8 flex justify-between items-end text-xs">
            <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
              <p className="font-bold text-slate-700">ARSIP DIGITAL TATA USAHA</p>
              <p>ID Berkas: #{dokumen.id}</p>
              <p>SMP Negeri 2 Kota Sukabumi</p>
              <p className="text-emerald-700 font-semibold">✓ Dokumen Terverifikasi Sah</p>
            </div>

            <div className="text-center w-64">
              <p className="text-slate-600">Ditetapkan di Sukabumi</p>
              <p className="text-slate-600">Pada tanggal {dokumen.tanggalTerbit}</p>
              <p className="font-bold mt-1">Kepala SMP Negeri 2 Kota Sukabumi</p>
              <div className="h-16 flex items-center justify-center relative">
                <div className="border border-blue-600/70 rounded-full px-3 py-1 rotate-[-6deg] text-blue-700 font-mono text-[8px] font-bold">
                  ★ DINAS DIKBUD KOTA SUKABUMI ★<br />SMP NEGERI 2
                </div>
              </div>
              <p className="font-bold underline text-slate-900 text-sm">H. Yusuf Hidayat, M.Pd.</p>
              <p className="text-[11px] font-mono text-slate-600">NIP 19680512 199412 1 002</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500 font-mono">
            {dokumen.fileTipe} · {dokumen.fileUkuran}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

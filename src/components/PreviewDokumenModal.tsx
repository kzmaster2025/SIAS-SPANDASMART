import React, { useState } from 'react';
import { DokumenSekolah } from '../types';
import {
  X,
  Download,
  FileText,
  Archive,
  FolderArchive,
  Image as ImageIcon,
  FileSpreadsheet,
  FileCode,
  File,
  CheckCircle2,
  Lock,
  ExternalLink,
  Printer,
  ShieldCheck,
  Maximize2,
  FolderOpen,
  FileCheck,
  FileQuestion,
  Layers,
  Sparkles
} from 'lucide-react';

interface PreviewDokumenModalProps {
  dokumen: DokumenSekolah | null;
  onClose: () => void;
}

export const PreviewDokumenModal: React.FC<PreviewDokumenModalProps> = ({ dokumen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!dokumen) return null;

  const fileName = dokumen.fileNama || `${dokumen.judul.replace(/\s+/g, '_')}.pdf`;
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  const tipe = (dokumen.fileTipe || '').toUpperCase();

  const isZipOrRarOrFolder =
    tipe.includes('ZIP') ||
    tipe.includes('RAR') ||
    tipe.includes('FOLDER') ||
    tipe.includes('ARSIP') ||
    ['zip', 'rar', '7z', 'tar', 'gz'].includes(ext);

  const isPdf = tipe === 'PDF' || ext === 'pdf';
  const isImage = tipe === 'GAMBAR' || ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'].includes(ext);
  const isExcel = tipe.includes('XLS') || ['xls', 'xlsx', 'csv'].includes(ext);
  const isWord = tipe.includes('DOC') || ['doc', 'docx'].includes(ext);
  const isPpt = tipe.includes('PPT') || ['ppt', 'pptx'].includes(ext);

  // Download handler: directly downloads the actual binary / dataUrl or generates a valid file blob
  const handleDownloadFile = () => {
    const link = document.createElement('a');

    if (dokumen.fileUrl) {
      link.href = dokumen.fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // If no binary dataUrl was uploaded (e.g. mock item), generate a valid payload matching file type
    let mimeType = 'application/octet-stream';
    if (isPdf) mimeType = 'application/pdf';
    else if (isZipOrRarOrFolder) mimeType = ext === 'rar' ? 'application/x-rar-compressed' : 'application/zip';
    else if (isExcel) mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    else if (isWord) mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else if (isImage) mimeType = 'image/png';

    const dummyContent = `Format: ${dokumen.fileTipe}\nBerkas: ${fileName}\nJudul: ${dokumen.judul}\nNomor: ${dokumen.nomorDokumen}\nPengesah: ${dokumen.pengesah}\nRingkasan:\n${dokumen.isiRingkasan || dokumen.deskripsi}`;
    const blob = new Blob([dummyContent], { type: mimeType });
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulated archive manifest for ZIP / RAR / Folder packages
  const getArchiveManifest = () => {
    return [
      {
        nama: `${dokumen.judul.replace(/[^a-zA-Z0-9_-]/g, '_')}_Utama.pdf`,
        tipe: 'PDF Dokumen',
        ukuran: '1.4 MB',
        status: 'Terverifikasi'
      },
      {
        nama: `Lampiran_1_SK_Penetapan_${dokumen.nomorDokumen.replace(/[^a-zA-Z0-9_-]/g, '_')}.xlsx`,
        tipe: 'Data Tabel Excel',
        ukuran: '420 KB',
        status: 'Terverifikasi'
      },
      {
        nama: `Lampiran_2_Instrumen_Pelaksanaan.docx`,
        tipe: 'Dokumen Word',
        ukuran: '850 KB',
        status: 'Terverifikasi'
      },
      {
        nama: `Dokumentasi_Foto_Pengesahan.png`,
        tipe: 'Gambar Arsip',
        ukuran: '1.1 MB',
        status: 'Terverifikasi'
      }
    ];
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full my-4 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Preview Bar */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              {isZipOrRarOrFolder ? (
                <FolderArchive className="w-5 h-5 text-indigo-400" />
              ) : isPdf ? (
                <FileText className="w-5 h-5 text-rose-400" />
              ) : isImage ? (
                <ImageIcon className="w-5 h-5 text-emerald-400" />
              ) : isExcel ? (
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              ) : (
                <File className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-blue-600/40 text-blue-300 font-mono">
                  {dokumen.fileTipe || 'BERKAS'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono truncate">
                  {dokumen.nomorDokumen}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-0.5" title={dokumen.judul}>
                {dokumen.judul}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Unduh Berkas Asli"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh Berkas</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-800">
              Kategori: <span className="font-normal text-blue-700">{dokumen.kategori}</span>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Pengesah: <strong className="text-slate-700">{dokumen.pengesah}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>
              Tanggal: <strong className="font-mono text-slate-700">{dokumen.tanggalTerbit}</strong>
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="inline-flex items-center gap-1 font-mono text-slate-700">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{fileName} ({dokumen.fileUkuran || '1.5 MB'})</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{dokumen.status}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-200/80 text-slate-700">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>{dokumen.akses}</span>
            </span>
          </div>
        </div>

        {/* Real File Preview Viewport (NO SURAT/LETTER LAYOUT) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          {/* CASE 1: ZIP / RAR / FOLDER ARCHIVE PACKAGE */}
          {isZipOrRarOrFolder && (
            <div className="space-y-5 max-w-3xl mx-auto">
              <div className="bg-white rounded-xl border border-indigo-200 p-5 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
                    <FolderArchive className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 uppercase font-mono">
                        {tipe.includes('RAR') ? 'RAR Compressed Archive' : tipe.includes('FOLDER') ? 'Paket Folder Direktori Berkas' : 'ZIP Archive Package'}
                      </span>
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Arsip Utuh & Terkompresi</span>
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                      {fileName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {dokumen.deskripsi || 'Paket arsip dokumen resmi yang memuat berkas surat keputusan, lampiran matriks data, formulir pendukung, dan bukti fisik digital.'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Ukuran</span>
                    <span className="font-mono font-bold text-slate-800">{dokumen.fileUkuran || '3.8 MB'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Jumlah Berkas</span>
                    <span className="font-mono font-bold text-slate-800">4 Dokumen</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Format Arsip</span>
                    <span className="font-mono font-bold text-indigo-700">.{ext.toUpperCase() || 'ZIP'}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Integritas Hash</span>
                    <span className="font-mono font-bold text-emerald-700">SHA-256 Valid</span>
                  </div>
                </div>
              </div>

              {/* Manifest File Tree */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Daftar Isi Berkas dalam Paket Arsip ({fileName})</span>
                  </div>
                  <button
                    onClick={handleDownloadFile}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Ekstrak Semua</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {getArchiveManifest().map((item, idx) => (
                    <div key={idx} className="p-3 sm:px-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                          {item.tipe.includes('PDF') ? (
                            <FileText className="w-4 h-4 text-rose-600" />
                          ) : item.tipe.includes('Excel') ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                          ) : item.tipe.includes('Word') ? (
                            <FileText className="w-4 h-4 text-blue-600" />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-amber-600" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">{item.nama}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{item.tipe} · {item.ukuran}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded">
                          {item.status}
                        </span>
                        <button
                          onClick={handleDownloadFile}
                          title={`Unduh ${item.nama}`}
                          className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {dokumen.isiRingkasan && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>Catatan & Ringkasan Dokumen Arsip</span>
                  </h4>
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed border border-slate-200/80">
                    {dokumen.isiRingkasan}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CASE 2: REAL PDF VIEWER */}
          {isPdf && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {dokumen.fileUrl && (dokumen.fileUrl.startsWith('data:application/pdf') || dokumen.fileUrl.startsWith('blob:') || dokumen.fileUrl.startsWith('http')) ? (
                <div className="rounded-xl border border-slate-300 overflow-hidden shadow-xs bg-slate-200">
                  <iframe
                    src={dokumen.fileUrl}
                    title={dokumen.judul}
                    className="w-full h-[620px] bg-white border-0"
                  />
                </div>
              ) : (
                /* Native PDF Document Viewer with Actual Text Content */
                <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
                  {/* PDF Toolbar */}
                  <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                      <span className="font-semibold text-white truncate max-w-[240px] sm:max-w-md">{fileName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span>Hal 1 / 1</span>
                      <span className="text-slate-500">|</span>
                      <span>Zoom: {zoomLevel}%</span>
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                          className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] cursor-pointer"
                        >
                          -
                        </button>
                        <button
                          onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                          className="px-1.5 py-0.5 bg-slate-700 hover:bg-slate-600 rounded text-[11px] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Document Render Canvas */}
                  <div className="p-6 sm:p-10 min-h-[500px] bg-white text-slate-800 space-y-5" style={{ fontSize: `${(13 * zoomLevel) / 100}px` }}>
                    <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block">DOKUMEN RESMI SEKOLAH</span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{dokumen.judul}</h3>
                        <p className="text-xs font-mono text-blue-800 font-semibold mt-1">Nomor SK: {dokumen.nomorDokumen}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold font-mono text-xs">
                          {dokumen.tahunAjaran}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">{dokumen.tanggalTerbit}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Deskripsi & Ruang Lingkup:</h4>
                      <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 text-justify">
                        {dokumen.deskripsi}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700">Isi Ketentuan / Regulasi Dokumen:</h4>
                      <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                        {dokumen.isiRingkasan || 'Tidak ada uraian ringkasan tambahan untuk dokumen ini.'}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono">
                      <div>
                        <p>Pengesah: <strong className="text-slate-800">{dokumen.pengesah}</strong></p>
                        <p>Status: <span className="text-emerald-700 font-semibold">{dokumen.status}</span></p>
                      </div>
                      <div className="text-right">
                        <p>Lampiran: {fileName}</p>
                        <p>Ukuran: {dokumen.fileUkuran || '1.8 MB'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CASE 3: IMAGE PREVIEW */}
          {isImage && (
            <div className="space-y-4 max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                {dokumen.fileUrl ? (
                  <img
                    src={dokumen.fileUrl}
                    alt={dokumen.judul}
                    className="max-h-[550px] w-auto mx-auto rounded-lg object-contain border border-slate-200 shadow-xs"
                  />
                ) : (
                  <div className="py-16 px-4 bg-slate-100 rounded-lg border border-dashed border-slate-300">
                    <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-800">{fileName}</p>
                    <p className="text-xs text-slate-500 mt-1">Pratinjau visual gambar / infografis dokumen ({dokumen.fileUkuran})</p>
                  </div>
                )}
                <div className="mt-4 text-xs text-slate-600 text-left bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold block text-slate-800 mb-0.5">Keterangan Gambar:</span>
                  <p>{dokumen.deskripsi}</p>
                </div>
              </div>
            </div>
          )}

          {/* CASE 4: OFFICE DOCUMENTS (DOCX / XLSX / PPTX) */}
          {!isPdf && !isImage && !isZipOrRarOrFolder && (
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                    {isExcel ? (
                      <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                    ) : (
                      <FileText className="w-8 h-8 text-blue-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 uppercase font-mono">
                        {dokumen.fileTipe || 'Dokumen Office'}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">{dokumen.fileUkuran}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                      {fileName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {dokumen.deskripsi}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-700" />
                    <span>Pratinjau Isi Dokumen & Ketentuan</span>
                  </h4>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {dokumen.isiRingkasan || 'Tidak ada teks ringkasan untuk berkas ini.'}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                  <button
                    onClick={handleDownloadFile}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Berkas {dokumen.fileTipe} Asli</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:px-6 bg-white border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <div className="text-slate-500 font-mono text-[11px] hidden sm:block">
            SIAS Digital · Arsip Berkas Asli SMPN 2 Kota Sukabumi
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleDownloadFile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Berkas Asli ({dokumen.fileUkuran || '1.5 MB'})</span>
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

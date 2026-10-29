import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { GuruTendik } from '../types';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

interface ImportGuruExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingGuruList: GuruTendik[];
  onImportSuccess: (importedGuru: GuruTendik[], mode: 'append' | 'replace') => void;
}

interface ParsedRowResult {
  guru: GuruTendik;
  isValid: boolean;
  isDuplicate: boolean;
  warnings: string[];
}

export const ImportGuruExcelModal: React.FC<ImportGuruExcelModalProps> = ({
  isOpen,
  onClose,
  existingGuruList,
  onImportSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [parsedResults, setParsedResults] = useState<ParsedRowResult[]>([]);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [activeStep, setActiveStep] = useState<'upload' | 'preview'>('upload');
  const [filterPreview, setFilterPreview] = useState<'all' | 'valid' | 'duplicate'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Generate and download standard SMPN 2 Kota Sukabumi GTK Template
  const handleDownloadTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
    const templateData = [
      [
        'No',
        'Nama Lengkap',
        'Gelar',
        'NIP',
        'NUPTK',
        'Jabatan',
        'Kategori',
        'Status Kepegawaian',
        'Golongan',
        'Mata Pelajaran',
        'Jam Mengajar',
        'Email',
        'Telepon',
        'Pendidikan Terakhir'
      ],
      [
        1,
        'Dra. Hj. Siti Komariah',
        'M.M.Pd.',
        '196805121994032004',
        '7436746648300023',
        'Kepala Sekolah',
        'Pendidik',
        'PNS',
        'Pembina Utama Muda / IV-c',
        'Manajemen Pendidikan',
        0,
        'siti.komariah@smpn2kotasukabumi.sch.id',
        '081234567801',
        'S2 Manajemen Pendidikan - UPI'
      ],
      [
        2,
        'Ahmad Subagja',
        'S.Pd., M.Mat.',
        '197903142005011008',
        '2938757659200012',
        'Guru Matematika / Wali Kelas 8-B',
        'Pendidik',
        'PNS',
        'Pembina / IV-a',
        'Matematika',
        24,
        'ahmad.subagja@smpn2kotasukabumi.sch.id',
        '081234567802',
        'S2 Pendidikan Matematika - UNJ'
      ],
      [
        3,
        'Ratna Dewi Sartika',
        'S.Pd.',
        '198506222010012015',
        '5839763665210043',
        'Guru Bahasa Indonesia / Pembina OSIS',
        'Pendidik',
        'PNS',
        'Penata Tk. I / III-d',
        'Bahasa Indonesia',
        26,
        'ratna.dewi@smpn2kotasukabumi.sch.id',
        '081234567803',
        'S1 Pendidikan Bahasa Indonesia - UPI'
      ],
      [
        4,
        'Dendi Pratama',
        'S.Kom.',
        '-',
        '9845761234890011',
        'Guru Informatika',
        'Pendidik',
        'PPPK',
        'Golongan IX',
        'Informatika',
        24,
        'dendi.pratama@smpn2kotasukabumi.sch.id',
        '081345678901',
        'S1 Ilmu Komputer - IPB'
      ],
      [
        5,
        'Dewi Anggraeni',
        'A.Md.',
        '199208152019032014',
        '4536789012345678',
        'Kepala Urusan Tata Usaha & Kearsipan',
        'Tenaga Kependidikan',
        'PNS',
        'Pengatur / II-c',
        '-',
        0,
        'dewi.anggraeni@smpn2kotasukabumi.sch.id',
        '081234567804',
        'D3 Administrasi Perkantoran - Polban'
      ],
      [
        6,
        'Gilang Ramadhan',
        'S.Pd.',
        '-',
        '-',
        'Guru Pendidikan Jasmani & Olahraga',
        'Pendidik',
        'GTT',
        '-',
        'PJOK',
        18,
        'gilang.ramadhan@smpn2kotasukabumi.sch.id',
        '085678901234',
        'S1 PJKR - STKIP Pasundan'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths for nice appearance
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 26 }, // Nama Lengkap
      { wch: 12 }, // Gelar
      { wch: 22 }, // NIP
      { wch: 20 }, // NUPTK
      { wch: 32 }, // Jabatan
      { wch: 20 }, // Kategori
      { wch: 18 }, // Status Kepegawaian
      { wch: 24 }, // Golongan
      { wch: 22 }, // Mata Pelajaran
      { wch: 14 }, // Jam Mengajar
      { wch: 34 }, // Email
      { wch: 16 }, // Telepon
      { wch: 30 }  // Pendidikan Terakhir
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_GTK_SMPN2');

    if (format === 'csv') {
      XLSX.writeFile(wb, 'Template_Data_GTK_SMPN2_Sukabumi.csv', { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, 'Template_Data_GTK_SMPN2_Sukabumi.xlsx', { bookType: 'xlsx' });
    }
  };

  // Process and parse uploaded spreadsheet
  const processSpreadsheet = async (selectedFile: File) => {
    setParsing(true);
    setErrorMsg(null);
    setFile(selectedFile);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('File excel tidak memiliki lembar kerja (worksheet) yang dapat dibaca.');
      }

      // Read first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Convert to JSON with header rows
      const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
        defval: '',
        blankrows: false
      });

      if (rawRows.length === 0) {
        throw new Error('Tidak ada baris data yang ditemukan di dalam lembar kerja.');
      }

      // Helper to flexibly find column value by potential aliases
      const findVal = (row: Record<string, any>, candidates: string[]): string => {
        const rowKeys = Object.keys(row);
        for (const cand of candidates) {
          const candNorm = cand.toLowerCase().replace(/[^a-z0-9]/g, '');
          for (const key of rowKeys) {
            const keyNorm = key.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (keyNorm === candNorm || keyNorm.includes(candNorm)) {
              const val = row[key];
              if (val !== undefined && val !== null) {
                return String(val).trim();
              }
            }
          }
        }
        return '';
      };

      const parsed: ParsedRowResult[] = [];

      rawRows.forEach((row, index) => {
        const rawNama = findVal(row, ['nama lengkap', 'nama guru', 'nama tendik', 'nama']);
        if (!rawNama) {
          // Skip completely empty rows
          const hasAnyVal = Object.values(row).some(v => v !== '' && v !== null);
          if (!hasAnyVal) return;
        }

        const gelar = findVal(row, ['gelar', 'gelar akademik', 'title']);
        const nipRaw = findVal(row, ['nip', 'nomor induk pegawai', 'no nip']);
        const nuptkRaw = findVal(row, ['nuptk', 'no nuptk']);
        const jabatanRaw = findVal(row, ['jabatan', 'tugas tambahan', 'role', 'posisi']);
        const kategoriRaw = findVal(row, ['kategori', 'jenis gtk', 'tipe', 'kelompok']);
        const statusRaw = findVal(row, ['status kepegawaian', 'status pegawai', 'status', 'kepegawaian']);
        const golonganRaw = findVal(row, ['golongan', 'pangkat/golongan', 'pangkat', 'gol']);
        const mapelRaw = findVal(row, ['mata pelajaran', 'mapel', 'pengampu', 'bidang studi']);
        const jamRaw = findVal(row, ['jam mengajar', 'beban jam', 'jam']);
        const emailRaw = findVal(row, ['email', 'surel', 'e-mail']);
        const telpRaw = findVal(row, ['telepon', 'whatsapp', 'no hp', 'telp', 'kontak']);
        const pendRaw = findVal(row, ['pendidikan terakhir', 'pendidikan', 'kualifikasi', 'ijazah']);

        // Normalize Kategori
        let kategori: 'Pendidik' | 'Tenaga Kependidikan' = 'Pendidik';
        const katLower = kategoriRaw.toLowerCase();
        if (
          katLower.includes('tendik') ||
          katLower.includes('tenaga') ||
          katLower.includes('tu') ||
          katLower.includes('tata usaha') ||
          katLower.includes('staff') ||
          katLower.includes('staf')
        ) {
          kategori = 'Tenaga Kependidikan';
        }

        // Normalize Status Kepegawaian
        let statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'PTT' = 'PNS';
        const statLower = statusRaw.toUpperCase();
        if (statLower.includes('PPPK') || statLower.includes('P3K')) {
          statusKepegawaian = 'PPPK';
        } else if (statLower.includes('GTT') || statLower.includes('HONORER GURU')) {
          statusKepegawaian = 'GTT';
        } else if (statLower.includes('PTT') || statLower.includes('HONORER TU') || statLower.includes('HONOR')) {
          statusKepegawaian = 'PTT';
        } else if (statLower.includes('PNS') || (nipRaw && nipRaw !== '-' && nipRaw.length >= 12)) {
          statusKepegawaian = 'PNS';
        }

        const jamMengajarNum = jamRaw ? parseInt(jamRaw.replace(/[^0-9]/g, ''), 10) : (kategori === 'Pendidik' ? 24 : 0);

        const warnings: string[] = [];
        if (!rawNama) {
          warnings.push('Nama belum terisi');
        }

        const cleanNip = nipRaw || '-';
        const cleanNuptk = nuptkRaw || '-';

        // Check duplicate against existing data
        const isDuplicateNip = cleanNip !== '-' && existingGuruList.some(e => e.nip === cleanNip);
        const isDuplicateNuptk = cleanNuptk !== '-' && existingGuruList.some(e => e.nuptk === cleanNuptk);
        const isDuplicateNama = existingGuruList.some(
          e => e.nama.trim().toLowerCase() === rawNama.trim().toLowerCase()
        );

        const isDuplicate = isDuplicateNip || isDuplicateNuptk || isDuplicateNama;
        if (isDuplicate) {
          if (isDuplicateNip) warnings.push('NIP sudah ada di sistem');
          else if (isDuplicateNuptk) warnings.push('NUPTK sudah ada di sistem');
          else if (isDuplicateNama) warnings.push('Nama GTK mirip data yang sudah ada');
        }

        const guruItem: GuruTendik = {
          id: `gtk-import-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
          nama: rawNama || `GTK Baris ${index + 1}`,
          gelar: gelar || '',
          nip: cleanNip,
          nuptk: cleanNuptk,
          jabatan: jabatanRaw || (kategori === 'Pendidik' ? 'Guru Mata Pelajaran' : 'Staf Tata Usaha'),
          kategori,
          statusKepegawaian,
          golongan: golonganRaw || (statusKepegawaian === 'PNS' ? 'Penata / III-c' : '-'),
          mapel: mapelRaw || (kategori === 'Pendidik' ? 'Umum' : '-'),
          jamMengajar: isNaN(jamMengajarNum) ? 0 : jamMengajarNum,
          email: emailRaw || `${rawNama.toLowerCase().replace(/[^a-z0-9]/g, '') || 'gtk'}@smpn2kotasukabumi.sch.id`,
          telepon: telpRaw || '08xxxxxxxxxx',
          pendidikanTerakhir: pendRaw || (kategori === 'Pendidik' ? 'S1 Pendidikan' : 'D3 / S1')
        };

        parsed.push({
          guru: guruItem,
          isValid: Boolean(rawNama),
          isDuplicate,
          warnings
        });
      });

      if (parsed.length === 0) {
        throw new Error('Tidak ada data GTK yang valid untuk diimpor. Pastikan format kolom sesuai template.');
      }

      setParsedResults(parsed);
      setActiveStep('preview');
    } catch (err: any) {
      console.error('Error parsing excel:', err);
      setErrorMsg(err.message || 'Gagal membaca berkas Excel. Pastikan file valid (.xlsx, .xls, .csv).');
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      processSpreadsheet(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSpreadsheet(e.target.files[0]);
    }
  };

  // Apply import
  const handleExecuteImport = () => {
    const validGurus = parsedResults.filter(r => r.isValid).map(r => r.guru);
    if (validGurus.length === 0) {
      setErrorMsg('Tidak ada baris data valid untuk diimpor.');
      return;
    }

    onImportSuccess(validGurus, importMode);
    onClose();
  };

  // Filter preview list
  const filteredPreviewList = parsedResults.filter(item => {
    if (filterPreview === 'valid') return item.isValid && !item.isDuplicate;
    if (filterPreview === 'duplicate') return item.isDuplicate;
    return true;
  });

  const totalValid = parsedResults.filter(r => r.isValid).length;
  const totalDuplicates = parsedResults.filter(r => r.isDuplicate).length;
  const totalPendidik = parsedResults.filter(r => r.guru.kategori === 'Pendidik').length;
  const totalTendik = parsedResults.filter(r => r.guru.kategori === 'Tenaga Kependidikan').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Impor Data GTK dari Excel / CSV</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Spreadsheet Parser
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pendidik & Tenaga Kependidikan SMP Negeri 2 Kota Sukabumi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 font-medium ${activeStep === 'upload' ? 'text-blue-700 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${activeStep === 'upload' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>1</span>
              <span>Pilih / Upload File</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 font-medium ${activeStep === 'preview' ? 'text-blue-700 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${activeStep === 'preview' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span>Pratinjau & Validasi Data</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadTemplate('xlsx')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="Unduh contoh template berformat .xlsx"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template Excel</span>
            </button>
            <button
              onClick={() => handleDownloadTemplate('csv')}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Unduh contoh template berformat .csv"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Terjadi kendala saat memproses file:</p>
                <p className="mt-0.5 text-red-700">{errorMsg}</p>
              </div>
            </div>
          )}

          {activeStep === 'upload' ? (
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/60 scale-[1.01]'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-blue-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                  {parsing ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {parsing ? 'Sedang membaca berkas...' : 'Klik untuk memilih file Excel atau seret berkas ke sini'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mb-4">
                  Mendukung format file <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong> dari sistem Dapodik, SIMPKB, BKN, atau format standar Excel sekolah.
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Berkas dari Komputer</span>
                </div>
              </div>

              {/* Instructions & Template info card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Format Kolom yang Dikenali Otomatis
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sistem SIAS secara cerdas mencocokkan kolom Anda meskipun judul kolom sedikit berbeda. Anda dapat menggunakan judul kolom berikut di baris pertama Excel Anda:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-blue-700 block">Nama Lengkap *</span>
                    <span className="text-[10px] text-slate-500">contoh: Dra. Hj. Siti</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Gelar</span>
                    <span className="text-[10px] text-slate-500">S.Pd., M.M.Pd.</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">NIP</span>
                    <span className="text-[10px] text-slate-500">18 Digit atau tanda '-'</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">NUPTK</span>
                    <span className="text-[10px] text-slate-500">16 Digit atau '-'</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Jabatan</span>
                    <span className="text-[10px] text-slate-500">Kepsek / Guru / TU</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Kategori</span>
                    <span className="text-[10px] text-slate-500">Pendidik / Tendik</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Status Pegawai</span>
                    <span className="text-[10px] text-slate-500">PNS / PPPK / GTT / PTT</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Mata Pelajaran</span>
                    <span className="text-[10px] text-slate-500">Matematika, IPA, dll</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500">
                  <span>Belum punya format Excel?</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh File Template Resmi (.xlsx)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Total Baris
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{parsedResults.length}</div>
                  <div className="text-[10px] text-blue-600 mt-0.5">{totalValid} data valid</div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Guru (Pendidik)
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalPendidik}</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Pengampu Mapel</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Tenaga Kependidikan
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalTendik}</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">Staf TU & Laboran</div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
                  <div className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Duplikasi / Mirip
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalDuplicates}</div>
                  <div className="text-[10px] text-purple-600 mt-0.5">NIP/Nama sudah ada</div>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="text-xs font-bold text-slate-800 mb-2">Pilih Mode Impor ke Database GTK:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'append'
                        ? 'border-blue-600 bg-white ring-1 ring-blue-600 shadow-2xs'
                        : 'border-slate-200 bg-slate-100/60 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Tambahkan ke Data yang Ada (Append)</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Menambahkan {totalValid} personel baru ke {existingGuruList.length} GTK yang sudah tersimpan tanpa menghapus yang lama.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                      importMode === 'replace'
                        ? 'border-amber-600 bg-white ring-1 ring-amber-600 shadow-2xs'
                        : 'border-slate-200 bg-slate-100/60 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">Gantikan Seluruh Data GTK (Replace)</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Mengganti seluruh daftar GTK saat ini dengan data yang baru dari berkas Excel ini.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Filter preview tabs */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Tampilkan:</span>
                  <button
                    onClick={() => setFilterPreview('all')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      filterPreview === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Semua ({parsedResults.length})
                  </button>
                  <button
                    onClick={() => setFilterPreview('valid')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                      filterPreview === 'valid' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    Valid Saja ({totalValid - totalDuplicates})
                  </button>
                  {totalDuplicates > 0 && (
                    <button
                      onClick={() => setFilterPreview('duplicate')}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                        filterPreview === 'duplicate' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      Peringatan Duplikasi ({totalDuplicates})
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-slate-500">
                  File: <span className="font-semibold text-slate-700">{file?.name}</span>
                </div>
              </div>

              {/* Table Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 sticky top-0 z-10 text-[11px] font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Nama & Gelar</th>
                      <th className="py-2.5 px-3">NIP / NUPTK</th>
                      <th className="py-2.5 px-3">Kategori</th>
                      <th className="py-2.5 px-3">Status Pegawai</th>
                      <th className="py-2.5 px-3">Jabatan & Mapel</th>
                      <th className="py-2.5 px-3">Status Validasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPreviewList.map((item, idx) => (
                      <tr
                        key={idx}
                        className={`hover:bg-slate-50 transition-colors ${
                          !item.isValid ? 'bg-red-50/50' : item.isDuplicate ? 'bg-amber-50/40' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-900">
                            {item.guru.nama} {item.guru.gelar && <span className="text-slate-500 font-normal">{item.guru.gelar}</span>}
                          </div>
                          <div className="text-[10px] text-slate-500">{item.guru.email}</div>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px]">
                          <div className="text-slate-800">{item.guru.nip}</div>
                          <div className="text-[10px] text-slate-500">NUPTK: {item.guru.nuptk}</div>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              item.guru.kategori === 'Pendidik'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {item.guru.kategori}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              item.guru.statusKepegawaian === 'PNS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.guru.statusKepegawaian === 'PPPK'
                                ? 'bg-cyan-100 text-cyan-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.guru.statusKepegawaian}
                          </span>
                          {item.guru.golongan && item.guru.golongan !== '-' && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.guru.golongan}</div>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="text-slate-800 font-medium">{item.guru.jabatan}</div>
                          {item.guru.mapel && item.guru.mapel !== '-' && (
                            <div className="text-[10px] text-blue-600">Mapel: {item.guru.mapel} ({item.guru.jamMengajar} Jam)</div>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {item.isValid && !item.isDuplicate && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Siap Impor
                            </span>
                          )}
                          {item.isDuplicate && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600" title={item.warnings.join(', ')}>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Peringatan
                            </span>
                          )}
                          {!item.isValid && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-600">
                              <X className="w-3.5 h-3.5" />
                              Tidak Valid
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {activeStep === 'upload' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Pilih Berkas Excel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setActiveStep('upload');
                  setFile(null);
                  setParsedResults([]);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Pilih File Lain
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleExecuteImport}
                  disabled={totalValid === 0}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Impor {totalValid} Data GTK Sekarang
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

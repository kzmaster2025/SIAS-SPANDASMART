import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Siswa } from '../types';
import { normalizeDateToIso } from '../utils/dateHelper';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertTriangle,
  CheckCircle2,
  Users,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';

interface ImportSiswaExcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSiswaList: Siswa[];
  onImportSuccess: (importedSiswa: Siswa[], mode: 'append' | 'replace') => void;
}

interface ParsedRowResult {
  siswa: Siswa;
  isValid: boolean;
  isDuplicate: boolean;
  warnings: string[];
}

export const ImportSiswaExcelModal: React.FC<ImportSiswaExcelModalProps> = ({
  isOpen,
  onClose,
  existingSiswaList,
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

  // Generate and download standard SMPN 2 Kota Sukabumi Siswa Template
  const handleDownloadTemplate = (format: 'xlsx' | 'csv' = 'xlsx') => {
    const templateData = [
      [
        'No',
        'NISN',
        'NIS',
        'Nama Lengkap',
        'Kelas',
        'Tingkat',
        'Jenis Kelamin (L/P)',
        'Tempat Lahir',
        'Tanggal Lahir (YYYY-MM-DD)',
        'Agama',
        'Alamat Domisili',
        'Nama Ayah',
        'Nama Ibu',
        'Kontak Ortu / WA',
        'Status Siswa'
      ],
      [
        1,
        '0098471201',
        '232407001',
        'Muhammad Rizky Ramadhan',
        '7-A',
        '7',
        'L',
        'Sukabumi',
        '2012-04-12',
        'Islam',
        'Jl. Bhayangkara No. 45, Kel. Selabatu',
        'Dedi Suhendar',
        'Siti Nurhaliza',
        '081234567890',
        'Aktif'
      ],
      [
        2,
        '0097654312',
        '232407002',
        'Siti Aisyah Putri',
        '7-A',
        '7',
        'P',
        'Sukabumi',
        '2012-07-25',
        'Islam',
        'Jl. Jend. Sudirman No. 12, Kel. Sriwidari',
        'Hendra Wijaya',
        'Rina Kurnia',
        '085712345678',
        'Aktif'
      ],
      [
        3,
        '0089123456',
        '222308015',
        'Fajar Pratama',
        '8-B',
        '8',
        'L',
        'Bogor',
        '2011-09-03',
        'Islam',
        'Jl. Otista No. 78, Kel. Kebonjati',
        'Yudi Hermawan',
        'Dewi Lestari',
        '082198765432',
        'Aktif'
      ],
      [
        4,
        '0076543219',
        '212209042',
        'Anisa Zahra Maulida',
        '9-C',
        '9',
        'P',
        'Sukabumi',
        '2010-02-18',
        'Islam',
        'Jl. Veteran No. 8, Kel. Cikole',
        'Agus Setiawan',
        'Fitri Handayani',
        '081345678912',
        'Aktif'
      ]
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths for nice appearance
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 14 }, // NISN
      { wch: 12 }, // NIS
      { wch: 28 }, // Nama Lengkap
      { wch: 10 }, // Kelas
      { wch: 10 }, // Tingkat
      { wch: 18 }, // JK
      { wch: 16 }, // Tempat Lahir
      { wch: 24 }, // Tanggal Lahir
      { wch: 12 }, // Agama
      { wch: 36 }, // Alamat
      { wch: 20 }, // Nama Ayah
      { wch: 20 }, // Nama Ibu
      { wch: 18 }, // Kontak Ortu
      { wch: 14 }  // Status
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template_Siswa_SMPN2');

    if (format === 'csv') {
      XLSX.writeFile(wb, 'Template_Buku_Induk_Siswa_SMPN2_Sukabumi.csv', { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, 'Template_Buku_Induk_Siswa_SMPN2_Sukabumi.xlsx', { bookType: 'xlsx' });
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
        const rawNama = findVal(row, ['nama lengkap', 'nama siswa', 'nama murid', 'nama peserta didik', 'nama']);
        if (!rawNama) {
          // Skip completely empty rows
          const hasAnyVal = Object.values(row).some(v => v !== '' && v !== null);
          if (!hasAnyVal) return;
        }

        const rawNisn = findVal(row, ['nisn', 'nomor induk siswa nasional', 'no nisn']);
        const rawNis = findVal(row, ['nis', 'nomor induk', 'no induk', 'nipd']);
        const rawKelas = findVal(row, ['kelas', 'rombel', 'rombongan belajar']) || '7-A';
        const rawTingkat = findVal(row, ['tingkat', 'kelas tingkat', 'tingkat kelas', 'jenjang']);
        const rawJk = findVal(row, ['jenis kelamin', 'jk', 'l/p', 'gender', 'sex']);
        const rawTempatLahir = findVal(row, ['tempat lahir', 'kota lahir', 'tempat']) || 'Sukabumi';
        const unnormalizedTanggalLahir = findVal(row, ['tanggal lahir', 'tgl lahir', 'tgl', 'birthdate']) || '2012-01-01';
        const rawTanggalLahir = normalizeDateToIso(unnormalizedTanggalLahir) || '2012-01-01';
        const rawAgama = findVal(row, ['agama', 'religion']) || 'Islam';
        const rawAlamat = findVal(row, ['alamat domisili', 'alamat', 'tempat tinggal', 'domisili']) || 'Kota Sukabumi';
        const rawNamaAyah = findVal(row, ['nama ayah', 'ayah', 'wali ayah']);
        const rawNamaIbu = findVal(row, ['nama ibu', 'ibu', 'wali ibu']);
        const rawKontakOrtu = findVal(row, ['kontak ortu', 'no hp', 'telepon', 'wa ortu', 'no wa', 'kontak', 'hp ortu']);
        const rawStatus = findVal(row, ['status siswa', 'status']);

        // Determine Tingkat ('7' | '8' | '9')
        let tingkat: '7' | '8' | '9' = '7';
        if (rawTingkat === '7' || rawTingkat === '8' || rawTingkat === '9') {
          tingkat = rawTingkat;
        } else if (rawKelas.startsWith('8')) {
          tingkat = '8';
        } else if (rawKelas.startsWith('9')) {
          tingkat = '9';
        }

        // Determine JK ('L' | 'P')
        let jenisKelamin: 'L' | 'P' = 'L';
        const jkLower = rawJk.toLowerCase();
        if (jkLower.startsWith('p') || jkLower.includes('perempuan') || jkLower.includes('wanita') || jkLower === 'f') {
          jenisKelamin = 'P';
        }

        // Determine Status ('Aktif' | 'Mutasi Keluar' | 'Lulus')
        let status: 'Aktif' | 'Mutasi Keluar' | 'Lulus' = 'Aktif';
        const statLower = rawStatus.toLowerCase();
        if (statLower.includes('lulus') || statLower.includes('alumni')) {
          status = 'Lulus';
        } else if (statLower.includes('mutasi') || statLower.includes('pindah') || statLower.includes('keluar')) {
          status = 'Mutasi Keluar';
        }

        const warnings: string[] = [];
        if (!rawNama) {
          warnings.push('Nama siswa belum terisi');
        }

        const cleanNisn = rawNisn || `009${Math.floor(1000000 + Math.random() * 9000000)}`;
        const cleanNis = rawNis || `2324${tingkat}${Math.floor(100 + Math.random() * 899)}`;

        // Check duplicate against existing data
        const isDuplicateNisn = rawNisn ? existingSiswaList.some(e => e.nisn === rawNisn) : false;
        const isDuplicateNis = rawNis ? existingSiswaList.some(e => e.nis === rawNis) : false;
        const isDuplicateNama = existingSiswaList.some(
          e => e.nama.trim().toLowerCase() === rawNama.trim().toLowerCase()
        );

        const isDuplicate = isDuplicateNisn || isDuplicateNis || isDuplicateNama;
        if (isDuplicate) {
          if (isDuplicateNisn) warnings.push('NISN sudah ada di database');
          else if (isDuplicateNis) warnings.push('NIS sudah ada di database');
          else if (isDuplicateNama) warnings.push('Nama siswa mirip dengan data yang sudah ada');
        }

        const siswaItem: Siswa = {
          id: `sis-import-${Date.now()}-${index}-${Math.floor(Math.random() * 1000)}`,
          nisn: cleanNisn,
          nis: cleanNis,
          nama: rawNama || `Siswa Baris ${index + 1}`,
          kelas: rawKelas,
          tingkat,
          jenisKelamin,
          tempatLahir: rawTempatLahir,
          tanggalLahir: rawTanggalLahir,
          agama: rawAgama,
          alamat: rawAlamat,
          namaAyah: rawNamaAyah || 'Orang Tua Siswa',
          namaIbu: rawNamaIbu || 'Ibu Siswa',
          kontakOrtu: rawKontakOrtu || '08xxxxxxxxxx',
          status
        };

        parsed.push({
          siswa: siswaItem,
          isValid: Boolean(rawNama),
          isDuplicate,
          warnings
        });
      });

      if (parsed.length === 0) {
        throw new Error('Tidak ada data peserta didik yang valid untuk diimpor. Pastikan format kolom sesuai template.');
      }

      setParsedResults(parsed);
      setActiveStep('preview');
    } catch (err: any) {
      console.error('Error parsing excel siswa:', err);
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
    const validSiswa = parsedResults.filter(r => r.isValid).map(r => r.siswa);
    if (validSiswa.length === 0) {
      setErrorMsg('Tidak ada baris data valid untuk diimpor.');
      return;
    }

    onImportSuccess(validSiswa, importMode);
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
  const totalKelas7 = parsedResults.filter(r => r.siswa.tingkat === '7').length;
  const totalKelas8 = parsedResults.filter(r => r.siswa.tingkat === '8').length;
  const totalKelas9 = parsedResults.filter(r => r.siswa.tingkat === '9').length;

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
                <h2 className="text-base font-bold tracking-tight">Impor Data Siswa dari Excel / CSV</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Buku Induk Siswa
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Administrasi Peserta Didik SMP Negeri 2 Kota Sukabumi
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
              <span>Pilih / Upload File Siswa</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            <div className={`flex items-center gap-1.5 font-medium ${activeStep === 'preview' ? 'text-blue-700 font-semibold' : 'text-slate-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${activeStep === 'preview' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'}`}>2</span>
              <span>Pratinjau & Validasi Data Siswa</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadTemplate('xlsx')}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="Unduh contoh template siswa berformat .xlsx"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Template Excel</span>
            </button>
            <button
              onClick={() => handleDownloadTemplate('csv')}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Unduh contoh template siswa berformat .csv"
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
                <p className="font-semibold">Terjadi kendala saat memproses berkas siswa:</p>
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

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                  {parsing ? (
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  ) : (
                    <Upload className="w-8 h-8" />
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {parsing ? 'Sedang membaca berkas siswa...' : 'Klik untuk memilih file Excel atau seret berkas ke sini'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mb-4">
                  Mendukung format file <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong> dari ekspor Dapodik Siswa, EMIS, atau format Excel buku induk sekolah.
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Pilih Berkas Siswa dari Komputer</span>
                </div>
              </div>

              {/* Instructions & Column info card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Kolom yang Terbaca Otomatis dari Excel / Dapodik
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sistem SIAS secara cerdas mencocokkan kolom Anda meskipun judul kolom sedikit berbeda. Anda dapat menggunakan judul kolom berikut di baris pertama Excel Anda:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-blue-700 block">Nama Lengkap *</span>
                    <span className="text-[10px] text-slate-500">contoh: Muhammad Rizky</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">NISN</span>
                    <span className="text-[10px] text-slate-500">10 Digit NISN Nasional</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">NIS</span>
                    <span className="text-[10px] text-slate-500">Nomor Induk Sekolah</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Kelas / Rombel</span>
                    <span className="text-[10px] text-slate-500">7-A, 8-B, 9-C, dll</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Jenis Kelamin</span>
                    <span className="text-[10px] text-slate-500">L / P / Laki-laki / Perempuan</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Tempat & Tgl Lahir</span>
                    <span className="text-[10px] text-slate-500">Sukabumi, 2012-04-12</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Nama Orang Tua</span>
                    <span className="text-[10px] text-slate-500">Ayah / Ibu / Wali</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-slate-200 font-mono text-slate-700">
                    <span className="font-bold text-slate-800 block">Kontak / HP Ortu</span>
                    <span className="text-[10px] text-slate-500">WhatsApp / Telp</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500">
                  <span>Belum punya file Excel data siswa?</span>
                  <button
                    type="button"
                    onClick={() => handleDownloadTemplate('xlsx')}
                    className="font-semibold text-blue-700 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Unduh File Template Siswa (.xlsx)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <div className="text-[11px] font-semibold text-blue-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Total Siswa
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{parsedResults.length}</div>
                  <div className="text-[10px] text-blue-600 mt-0.5">{totalValid} data valid</div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Kelas 7
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalKelas7}</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Tingkat VII</div>
                </div>

                <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-900">
                  <div className="text-[11px] font-semibold text-cyan-700 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Kelas 8
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalKelas8}</div>
                  <div className="text-[10px] text-cyan-600 mt-0.5">Tingkat VIII</div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900">
                  <div className="text-[11px] font-semibold text-indigo-700 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Kelas 9
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalKelas9}</div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">Tingkat IX</div>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 col-span-2 sm:col-span-1">
                  <div className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Duplikasi
                  </div>
                  <div className="text-xl font-bold font-mono mt-1">{totalDuplicates}</div>
                  <div className="text-[10px] text-purple-600 mt-0.5">NISN/Nama sudah ada</div>
                </div>
              </div>

              {/* Mode Selection */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div className="text-xs font-bold text-slate-800 mb-2">Pilih Mode Impor ke Buku Induk Siswa:</div>
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
                      <div className="font-semibold text-slate-900">Tambahkan ke Data Siswa yang Ada (Append)</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Menambahkan {totalValid} peserta didik baru ke {existingSiswaList.length} siswa yang sudah terdaftar tanpa menghapus siswa lama.
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
                      <div className="font-semibold text-slate-900">Gantikan Seluruh Data Siswa (Replace)</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Mengganti seluruh daftar siswa buku induk dengan data baru dari berkas Excel ini.
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
                      <th className="py-2.5 px-3">Nama Siswa</th>
                      <th className="py-2.5 px-3">NISN / NIS</th>
                      <th className="py-2.5 px-3">Kelas / JK</th>
                      <th className="py-2.5 px-3">Tempat, Tgl Lahir</th>
                      <th className="py-2.5 px-3">Orang Tua & Alamat</th>
                      <th className="py-2.5 px-3">Status</th>
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
                          <div className="font-semibold text-slate-900">{item.siswa.nama}</div>
                          <div className="text-[10px] text-slate-500">{item.siswa.agama}</div>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px]">
                          <div className="text-slate-800">{item.siswa.nisn}</div>
                          <div className="text-[10px] text-slate-500">NIS: {item.siswa.nis}</div>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
                              {item.siswa.kelas}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-600">
                              {item.siswa.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-700">
                          <div>{item.siswa.tempatLahir}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{item.siswa.tanggalLahir}</div>
                        </td>
                        <td className="py-2 px-3 text-[11px]">
                          <div className="text-slate-800 truncate max-w-[180px]">
                            {item.siswa.namaAyah} / {item.siswa.namaIbu}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            {item.siswa.alamat} ({item.siswa.kontakOrtu})
                          </div>
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
                Pilih Berkas Excel Siswa
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
                  Impor {totalValid} Data Siswa Sekarang
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

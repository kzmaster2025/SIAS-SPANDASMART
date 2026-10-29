import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from '../services/auth';
import {
  listDriveFiles,
  uploadFileToDrive,
  createDriveFolder,
  deleteDriveFile,
  fetchDriveAbout,
  DriveFileItem,
  DriveAboutInfo
} from '../services/driveService';
import { DokumenSekolah } from '../types';
import {
  Cloud,
  Search,
  Upload,
  FolderPlus,
  Trash2,
  ExternalLink,
  RefreshCw,
  Folder,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  File,
  CheckCircle2,
  AlertTriangle,
  Lock,
  X,
  HardDrive,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Copy,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface GoogleDriveSekolahProps {
  dokumenSekolahList: DokumenSekolah[];
}

export const GoogleDriveSekolah: React.FC<GoogleDriveSekolahProps> = ({ dokumenSekolahList }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [aboutInfo, setAboutInfo] = useState<DriveAboutInfo | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMime, setFilterMime] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Upload Form
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileContent, setUploadFileContent] = useState('');
  const [selectedLocalFile, setSelectedLocalFile] = useState<File | null>(null);
  const [uploadDocId, setUploadDocId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // New Folder Form
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsLoadingAuth(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch files when token is available
  useEffect(() => {
    if (token) {
      loadDriveData();
    }
  }, [token]);

  const loadDriveData = async () => {
    setIsLoadingFiles(true);
    setFeedbackMsg(null);
    try {
      const [filesRes, aboutRes] = await Promise.all([
        listDriveFiles(),
        fetchDriveAbout().catch(() => null)
      ]);
      setFiles(filesRes.files || []);
      if (aboutRes) setAboutInfo(aboutRes);
    } catch (err: any) {
      console.error('Error loading Google Drive data:', err);
      setFeedbackMsg({
        text: err?.message || 'Gagal memuat data dari Google Drive.',
        type: 'error'
      });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setAuthError(err?.message || 'Gagal masuk dengan Google. Pastikan popup tidak diblokir.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setFiles([]);
    setAboutInfo(null);
  };

  // Filtered files
  const filteredFiles = files.filter((f) => {
    const matchQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchQuery) return false;

    if (filterMime === 'all') return true;
    if (filterMime === 'folder') return f.mimeType === 'application/vnd.google-apps.folder';
    if (filterMime === 'docs') return f.mimeType.includes('document');
    if (filterMime === 'sheets') return f.mimeType.includes('spreadsheet');
    if (filterMime === 'slides') return f.mimeType.includes('presentation');
    if (filterMime === 'pdf') return f.mimeType.includes('pdf');
    if (filterMime === 'image') return f.mimeType.startsWith('image/');
    return true;
  });

  const getMimeIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-4 h-4 text-amber-500 shrink-0" />;
    }
    if (mimeType.includes('document')) {
      return <FileText className="w-4 h-4 text-blue-600 shrink-0" />;
    }
    if (mimeType.includes('spreadsheet')) {
      return <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
    if (mimeType.includes('presentation')) {
      return <Presentation className="w-4 h-4 text-amber-600 shrink-0" />;
    }
    if (mimeType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-purple-600 shrink-0" />;
    }
    return <File className="w-4 h-4 text-slate-500 shrink-0" />;
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '-';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '-';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Upload handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setFeedbackMsg(null);
    try {
      if (selectedLocalFile) {
        await uploadFileToDrive({
          name: selectedLocalFile.name,
          mimeType: selectedLocalFile.type || 'application/octet-stream',
          content: selectedLocalFile
        });
      } else if (uploadDocId) {
        const doc = dokumenSekolahList.find(d => d.id === uploadDocId);
        if (!doc) throw new Error('Dokumen tidak ditemukan');
        const content = `DOKUMEN RESMI SMP NEGERI 2 KOTA SUKABUMI
Judul: ${doc.judul}
Nomor: ${doc.nomorDokumen}
Kategori: ${doc.kategori}
Tahun Ajaran: ${doc.tahunAjaran}
Pengesah: ${doc.pengesah}

Deskripsi:
${doc.deskripsi}

Ketentuan:
${doc.isiRingkasan}`;

        await uploadFileToDrive({
          name: `${doc.nomorDokumen.replace(/[/\\?%*:|"<>]/g, '_')}_${doc.judul}.txt`,
          mimeType: 'text/plain',
          content: content
        });
      } else if (uploadFileName && uploadFileContent) {
        await uploadFileToDrive({
          name: uploadFileName.endsWith('.txt') ? uploadFileName : `${uploadFileName}.txt`,
          mimeType: 'text/plain',
          content: uploadFileContent
        });
      } else {
        throw new Error('Pilih dokumen sekolah atau berkas lokal untuk diunggah.');
      }

      setFeedbackMsg({ text: 'Berkas berhasil diunggah ke Google Drive!', type: 'success' });
      setIsUploadModalOpen(false);
      setUploadFileName('');
      setUploadFileContent('');
      setSelectedLocalFile(null);
      setUploadDocId('');
      await loadDriveData();
    } catch (err: any) {
      console.error('Upload error:', err);
      setFeedbackMsg({ text: err?.message || 'Gagal mengunggah berkas.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // Create folder handler
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setIsCreatingFolder(true);
    try {
      await createDriveFolder(newFolderName.trim());
      setFeedbackMsg({ text: `Folder "${newFolderName}" berhasil dibuat di Google Drive!`, type: 'success' });
      setIsNewFolderModalOpen(false);
      setNewFolderName('');
      await loadDriveData();
    } catch (err: any) {
      console.error('Create folder error:', err);
      setFeedbackMsg({ text: err?.message || 'Gagal membuat folder.', type: 'error' });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Explicit confirmation delete handler (Mandatory)
  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setFeedbackMsg({ text: `Berkas "${fileToDelete.name}" telah dihapus dari Google Drive.`, type: 'success' });
      setFileToDelete(null);
      await loadDriveData();
    } catch (err: any) {
      console.error('Delete file error:', err);
      setFeedbackMsg({ text: err?.message || 'Gagal menghapus berkas.', type: 'error' });
    } finally {
      setIsDeleting(false);
    }
  };

  // Quick backup all school documents
  const handleBackupAllDocuments = async () => {
    if (!token) return;
    setIsUploading(true);
    try {
      // 1. Create a dedicated folder
      const folder = await createDriveFolder(
        `Arsip SMPN 2 Sukabumi - TA 2025-2026 (${new Date().toISOString().slice(0, 10)})`
      );

      // 2. Upload documents into the folder
      let count = 0;
      for (const doc of dokumenSekolahList.slice(0, 5)) {
        const text = `DOKUMEN RESMI SMP NEGERI 2 KOTA SUKABUMI
Judul: ${doc.judul}
Nomor SK: ${doc.nomorDokumen}
Kategori: ${doc.kategori}
Tahun Ajaran: ${doc.tahunAjaran}
Pengesah: ${doc.pengesah}

Deskripsi:
${doc.deskripsi}

Isi Ringkasan:
${doc.isiRingkasan}`;

        await uploadFileToDrive({
          name: `${doc.fileNama.replace(/\.[^.]+$/, '')}_Arsip.txt`,
          mimeType: 'text/plain',
          content: text,
          folderId: folder.id
        });
        count++;
      }

      setFeedbackMsg({
        text: `Berhasil mencadangkan ${count} dokumen ke folder Google Drive: "${folder.name}"!`,
        type: 'success'
      });
      await loadDriveData();
    } catch (err: any) {
      console.error('Backup error:', err);
      setFeedbackMsg({ text: err?.message || 'Gagal mencadangkan arsip.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Integrasi Cloud Workspace</span>
            <span aria-hidden="true">·</span>
            <span>Google Drive API v3</span>
            <span aria-hidden="true">·</span>
            <span>SMP Negeri 2 Kota Sukabumi</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cloud className="w-5 h-5 text-blue-600" />
            <span>Pusat Berkas & Google Drive Sekolah</span>
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Sinkronisasi dokumen resmi, KOSP, SK guru, dan berkas administrasi langsung dengan akun Google Drive / Belajar.id sekolah.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsNewFolderModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4 text-amber-600" />
              <span>Buat Folder</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Unggah ke Drive</span>
            </button>
          </div>
        )}
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Authentication Banner if not signed in */}
      {!user ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto shadow-inner">
            <Cloud className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Hubungkan dengan Google Drive
            </h2>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed max-w-md mx-auto">
              Gunakan akun Google atau akun guru Belajar.id untuk mengelola berkas sekolah, mencadangkan arsip KOSP & SK Kepala Sekolah, serta mengakses penyimpanan cloud secara aman.
            </p>
          </div>

          {authError && (
            authError.includes('unauthorized-domain') ? (
              <div className="p-4 bg-amber-50/90 border border-amber-300 text-amber-950 text-xs rounded-xl text-left space-y-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Domain Belum Diizinkan di Firebase Console (auth/unauthorized-domain)
                    </h4>
                    <p className="text-slate-700 mt-1 leading-relaxed">
                      Karena website ini diakses dari domain <strong className="font-mono text-blue-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">{typeof window !== 'undefined' ? window.location.hostname : 'domain Anda'}</strong>, Firebase membatasi login demi keamanan akun Google Anda sampai domain ini ditambahkan.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-white rounded-lg border border-amber-200 space-y-2 text-slate-700">
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Langkah Mudah Memperbaiki (1 Menit):</span>
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed text-[11px]">
                    <li>
                      Buka Firebase Console Settings:{' '}
                      <a
                        href="https://console.firebase.google.com/project/gen-lang-client-0747928200/authentication/settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-bold underline inline-flex items-center gap-1 hover:text-blue-900"
                      >
                        <span>Buka Tab Authorized Domains di Firebase</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </li>
                    <li>
                      Di bagian <strong>Authorized domains</strong> (Domain yang diizinkan), klik tombol <strong>Add domain</strong> (Tambahkan domain).
                    </li>
                    <li>
                      Ketik nama domain Anda:{' '}
                      <code className="font-mono font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {typeof window !== 'undefined' ? window.location.hostname : 'kzmaster2025.github.io'}
                      </code>{' '}
                      lalu klik <strong>Save (Simpan)</strong>.
                    </li>
                    <li>Setelah disimpan, tutup dan klik kembali tombol <strong>Sign in with Google</strong> di bawah!</li>
                  </ol>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(window.location.hostname);
                        alert(`Domain "${window.location.hostname}" berhasil disalin!`);
                      }
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Salin Nama Domain ({typeof window !== 'undefined' ? window.location.hostname : ''})</span>
                  </button>

                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0747928200/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka Firebase Console</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg text-left">
                {authError}
              </div>
            )
          )}

          {/* Official Sign in with Google Button */}
          <div className="flex flex-col items-center justify-center pt-2 space-y-3">
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:shadow-xs transition-all text-xs font-semibold text-slate-700 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              <span>{isLoggingIn ? 'Menghubungkan...' : 'Sign in with Google'}</span>
            </button>

            {/* Simulation demo button if domain not yet verified */}
            <button
              type="button"
              onClick={() => {
                const demoUser = {
                  uid: 'demo-guru-smpn2',
                  displayName: 'Admin TU & Guru SMPN 2 Sukabumi',
                  email: 'engkuskusnandar55@guru.smp.belajar.id',
                  photoURL: ''
                } as unknown as User;
                setUser(demoUser);
                setToken('demo-token');
                setAboutInfo({
                  user: { displayName: 'Admin TU & Guru SMPN 2 Sukabumi', emailAddress: 'engkuskusnandar55@guru.smp.belajar.id' },
                  storageQuota: { usage: '2147483648', limit: '107374182400', usageInDrive: '2147483648', usageInDriveTrash: '0' }
                });
                setFiles([
                  { id: 'f-1', name: '📁 01_KOSP_Kurikulum_Merdeka_2025_2026', mimeType: 'application/vnd.google-apps.folder', modifiedTime: new Date().toISOString() },
                  { id: 'f-2', name: '📁 02_SK_Pembagian_Tugas_Guru_Tendik', mimeType: 'application/vnd.google-apps.folder', modifiedTime: new Date().toISOString() },
                  { id: 'f-3', name: '📁 03_Arsip_Surat_Resmi_Kedinasan_TU', mimeType: 'application/vnd.google-apps.folder', modifiedTime: new Date().toISOString() },
                  { id: 'f-4', name: 'KOSP_Fase_D_SMPN_2_Kota_Sukabumi.pdf', mimeType: 'application/pdf', size: '2450000', modifiedTime: new Date().toISOString(), webViewLink: 'https://drive.google.com' },
                  { id: 'f-5', name: 'SK_Kepala_Sekolah_Pembagian_Tugas_2025.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: '540000', modifiedTime: new Date().toISOString(), webViewLink: 'https://drive.google.com' },
                  { id: 'f-6', name: 'RKAS_BOS_SMPN2_Sukabumi_Tahun_2026.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '1240000', modifiedTime: new Date().toISOString(), webViewLink: 'https://drive.google.com' },
                  { id: 'f-7', name: 'SOP_Pelayanan_Administrasi_Tata_Usaha.pdf', mimeType: 'application/pdf', size: '890000', modifiedTime: new Date().toISOString(), webViewLink: 'https://drive.google.com' }
                ]);
                setAuthError(null);
              }}
              className="text-[11px] text-blue-700 hover:text-blue-800 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Gunakan Mode Simulasi Berkas Sekolah (Coba Fitur Drive Tanpa Tunggu Setting Domain)</span>
            </button>

            <span className="text-[11px] text-slate-400 font-mono">
              Protokol Resmi Google OAuth 2.0 · SMPN 2 Kota Sukabumi
            </span>
          </div>
        </div>
      ) : (
        /* Connected Google Account Bar */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Google User'}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-slate-200 object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {user.displayName?.slice(0, 1) || 'G'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{user.displayName || 'Akun Google'}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Terhubung</span>
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {aboutInfo?.storageQuota && (
                <div className="text-xs text-slate-500 font-mono border-l md:border-l-0 md:border-r border-slate-200 pl-3 md:pl-0 md:pr-4">
                  <span>Penyimpanan Drive: </span>
                  <span className="font-semibold text-slate-800">
                    {formatFileSize(aboutInfo.storageQuota.usageInDrive)}
                  </span>
                </div>
              )}

              <button
                onClick={handleBackupAllDocuments}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Cadangkan Arsip Sekolah</span>
              </button>

              <button
                onClick={loadDriveData}
                disabled={isLoadingFiles}
                className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Muat Ulang Berkas"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Keluar dari Google"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Putuskan</span>
              </button>
            </div>
          </div>

          {/* Drive Search & Filter */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari berkas di Google Drive..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setFilterMime('all')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterMime === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua Berkas
              </button>
              <button
                onClick={() => setFilterMime('folder')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterMime === 'folder' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Folder
              </button>
              <button
                onClick={() => setFilterMime('docs')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterMime === 'docs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dokumen
              </button>
              <button
                onClick={() => setFilterMime('sheets')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterMime === 'sheets' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Spreadsheet
              </button>
              <button
                onClick={() => setFilterMime('pdf')}
                className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  filterMime === 'pdf' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PDF
              </button>
            </div>
          </div>

          {/* Files Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                Berkas Tersimpan di Google Drive ({filteredFiles.length} Item)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Akun: {user.email}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="py-3 px-4 whitespace-nowrap">Nama Berkas</th>
                    <th className="py-3 px-4 whitespace-nowrap">Tipe / Format</th>
                    <th className="py-3 px-4 whitespace-nowrap">Ukuran</th>
                    <th className="py-3 px-4 whitespace-nowrap">Terakhir Diubah</th>
                    <th className="py-3 px-4 whitespace-nowrap">Pemilik</th>
                    <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {isLoadingFiles ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                        <p className="font-medium text-slate-600">Menghubungkan ke Google Drive...</p>
                      </td>
                    </tr>
                  ) : filteredFiles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Cloud className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium text-slate-600">Tidak ada berkas yang ditemukan</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Klik tombol "Unggah ke Drive" untuk menambahkan dokumen pertama Anda.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {getMimeIcon(file.mimeType)}
                            <span className="font-semibold text-slate-900 truncate max-w-xs md:max-w-md block">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {file.mimeType.split('.').pop()?.replace('vnd.google-apps.', '') || 'file'}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-600 whitespace-nowrap">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-slate-500 whitespace-nowrap">
                          {new Date(file.modifiedTime).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {file.owners?.[0]?.displayName || 'Saya'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Buka di Google Drive"
                                className="p-1.5 rounded-md hover:bg-blue-50 text-blue-700 transition-colors inline-block"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button
                              onClick={() => setFileToDelete(file)}
                              title="Hapus Berkas dari Google Drive"
                              className="p-1.5 rounded-md hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-700" />
                <span>Unggah Berkas ke Google Drive</span>
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Pilih Dokumen Sekolah yang Tersedia (Otomatis)
                </label>
                <select
                  value={uploadDocId}
                  onChange={(e) => {
                    setUploadDocId(e.target.value);
                    if (e.target.value) {
                      const doc = dokumenSekolahList.find(d => d.id === e.target.value);
                      if (doc) setUploadFileName(doc.fileNama);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="">-- Pilih Dokumen Sekolah (KOSP / SK / SOP) --</option>
                  {dokumenSekolahList.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.judul} ({doc.kategori})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-center text-slate-400 font-semibold my-1">
                — ATAU PILIH DARI KOMPUTER LOKAL —
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Pilih Berkas Lokal
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedLocalFile(e.target.files[0]);
                      setUploadDocId('');
                    }
                  }}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Sedang Mengunggah...' : 'Unggah Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-600" />
                <span>Buat Folder Baru di Google Drive</span>
              </h2>
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Folder*
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  placeholder="Misal: Arsip Surat Keluar 2026 atau Kurikulum Merdeka"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isCreatingFolder ? 'Membuat...' : 'Buat Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Explicit Confirmation Dialog for Destructive Delete Operation */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-slate-900 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 pb-2 border-b border-slate-100">
              <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Konfirmasi Penghapusan Berkas</h3>
                <p className="text-[11px] text-slate-500">Tindakan ini akan menghapus berkas dari Google Drive Anda</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500">Nama Berkas:</p>
              <p className="font-semibold text-slate-900 break-all">{fileToDelete.name}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">ID Drive: {fileToDelete.id}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus berkas ini secara permanen dari akun Google Drive sekolah?
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus Berkas'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

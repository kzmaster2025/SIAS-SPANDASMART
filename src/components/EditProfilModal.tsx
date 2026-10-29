import React, { useState, useRef } from 'react';
import { ProfilSekolahData } from '../types';
import { PROFIL_SEKOLAH } from '../data/mockData';
import {
  X,
  Upload,
  Image as ImageIcon,
  Building,
  UserCheck,
  Compass,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2
} from 'lucide-react';

interface EditProfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  profilData: ProfilSekolahData;
  onSave: (updated: ProfilSekolahData) => void;
  onResetDefault: () => void;
}

export const EditProfilModal: React.FC<EditProfilModalProps> = ({
  isOpen,
  onClose,
  profilData,
  onSave,
  onResetDefault
}) => {
  const [activeTab, setActiveTab] = useState<'gambar' | 'identitas' | 'kepsek' | 'visimisi' | 'fasilitas'>('gambar');
  const [formData, setFormData] = useState<ProfilSekolahData>({ ...profilData });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // File input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const kepsekPhotoInputRef = useRef<HTMLInputElement>(null);
  const labInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Generic file to base64 reader
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'heroImage' | 'kepsekFoto' | 'labImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: warning if > 3MB
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Disarankan di bawah 3MB agar performa tetap cepat.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (field === 'logoUrl') {
        setFormData(prev => ({ ...prev, logoUrl: result }));
      } else if (field === 'heroImage') {
        setFormData(prev => ({ ...prev, heroImage: result }));
      } else if (field === 'labImage') {
        setFormData(prev => ({ ...prev, labImage: result }));
      } else if (field === 'kepsekFoto') {
        setFormData(prev => ({
          ...prev,
          kepalaSekolah: { ...prev.kepalaSekolah, foto: result }
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMisiChange = (index: number, val: string) => {
    const newMisi = [...formData.misi];
    newMisi[index] = val;
    setFormData(prev => ({ ...prev, misi: newMisi }));
  };

  const handleAddMisi = () => {
    setFormData(prev => ({ ...prev, misi: [...prev.misi, ''] }));
  };

  const handleRemoveMisi = (index: number) => {
    setFormData(prev => ({ ...prev, misi: prev.misi.filter((_, i) => i !== index) }));
  };

  const handleFasilitasChange = (index: number, field: 'nama' | 'kapasitas' | 'status', val: string) => {
    const newFas = [...formData.fasilitas];
    newFas[index] = { ...newFas[index], [field]: val };
    setFormData(prev => ({ ...prev, fasilitas: newFas }));
  };

  const handleAddFasilitas = () => {
    setFormData(prev => ({
      ...prev,
      fasilitas: [...prev.fasilitas, { nama: 'Fasilitas Baru', kapasitas: 'Kapasitas standar', status: 'Baik' }]
    }));
  };

  const handleRemoveFasilitas = (index: number) => {
    setFormData(prev => ({ ...prev, fasilitas: prev.fasilitas.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh profil dan foto ke data standar bawaan SMPN 2 Kota Sukabumi?')) {
      onResetDefault();
      setFormData({ ...PROFIL_SEKOLAH });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Edit Profil, Logo & Foto Halaman Depan
              </h3>
              <p className="text-xs text-slate-500">
                Sesuaikan logo sekolah, gambar gedung utama, data profil, dan kepala sekolah
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('gambar')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'gambar'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Logo & Gambar Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('identitas')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'identitas'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Identitas & Kontak</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kepsek')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'kepsek'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Kepala Sekolah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('visimisi')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'visimisi'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Visi & Misi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fasilitas')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'fasilitas'
                ? 'border-blue-600 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Sarana & Fasilitas</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: LOGO & GAMBAR SEKOLAH */}
          {activeTab === 'gambar' && (
            <div className="space-y-6 text-xs">
              {/* Section 1: Logo Sekolah */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-900 text-sm block">
                      1. Logo Resmi SMP Negeri 2 Kota Sukabumi
                    </label>
                    <p className="text-slate-500">
                      Logo ini akan muncul di Header atas, Sidebar menu, Profil Sekolah, dan Kop Cetak Surat.
                    </p>
                  </div>
                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: undefined }))}
                      className="text-xs text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                    >
                      Hapus Logo Kustom
                    </button>
                  )}
                </div>

                <div className="mt-4 flex flex-col sm:flex-row items-center gap-5">
                  {/* Logo Preview */}
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center p-2 overflow-hidden shadow-xs shrink-0">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Logo Sekolah"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-blue-700 text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                        2
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2.5 w-full">
                    {/* Hidden file input */}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logoUrl')}
                      className="hidden"
                    />

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => logoInputRef.current?.click()}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pilih Logo dari Komputer / HP</span>
                      </button>
                      <span className="text-[11px] text-slate-400">Format: PNG, JPG, WebP, SVG</span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] text-slate-500 block mb-1">Atau tempel Link URL Logo:</span>
                      <input
                        type="text"
                        value={formData.logoUrl || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://.../logo-smpn2.png"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Banner Gedung Utama (Hero Image) */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="space-y-1 mb-3">
                  <label className="font-bold text-slate-900 text-sm block">
                    2. Foto Gedung / Banner Utama Halaman Depan
                  </label>
                  <p className="text-slate-500">
                    Foto landscape yang ditampilkan sebagai latar utama profil sekolah (Jl. Ir. H. Juanda No. 14).
                  </p>
                </div>

                {/* Banner Preview */}
                <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-900 mb-3 shadow-xs">
                  <img
                    src={formData.heroImage}
                    alt="Preview Banner Gedung"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                    <button
                      type="button"
                      onClick={() => heroInputRef.current?.click()}
                      className="px-4 py-2 text-xs font-semibold text-white bg-blue-600/90 hover:bg-blue-600 rounded-lg backdrop-blur-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Ganti Foto Gedung</span>
                    </button>
                  </div>
                </div>

                <input
                  ref={heroInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'heroImage')}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    type="button"
                    onClick={() => heroInputRef.current?.click()}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                    <span>Upload Foto dari Komputer</span>
                  </button>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={formData.heroImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, heroImage: e.target.value }))}
                      placeholder="Atau masukkan Link URL Foto Gedung..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Foto Kepala Sekolah & Lab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Foto Kepala Sekolah */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <label className="font-bold text-slate-900 block">Foto Resmi Kepala Sekolah</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.kepalaSekolah.foto}
                      alt="Foto Kepala Sekolah"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="flex-1 space-y-1.5">
                      <input
                        ref={kepsekPhotoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'kepsekFoto')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => kepsekPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pilih Foto</span>
                      </button>
                      <input
                        type="text"
                        value={formData.kepalaSekolah.foto}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            kepalaSekolah: { ...prev.kepalaSekolah, foto: e.target.value }
                          }))
                        }
                        placeholder="Atau URL foto..."
                        className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Foto Lab / Fasilitas */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <label className="font-bold text-slate-900 block">Foto Fasilitas Lab / Perpustakaan</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.labImage}
                      alt="Foto Lab"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300 shrink-0"
                    />
                    <div className="flex-1 space-y-1.5">
                      <input
                        ref={labInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'labImage')}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => labInputRef.current?.click()}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pilih Foto</span>
                      </button>
                      <input
                        type="text"
                        value={formData.labImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, labImage: e.target.value }))}
                        placeholder="Atau URL foto lab..."
                        className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITAS & KONTAK */}
          {activeTab === 'identitas' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Satuan Pendidikan</label>
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Populer / Julukan</label>
                  <input
                    type="text"
                    value={formData.sebutan}
                    onChange={(e) => setFormData(prev => ({ ...prev, sebutan: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NPSN</label>
                  <input
                    type="text"
                    value={formData.npsn}
                    onChange={(e) => setFormData(prev => ({ ...prev, npsn: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NSS</label>
                  <input
                    type="text"
                    value={formData.nss}
                    onChange={(e) => setFormData(prev => ({ ...prev, nss: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status Akreditasi</label>
                  <input
                    type="text"
                    value={formData.akreditasi}
                    onChange={(e) => setFormData(prev => ({ ...prev, akreditasi: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nilai Akreditasi (Skor)</label>
                  <input
                    type="number"
                    value={formData.nilaiAkreditasi}
                    onChange={(e) => setFormData(prev => ({ ...prev, nilaiAkreditasi: Number(e.target.value) }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    value={formData.alamat}
                    onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.kodePos}
                    onChange={(e) => setFormData(prev => ({ ...prev, kodePos: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Telepon / Fax</label>
                  <input
                    type="text"
                    value={formData.telepon}
                    onChange={(e) => setFormData(prev => ({ ...prev, telepon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KEPALA SEKOLAH */}
          {activeTab === 'kepsek' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Kepala Sekolah & Gelar</label>
                  <input
                    type="text"
                    value={formData.kepalaSekolah.nama}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        kepalaSekolah: { ...prev.kepalaSekolah, nama: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">NIP Kepala Sekolah</label>
                  <input
                    type="text"
                    value={formData.kepalaSekolah.nip}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        kepalaSekolah: { ...prev.kepalaSekolah, nip: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Pangkat & Golongan</label>
                  <input
                    type="text"
                    value={formData.kepalaSekolah.pangkat}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        kepalaSekolah: { ...prev.kepalaSekolah, pangkat: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Teks Sambutan Kepala Sekolah</label>
                  <textarea
                    rows={5}
                    value={formData.kepalaSekolah.sambutan}
                    onChange={(e) =>
                      setFormData(prev => ({
                        ...prev,
                        kepalaSekolah: { ...prev.kepalaSekolah, sambutan: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 leading-relaxed"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISI & MISI */}
          {activeTab === 'visimisi' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">Visi Sekolah</label>
                <textarea
                  rows={3}
                  value={formData.visi}
                  onChange={(e) => setFormData(prev => ({ ...prev, visi: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 leading-relaxed font-medium"
                  required
                />
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-900 block">Daftar Misi Sekolah</label>
                  <button
                    type="button"
                    onClick={handleAddMisi}
                    className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Butir Misi</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.misi.map((m, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 h-8 rounded bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={m}
                        onChange={(e) => handleMisiChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMisi(idx)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                        title="Hapus Misi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SARANA & FASILITAS */}
          {activeTab === 'fasilitas' && (
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900">Kelola Fasilitas & Sarana Prasarana</h4>
                  <p className="text-slate-500">Sesuaikan daftar laboratorium, kelas, dan sarana unggulan</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFasilitas}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Fasilitas</span>
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {formData.fasilitas.map((f, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <span className="font-mono text-slate-400 font-semibold">{idx + 1}.</span>
                    <input
                      type="text"
                      value={f.nama}
                      onChange={(e) => handleFasilitasChange(idx, 'nama', e.target.value)}
                      placeholder="Nama fasilitas (contoh: Lab TIK)"
                      className="flex-1 px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                      required
                    />
                    <input
                      type="text"
                      value={f.kapasitas}
                      onChange={(e) => handleFasilitasChange(idx, 'kapasitas', e.target.value)}
                      placeholder="Kapasitas / Rincian"
                      className="w-44 px-2.5 py-1.5 text-xs rounded border border-slate-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFasilitas(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1.5 cursor-pointer py-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Default Sekolah</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>

        {showSuccessToast && (
          <div className="absolute top-4 right-4 z-50 bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profil dan Tampilan Sekolah Berhasil Disimpan!</span>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { Siswa, ProfilSekolahData } from '../types';
import { formatTanggalLahirIndo } from '../utils/dateHelper';
import {
  X,
  Printer,
  ShieldCheck,
  Edit2,
  Upload,
  CheckCircle2,
  Settings,
  Image as ImageIcon,
  UserCheck,
  Lock,
  Save,
  RotateCcw
} from 'lucide-react';

interface KartuPelajarModalProps {
  siswa: Siswa | null;
  onClose: () => void;
  profil?: ProfilSekolahData;
  isAdmin?: boolean;
  onOpenEditProfil?: () => void;
  onOpenAdminLogin?: () => void;
  onUpdateProfil?: (updated: ProfilSekolahData) => void;
}

export const KartuPelajarModal: React.FC<KartuPelajarModalProps> = ({
  siswa,
  onClose,
  profil,
  isAdmin = false,
  onOpenEditProfil,
  onOpenAdminLogin,
  onUpdateProfil
}) => {
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'logo' | 'kepsek' | 'kartu'>('logo');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Form states initialized from profil
  const [logoUrl, setLogoUrl] = useState(profil?.logoUrl || '');
  const [namaSekolah, setNamaSekolah] = useState(profil?.nama || 'SMP Negeri 2 Kota Sukabumi');
  const [npsn, setNpsn] = useState(profil?.npsn || '20221614');
  const [alamat, setAlamat] = useState(profil?.alamat || 'Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi');
  const [subHeaderDinas, setSubHeaderDinas] = useState(
    profil?.kartuPelajarSettings?.subHeaderDinas || 'Pemerintah Kota Sukabumi · Dinas Pendidikan & Kebudayaan'
  );
  const [namaKepsek, setNamaKepsek] = useState(profil?.kepalaSekolah?.nama || 'H. Yusuf Hidayat, M.Pd.');
  const [nipKepsek, setNipKepsek] = useState(profil?.kepalaSekolah?.nip || '19680512 199412 1 002');
  const [jabatanKepsek, setJabatanKepsek] = useState(
    profil?.kartuPelajarSettings?.jabatan || 'Kepala SMPN 2 Kota Sukabumi'
  );
  const [titimangsa, setTitimangsa] = useState(
    profil?.kartuPelajarSettings?.titimangsa || 'Sukabumi, Juli 2025'
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if profil prop updates
  useEffect(() => {
    if (profil) {
      setLogoUrl(profil.logoUrl || '');
      setNamaSekolah(profil.nama || 'SMP Negeri 2 Kota Sukabumi');
      setNpsn(profil.npsn || '20221614');
      setAlamat(profil.alamat || 'Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi');
      setNamaKepsek(profil.kepalaSekolah?.nama || 'H. Yusuf Hidayat, M.Pd.');
      setNipKepsek(profil.kepalaSekolah?.nip || '19680512 199412 1 002');
      if (profil.kartuPelajarSettings?.jabatan) {
        setJabatanKepsek(profil.kartuPelajarSettings.jabatan);
      }
      if (profil.kartuPelajarSettings?.titimangsa) {
        setTitimangsa(profil.kartuPelajarSettings.titimangsa);
      }
      if (profil.kartuPelajarSettings?.subHeaderDinas) {
        setSubHeaderDinas(profil.kartuPelajarSettings.subHeaderDinas);
      }
    }
  }, [profil]);

  if (!siswa) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Disarankan di bawah 2MB.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }

    if (profil && onUpdateProfil) {
      const updated: ProfilSekolahData = {
        ...profil,
        logoUrl: logoUrl.trim() ? logoUrl.trim() : undefined,
        nama: namaSekolah,
        npsn: npsn,
        alamat: alamat,
        kepalaSekolah: {
          ...profil.kepalaSekolah,
          nama: namaKepsek,
          nip: nipKepsek
        },
        kartuPelajarSettings: {
          titimangsa,
          jabatan: jabatanKepsek,
          subHeaderDinas
        }
      };
      onUpdateProfil(updated);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 2000);
      setIsEditingSettings(false);
    }
  };

  const handleTriggerEdit = () => {
    if (!isAdmin) {
      onOpenAdminLogin?.();
      return;
    }
    setIsEditingSettings(!isEditingSettings);
  };

  // Safe birthdate formatting (handles 41065.291666666664 as well as standard strings)
  const formattedTglLahir = formatTanggalLahirIndo(siswa.tanggalLahir);

  // Address line for card header
  const shortAddress = alamat.split(',')[0].trim();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 sm:p-6 my-auto">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4 no-print">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                Kartu Pelajar Digital Resmi
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                SMP Negeri 2 Kota Sukabumi · NISN: {siswa.nisn}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerEdit}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                isEditingSettings
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-300'
              }`}
              title={isAdmin ? "Edit Logo & Nama Kepala Sekolah" : "Login Admin untuk Edit Logo & Kepsek"}
            >
              {isAdmin ? (
                <>
                  <Edit2 className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isEditingSettings ? 'Tutup Pengaturan' : 'Edit Logo & Kepsek'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3 text-amber-600" />
                  <span className="text-[11px]">Edit Logo & Kepsek</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SETTINGS PANEL (Shown when Admin clicks Edit Logo & Kepsek) */}
        {isEditingSettings && (
          <div className="mb-5 p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-3 no-print">
            <div className="flex items-center justify-between pb-2 border-b border-blue-200">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-bold text-slate-900">
                  Pengaturan Logo Sekolah & Kepala Sekolah
                </h4>
              </div>
              <span className="text-[10px] text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                Admin Mode
              </span>
            </div>

            {/* Quick Tabs in Settings */}
            <div className="flex items-center gap-2 text-xs font-medium border-b border-blue-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('logo')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'logo'
                    ? 'bg-blue-700 text-white font-bold'
                    : 'text-slate-600 hover:bg-blue-100'
                }`}
              >
                1. Logo & Identitas
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kepsek')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'kepsek'
                    ? 'bg-blue-700 text-white font-bold'
                    : 'text-slate-600 hover:bg-blue-100'
                }`}
              >
                2. Kepala Sekolah & TTD
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('kartu')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  activeTab === 'kartu'
                    ? 'bg-blue-700 text-white font-bold'
                    : 'text-slate-600 hover:bg-blue-100'
                }`}
              >
                3. Tanggal & Titimangsa
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              {/* TAB 1: LOGO */}
              {activeTab === 'logo' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border border-slate-300 bg-white p-1 flex items-center justify-center shrink-0 shadow-xs">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-700 text-white font-bold text-lg flex items-center justify-center">
                          2
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-blue-600" />
                          <span>Pilih File Logo (PNG/JPG)</span>
                        </button>
                        {logoUrl && (
                          <button
                            type="button"
                            onClick={() => setLogoUrl('')}
                            className="text-[11px] text-rose-600 hover:underline cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="Atau tempel Link URL logo (https://...)..."
                        className="w-full px-2.5 py-1 text-[11px] rounded border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Nama Sekolah</label>
                      <input
                        type="text"
                        value={namaSekolah}
                        onChange={(e) => setNamaSekolah(e.target.value)}
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">NPSN</label>
                      <input
                        type="text"
                        value={npsn}
                        onChange={(e) => setNpsn(e.target.value)}
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-mono"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Alamat Singkat Header</label>
                    <input
                      type="text"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: KEPALA SEKOLAH */}
              {activeTab === 'kepsek' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                        Nama Kepala Sekolah & Gelar
                      </label>
                      <input
                        type="text"
                        value={namaKepsek}
                        onChange={(e) => setNamaKepsek(e.target.value)}
                        placeholder="Contoh: H. Yusuf Hidayat, M.Pd."
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-medium"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                        NIP Kepala Sekolah
                      </label>
                      <input
                        type="text"
                        value={nipKepsek}
                        onChange={(e) => setNipKepsek(e.target.value)}
                        placeholder="Contoh: 19680512 199412 1 002"
                        className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white font-mono"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                      Jabatan Penandatangan Kartu
                    </label>
                    <input
                      type="text"
                      value={jabatanKepsek}
                      onChange={(e) => setJabatanKepsek(e.target.value)}
                      placeholder="Contoh: Kepala SMPN 2 Kota Sukabumi"
                      className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: TITIMANGSA & KOP */}
              {activeTab === 'kartu' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                      Titimangsa Kota & Tanggal Kartu
                    </label>
                    <input
                      type="text"
                      value={titimangsa}
                      onChange={(e) => setTitimangsa(e.target.value)}
                      placeholder="Contoh: Sukabumi, Juli 2025"
                      className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">
                      Subheader Dinas Pendidikan (Baris Atas)
                    </label>
                    <input
                      type="text"
                      value={subHeaderDinas}
                      onChange={(e) => setSubHeaderDinas(e.target.value)}
                      placeholder="Pemerintah Kota Sukabumi · Dinas Pendidikan & Kebudayaan"
                      className="w-full px-2.5 py-1 rounded border border-slate-300 bg-white text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* Save & Reset Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                <button
                  type="button"
                  onClick={() => {
                    setNamaKepsek('H. Yusuf Hidayat, M.Pd.');
                    setNipKepsek('19680512 199412 1 002');
                    setNamaSekolah('SMP Negeri 2 Kota Sukabumi');
                    setNpsn('20221614');
                    setAlamat('Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi');
                    setJabatanKepsek('Kepala SMPN 2 Kota Sukabumi');
                    setTitimangsa('Sukabumi, Juli 2025');
                  }}
                  className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Isian</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingSettings(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Terapkan & Simpan</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* KARTU PELAJAR FRONT LAYOUT */}
        <div className="relative rounded-xl overflow-hidden border-2 border-blue-900 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-5 shadow-lg print:border-black print:text-black">
          {/* Subtle watermark background */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none select-none">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="w-48 h-48 object-contain filter grayscale" />
            ) : (
              <div className="w-48 h-48 rounded-full border-8 border-white flex items-center justify-center text-8xl font-black">
                2
              </div>
            )}
          </div>

          {/* Header Kartu */}
          <div className="relative z-10 flex items-center gap-3 pb-3 border-b border-white/20">
            {logoUrl ? (
              <div className="w-11 h-11 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-xs border border-white/30">
                <img
                  src={logoUrl}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white text-blue-900 font-extrabold flex items-center justify-center text-xl shrink-0 shadow-xs">
                2
              </div>
            )}
            <div>
              <p className="text-[10px] tracking-wider uppercase text-blue-200 leading-tight">
                {subHeaderDinas}
              </p>
              <h3 className="text-sm font-bold tracking-tight text-white uppercase">
                {namaSekolah}
              </h3>
              <p className="text-[9px] text-blue-100 font-mono">
                {shortAddress} · NPSN {npsn}
              </p>
            </div>
          </div>

          <div className="relative z-10 text-center my-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-400 text-blue-950 px-3 py-0.5 rounded-full inline-block shadow-xs">
              KARTU TANDA PELAJAR
            </span>
          </div>

          {/* Body Kartu */}
          <div className="relative z-10 flex gap-4 items-start pt-1">
            {/* Foto Siswa */}
            <div className="w-24 h-32 rounded-lg bg-blue-100/10 border-2 border-white/40 flex flex-col items-center justify-center text-center p-2 shrink-0">
              {siswa.fotoUrl ? (
                <img
                  src={siswa.fotoUrl}
                  alt={siswa.nama}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-700/80 text-white flex items-center justify-center font-bold text-lg mb-1">
                    {siswa.nama.slice(0, 1)}
                  </div>
                  <span className="text-[9px] text-white/80 uppercase font-mono">Pasfoto 3x4</span>
                </>
              )}
            </div>

            {/* Biodata Siswa */}
            <div className="flex-1 space-y-1 text-xs">
              <div>
                <span className="text-[9px] text-blue-200 block uppercase">Nama Lengkap</span>
                <span className="font-bold text-white text-sm block leading-tight">{siswa.nama}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">NISN</span>
                  <span className="font-mono font-bold text-white">{siswa.nisn}</span>
                </div>
                <div>
                  <span className="text-[9px] text-blue-200 block uppercase">NIS / Kelas</span>
                  <span className="font-mono font-semibold text-white">
                    {siswa.nis} ({siswa.kelas})
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[9px] text-blue-200 block uppercase">Tempat, Tanggal Lahir</span>
                <span className="text-white text-[11px] font-medium">
                  {siswa.tempatLahir}, {formattedTglLahir}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-blue-200 block uppercase">Alamat</span>
                <span className="text-white/90 text-[10px] line-clamp-1">{siswa.alamat}</span>
              </div>
            </div>
          </div>

          {/* Footer Kartu & TTD Kepala Sekolah */}
          <div className="relative z-10 mt-4 pt-3 border-t border-white/20 flex items-end justify-between">
            <div>
              <div className="font-mono tracking-widest text-[10px] text-white/70">
                ||| | |||| | ||||| ||| |||| ||||
              </div>
              <span className="text-[9px] text-blue-200 font-mono">BARCODE VERIFIKASI ID #{siswa.nisn}</span>
            </div>

            <div className="text-right text-[9px] leading-tight text-white/90">
              <p>{titimangsa}</p>
              <p className="font-semibold">{jabatanKepsek}</p>
              <div className="h-6 flex items-center justify-end">
                {/* Signature blank space */}
              </div>
              <p className="font-bold underline text-white text-[10px]">{namaKepsek}</p>
              <p className="font-mono text-white/70">NIP {nipKepsek}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Format Standar PVC 85 x 54 mm
            </span>
            {onOpenEditProfil && isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditProfil();
                }}
                className="text-[11px] text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Buka Profil Sekolah Lengkap</span>
              </button>
            )}
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
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
          </div>
        </div>

        {/* Success toast */}
        {showSavedToast && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Logo dan Data Kepala Sekolah berhasil diperbarui dan tersimpan ke sistem!</span>
          </div>
        )}
      </div>
    </div>
  );
};

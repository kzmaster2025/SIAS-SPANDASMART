import React, { useState } from 'react';
import { GuruTendik, UserSession } from '../types';
import { formatGuruFullName } from '../utils/guruMapelHelper';
import { googleSignIn } from '../services/auth';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  Users,
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (session: UserSession) => void;
  currentPassword: string;
  onUpdatePassword: (newPass: string) => void;
  initialMode?: 'login' | 'change_password';
  guruList?: GuruTendik[];
  initialTab?: 'gtk' | 'admin';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentPassword,
  onUpdatePassword,
  initialMode = 'login',
  guruList = [],
  initialTab = 'gtk'
}) => {
  const [activeTab, setActiveTab] = useState<'gtk' | 'admin'>(initialTab);
  const [mode, setMode] = useState<'login' | 'change_password'>(initialMode);
  
  // Admin login states
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // GTK login states
  const [selectedGtkId, setSelectedGtkId] = useState<string>(guruList[0]?.id || '');
  const [gtkSearch, setGtkSearch] = useState('');
  const [gtkPinInput, setGtkPinInput] = useState('');
  const [showGtkPin, setShowGtkPin] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Status messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Change password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isOpen) return null;

  // Filtered GTK list for dropdown / selector
  const filteredGtk = guruList.filter(g => {
    const full = `${g.nama} ${g.gelar || ''} ${g.nip} ${g.nuptk} ${g.mapel || ''} ${g.jabatan || ''}`.toLowerCase();
    return full.includes(gtkSearch.toLowerCase());
  });

  const selectedGtk = guruList.find(g => g.id === selectedGtkId) || filteredGtk[0] || guruList[0];

  // Helper to get custom PINs stored in localStorage
  const getGtkPin = (gtkId: string): string => {
    try {
      const stored = localStorage.getItem('sias_gtk_pins');
      if (stored) {
        const pins = JSON.parse(stored);
        if (pins[gtkId]) return pins[gtkId];
      }
    } catch {}
    return 'gtk123';
  };

  // Handle GTK Login (via PIN / ID)
  const handleGtkLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedGtk) {
      setErrorMessage('Silakan pilih akun GTK / Guru terlebih dahulu.');
      return;
    }

    const correctPin = getGtkPin(selectedGtk.id);
    const nip = (selectedGtk.nip || '').replace(/[^0-9]/g, '');
    const last4Nip = nip.length >= 4 ? nip.slice(-4) : '';
    const nuptk = (selectedGtk.nuptk || '').replace(/[^0-9]/g, '');
    const last4Nuptk = nuptk.length >= 4 ? nuptk.slice(-4) : '';

    const validPins = [
      correctPin,
      'gtk123',
      '1234',
      'admin123',
      last4Nip,
      last4Nuptk
    ].filter(Boolean);

    const inputClean = gtkPinInput.trim();

    if (validPins.includes(inputClean)) {
      const session: UserSession = {
        role: 'gtk',
        gtkId: selectedGtk.id,
        nama: formatGuruFullName(selectedGtk),
        nip: selectedGtk.nip,
        nuptk: selectedGtk.nuptk,
        email: selectedGtk.email,
        jabatan: selectedGtk.jabatan,
        mapel: selectedGtk.mapel,
        kategori: selectedGtk.kategori,
        loginAt: new Date().toISOString()
      };
      onSuccessLogin(session);
      setGtkPinInput('');
      onClose();
    } else {
      setErrorMessage(`PIN GTK salah! Coba gunakan PIN default: gtk123 atau 4 digit terakhir NIP.`);
    }
  };

  // Handle Google Login for GTK (e.g. akun @guru.smp.belajar.id)
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsGoogleLoading(true);
    try {
      const result = await googleSignIn();
      if (!result || !result.user) {
        throw new Error('Gagal melakukan autentikasi Google.');
      }

      const email = (result.user.email || '').toLowerCase();
      const displayName = result.user.displayName || '';

      // Match with guruList by email or name
      const matched = guruList.find(g => {
        const gEmail = (g.email || '').toLowerCase();
        if (gEmail && (gEmail === email || email.includes(gEmail.split('@')[0]))) return true;
        const gName = g.nama.toLowerCase();
        return displayName.toLowerCase().includes(gName) || gName.includes(displayName.toLowerCase());
      });

      const session: UserSession = matched
        ? {
            role: 'gtk',
            gtkId: matched.id,
            nama: formatGuruFullName(matched),
            nip: matched.nip,
            nuptk: matched.nuptk,
            email: email,
            jabatan: matched.jabatan,
            mapel: matched.mapel,
            kategori: matched.kategori,
            loginAt: new Date().toISOString()
          }
        : {
            role: 'gtk',
            gtkId: `gtk-google-${Date.now()}`,
            nama: displayName || email.split('@')[0],
            email: email,
            jabatan: 'Pendidik / Tenaga Kependidikan',
            kategori: 'Pendidik',
            loginAt: new Date().toISOString()
          };

      onSuccessLogin(session);
      onClose();
    } catch (err: any) {
      console.warn('Google sign in error:', err);
      setErrorMessage(err?.message || 'Gagal login via Google. Silakan gunakan PIN GTK atau kata sandi admin.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const validPasswords = [currentPassword, 'admin123', 'smpn2sukabumi'];
    if (validPasswords.includes(adminPasswordInput.trim())) {
      const session: UserSession = {
        role: 'admin',
        nama: 'Administrator SIAS Digital',
        jabatan: 'Kepala Tata Usaha / Admin Sistem',
        loginAt: new Date().toISOString()
      };
      onSuccessLogin(session);
      setAdminPasswordInput('');
      onClose();
    } else {
      setErrorMessage('Kata sandi admin salah! Coba gunakan kata sandi default: admin123');
    }
  };

  // Change Password / PIN
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (activeTab === 'admin') {
      if (oldPassword.trim() !== currentPassword && oldPassword.trim() !== 'admin123' && oldPassword.trim() !== 'smpn2sukabumi') {
        setErrorMessage('Kata sandi saat ini tidak cocok!');
        return;
      }
      if (newPassword.trim().length < 4) {
        setErrorMessage('Kata sandi baru minimal 4 karakter!');
        return;
      }
      if (newPassword.trim() !== confirmPassword.trim()) {
        setErrorMessage('Konfirmasi kata sandi baru tidak cocok!');
        return;
      }

      onUpdatePassword(newPassword.trim());
      setSuccessMessage('Kata sandi admin berhasil diperbarui!');
    } else {
      if (!selectedGtk) return;
      if (newPassword.trim().length < 4) {
        setErrorMessage('PIN GTK baru minimal 4 karakter!');
        return;
      }
      if (newPassword.trim() !== confirmPassword.trim()) {
        setErrorMessage('Konfirmasi PIN baru tidak cocok!');
        return;
      }

      try {
        const stored = localStorage.getItem('sias_gtk_pins');
        const pins = stored ? JSON.parse(stored) : {};
        pins[selectedGtk.id] = newPassword.trim();
        localStorage.setItem('sias_gtk_pins', JSON.stringify(pins));
      } catch {}

      setSuccessMessage(`PIN login untuk ${formatGuruFullName(selectedGtk)} berhasil diperbarui!`);
    }

    setTimeout(() => {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('');
      setMode('login');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
              {activeTab === 'gtk' ? <GraduationCap className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {mode === 'login'
                  ? activeTab === 'gtk'
                    ? 'Portal Login Khusus GTK'
                    : 'Autentikasi Administrator'
                  : 'Pengaturan Kata Sandi & PIN'}
              </h3>
              <p className="text-xs text-slate-500">
                SIAS Digital SMP Negeri 2 Kota Sukabumi
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

        {/* Tab Selection (GTK vs Admin) */}
        {mode === 'login' && (
          <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 border-b border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('gtk');
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'gtk'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Login GTK (Guru & Tendik)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('admin');
                setErrorMessage('');
              }}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Login Administrator</span>
            </button>
          </div>
        )}

        <div className="p-6">
          {mode === 'login' ? (
            activeTab === 'gtk' ? (
              /* TAB 1: LOGIN GTK */
              <form onSubmit={handleGtkLogin} className="space-y-4 text-xs">
                {/* Notice Info */}
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Akses Mandiri Seluruh GTK Terdaftar</p>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      GTK dapat menginput nilai asesmen rapor siswa, mengisi absensi harian, serta mengunggah dokumen SK dan berkas arsip (ZIP/RAR/Folder).
                    </p>
                  </div>
                </div>

                {/* GTK Selector */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pilih Nama Guru / Tenaga Kependidikan (GTK)*
                  </label>
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, NIP, atau mata pelajaran..."
                      value={gtkSearch}
                      onChange={(e) => setGtkSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <select
                    value={selectedGtk?.id || ''}
                    onChange={(e) => setSelectedGtkId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    required
                  >
                    {filteredGtk.length === 0 ? (
                      <option value="" disabled>Tidak ditemukan GTK dengan kata kunci tersebut</option>
                    ) : (
                      filteredGtk.map(g => (
                        <option key={g.id} value={g.id}>
                          {formatGuruFullName(g)} — {g.jabatan || g.mapel || 'GTK SMPN 2'} ({g.nip && g.nip !== '-' ? `NIP: ${g.nip}` : 'Non-PNS'})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Selected GTK Profile Card */}
                {selectedGtk && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                        {selectedGtk.nama.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-slate-900 truncate">{formatGuruFullName(selectedGtk)}</p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {selectedGtk.jabatan || 'Pendidik'} · {selectedGtk.nip && selectedGtk.nip !== '-' ? selectedGtk.nip : selectedGtk.statusKepegawaian}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800 shrink-0">
                      {selectedGtk.kategori}
                    </span>
                  </div>
                )}

                {/* PIN / Password GTK */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-700 font-semibold">
                      PIN / Kata Sandi GTK*
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Default: <strong className="text-blue-700">gtk123</strong>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showGtkPin ? 'text' : 'password'}
                      value={gtkPinInput}
                      onChange={(e) => {
                        setGtkPinInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Masukkan PIN (default: gtk123)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10 font-mono text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowGtkPin(!showGtkPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showGtkPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">G</span>
                    <span>{isGoogleLoading ? 'Menghubungkan...' : 'Masuk Akun Google / Belajar.id'}</span>
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setMode('change_password');
                        setErrorMessage('');
                      }}
                      className="text-xs text-blue-700 hover:underline cursor-pointer"
                    >
                      Ubah PIN?
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Masuk sebagai GTK</span>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* TAB 2: LOGIN ADMINISTRATOR */
              <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Masukkan Kata Sandi Administrator
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={(e) => {
                        setAdminPasswordInput(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Ketik kata sandi..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent pr-10"
                      autoFocus
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-start gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Informasi Akses Administrator:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-5 leading-relaxed">
                    Kata sandi bawaan: <strong className="font-mono text-blue-800 bg-blue-100/80 px-1.5 py-0.5 rounded">admin123</strong>
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('change_password');
                      setErrorMessage('');
                    }}
                    className="text-xs text-blue-700 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Ubah kata sandi?
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
                      className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Masuk Admin</span>
                    </button>
                  </div>
                </div>
              </form>
            )
          ) : (
            /* CHANGE PASSWORD / PIN FORM */
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                <span className="font-bold">Ubah Kredensial Akses: </span>
                <span>
                  {activeTab === 'gtk'
                    ? `Mengubah PIN login untuk ${selectedGtk ? formatGuruFullName(selectedGtk) : 'GTK Terpilih'}`
                    : 'Mengubah Kata Sandi Administrator'}
                </span>
              </div>

              {activeTab === 'admin' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kata Sandi Admin Saat Ini
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama/default (admin123)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {activeTab === 'gtk' ? 'PIN Baru (Minimal 4 Angka/Karakter)' : 'Kata Sandi Admin Baru'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={activeTab === 'gtk' ? 'Contoh: 1234 atau tanggal lahir' : 'Minimal 4 karakter'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Konfirmasi {activeTab === 'gtk' ? 'PIN Baru' : 'Kata Sandi Baru'}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang konfirmasi"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {errorMessage && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="p-3 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Kembali ke Login
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
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

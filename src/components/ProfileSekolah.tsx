import React from 'react';
import { ProfilSekolahData } from '../types';
import {
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Building2,
  Compass,
  ArrowUpRight,
  Edit3,
  Lock,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface ProfileSekolahProps {
  onNavigateToTab: (tab: any) => void;
  profil: ProfilSekolahData;
  isAdmin: boolean;
  onOpenEdit: () => void;
  onOpenAdminLogin: () => void;
}

export const ProfileSekolah: React.FC<ProfileSekolahProps> = ({
  onNavigateToTab,
  profil,
  isAdmin,
  onOpenEdit,
  onOpenAdminLogin
}) => {
  return (
    <div className="space-y-8">
      {/* Admin Action Bar Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isAdmin ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {isAdmin ? 'Mode Administrator Aktif' : 'Mode Publik / Pengunjung'}
              </span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {isAdmin ? 'Akses Penuh Edit' : 'Hanya Lihat'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAdmin
                ? 'Anda dapat mengubah logo sekolah, gambar gedung utama, foto kepala sekolah, dan data profil sekolah.'
                : 'Masuk sebagai admin untuk mengedit halaman profil, mengganti logo, dan foto gedung.'}
            </p>
          </div>
        </div>

        <div>
          {isAdmin ? (
            <button
              onClick={onOpenEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profil, Logo & Foto</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-blue-700" />
              <span>Masuk Admin untuk Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
        <div className="relative h-72 sm:h-84 md:h-96 w-full">
          <img
            src={profil.heroImage}
            alt={`Gedung ${profil.nama}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent" />
          
          {/* Quick Edit Overlay for Admin on Hero */}
          <div className="absolute top-4 right-4">
            {isAdmin ? (
              <button
                onClick={onOpenEdit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900/80 hover:bg-slate-900 border border-white/20 backdrop-blur-md rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                <span>Ganti Foto Gedung & Logo</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-900 border border-white/10 backdrop-blur-md rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Kunci Admin</span>
              </button>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mb-2.5">
              <span className="font-semibold tracking-wide uppercase bg-blue-600/60 px-2 py-0.5 rounded text-[10px] backdrop-blur-xs">
                Profil Satuan Pendidikan
              </span>
              <span aria-hidden="true">·</span>
              <span>NPSN {profil.npsn}</span>
              <span aria-hidden="true">·</span>
              <span>Akreditasi {profil.akreditasi}</span>
              <span aria-hidden="true">·</span>
              <span>Berdiri Sejak {profil.tahunBerdiri}</span>
            </div>
            
            <div className="flex items-center gap-4 mb-2">
              {profil.logoUrl ? (
                <img
                  src={profil.logoUrl}
                  alt="Logo Sekolah"
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain bg-white/95 p-1.5 shadow-lg shrink-0 border border-white/20"
                />
              ) : (
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-700 border-2 border-white/40 text-white font-bold text-2xl flex items-center justify-center shadow-lg shrink-0">
                  2
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white max-w-3xl">
                  {profil.nama}
                </h1>
                <p className="text-xs sm:text-sm text-blue-200 font-medium">
                  {profil.sebutan} · {profil.dinas}
                </p>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{profil.alamat}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Identitas Sekolah & Sambutan Kepala Sekolah */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Identitas Resmi */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Identitas Resmi Satuan Pendidikan</h2>
              <p className="text-xs text-slate-500 mt-0.5">Data terdaftar di Kemendikbudristek & Disdikbud Kota Sukabumi</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-semibold">
              <Award className="w-4 h-4" />
              <span>Akreditasi {profil.akreditasi} ({profil.nilaiAkreditasi})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Nama Satuan Pendidikan</span>
              <span className="font-semibold text-slate-800 text-sm">{profil.nama}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Nama Populer / Julukan</span>
              <span className="font-semibold text-slate-800 text-sm">{profil.sebutan}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">NPSN & NSS</span>
              <span className="font-mono font-semibold text-slate-800 text-sm">
                {profil.npsn} / {profil.nss}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Kurikulum Diterapkan</span>
              <span className="font-semibold text-slate-800">{profil.kurikulum}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block mb-1">Alamat Domisili Sekolah</span>
              <span className="font-medium text-slate-800 leading-relaxed">
                {profil.alamat} (Kode Pos: {profil.kodePos})
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Kontak Telepon / Fax</span>
              <span className="font-mono font-medium text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {profil.telepon}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Surat Elektronik (Email)</span>
              <span className="font-mono font-medium text-slate-800 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {profil.email}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>SK Akreditasi: {profil.noSkAkreditasi}</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateToTab('kesiswaan')}
                className="text-blue-700 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Data Siswa</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab('guru')}
                className="text-blue-700 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Daftar Guru GTK</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sambutan Kepala Sekolah */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 mb-4">
              <img
                src={profil.kepalaSekolah.foto}
                alt={profil.kepalaSekolah.nama}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{profil.kepalaSekolah.nama}</h3>
                <p className="text-xs text-blue-700 font-medium">Kepala {profil.nama}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">NIP: {profil.kepalaSekolah.nip}</p>
                <p className="text-[10px] text-slate-400">{profil.kepalaSekolah.pangkat}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/70 p-4 rounded-lg border border-slate-100">
              "{profil.kepalaSekolah.sambutan}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>{profil.dinas}</span>
            <span className="font-mono">{profil.provinsi}</span>
          </div>
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block mb-1">
            Arah & Panduan Pendidikan
          </span>
          <h2 className="text-lg font-bold text-slate-900">Visi & Misi Satuan Pendidikan</h2>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide mb-1">Visi Sekolah</p>
          <p className="text-sm font-medium text-slate-800 leading-relaxed">
            "{profil.visi}"
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Misi Sekolah</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {profil.misi.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed"
              >
                <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono text-[11px]">
                  {index + 1}
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sarana & Prasarana dengan Visual Foto */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sarana & Prasarana Digital</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fasilitas pembelajaran berstandar nasional mendukung Kurikulum Merdeka & Adiwiyata
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 font-mono tabular-nums">
            <Building2 className="w-4 h-4 text-blue-700" />
            <span>27 Rombel · {profil.fasilitas.length} Fasilitas Utama</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
            <img
              src={profil.labImage}
              alt={`Laboratorium & Perpustakaan Digital ${profil.nama}`}
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover"
            />
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Pustaka & Lab Komputer TIK {profil.sebutan}</span>
              <p className="text-slate-500 mt-0.5">Dukungan asesmen nasional berbasis komputer (ANBK) & literasi digital.</p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profil.fasilitas.map((f, i) => (
              <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900 mb-1">
                  <span>{f.nama}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <div className="text-[11px] text-slate-500">
                  <span>{f.kapasitas}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peta Lokasi & Geografis */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-700" />
              <span>Lokasi Strategis Kampus Sekolah</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kawasan pendidikan di pusat Kota Sukabumi, berdampingan dengan instansi pemerintahan kota
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Koordinat: {profil.koordinat}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Aksesibilitas & Petunjuk Arah:</p>
            <p>Terletak di {profil.alamat}, dekat dengan Balai Kota Sukabumi dan Lapangan Merdeka.</p>
            <p className="text-slate-500">Dapat diakses dengan angkutan kota trayek Cikole - Juanda.</p>
          </div>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(profil.nama + ' ' + profil.alamat)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap shadow-xs cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Buka di Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};

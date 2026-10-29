import React from 'react';
import { PROFIL_SEKOLAH } from '../data/mockData';
import {
  MapPin,
  Phone,
  Mail,
  Award,
  CheckCircle2,
  Building2,
  BookOpenCheck,
  Compass,
  ArrowUpRight
} from 'lucide-react';

interface ProfileSekolahProps {
  onNavigateToTab: (tab: any) => void;
}

export const ProfileSekolah: React.FC<ProfileSekolahProps> = ({ onNavigateToTab }) => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
        <div className="relative h-72 sm:h-84 md:h-96 w-full">
          <img
            src={PROFIL_SEKOLAH.heroImage}
            alt="Gedung SMP Negeri 2 Kota Sukabumi"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mb-2">
              <span className="font-semibold tracking-wide uppercase">Profil Lembaga Pendidikan</span>
              <span aria-hidden="true">·</span>
              <span>NPSN {PROFIL_SEKOLAH.npsn}</span>
              <span aria-hidden="true">·</span>
              <span>Akreditasi {PROFIL_SEKOLAH.akreditasi}</span>
              <span aria-hidden="true">·</span>
              <span>Berdiri Sejak {PROFIL_SEKOLAH.tahunBerdiri}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 max-w-3xl">
              SMP Negeri 2 Kota Sukabumi
            </h1>
            
            <p className="text-sm sm:text-base text-slate-200 max-w-2xl flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Jl. Ir. H. Juanda No. 14, Kelurahan Cikole, Kecamatan Cikole, Kota Sukabumi, Jawa Barat</span>
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
              <span>Akreditasi A ({PROFIL_SEKOLAH.nilaiAkreditasi})</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Nama Satuan Pendidikan</span>
              <span className="font-semibold text-slate-800 text-sm">{PROFIL_SEKOLAH.nama}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Nama Populer / Julukan</span>
              <span className="font-semibold text-slate-800 text-sm">{PROFIL_SEKOLAH.sebutan}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">NPSN & NSS</span>
              <span className="font-mono font-semibold text-slate-800 text-sm">
                {PROFIL_SEKOLAH.npsn} / {PROFIL_SEKOLAH.nss}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Kurikulum Diterapkan</span>
              <span className="font-semibold text-slate-800">{PROFIL_SEKOLAH.kurikulum}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block mb-1">Alamat Domisili Sekolah</span>
              <span className="font-medium text-slate-800 leading-relaxed">
                {PROFIL_SEKOLAH.alamat} (Kode Pos: {PROFIL_SEKOLAH.kodePos})
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Kontak Telepon / Fax</span>
              <span className="font-mono font-medium text-slate-800 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {PROFIL_SEKOLAH.telepon}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block mb-1">Surat Elektronik (Email)</span>
              <span className="font-mono font-medium text-slate-800 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {PROFIL_SEKOLAH.email}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>SK Akreditasi: {PROFIL_SEKOLAH.noSkAkreditasi}</span>
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
                src={PROFIL_SEKOLAH.kepalaSekolah.foto}
                alt={PROFIL_SEKOLAH.kepalaSekolah.nama}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0"
              />
              <div>
                <h3 className="text-sm font-bold text-slate-900">{PROFIL_SEKOLAH.kepalaSekolah.nama}</h3>
                <p className="text-xs text-blue-700 font-medium">Kepala SMP Negeri 2 Kota Sukabumi</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">NIP: {PROFIL_SEKOLAH.kepalaSekolah.nip}</p>
                <p className="text-[10px] text-slate-400">{PROFIL_SEKOLAH.kepalaSekolah.pangkat}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50/70 p-4 rounded-lg border border-slate-100">
              "{PROFIL_SEKOLAH.kepalaSekolah.sambutan}"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Dinas Pendidikan dan Kebudayaan Kota Sukabumi</span>
            <span className="font-mono">Jawa Barat</span>
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
            "{PROFIL_SEKOLAH.visi}"
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Misi Sekolah</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PROFIL_SEKOLAH.misi.map((item, index) => (
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
            <span>27 Rombel · 10 Fasilitas Utama</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
            <img
              src={PROFIL_SEKOLAH.labImage}
              alt="Laboratorium Komputer & Perpustakaan Digital SMPN 2 Sukabumi"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover"
            />
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Pustaka & Lab Komputer TIK Spenda Sukabumi</span>
              <p className="text-slate-500 mt-0.5">Dukungan asesmen nasional berbasis komputer (ANBK) & literasi digital.</p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROFIL_SEKOLAH.fasilitas.map((f, i) => (
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
            Koordinat: {PROFIL_SEKOLAH.koordinat}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Aksesibilitas & Petunjuk Arah:</p>
            <p>Terletak di Jl. Ir. H. Juanda No. 14, Cikole (Dago Sukabumi), 200 meter dari Balai Kota Sukabumi dan Lapangan Merdeka.</p>
            <p className="text-slate-500">Dapat diakses dengan angkutan kota trayek 01, 04, dan 14 melintasi koridor Cikole - Juanda.</p>
          </div>
          <a
            href="https://maps.google.com/?q=SMP+Negeri+2+Kota+Sukabumi"
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

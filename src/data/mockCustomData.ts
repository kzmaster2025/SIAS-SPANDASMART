import { CustomMenu, CustomMenuItem } from '../types';

export const INITIAL_CUSTOM_MENUS: CustomMenu[] = [
  {
    id: 'menu-galeri-kegiatan',
    label: 'Galeri Video & Kegiatan',
    deskripsi: 'Dokumentasi video upacara, ekstrakurikuler, dan kegiatan Projek P5 SMP Negeri 2 Kota Sukabumi.',
    iconName: 'Video',
    adminOnly: false,
    order: 1,
    createdAt: '2026-10-01'
  },
  {
    id: 'menu-portal-tautan',
    label: 'Portal Tautan & Media',
    deskripsi: 'Pusat akses cepat tautan resmi kemdikbud, platform belajar guru, dan materi ajar digital.',
    iconName: 'Link',
    adminOnly: false,
    order: 2,
    createdAt: '2026-10-10'
  }
];

export const INITIAL_CUSTOM_ITEMS: CustomMenuItem[] = [
  // Items for 'menu-galeri-kegiatan'
  {
    id: 'item-video-1',
    menuId: 'menu-galeri-kegiatan',
    tipe: 'video',
    judul: 'Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5)',
    deskripsi: 'Dokumentasi pameran kewirausahaan dan kreasi seni siswa SMP Negeri 2 Kota Sukabumi dengan tema Kearifan Lokal Sukabumi.',
    kategori: 'Kurikulum & P5',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    videoDuration: '04:15',
    tanggal: '2026-10-20',
    uploader: 'Waka Kesiswaan & Kurikulum'
  },
  {
    id: 'item-video-2',
    menuId: 'menu-galeri-kegiatan',
    tipe: 'video',
    judul: 'Peringatan Hari Guru Nasional & Upacara Bendera Khidmat',
    deskripsi: 'Liputan prosesi upacara bendera memperingati Hari Guru di lapangan utama SMP Negeri 2 Kota Sukabumi dipimpin oleh Kepala Sekolah.',
    kategori: 'Upacara & OSIS',
    videoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4',
    videoDuration: '03:40',
    tanggal: '2026-10-15',
    uploader: 'Pembina OSIS'
  },
  {
    id: 'item-gambar-1',
    menuId: 'menu-galeri-kegiatan',
    tipe: 'gambar',
    judul: 'Dokumentasi Apel Pagi dan Gerakan Sekolah Sehat (GSS)',
    deskripsi: 'Seluruh peserta didik dan GTK melaksanakan senam pagi bersama serta sarapan sehat bersama di halaman sekolah.',
    kategori: 'Kesiswaan & PHBS',
    gambarUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80',
    caption: 'Suasana riang siswa-siswi kelas 7, 8, dan 9 saat Gerakan Sekolah Sehat',
    tanggal: '2026-10-18',
    uploader: 'Tim UKS & Olahraga'
  },
  {
    id: 'item-gambar-2',
    menuId: 'menu-galeri-kegiatan',
    tipe: 'gambar',
    judul: 'Laboratorium Komputer & Asesmen Berbasis Komputer (ANBK)',
    deskripsi: 'Kesiapan fasilitas sarana lab komputer mutakhir dalam pelaksanaan gladi bersih simulasi ANBK SMPN 2 Kota Sukabumi.',
    kategori: 'Sarana & Asesmen',
    gambarUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Fasilitas Lab Komputer 1 ber-AC dengan koneksi internet Gigabit',
    tanggal: '2026-10-12',
    uploader: 'Kepala Lab TIK'
  },
  {
    id: 'item-tautan-1',
    menuId: 'menu-galeri-kegiatan',
    tipe: 'tautan',
    judul: 'Kanal YouTube Resmi Spandasmart Sukabumi',
    deskripsi: 'Ikuti siaran langsung kegiatan sekolah, video karya seni tari, dan podcast inspiratif peserta didik.',
    kategori: 'Media Sosial Sekolah',
    tautanUrl: 'https://www.youtube.com',
    tautanLabel: 'Buka Kanal YouTube',
    tanggal: '2026-10-05',
    uploader: 'Humas Sekolah'
  },

  // Items for 'menu-portal-tautan'
  {
    id: 'item-tautan-2',
    menuId: 'menu-portal-tautan',
    tipe: 'tautan',
    judul: 'Platform Merdeka Mengajar (PMM) Kemendikbudristek',
    deskripsi: 'Akses pelatihan mandiri, Bukti Karya Saya, Komunitas Belajar GTK, dan perangkat ajar terintegrasi.',
    kategori: 'Platform Resmi',
    tautanUrl: 'https://guru.kemdikbud.go.id',
    tautanLabel: 'Buka Portal PMM',
    tanggal: '2026-10-02',
    uploader: 'Kurikulum'
  },
  {
    id: 'item-tautan-3',
    menuId: 'menu-portal-tautan',
    tipe: 'tautan',
    judul: 'Portal SIMPKB & PPG Kemendikbud',
    deskripsi: 'Layanan terpadu pengembangan keprofesian berkelanjutan, sertifikasi pendidik, dan program Guru Penggerak.',
    kategori: 'Layanan GTK',
    tautanUrl: 'https://paspor-gtk.belajar.kemdikbud.go.id',
    tautanLabel: 'Masuk ke SIMPKB',
    tanggal: '2026-10-02',
    uploader: 'Admin Kepegawaian'
  },
  {
    id: 'item-tautan-4',
    menuId: 'menu-portal-tautan',
    tipe: 'tautan',
    judul: 'Canva for Education - Akun Belajar.id',
    deskripsi: 'Desain media presentasi ajar interaktif, poster edukasi, dan LKPD gratis dengan akun Belajar.id.',
    kategori: 'Media Pembelajaran',
    tautanUrl: 'https://www.canva.com/education/',
    tautanLabel: 'Buka Canva Pendidikan',
    tanggal: '2026-10-08',
    uploader: 'Tim IT Sekolah'
  },
  {
    id: 'item-video-3',
    menuId: 'menu-portal-tautan',
    tipe: 'video',
    judul: 'Tutorial Pemanfaatan Akun Belajar.id & Google Workspace',
    deskripsi: 'Panduan aktivasi email @guru.smp.belajar.id dan penyimpanan Google Drive tanpa batas bagi seluruh GTK.',
    kategori: 'Video Panduan',
    videoUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/fJ9rUzIMcZQ',
    videoDuration: '06:30',
    tanggal: '2026-10-11',
    uploader: 'Tim IT Sekolah'
  }
];

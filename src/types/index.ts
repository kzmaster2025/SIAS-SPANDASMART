export type StandardTab = 
  | 'dashboard'
  | 'profil'
  | 'kesiswaan'
  | 'guru'
  | 'akademik'
  | 'presensi'
  | 'persuratan'
  | 'dokumen'
  | 'drive'
  | 'keuangan'
  | 'agenda';

export type ActiveTab = StandardTab | (string & {});

export interface CustomMenu {
  id: string; // e.g. "menu-galeri-kegiatan"
  label: string; // e.g. "Galeri Video & Kegiatan"
  deskripsi?: string;
  iconName: string; // e.g. "Video", "Film", "Image", "Link", "Globe", "Sparkles", "Folder", "Tv", "Trophy"
  adminOnly: boolean;
  order: number;
  createdAt: string;
}

export type CustomItemType = 'video' | 'gambar' | 'tautan';

export interface CustomMenuItem {
  id: string;
  menuId: string;
  tipe: CustomItemType;
  judul: string;
  deskripsi: string;
  kategori?: string;
  
  // For 'video'
  videoUrl?: string; // direct mp4 / data url or youtube / drive link
  videoEmbedUrl?: string; // iframe embed URL if YouTube or Google Drive
  videoDuration?: string;
  
  // For 'gambar'
  gambarUrl?: string; // direct url or data url
  caption?: string;
  
  // For 'tautan'
  tautanUrl?: string;
  tautanLabel?: string;
  
  tanggal: string;
  uploader: string;
}

export interface DokumenSekolah {
  id: string;
  judul: string;
  nomorDokumen: string;
  kategori: 'Kurikulum & KOSP' | 'Kesiswaan & Tata Tertib' | 'Kepegawaian & SK' | 'Tata Usaha & SOP' | 'Sarpras & Aset' | 'Keuangan & BOS' | 'Panduan & Modul';
  tahunAjaran: string;
  tanggalTerbit: string;
  pengesah: string;
  status: 'Berlaku' | 'Draft' | 'Diarsipkan';
  akses: 'Publik Sekolah' | 'Internal GTK' | 'Terbatas Pimpinan & TU';
  deskripsi: string;
  fileNama: string;
  fileTipe: 'PDF' | 'DOCX' | 'XLSX';
  fileUkuran: string;
  isiRingkasan: string;
}

export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  kelas: string; // e.g. "7-A", "8-C", "9-B"
  tingkat: '7' | '8' | '9';
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  alamat: string;
  namaAyah: string;
  namaIbu: string;
  kontakOrtu: string;
  status: 'Aktif' | 'Mutasi Keluar' | 'Lulus';
  fotoUrl?: string;
}

export interface GuruTendik {
  id: string;
  nip: string; // or "-" if non-PNS
  nuptk: string;
  nama: string;
  gelar: string;
  jabatan: string; // e.g. "Kepala Sekolah", "Guru Matematika / Wali Kelas 8-B", "Kepala Tata Usaha"
  kategori: 'Pendidik' | 'Tenaga Kependidikan';
  statusKepegawaian: 'PNS' | 'PPPK' | 'GTT' | 'PTT';
  golongan?: string; // e.g. "Pembina / IV-a", "Penata / III-c"
  mapel?: string;
  jamMengajar?: number;
  email: string;
  telepon: string;
  pendidikanTerakhir: string;
}

export interface NilaiMapel {
  kodeMapel: string;
  namaMapel: string;
  guruPengampu: string;
  kkm: number;
  formatif: number;
  sumatif: number;
  nilaiAkhir: number;
  capaianKompetensi: string;
}

export type PredikatKokurikuler = 'Sangat Berkembang' | 'Berkembang Sesuai Harapan' | 'Mulai Berkembang' | 'Belum Berkembang';

export interface CapaianKokurikuler {
  dimensi: string;
  deskripsiDimensi?: string;
  temaProjek?: string;
  predikat: PredikatKokurikuler;
  catatan: string;
}

export interface RaporSiswa {
  siswaId: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string; // e.g. "2025/2026"
  nilai: NilaiMapel[];
  kokurikuler?: CapaianKokurikuler[];
  kehadiran: {
    sakit: number;
    izin: number;
    alpa: number;
  };
  catatanWaliKelas: string;
  ekskul: { nama: string; predikat: 'Sangat Baik' | 'Baik' | 'Cukup'; keterangan: string }[];
  fase?: string;
  kenaikanKelas?: string;
  narasiKokurikuler?: string;
  titimangsa?: string;
  waliKelas?: {
    nama: string;
    nip: string;
  };
  kepalaSekolah?: {
    nama: string;
    nip: string;
  };
}

export interface PresensiHarian {
  id: string;
  siswaId: string;
  namaSiswa: string;
  kelas: string;
  tanggal: string;
  status: 'H' | 'S' | 'I' | 'A';
  keterangan?: string;
}

export interface SuratResmi {
  id: string;
  nomorSurat: string;
  jenisSurat: 'Keterangan Aktif' | 'Mutasi Keluar' | 'Tugas Guru' | 'Panggilan Ortu' | 'Dispensasi';
  tanggalSurat: string;
  perihal: string;
  tujuan: string;
  namaTerkait: string;
  nisnNipTerkait: string;
  statusArsip: 'Terbit' | 'Draft' | 'Diarsipkan';
  isiSuratKhusus?: string;
}

export interface TransaksiKeuangan {
  id: string;
  kodeTransaksi: string;
  tanggal: string;
  kategori: 'BOS Reguler' | 'BOS Kinerja' | 'Komite Sekolah' | 'Kegiatan Siswa';
  jenis: 'Pemasukan' | 'Pengeluaran';
  uraian: string;
  jumlah: number;
  buktiRef: string;
  penanggungJawab: string;
}

export interface AgendaSekolah {
  id: string;
  judul: string;
  tanggal: string;
  kategori: 'Akademik' | 'Kesiswaan' | 'Kedinasan' | 'Keagamaan' | 'Komite';
  lokasi: string;
  deskripsi: string;
  penanggungJawab: string;
  status: 'Akan Datang' | 'Sedang Berjalan' | 'Selesai';
}

export interface ProfilSekolahData {
  nama: string;
  sebutan: string;
  npsn: string;
  nss: string;
  statusSekolah: string;
  bentukPendidikan: string;
  akreditasi: string;
  nilaiAkreditasi: number;
  noSkAkreditasi: string;
  kurikulum: string;
  tahunBerdiri: string;
  skPendirian: string;
  alamat: string;
  kodePos: string;
  telepon: string;
  email: string;
  website: string;
  dinas: string;
  provinsi: string;
  koordinat: string;
  logoUrl?: string;
  heroImage: string;
  labImage: string;
  kepalaSekolah: {
    nama: string;
    nip: string;
    pangkat: string;
    foto: string;
    sambutan: string;
  };
  visi: string;
  misi: string[];
  fasilitas: { nama: string; kapasitas: string; status: string }[];
  kartuPelajarSettings?: {
    titimangsa?: string;
    jabatan?: string;
    subHeaderDinas?: string;
  };
  statistikUmum?: {
    totalSiswa: number;
    totalRombel: number;
    totalGuru: number;
    totalTendik: number;
    siswaLaki: number;
    siswaPerempuan: number;
  };
}


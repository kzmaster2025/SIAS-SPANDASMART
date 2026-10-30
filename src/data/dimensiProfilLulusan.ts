import { CapaianKokurikuler } from '../types';

export interface DimensiMeta {
  id: string;
  nomor: number;
  nama: string;
  fokus: string;
  defaultTema: string;
  defaultPredikat: 'Sangat Berkembang' | 'Berkembang Sesuai Harapan' | 'Mulai Berkembang' | 'Belum Berkembang';
  defaultCatatan: string;
}

export const DELAPAN_DIMENSI_PROFIL_LULUSAN: DimensiMeta[] = [
  {
    id: 'dim-01',
    nomor: 1,
    nama: 'Keimanan dan Ketakwaan terhadap Tuhan YME',
    fokus: 'Keyakinan teguh, ketaatan beribadah, integritas akhlak mulia, serta memelihara hubungan harmonis dengan sesama dan lingkungan alam.',
    defaultTema: 'Pekan Berbagi & Tadarus/Doa Pagi Karakter Mulia',
    defaultPredikat: 'Sangat Berkembang',
    defaultCatatan: 'Konsisten menjalankan ibadah tepat waktu, berakhlak terpuji, menghormati guru dan teman, serta aktif menjaga kebersihan lingkungan madani sekolah.'
  },
  {
    id: 'dim-02',
    nomor: 2,
    nama: 'Kewargaan',
    fokus: 'Kebanggaan identitas nasional, menjunjung tinggi nilai-nilai Pancasila, menghargai keberagaman budaya, dan menaati aturan bernegara.',
    defaultTema: 'Kearifan Lokal Sunda & Kebinekaan Budaya Sukabumi',
    defaultPredikat: 'Berkembang Sesuai Harapan',
    defaultCatatan: 'Bangga melestarikan budaya Sunda dan kearifan lokal, menjunjung tinggi toleransi keragaman, serta aktif menjaga ketertiban tata tertib sekolah.'
  },
  {
    id: 'dim-03',
    nomor: 3,
    nama: 'Penalaran Kritis',
    fokus: 'Rasa ingin tahu tinggi, berpikir logis, analitis, evaluatif, serta terampil memecahkan masalah dengan literasi dan numerasi berbasis data.',
    defaultTema: 'Riset Sederhana Masalah Lingkungan & Pengolahan Sampah',
    defaultPredikat: 'Sangat Berkembang',
    defaultCatatan: 'Mampu mengidentifikasi pokok persoalan secara objektif, membedakan fakta dan opini, serta menyusun argumen yang logis dan solutif.'
  },
  {
    id: 'dim-04',
    nomor: 4,
    nama: 'Kreativitas',
    fokus: 'Berperilaku produktif, menghasilkan gagasan orisinal, berinovasi menghasilkan karya bermakna, dan merumuskan solusi baru atas tantangan sekitar.',
    defaultTema: 'Kewirausahaan Kreatif Produk Olahan Pangan Lokal',
    defaultPredikat: 'Berkembang Sesuai Harapan',
    defaultCatatan: 'Mampu merancang produk projek yang inovatif, berani bereksperimen dengan metode baru, dan terampil memanfaatkan bahan daur ulang.'
  },
  {
    id: 'dim-05',
    nomor: 5,
    nama: 'Kolaborasi',
    fokus: 'Gotong royong, kerja sama tim yang harmonis, empati sosial, berbagi peran secara adil, dan saling mendukung demi mencapai tujuan bersama.',
    defaultTema: 'Projek Kolaboratif Bhinneka Tunggal Ika & Pameran Karya',
    defaultPredikat: 'Sangat Berkembang',
    defaultCatatan: 'Sangat kooperatif dalam dinamika kelompok, mampu mengomunikasikan gagasan dengan santun, serta proaktif membantu rekan yang membutuhkan.'
  },
  {
    id: 'dim-06',
    nomor: 6,
    nama: 'Kemandirian',
    fokus: 'Tanggung jawab penuh terhadap proses dan hasil belajar, inisiatif diri, disiplin waktu, regulasi emosi, dan ketangguhan mengatasi rintangan.',
    defaultTema: 'Manajemen Belajar Mandiri Berbasis Projek Digital',
    defaultPredikat: 'Berkembang Sesuai Harapan',
    defaultCatatan: 'Menunjukkan inisiatif tinggi dalam menuntaskan tugas tanpa harus selalu diawasi, disiplin mengatur waktu, dan tangguh saat menghadapi kesulitan.'
  },
  {
    id: 'dim-07',
    nomor: 7,
    nama: 'Kesehatan',
    fokus: 'Pola hidup bersih dan sehat (PHBS), kebugaran jasmani, kesehatan mental, pola makan bergizi, serta peduli kelestarian lingkungan hidup.',
    defaultTema: 'Sekolah Sehat Jiwa Raga & Gerakan Aksi Bergizi',
    defaultPredikat: 'Sangat Berkembang',
    defaultCatatan: 'Aktif berpartisipasi dalam senam kesegaran jasmani, konsisten menerapkan pola hidup bersih sehat, serta memiliki sikap mental yang positif dan ceria.'
  },
  {
    id: 'dim-08',
    nomor: 8,
    nama: 'Komunikasi',
    fokus: 'Menyampaikan gagasan secara jelas, terstruktur, santun, efektif dalam berbagai media interaksi, serta mampu menjadi pendengar yang empatik.',
    defaultTema: 'Presentasi Hasil Riset Projek & Public Speaking Pelajar',
    defaultPredikat: 'Berkembang Sesuai Harapan',
    defaultCatatan: 'Mampu mempresentasikan hasil projek dengan percaya diri dan artikulatif, santun memilih diksi, serta responsif terhadap pertanyaan audiens.'
  }
];

export function getDefaultKokurikuler(): CapaianKokurikuler[] {
  return DELAPAN_DIMENSI_PROFIL_LULUSAN.map(d => ({
    dimensi: d.nama,
    deskripsiDimensi: d.fokus,
    temaProjek: d.defaultTema,
    predikat: d.defaultPredikat,
    catatan: d.defaultCatatan
  }));
}

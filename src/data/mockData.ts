import { Siswa, GuruTendik, SuratResmi, TransaksiKeuangan, AgendaSekolah, RaporSiswa, DokumenSekolah } from '../types';
import { getDefaultKokurikuler } from './dimensiProfilLulusan';

export const PROFIL_SEKOLAH = {
  nama: 'SMP Negeri 2 Kota Sukabumi',
  sebutan: 'Spenda Sukabumi',
  npsn: '20221614',
  nss: '201026002002',
  statusSekolah: 'Negeri',
  bentukPendidikan: 'SMP (Sekolah Menengah Pertama)',
  akreditasi: 'A (Unggul)',
  nilaiAkreditasi: 96,
  noSkAkreditasi: '763/BAN-SM/SK/2021',
  kurikulum: 'Kurikulum Merdeka (Fase D)',
  tahunBerdiri: '1960',
  skPendirian: 'No. 187/SK/B.III/1960',
  alamat: 'Jl. Ir. H. Juanda No. 14, Kelurahan Cikole, Kecamatan Cikole, Kota Sukabumi, Jawa Barat',
  kodePos: '43113',
  telepon: '(0266) 221584',
  email: 'info@smpn2kotasukabumi.sch.id',
  website: 'https://smpn2kotasukabumi.sch.id',
  dinas: 'Dinas Pendidikan dan Kebudayaan Kota Sukabumi',
  provinsi: 'Jawa Barat',
  koordinat: '-6.9189, 106.9272',
  heroImage: '/src/assets/images/smpn2_sukabumi_hero_1793223410615.jpg',
  labImage: '/src/assets/images/smpn2_classroom_lab_1793223411720.jpg',
  kepalaSekolah: {
    nama: 'H. Yusuf Hidayat, M.Pd.',
    nip: '19680512 199412 1 002',
    pangkat: 'Pembina Utama Muda, IV/c',
    foto: '/src/assets/images/smpn2_kepala_sekolah_1793223411383.jpg',
    sambutan: 'Assalamu’alaikum Warahmatullahi Wabarakatuh, Sampurasun. Selamat datang di Sistem Informasi & Administrasi Sekolah Digital SMP Negeri 2 Kota Sukabumi. Kami berkomitmen mewujudkan tata kelola madani yang transparan, akuntabel, dan adaptif terhadap perkembangan teknologi pendidikan. Melalui platform digital ini, pelayanan administrasi kesiswaan, kepegawaian, akademik, hingga persuratan tata usaha terintegrasi secara prima untuk melayani seluruh warga sekolah dan masyarakat Kota Sukabumi tercinta.'
  },
  visi: 'Mewujudkan Peserta Didik yang Berakhlak Mulia, Unggul dalam Prestasi, Berbudaya Lingkungan, dan Cakap Berteknologi Berlandaskan Profil Pelajar Pancasila.',
  misi: [
    'Menumbuhkembangkan penghayatan dan pengamalan nilai-nilai keagamaan, budi pekerti luhur, dan kearifan lokal Sunda.',
    'Menyelenggarakan proses pembelajaran berbasis Kurikulum Merdeka yang inovatif, berdiferensiasi, dan berpusat pada murid.',
    'Meningkatkan mutu sarana prasarana penunjang literasi digital, sains, matematika, dan teknologi informasi.',
    'Mewujudkan sekolah ramah anak, berwawasan Adiwiyata Mandiri, serta peduli terhadap pelestarian lingkungan hidup.',
    'Meningkatkan prestasi akademik dan non-akademik di tingkat Kota Sukabumi, Provinsi Jawa Barat, hingga Nasional.',
    'Menerapkan tata kelola administrasi sekolah berbasis digital yang efektif, akuntabel, dan transparan.'
  ],
  fasilitas: [
    { nama: '27 Ruang Kelas Ber-AC & Proyektor', kapasitas: '32 siswa/kelas', status: 'Sangat Baik' },
    { nama: 'Laboratorium Komputer & TIK Digital', kapasitas: '40 PC All-in-One + Fiber Optic', status: 'Sangat Baik' },
    { nama: 'Laboratorium IPA (Fisika & Biologi)', kapasitas: 'Alat Peraga Lengkap & Mikroskop Digital', status: 'Sangat Baik' },
    { nama: 'Perpustakaan Digital "Bintang Ilmu"', kapasitas: '12.000 Koleksi + E-Book Kemenkeu/Kemdikbud', status: 'Sangat Baik' },
    { nama: 'Masjid At-Tarbiyah SMPN 2', kapasitas: 'Kapasitas 800 Jamaah Siswa & Guru', status: 'Sangat Baik' },
    { nama: 'Lapangan Olahraga Multifungsi', kapasitas: 'Futsal, Basket, Voli, & Upacara Bendera', status: 'Sangat Baik' },
    { nama: 'Ruang Bimbingan & Konseling (BK)', kapasitas: 'Ruang Konseling Privat & Karir', status: 'Baik' },
    { nama: 'Unit Kesehatan Sekolah (UKS) Terakreditasi', kapasitas: 'Bekerjasama dengan Puskesmas Cikole', status: 'Sangat Baik' },
    { nama: 'Kantin Sehat Higienis Berstandar BPOM', kapasitas: '12 Kios Kuliner Bergizi & Ramah Lingkungan', status: 'Sangat Baik' },
    { nama: 'Studio Seni Budaya & Karawitan', kapasitas: 'Gamelan Pelog Salendro & Alat Musik Modern', status: 'Sangat Baik' }
  ],
  statistikUmum: {
    totalSiswa: 948,
    totalRombel: 27,
    totalGuru: 44,
    totalTendik: 12,
    siswaLaki: 462,
    siswaPerempuan: 486,
    persentaseKelulusan: '100%',
    rataRataKehadiran: '98.2%'
  }
};

export const INITIAL_SISWA: Siswa[] = [
  {
    id: 'sis-01',
    nisn: '0098471201',
    nis: '232407001',
    nama: 'Muhammad Alif Ramadhan',
    kelas: '7-A',
    tingkat: '7',
    jenisKelamin: 'L',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2012-04-12',
    agama: 'Islam',
    alamat: 'Jl. R.E. Martadinata No. 55, Cikole, Kota Sukabumi',
    namaAyah: 'Deden Ramadhan, S.T.',
    namaIbu: 'Siti Nurjanah',
    kontakOrtu: '081289123456',
    status: 'Aktif'
  },
  {
    id: 'sis-02',
    nisn: '0097652311',
    nis: '232407002',
    nama: 'Nabila Syakira Putri',
    kelas: '7-A',
    tingkat: '7',
    jenisKelamin: 'P',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2012-06-25',
    agama: 'Islam',
    alamat: 'Jl. Siliwangi No. 89, Gunungpuyuh, Kota Sukabumi',
    namaAyah: 'Asep Saepuloh',
    namaIbu: 'Rina Maryati',
    kontakOrtu: '085721345678',
    status: 'Aktif'
  },
  {
    id: 'sis-03',
    nisn: '0095431890',
    nis: '232407003',
    nama: 'Rizky Pratama Kusuma',
    kelas: '7-B',
    tingkat: '7',
    jenisKelamin: 'L',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2012-01-18',
    agama: 'Islam',
    alamat: 'Jl. Surya Kencana No. 12, Cikole, Kota Sukabumi',
    namaAyah: 'Kusuma Wardhana',
    namaIbu: 'Dewi Lestari',
    kontakOrtu: '081399887766',
    status: 'Aktif'
  },
  {
    id: 'sis-04',
    nisn: '0089234102',
    nis: '222308015',
    nama: 'Chelsea Olivia Tanuwijaya',
    kelas: '8-C',
    tingkat: '8',
    jenisKelamin: 'P',
    tempatLahir: 'Bandung',
    tanggalLahir: '2011-09-14',
    agama: 'Kristen',
    alamat: 'Jl. Tipar Gede No. 24, Citamiang, Kota Sukabumi',
    namaAyah: 'Hendrik Tanuwijaya',
    namaIbu: 'Meilani Chandra',
    kontakOrtu: '081122334455',
    status: 'Aktif'
  },
  {
    id: 'sis-05',
    nisn: '0087612398',
    nis: '222308016',
    nama: 'Fajar Nugraha Subekti',
    kelas: '8-C',
    tingkat: '8',
    jenisKelamin: 'L',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2011-03-08',
    agama: 'Islam',
    alamat: 'Jl. Bhayangkara No. 102, Cikole, Kota Sukabumi',
    namaAyah: 'Iwan Subekti, S.Pd.',
    namaIbu: 'Endah Sulastri',
    kontakOrtu: '087812908765',
    status: 'Aktif'
  },
  {
    id: 'sis-06',
    nisn: '0078123490',
    nis: '212209028',
    nama: 'Alya Zahra Salsabila',
    kelas: '9-A',
    tingkat: '9',
    jenisKelamin: 'P',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2010-11-20',
    agama: 'Islam',
    alamat: 'Jl. Brawijaya No. 15, Gunungpuyuh, Kota Sukabumi',
    namaAyah: 'Dr. H. Agus Salsabil',
    namaIbu: 'Hj. Fatimah, S.E.',
    kontakOrtu: '081233445566',
    status: 'Aktif'
  },
  {
    id: 'sis-07',
    nisn: '0079012488',
    nis: '212209029',
    nama: 'Dimas Aditya Saputra',
    kelas: '9-A',
    tingkat: '9',
    jenisKelamin: 'L',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2010-07-04',
    agama: 'Islam',
    alamat: 'Jl. Gudang No. 7, Cikole, Kota Sukabumi',
    namaAyah: 'Budi Saputra',
    namaIbu: 'Yuyun Yuningsih',
    kontakOrtu: '085622114433',
    status: 'Aktif'
  },
  {
    id: 'sis-08',
    nisn: '0075678912',
    nis: '212209030',
    nama: 'Siti Hanifah Rahmah',
    kelas: '9-B',
    tingkat: '9',
    jenisKelamin: 'P',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2010-02-14',
    agama: 'Islam',
    alamat: 'Jl. Veteran II No. 34, Cikole, Kota Sukabumi',
    namaAyah: 'Rahmat Hidayat',
    namaIbu: 'Lilis Mardiana',
    kontakOrtu: '081988776655',
    status: 'Aktif'
  },
  {
    id: 'sis-09',
    nisn: '3122000659',
    nis: '3122000659',
    nama: 'Zidan Vicki Nugraha',
    kelas: '9 K',
    tingkat: '9',
    jenisKelamin: 'L',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2010-08-15',
    agama: 'Islam',
    alamat: 'Jalan Selabintana, Cikole, Kota Sukabumi',
    namaAyah: 'H. Vicki Nugraha',
    namaIbu: 'Hj. Rohimah',
    kontakOrtu: '081234567890',
    status: 'Aktif'
  },
  {
    id: 'sis-10',
    nisn: '0126191596',
    nis: '2526.07.004',
    nama: 'ADELIA ANGGRAINI',
    kelas: 'Kelas VII A',
    tingkat: '7',
    jenisKelamin: 'P',
    tempatLahir: 'Sukabumi',
    tanggalLahir: '2012-05-10',
    agama: 'Islam',
    alamat: 'Jl. Ir. H. Juanda No. 14, Kota Sukabumi',
    namaAyah: 'H. Anggraini',
    namaIbu: 'Hj. Nurbaeti',
    kontakOrtu: '085711223344',
    status: 'Aktif'
  }
];

export const INITIAL_GURU: GuruTendik[] = [
  {
    id: 'gtk-01',
    nip: '19680512 199412 1 002',
    nuptk: '4534746648200012',
    nama: 'H. Yusuf Hidayat',
    gelar: 'M.Pd.',
    jabatan: 'Kepala Sekolah',
    kategori: 'Pendidik',
    statusKepegawaian: 'PNS',
    golongan: 'Pembina Utama Muda / IV-c',
    mapel: 'Pendidikan Agama Islam / Manajemen Sekolah',
    jamMengajar: 6,
    email: 'yusuf.hidayat@smpn2kotasukabumi.sch.id',
    telepon: '081223456789',
    pendidikanTerakhir: 'S2 Manajemen Pendidikan - UPI'
  },
  {
    id: 'gtk-02',
    nip: '19740815 199903 1 004',
    nuptk: '7845752654200003',
    nama: 'Dra. Hj. Nunung Nurbaeti',
    gelar: 'M.M.Pd.',
    jabatan: 'Wakasek Bidang Kurikulum / Guru Matematika',
    kategori: 'Pendidik',
    statusKepegawaian: 'PNS',
    golongan: 'Pembina Tingkat I / IV-b',
    mapel: 'Matematika (Kelas 9)',
    jamMengajar: 24,
    email: 'nunung.nurbaeti@smpn2kotasukabumi.sch.id',
    telepon: '081320112233',
    pendidikanTerakhir: 'S2 Magister Manajemen Pendidikan - Uninus'
  },
  {
    id: 'gtk-03',
    nip: '19790321 200501 1 008',
    nuptk: '3456757659200013',
    nama: 'Cecep Sunandar',
    gelar: 'S.Pd., M.Si.',
    jabatan: 'Wakasek Bidang Kesiswaan / Guru IPA',
    kategori: 'Pendidik',
    statusKepegawaian: 'PNS',
    golongan: 'Pembina / IV-a',
    mapel: 'Ilmu Pengetahuan Alam (IPA)',
    jamMengajar: 24,
    email: 'cecep.sunandar@smpn2kotasukabumi.sch.id',
    telepon: '085799881122',
    pendidikanTerakhir: 'S2 Pendidikan IPA - ITB'
  },
  {
    id: 'gtk-04',
    nip: '19821104 200902 2 003',
    nuptk: '5678760662300021',
    nama: 'Rina Marlina',
    gelar: 'S.Pd.',
    jabatan: 'Guru Bahasa Indonesia / Wali Kelas 7-A',
    kategori: 'Pendidik',
    statusKepegawaian: 'PNS',
    golongan: 'Penata Tingkat I / III-d',
    mapel: 'Bahasa Indonesia',
    jamMengajar: 28,
    email: 'rina.marlina@smpn2kotasukabumi.sch.id',
    telepon: '081287654321',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa & Sastra Indonesia - UMMI'
  },
  {
    id: 'gtk-05',
    nip: '19880419 201503 1 002',
    nuptk: '8901766668130082',
    nama: 'Wildan Ramdani',
    gelar: 'S.Kom., Gr.',
    jabatan: 'Guru Informatika / Pembina TIK & Robotik',
    kategori: 'Pendidik',
    statusKepegawaian: 'PPPK',
    golongan: 'Ahli Pertama / IX',
    mapel: 'Informatika',
    jamMengajar: 24,
    email: 'wildan.ramdani@smpn2kotasukabumi.sch.id',
    telepon: '089677889900',
    pendidikanTerakhir: 'S1 Teknik Informatika - Unpad'
  },
  {
    id: 'gtk-06',
    nip: '19850912 201001 2 011',
    nuptk: '6789763665200034',
    nama: 'Sri Wahyuni',
    gelar: 'S.Pd.',
    jabatan: 'Guru Bahasa Inggris / Wali Kelas 8-C',
    kategori: 'Pendidik',
    statusKepegawaian: 'PNS',
    golongan: 'Penata / III-c',
    mapel: 'Bahasa Inggris',
    jamMengajar: 26,
    email: 'sri.wahyuni@smpn2kotasukabumi.sch.id',
    telepon: '081311223344',
    pendidikanTerakhir: 'S1 Pendidikan Bahasa Inggris - UPI'
  },
  {
    id: 'gtk-07',
    nip: '19760218 200312 1 005',
    nuptk: '2345754656100012',
    nama: 'H. Dedi Suhendi',
    gelar: 'S.Sos.',
    jabatan: 'Kepala Urusan Tata Usaha (Kaur TU)',
    kategori: 'Tenaga Kependidikan',
    statusKepegawaian: 'PNS',
    golongan: 'Penata Tingkat I / III-d',
    email: 'dedi.suhendi@smpn2kotasukabumi.sch.id',
    telepon: '081299001122',
    pendidikanTerakhir: 'S1 Administrasi Publik - STIA Sukabumi'
  },
  {
    id: 'gtk-08',
    nip: '-',
    nuptk: '-',
    nama: 'Rian Firmansyah',
    gelar: 'A.Md.',
    jabatan: 'Operator Sekolah / Pengelola Data Dapodik',
    kategori: 'Tenaga Kependidikan',
    statusKepegawaian: 'PTT',
    email: 'operator@smpn2kotasukabumi.sch.id',
    telepon: '087766554433',
    pendidikanTerakhir: 'D3 Manajemen Informatika - Poltek Sukabumi'
  }
];

export const MOCK_RAPOR_CONTOH: RaporSiswa = {
  siswaId: 'sis-01',
  semester: 'Ganjil',
  tahunAjaran: '2025/2026',
  kehadiran: { sakit: 0, izin: 0, alpa: 0 },
  catatanWaliKelas: 'Peserta didik menunjukkan partisipasi aktif dalam pembelajaran Kurikulum Merdeka. Terus kembangkan potensi dan integritas.',
  ekskul: [
    { nama: 'belum', predikat: 'Cukup', keterangan: 'Aktif dalam kegiatan jambore dan kepanduan' },
    { nama: 'Belum', predikat: 'Cukup', keterangan: 'Juara 2 Lomba Web Programming Pelajar Kota Sukabumi' },
    { nama: 'Ekstrakurikuler Baru', predikat: 'Cukup', keterangan: 'Berpartisipasi aktif dalam latihan rutin' }
  ],
  kokurikuler: getDefaultKokurikuler(),
  nilai: [
    {
      kodeMapel: 'PAI',
      namaMapel: 'Pendidikan Agama Islam dan Budi Pekerti',
      guruPengampu: 'H. Yusuf Hidayat, M.Pd.',
      kkm: 75,
      formatif: 88,
      sumatif: 90,
      nilaiAkhir: 89,
      capaianKompetensi: 'Sangat menguasai pemahaman tajwid Al-Qur’an dan penerapan nilai amanah dalam pergaulan sehari-hari.'
    },
    {
      kodeMapel: 'PPKN',
      namaMapel: 'Pendidikan Pancasila',
      guruPengampu: 'Dra. Hj. Nurbaeti',
      kkm: 75,
      formatif: 86,
      sumatif: 88,
      nilaiAkhir: 87,
      capaianKompetensi: 'Mampu menjelaskan penerapan nilai-nilai Pancasila dalam norma hukum dan musyawarah mufakat.'
    },
    {
      kodeMapel: 'BIN',
      namaMapel: 'Bahasa Indonesia',
      guruPengampu: 'Rina Marlina, S.Pd.',
      kkm: 75,
      formatif: 91,
      sumatif: 93,
      nilaiAkhir: 92,
      capaianKompetensi: 'Sangat terampil menganalisis teks deskripsi dan menyajikan pidato persuasif dengan intonasi prima.'
    },
    {
      kodeMapel: 'MAT',
      namaMapel: 'Matematika',
      guruPengampu: 'Dra. Hj. Nunung Nurbaeti, M.M.Pd.',
      kkm: 75,
      formatif: 89,
      sumatif: 91,
      nilaiAkhir: 90,
      capaianKompetensi: 'Menunjukkan penguasaan tinggi operasi aljabar linier dan pemecahan masalah geometri dua dimensi.'
    },
    {
      kodeMapel: 'IPA',
      namaMapel: 'Ilmu Pengetahuan Alam (IPA)',
      guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
      kkm: 75,
      formatif: 90,
      sumatif: 92,
      nilaiAkhir: 91,
      capaianKompetensi: 'Memahami konsep metode ilmiah mikroskopis dan klasifikasi materi zat dengan sangat baik.'
    },
    {
      kodeMapel: 'IPS',
      namaMapel: 'Ilmu Pengetahuan Sosial (IPS)',
      guruPengampu: 'Dedi Suhendi, S.Sos.',
      kkm: 75,
      formatif: 85,
      sumatif: 87,
      nilaiAkhir: 86,
      capaianKompetensi: 'Mampu menganalisis dinamika interaksi antarruang dan kelembagaan ekonomi lokal Sukabumi.'
    },
    {
      kodeMapel: 'ING',
      namaMapel: 'Bahasa Inggris',
      guruPengampu: 'Sri Wahyuni, S.Pd.',
      kkm: 75,
      formatif: 0,
      sumatif: 0,
      nilaiAkhir: 0,
      capaianKompetensi: 'Fluent in expressing self-introduction, giving instruction, and descriptive procedural texts.'
    },
    {
      kodeMapel: 'INF',
      namaMapel: 'Informatika',
      guruPengampu: 'Wildan Ramdani, S.Kom., Gr.',
      kkm: 75,
      formatif: 0,
      sumatif: 0,
      nilaiAkhir: 0,
      capaianKompetensi: 'Sangat mahir berpikir komputasional, algoritma flowchart, dan pemrograman dasar visual scratch.'
    },
    {
      kodeMapel: 'SND',
      namaMapel: 'Muatan Lokal Bahasa Sunda',
      guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
      kkm: 75,
      formatif: 0,
      sumatif: 0,
      nilaiAkhir: 0,
      capaianKompetensi: 'Mahir ngalarapkeun undak-usuk basa Sunda dina paguneman sapopoe sarta maca aksara Sunda.'
    }
  ]
};

export const RAPOR_ADELIA: RaporSiswa = {
  siswaId: 'sis-10',
  semester: 'Genap',
  tahunAjaran: '2025/2026',
  fase: 'D',
  kenaikanKelas: 'Naik ke kelas VIII',
  titimangsa: 'Sukabumi, 24 Juni 2026',
  kehadiran: { sakit: 2, izin: 0, alpa: 0 },
  catatanWaliKelas: 'Selamat atas keberhasilanmu naik ke kelas VIII. Tingkatkan terus motivasi dalam belajar serta kedisiplinan untuk meraih prestasi yang lebih tinggi.',
  waliKelas: {
    nama: 'Gina Risdiyani, S.Si',
    nip: '198609132022212014'
  },
  kepalaSekolah: {
    nama: 'ARHAM, S.Pd., M.M.Pd',
    nip: '196903261998021002'
  },
  ekskul: [
    { nama: 'Ekstrakurikuler Tari', predikat: 'Sangat Baik', keterangan: 'Mempunyai keterampilan menari yang baik. Terus tingkatkan potensi diri, untuk mengembangkan bakat yang telah dimiliki.' }
  ],
  kokurikuler: getDefaultKokurikuler(),
  narasiKokurikuler: `Pada semester ini, ananda menunjukkan capaian yang baik dalam penguatan profil lulusan, yang ditunjukkan melalui kegiatan kokurikuler "Eksplorasi keberagaman budaya lokal dan nasional" serta "melestarikan kekayaan warisan budaya Indonesia".\nPada dimensi kewargaan, ananda cakap dalam subdimensi kewargaan lokal.\nPada dimensi kreativitas, ananda cakap dalam subdimensi gagasan baru.\nPada dimensi kolaborasi, ananda cakap dalam subdimensi kerja sama.`,
  nilai: [
    {
      kodeMapel: 'PAI',
      namaMapel: 'Pendidikan Agama Islam dan Budi Pekerti',
      guruPengampu: 'H. Yusuf Hidayat, M.Pd.',
      kkm: 75,
      formatif: 90,
      sumatif: 90,
      nilaiAkhir: 90,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Memahami Nilai-nilai yang dapat dipetik pada Penciptaan dan Pengaturan Alam Semesta, Menyajikan perilaku beriman kepada Malaikat , Perkembangan ilmu pengetahuan pada Masa Bani Umayyah di Andalusia, Menciptakan harmoni sosial dengan menjauhi ghibah dan menumbuhkan sikap tabayyun..\nPerlu peningkatan dalam hal Menunjukkan sikap disiplin dan saling menghargai dalam menjalankan ibadah..'
    },
    {
      kodeMapel: 'PPKN',
      namaMapel: 'Pendidikan Pancasila',
      guruPengampu: 'Dra. Hj. Nurbaeti',
      kkm: 75,
      formatif: 83,
      sumatif: 83,
      nilaiAkhir: 83,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Persatuan dalam keberagaman suku, agama, ras, dan antargolongan dalam kehidupan bermasyarakat., sikap cinta tanah air, rela berkorban, toleransi, dan kerja sama..\nPerlu peningkatan dalam hal wilayah negara kesatuan Republik Indonesia..'
    },
    {
      kodeMapel: 'BIN',
      namaMapel: 'Bahasa Indonesia',
      guruPengampu: 'Rina Marlina, S.Pd.',
      kkm: 75,
      formatif: 88,
      sumatif: 88,
      nilaiAkhir: 88,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal menganalisis unsur-unsur kebahasaan berita dengan menandai jenis kalimat dalam teks dengan teliti, Menggali perbedaan dan persamaan bagian-bagian pada buku fiksi dan nonfiksi dengan teliti..\nPerlu peningkatan dalam hal Menulis surat pribadi dan resmi menggunakan pilihan kata yang tepat.'
    },
    {
      kodeMapel: 'MAT',
      namaMapel: 'Matematika (Umum)',
      guruPengampu: 'Dra. Hj. Nunung Nurbaeti, M.M.Pd.',
      kkm: 75,
      formatif: 85,
      sumatif: 85,
      nilaiAkhir: 85,
      capaianKompetensi: 'Mencapai Kompetensi dengan baik dalam hal Menyelesaikan masalah hubungan antar sudut, pemahaman konsep dasar kesebangunan, Menyatakan masalah sehari-hari ke bentuk PLSV dan PtLSV serta menentukan penyelesaiannya, Melakukan operasi hitung bentuk aljabar, Menyelesaikan masalah bentuk aljabar.'
    },
    {
      kodeMapel: 'IPA',
      namaMapel: 'Ilmu Pengetahuan Alam (IPA)',
      guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
      kkm: 75,
      formatif: 85,
      sumatif: 85,
      nilaiAkhir: 85,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal menelaah hasil identifikasi makhluk hidup sesuai dengan karakteristiknya, menganalisis posisi relatif bumi-bulan-matahari dalam sistem tata surya untuk menjelaskan fenomena alam dan perubahan iklim.\nPerlu peningkatan dalam hal menganalisis interaksi antar makhluk hidup dan lingkungan dalam merancang upaya untuk mencegah dan mengatasi perubahan iklim.'
    },
    {
      kodeMapel: 'IPS',
      namaMapel: 'Ilmu Pengetahuan Sosial (IPS)',
      guruPengampu: 'Dedi Suhendi, S.Sos.',
      kkm: 75,
      formatif: 84,
      sumatif: 84,
      nilaiAkhir: 84,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Mengidentifikasi kegiatan ekonomi masyarakat dan Literasi Keuangan, Menganalisis pemanfaatan dan pelestarian potensi sumber daya alam, Menguraikan aktivitas kehidupan masyarakat masa Hindu Buddha dan masa Islam, Mengidentifikasi Keragaman Budaya dan permasalahan kehidupan sosial budaya di masyarakat.\nPerlu peningkatan dalam hal mempelajari sejarah lokal dan toponimi wilayah.'
    },
    {
      kodeMapel: 'ING',
      namaMapel: 'Bahasa Inggris',
      guruPengampu: 'Sri Wahyuni, S.Pd.',
      kkm: 75,
      formatif: 83,
      sumatif: 83,
      nilaiAkhir: 83,
      capaianKompetensi: 'Perlu peningkatan dalam hal Mengidentifikasi ide utama dan informasi rinci teks deskripsi terkait study habit.'
    },
    {
      kodeMapel: 'SBK',
      namaMapel: 'Seni, Budaya dan Prakarya',
      guruPengampu: 'Rina Marlina, S.Pd.',
      kkm: 75,
      formatif: 94,
      sumatif: 94,
      nilaiAkhir: 94,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Mendesain (Prinsip & Elemen Desain), Apresiasi & Penciptaan Karya Seni.'
    },
    {
      kodeMapel: 'PJOK',
      namaMapel: 'Pendidikan Jasmani, Olahraga, dan Kesehatan',
      guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
      kkm: 75,
      formatif: 91,
      sumatif: 91,
      nilaiAkhir: 91,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Menganalisis dan mempraktikan keterampilan aktivitas bola besar dan atletik.\nPerlu peningkatan dalam hal Menganalisis dan mempraktikan keterampilan aktivitas senam lantai dan aktivitas olahraga air..'
    },
    {
      kodeMapel: 'INF',
      namaMapel: 'Informatika',
      guruPengampu: 'Wildan Ramdani, S.Kom., Gr.',
      kkm: 75,
      formatif: 92,
      sumatif: 92,
      nilaiAkhir: 92,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Menerapkan analisis data pada kehidupan sehari hari, Memahami dampak sosial dari penggunaan teknologi dan informasi..'
    },
    {
      kodeMapel: 'SND',
      namaMapel: 'Muatan Lokal Bahasa Daerah',
      guruPengampu: 'Cecep Sunandar, S.Pd., M.Si.',
      kkm: 75,
      formatif: 82,
      sumatif: 82,
      nilaiAkhir: 82,
      capaianKompetensi: 'Mencapai Kompetensi dengan sangat baik dalam hal Mengidentifikasi dan mengomunikasikan dongeng, Mengidentifikasi dan mendeklamasikan sajak , Mengidentifikasi dan menyajikan teks aksara Sunda.'
    }
  ]
};

export const INITIAL_SURAT: SuratResmi[] = [
  {
    id: 'srt-01',
    nomorSurat: '421.3/084-SMPN.2/Disdikbud/2026',
    jenisSurat: 'Keterangan Aktif',
    tanggalSurat: '2026-10-15',
    perihal: 'Surat Keterangan Masih Aktif Belajar',
    tujuan: 'Kepala Kantor Cabang Bank BNI Sukabumi (Pencairan PIP)',
    namaTerkait: 'Muhammad Alif Ramadhan',
    nisnNipTerkait: '0098471201',
    statusArsip: 'Terbit',
    isiSuratKhusus: 'Menerangkan bahwa peserta didik tersebut di atas adalah benar-benar siswa aktif terdaftar pada Tahun Pelajaran 2025/2026 di SMP Negeri 2 Kota Sukabumi, memiliki kelakuan baik, dan diusulkan untuk penerima manfaat Program Indonesia Pintar (PIP).'
  },
  {
    id: 'srt-02',
    nomorSurat: '421.3/085-SMPN.2/Disdikbud/2026',
    jenisSurat: 'Tugas Guru',
    tanggalSurat: '2026-10-18',
    perihal: 'Surat Perintah Tugas (SPT) Pembimbing OSN Tingkat Kota',
    tujuan: 'Dinas Pendidikan dan Kebudayaan Kota Sukabumi',
    namaTerkait: 'Cecep Sunandar, S.Pd., M.Si.',
    nisnNipTerkait: '19790321 200501 1 008',
    statusArsip: 'Terbit',
    isiSuratKhusus: 'Ditugaskan sebagai Guru Pembimbing Kontingen Olimpiade Sains Nasional (OSN) SMP bidang IPA Tingkat Kota Sukabumi Tahun 2026 yang diselenggarakan di SMP Negeri 1 Sukabumi.'
  },
  {
    id: 'srt-03',
    nomorSurat: '421.3/086-SMPN.2/Disdikbud/2026',
    jenisSurat: 'Dispensasi',
    tanggalSurat: '2026-10-22',
    perihal: 'Surat Dispensasi Mengikuti Kejuaraan Bulutangkis O2SN',
    tujuan: 'Wali Kelas 8-C SMP Negeri 2 Kota Sukabumi',
    namaTerkait: 'Fajar Nugraha Subekti',
    nisnNipTerkait: '0087612398',
    statusArsip: 'Terbit',
    isiSuratKhusus: 'Diberikan izin dispensasi tidak mengikuti KBM selama 3 hari kerja untuk mewakili sekolah dalam Kejuaraan O2SN Cabor Bulutangkis Tunggal Putra.'
  },
  {
    id: 'srt-04',
    nomorSurat: '421.3/087-SMPN.2/Disdikbud/2026',
    jenisSurat: 'Mutasi Keluar',
    tanggalSurat: '2026-10-24',
    perihal: 'Surat Keterangan Pindah Sekolah',
    tujuan: 'Kepala SMP Negeri 5 Kota Bandung',
    namaTerkait: 'Rian Hidayatullah',
    nisnNipTerkait: '0086543210',
    statusArsip: 'Terbit',
    isiSuratKhusus: 'Diberikan surat pindah atas permohonan orang tua kandung dikarenakan kepindahan domisili tugas dinas orang tua ke Kota Bandung.'
  }
];

export const INITIAL_TRANSAKSI: TransaksiKeuangan[] = [
  {
    id: 'tr-01',
    kodeTransaksi: 'TRX-BOS-26-001',
    tanggal: '2026-10-02',
    kategori: 'BOS Reguler',
    jenis: 'Pemasukan',
    uraian: 'Penerimaan Dana BOS Reguler Tahap II Tahun 2026 dari Kemenkeu RI',
    jumlah: 320500000,
    buktiRef: 'SP2D-BOS-2026-08912',
    penanggungJawab: 'Bendahara BOS / Kepala Sekolah'
  },
  {
    id: 'tr-02',
    kodeTransaksi: 'TRX-BOS-26-002',
    tanggal: '2026-10-05',
    kategori: 'BOS Reguler',
    jenis: 'Pengeluaran',
    uraian: 'Pembelian Buku Teks Utama Kurikulum Merdeka Terbitan Kemendikbudristek',
    jumlah: 48600000,
    buktiRef: 'KWT-PT-GRAMEDIA-1002',
    penanggungJawab: 'Pengelola Perpustakaan'
  },
  {
    id: 'tr-03',
    kodeTransaksi: 'TRX-BOS-26-003',
    tanggal: '2026-10-08',
    kategori: 'BOS Reguler',
    jenis: 'Pengeluaran',
    uraian: 'Pemeliharaan Jaringan Internet Fiber Optic 200 Mbps & Server Lab Komputer',
    jumlah: 4500000,
    buktiRef: 'INV-TELKOM-KOTA-SKBM-10',
    penanggungJawab: 'Kaur Sarpras / Wildan Ramdani'
  },
  {
    id: 'tr-04',
    kodeTransaksi: 'TRX-KMT-26-001',
    tanggal: '2026-10-12',
    kategori: 'Komite Sekolah',
    jenis: 'Pemasukan',
    uraian: 'Penerimaan Sumbangan Sukarela Orang Tua untuk Pembangunan Kanopi Lapangan Upacara',
    jumlah: 35000000,
    buktiRef: 'KWT-KOMITE-OKT-01',
    penanggungJawab: 'Ketua Komite Sekolah'
  },
  {
    id: 'tr-05',
    kodeTransaksi: 'TRX-BOS-26-004',
    tanggal: '2026-10-20',
    kategori: 'Kegiatan Siswa',
    jenis: 'Pengeluaran',
    uraian: 'Dukungan Akomodasi & Pendaftaran Kontingen Lomba FLS2N & O2SN Kota Sukabumi',
    jumlah: 12400000,
    buktiRef: 'BKK-KESISWAAN-041',
    penanggungJawab: 'Wakasek Kesiswaan'
  }
];

export const INITIAL_AGENDA: AgendaSekolah[] = [
  {
    id: 'ag-01',
    judul: 'Asesmen Sumatif Akhir Semester (ASAS) Ganjil TA 2025/2026',
    tanggal: '2026-11-24 s.d 2026-12-01',
    kategori: 'Akademik',
    lokasi: 'Ruang Kelas 7, 8, 9 (CBT Berbasis Komputer & HP Android)',
    deskripsi: 'Pelaksanaan ujian akhir semester ganjil serentak se-Kota Sukabumi melalui aplikasi CBT Lokal SMPN 2 Sukabumi.',
    penanggungJawab: 'Panitia ASAS / Wakasek Kurikulum',
    status: 'Akan Datang'
  },
  {
    id: 'ag-02',
    judul: 'Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5)',
    tanggal: '2026-11-15',
    kategori: 'Kesiswaan',
    lokasi: 'Aula & Lapangan Utama SMPN 2 Kota Sukabumi',
    deskripsi: 'Pameran kewirausahaan olahan pangan khas Sunda Sukabumi dan rekayasa teknologi daur ulang sampah plastik oleh siswa kelas 7 & 8.',
    penanggungJawab: 'Koordinator Fasilitator P5',
    status: 'Akan Datang'
  },
  {
    id: 'ag-03',
    judul: 'Rapat Koordinasi Komite Sekolah & Sosialisasi Program Sekolah',
    tanggal: '2026-11-05',
    kategori: 'Komite',
    lokasi: 'Ruang Rapat Guru & Musholla At-Tarbiyah',
    deskripsi: 'Penyampaian pertanggungjawaban program kerja semester 1 dan sosialisasi peningkatan fasilitas laboratorium TIK.',
    penanggungJawab: 'Pengurus Komite & Kepala Sekolah',
    status: 'Akan Datang'
  },
  {
    id: 'ag-04',
    judul: 'Upacara Peringatan Hari Sumpah Pemuda & Bulan Bahasa',
    tanggal: '2026-10-28',
    kategori: 'Kesiswaan',
    lokasi: 'Lapangan Upacara SMP Negeri 2 Kota Sukabumi',
    deskripsi: 'Upacara bendera dengan pakaian adat nusantara dilanjutkan dengan lomba pasanggiri sajak Sunda dan pidato Bahasa Indonesia.',
    penanggungJawab: 'Pengurus OSIS Spenda Sukabumi',
    status: 'Sedang Berjalan'
  }
];

export const INITIAL_DOKUMEN: DokumenSekolah[] = [
  {
    id: 'dok-01',
    judul: 'Kurikulum Operasional Satuan Pendidikan (KOSP) SMPN 2 Kota Sukabumi',
    nomorDokumen: '421.3/001-KOSP/SMPN.2/Disdikbud/2025',
    kategori: 'Kurikulum & KOSP',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2025-07-14',
    pengesah: 'H. Yusuf Hidayat, M.Pd. (Kepala Sekolah) & Kadisdikbud Kota Sukabumi',
    status: 'Berlaku',
    akses: 'Publik Sekolah',
    deskripsi: 'Dokumen panduan kurikulum operasional sekolah berbasis Kurikulum Merdeka (Fase D) yang memuat karakteristik satuan pendidikan, visi-misi, pengorganisasian pembelajaran, dan rencana pembelajaran berdiferensiasi.',
    fileNama: 'KOSP_SMPN2_Sukabumi_2025_2026.pdf',
    fileTipe: 'PDF',
    fileUkuran: '4.2 MB',
    isiRingkasan: `BAB I: KARAKTERISTIK SATUAN PENDIDIKAN
SMP Negeri 2 Kota Sukabumi terletak di jantung Kota Sukabumi, Jl. Ir. H. Juanda No. 14 Cikole. Memiliki 27 rombongan belajar dengan kekayaan budaya Sunda dan komitmen digitalisasi pembelajaran.

BAB II: VISI, MISI, DAN TUJUAN
Visi: Terwujudnya Peserta Didik yang Berakhlak Mulia, Berprestasi Unggul, Berwawasan Lingkungan Hidup, dan Berbasis Teknologi Digital Berlandaskan Profil Pelajar Pancasila.

BAB III: PENGORGANISASIAN PEMBELAJARAN
Intrakurikuler menggunakan alokasi waktu Kurikulum Merdeka. Kokurikuler Projek Penguatan Profil Pelajar Pancasila (P5) dialokasikan 20-30% dengan tema: Gaya Hidup Berkelanjutan, Bhinneka Tunggal Ika, dan Kewirausahaan Olahan Lokal Sukabumi.`
  },
  {
    id: 'dok-02',
    judul: 'SK Kepala Sekolah tentang Pembagian Tugas Mengajar & Bimbingan Konseling',
    nomorDokumen: '421.3/042-SK/SMPN.2/2025',
    kategori: 'Kepegawaian & SK',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2025-07-18',
    pengesah: 'H. Yusuf Hidayat, M.Pd. (Kepala Sekolah)',
    status: 'Berlaku',
    akses: 'Internal GTK',
    deskripsi: 'Surat Keputusan penetapan beban jam mengajar 44 guru pendidik, 4 guru bimbingan konseling, tugas tambahan wakil kepala sekolah, wali kelas 27 rombel, dan pembina laboratorium.',
    fileNama: 'SK_Beban_Mengajar_Semester_Ganjil_2025_2026.pdf',
    fileTipe: 'PDF',
    fileUkuran: '2.4 MB',
    isiRingkasan: `SURAT KEPUTUSAN KEPALA SMP NEGERI 2 KOTA SUKABUMI
NOMOR: 421.3/042-SK/SMPN.2/2025

TENTANG:
PEMBAGIAN TUGAS GURU DALAM PROSES PEMBELAJARAN DAN BIMBINGAN KONSELING SEMESTER GANJIL TAHUN AJARAN 2025/2026

MEMUTUSKAN:
Menetapkan pembagian tugas mengajar bagi para guru sebagaimana tercantum dalam lampiran keputusan ini;
1. Dra. Hj. Nunung Nurbaeti, M.M.Pd. sebagai Wakasek Kurikulum & Guru Matematika (24 JP)
2. Cecep Sunandar, S.Pd., M.Si. sebagai Wakasek Kesiswaan & Guru IPA (24 JP)
3. Rina Marlina, S.Pd. sebagai Guru Bahasa Indonesia & Wali Kelas 7-A (28 JP)
4. Wildan Ramdani, S.Kom., Gr. sebagai Guru Informatika & Kepala Lab Komputer (24 JP)`
  },
  {
    id: 'dok-03',
    judul: 'Tata Tertib, Kode Etik, dan Budaya Disiplin Peserta Didik SMPN 2 Sukabumi',
    nomorDokumen: '421.3/018-Tatib/SMPN.2/2025',
    kategori: 'Kesiswaan & Tata Tertib',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2025-07-21',
    pengesah: 'H. Yusuf Hidayat, M.Pd. & Komite Sekolah',
    status: 'Berlaku',
    akses: 'Publik Sekolah',
    deskripsi: 'Pedoman norma perilaku, ketentuan seragam sekolah (Senin Putih-Biru, Selasa Batik Spenda, Rabu Pramuka, Kamis Adat Sunda Pangsi/Kebaya, Jumat Muslim/Olahraga), tata cara presensi, dan sistem poin pembinaan karakter positif.',
    fileNama: 'Buku_Pedoman_Tata_Tertib_Siswa_2025.pdf',
    fileTipe: 'PDF',
    fileUkuran: '1.6 MB',
    isiRingkasan: `TATA TERTIB SISWA SMP NEGERI 2 KOTA SUKABUMI

PASAL 1: HAK DAN KEWAJIBAN
1. Peserta didik wajib hadir di sekolah paling lambat pukul 06.45 WIB.
2. Melaksanakan doa bersama, tadarus/renungan pagi, dan menyanyikan Lagu Indonesia Raya.
3. Menjaga kebersihan lingkungan sekolah sesuai prinsip Adiwiyata Mandiri.

PASAL 2: KETENTUAN PAKAIAN SERAGAM
- Senin: Kemeja putih, celana/rok biru tua, dasi, ikat pinggang hitam, sepatu hitam polos.
- Selasa: Batik resmi SMPN 2 Sukabumi dan celana/rok biru.
- Rabu: Seragam Pramuka Penggalang lengkap kacu dan baret/tutup kepala.
- Kamis: Pakaian khas Sunda (Pangsi hideung pikeun pameget, Kabaya pikeun istri).
- Jumat: Busana muslim/muslimah rapi dan sopan.`
  },
  {
    id: 'dok-04',
    judul: 'Standard Operating Procedure (SOP) Tata Usaha dan Pelayanan Digital',
    nomorDokumen: '421.3/SOP-TU-01/SMPN.2/2025',
    kategori: 'Tata Usaha & SOP',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2025-08-01',
    pengesah: 'H. Dedi Suhendi, S.Sos. (Kaur TU) & Kepala Sekolah',
    status: 'Berlaku',
    akses: 'Terbatas Pimpinan & TU',
    deskripsi: 'Standar operasional prosedur pengarsipan surat masuk/keluar, penerbitan surat keterangan aktif, mutasi siswa, legalisir ijazah digital, dan integrasi data Dapodik Kemendikbudristek.',
    fileNama: 'SOP_Administrasi_Tata_Usaha_Digital.docx',
    fileTipe: 'DOCX',
    fileUkuran: '890 KB',
    isiRingkasan: `STANDARD OPERATING PROCEDURE (SOP)
PELAYANAN ADMINISTRASI DAN PERSURATAN DIGITAL TU

1. TUJUAN
Memberikan kepastian waktu, transparansi, dan kemudahan dalam pelayanan persuratan kepada siswa, guru, orang tua, dan kedinasan.

2. STANDAR WAKTU PELAYANAN
- Surat Keterangan Siswa Aktif: Maksimal 15 Menit (terbit otomatis via SIAS Digital).
- Surat Pengantar Mutasi: Maksimal 1 Hari Kerja setelah verifikasi kelengkapan berkas.
- Legalisir Dokumen Ijazah/Rapor: Maksimal 30 Menit.`
  },
  {
    id: 'dok-05',
    judul: 'Rencana Kegiatan dan Anggaran Sekolah (RKAS) BOSP Tahun Anggaran 2026',
    nomorDokumen: '421.3/RKAS-BOSP/SMPN.2/2026',
    kategori: 'Keuangan & BOS',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2026-01-05',
    pengesah: 'Kepala Sekolah, Bendahara BOSP & Komite Sekolah',
    status: 'Berlaku',
    akses: 'Terbatas Pimpinan & TU',
    deskripsi: 'Rencana alokasi pembiayaan operasional sekolah dari Dana BOS Reguler dan Kinerja Kementerian Keuangan RI sebesar Rp 641.000.000 untuk 8 Standar Nasional Pendidikan.',
    fileNama: 'Dokumen_RKAS_BOSP_2026_SMPN2_Sukabumi.xlsx',
    fileTipe: 'XLSX',
    fileUkuran: '3.1 MB',
    isiRingkasan: `RINGKASAN ANGGARAN RKAS BOSP TAHUN 2026:
Total Alokasi Penerimaan: Rp 641.000.000 (948 Siswa x Rp 1.100.000 + Alokasi Kinerja)

Pos Alokasi 8 Standar Nasional Pendidikan:
1. Pengembangan Kompetensi Lulusan: Rp 45.000.000
2. Pengembangan Standar Isi & Kurikulum Merdeka: Rp 38.000.000
3. Pengembangan Standar Proses & Bahan Ajar Digital: Rp 124.000.000
4. Pengembangan Pendidik & Tenaga Kependidikan: Rp 55.000.000
5. Pengembangan Sarana & Prasarana Lab Komputer: Rp 180.000.000
6. Pengembangan Pengelolaan Sekolah: Rp 62.000.000
7. Pengembangan Pembiayaan: Rp 47.000.000
8. Pengembangan & Implementasi Penilaian: Rp 90.000.000`
  },
  {
    id: 'dok-06',
    judul: 'SK Tim Pencegahan dan Penanganan Kekerasan (TPPK) SMPN 2 Sukabumi',
    nomorDokumen: '421.3/028-SK.TPPK/SMPN.2/2025',
    kategori: 'Kepegawaian & SK',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2025-08-10',
    pengesah: 'H. Yusuf Hidayat, M.Pd. (Kepala Sekolah)',
    status: 'Berlaku',
    akses: 'Publik Sekolah',
    deskripsi: 'Surat Keputusan pembentukan Satgas TPPK sesuai Permendikbudristek No. 46 Tahun 2023 untuk memastikan lingkungan belajar SMPN 2 Kota Sukabumi aman, nyaman, dan bebas dari perundungan.',
    fileNama: 'SK_Pembentukan_Satgas_TPPK_2025.pdf',
    fileTipe: 'PDF',
    fileUkuran: '1.4 MB',
    isiRingkasan: `SURAT KEPUTUSAN KEPALA SEKOLAH
TENTANG PEMBENTUKAN TIM PENCEGAHAN DAN PENANGANAN KEKERASAN (TPPK)

Susunan Keanggotaan:
- Penanggung Jawab: H. Yusuf Hidayat, M.Pd. (Kepala Sekolah)
- Ketua TPPK: Cecep Sunandar, S.Pd., M.Si. (Wakasek Kesiswaan)
- Anggota Pendidik: Guru BK & Wali Kelas
- Anggota Komite Sekolah: Perwakilan Orang Tua Siswa
- Layanan Hotline Pengaduan: 0812-2215-8422`
  },
  {
    id: 'dok-07',
    judul: 'Laporan Buku Inventaris Aset & Sarana Prasarana Laboratorium Digital',
    nomorDokumen: '028/INV-SARPRAS/SMPN.2/2025',
    kategori: 'Sarpras & Aset',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2025-09-12',
    pengesah: 'Kaur Sarpras & Pengurus Barang Disdikbud',
    status: 'Berlaku',
    akses: 'Terbatas Pimpinan & TU',
    deskripsi: 'Daftar inventarisasi Barang Milik Daerah (BMD) mencakup 40 unit PC Lab TIK, 27 LCD Proyektor ruang kelas, peralatan praktikum Lab IPA, dan sarana olahraga sekolah.',
    fileNama: 'Buku_Inventaris_Aset_Lab_Digital_2025.xlsx',
    fileTipe: 'XLSX',
    fileUkuran: '2.8 MB',
    isiRingkasan: `DAFTAR INVENTARIS BARANG MILIK DAERAH (BMD) SMPN 2 KOTA SUKABUMI
1. Laboratorium Komputer: 40 Unit PC All-in-One Core i5, 1 Server Rack, 3 Unit Switch Gigabit, 2 AC Split 2 PK (Kondisi: Baik).
2. Laboratorium IPA: 16 Mikroskop Monokuler & Binokuler Digital, Kit Optik, Kit Mekanika, Torso Anatomi (Kondisi: Baik).
3. Ruang Kelas: 27 Unit Smart Projector & Screen, 864 Set Meja Kursi Siswa Kayu Jati Solid.`
  },
  {
    id: 'dok-08',
    judul: 'Panduan Operasional Asesmen Sumatif Berbasis Komputer & HP (CBT)',
    nomorDokumen: '421.3/PAN-ASAS/SMPN.2/2026',
    kategori: 'Panduan & Modul',
    tahunAjaran: '2025/2026',
    tanggalTerbit: '2026-10-15',
    pengesah: 'Panitia ASAS & Tim Pengembang IT Spenda',
    status: 'Draft',
    akses: 'Internal GTK',
    deskripsi: 'Petunjuk teknis pengoperasian server lokal ujian, konfigurasi jaringan WiFi kelas, panduan proktor ruang, dan SOP pengawasan asesmen sumatif semester ganjil.',
    fileNama: 'Panduan_Proktor_CBT_ASAS_2026.pdf',
    fileTipe: 'PDF',
    fileUkuran: '1.9 MB',
    isiRingkasan: `PETUNJUK TEKNIS PROKTOR DAN PENGAWAS ASESMEN CBT LOKAL
1. Proktor memastikan server lokal sinkron H-1 pelaksanaan ujian.
2. Token ujian diumumkan tepat pukul 07.30 WIB untuk sesi 1.
3. Aplikasi ujian menerapkan browser lockdown mencegah siswa berpindah aplikasi atau tab selama ujian berlangsung.`
  }
];


import { GuruTendik, NilaiMapel, Siswa } from '../types';

/**
 * Format nama lengkap guru dengan gelar tanpa duplikasi
 */
export const formatGuruFullName = (g: { nama: string; gelar?: string }): string => {
  if (!g) return '';
  const nama = (g.nama || '').trim();
  const gelar = (g.gelar || '').trim();
  if (!gelar) return nama;
  if (nama.toLowerCase().includes(gelar.toLowerCase())) return nama;
  return `${nama}, ${gelar}`;
};

/**
 * Ekstraksi tingkat kelas ('7' | '8' | '9') dari Siswa
 */
export const getGradeFromSiswa = (siswa?: Siswa | null): '7' | '8' | '9' => {
  if (!siswa) return '7';
  if (siswa.tingkat === '7' || siswa.tingkat === '8' || siswa.tingkat === '9') {
    return siswa.tingkat;
  }
  const kelas = (siswa.kelas || '').toLowerCase();
  if (kelas.includes('7') || kelas.includes('vii')) return '7';
  if (kelas.includes('8') || kelas.includes('viii')) return '8';
  if (kelas.includes('9') || kelas.includes('ix')) return '9';
  return '7';
};

/**
 * Daftar kata kunci mapel standar Kurikulum Merdeka SMP
 */
interface MapelPattern {
  key: string;
  keywords: string[];
}

const MAPEL_PATTERNS: MapelPattern[] = [
  { key: 'PAI', keywords: ['agama', 'islam', 'pai', 'paibp', 'budi pekerti'] },
  { key: 'PPKN', keywords: ['pancasila', 'ppkn', 'pkn', 'kewarganegaraan'] },
  { key: 'BIN', keywords: ['bahasa indonesia', 'b. indonesia', 'indonesia', 'sastra indonesia'] },
  { key: 'MAT', keywords: ['matematika', 'mtk', 'math', 'aljabar'] },
  { key: 'IPA', keywords: ['ilmu pengetahuan alam', 'ipa', 'sains', 'fisika', 'biologi'] },
  { key: 'IPS', keywords: ['ilmu pengetahuan sosial', 'ips', 'sosial', 'ekonomi', 'sejarah', 'geografi'] },
  { key: 'ING', keywords: ['bahasa inggris', 'b. inggris', 'inggris', 'english'] },
  { key: 'INF', keywords: ['informatika', 'tik', 'komputer', 'teknologi informasi'] },
  { key: 'PJOK', keywords: ['pjok', 'penjas', 'olahraga', 'penjaskes', 'jasmani'] },
  { key: 'SENI', keywords: ['seni', 'budaya', 'seni rupa', 'seni musik', 'seni tari', 'prakarya'] },
  { key: 'SND', keywords: ['sunda', 'basa sunda', 'bahasa daerah', 'mulok'] },
  { key: 'BK', keywords: ['bimbingan', 'konseling', 'bk'] }
];

/**
 * Normalisasi identifikasi mapel ke key utama
 */
const identifyMapelKey = (rawName: string): string => {
  const lower = rawName.toLowerCase();
  for (const pat of MAPEL_PATTERNS) {
    for (const kw of pat.keywords) {
      if (lower.includes(kw)) {
        return pat.key;
      }
    }
  }
  return lower;
};

/**
 * Cek apakah teks guru (mapel / jabatan) secara spesifik merujuk ke kelas 7, 8, atau 9
 */
const checkGradeMatch = (text: string, grade: '7' | '8' | '9'): boolean => {
  const lower = text.toLowerCase();
  if (grade === '7') {
    return (
      lower.includes('kelas 7') ||
      lower.includes('kelas vii') ||
      lower.includes('kls 7') ||
      lower.includes('7-') ||
      lower.includes('7a') ||
      lower.includes('7b') ||
      lower.includes('7c') ||
      lower.includes('7d') ||
      lower.includes('7e') ||
      lower.includes('7f') ||
      lower.includes('7g') ||
      lower.includes('7h') ||
      lower.includes('7i') ||
      /\b(7|vii)\b/.test(lower)
    );
  }
  if (grade === '8') {
    return (
      lower.includes('kelas 8') ||
      lower.includes('kelas viii') ||
      lower.includes('kls 8') ||
      lower.includes('8-') ||
      lower.includes('8a') ||
      lower.includes('8b') ||
      lower.includes('8c') ||
      lower.includes('8d') ||
      lower.includes('8e') ||
      lower.includes('8f') ||
      lower.includes('8g') ||
      lower.includes('8h') ||
      lower.includes('8i') ||
      /\b(8|viii)\b/.test(lower)
    );
  }
  if (grade === '9') {
    return (
      lower.includes('kelas 9') ||
      lower.includes('kelas ix') ||
      lower.includes('kls 9') ||
      lower.includes('9-') ||
      lower.includes('9a') ||
      lower.includes('9b') ||
      lower.includes('9c') ||
      lower.includes('9d') ||
      lower.includes('9e') ||
      lower.includes('9f') ||
      lower.includes('9g') ||
      lower.includes('9h') ||
      lower.includes('9i') ||
      /\b(9|ix)\b/.test(lower)
    );
  }
  return false;
};

/**
 * Cocokkan guru pengampu mapel otomatis berdasarkan nama mapel dan jenjang kelas (7, 8, atau 9)
 */
export const matchGuruForMapel = (
  mapelName: string,
  grade: '7' | '8' | '9',
  guruList: GuruTendik[]
): GuruTendik | undefined => {
  if (!guruList || guruList.length === 0) return undefined;

  const targetKey = identifyMapelKey(mapelName);
  const educators = guruList.filter(g => g.kategori === 'Pendidik' || !!g.mapel || (g.jabatan || '').toLowerCase().includes('guru'));

  // 1. Prioritas Tertinggi: Mapel Cocok DAN Spesifik Kelas Cocok
  const gradeSpecificMatch = educators.find(g => {
    const gMapel = (g.mapel || '').toLowerCase();
    const gJabatan = (g.jabatan || '').toLowerCase();
    const combined = `${gMapel} ${gJabatan}`;
    const mapelMatch = identifyMapelKey(combined) === targetKey;
    const gradeMatch = checkGradeMatch(combined, grade);
    return mapelMatch && gradeMatch;
  });

  if (gradeSpecificMatch) return gradeSpecificMatch;

  // 2. Prioritas Kedua: Mapel Cocok (tanpa batasan kelas / mengajar lintas kelas 7, 8, 9)
  const anyGradeMatch = educators.find(g => {
    const gMapel = (g.mapel || '').toLowerCase();
    const gJabatan = (g.jabatan || '').toLowerCase();
    const combined = `${gMapel} ${gJabatan}`;
    return identifyMapelKey(combined) === targetKey;
  });

  if (anyGradeMatch) return anyGradeMatch;

  // 3. Prioritas Ketiga: Pencarian substring kata kunci pada guruList lengkap
  const keywordMatch = guruList.find(g => {
    const text = `${g.mapel || ''} ${g.jabatan || ''}`.toLowerCase();
    const pat = MAPEL_PATTERNS.find(p => p.key === targetKey);
    if (!pat) return false;
    return pat.keywords.some(kw => text.includes(kw));
  });

  return keywordMatch;
};

/**
 * Terapkan pencocokan otomatis nama guru pengampu ke seluruh daftar nilai mapel
 */
export const applyAutoGuruToNilai = (
  nilaiList: NilaiMapel[],
  grade: '7' | '8' | '9',
  guruList: GuruTendik[]
): { updatedNilai: NilaiMapel[]; countMatched: number } => {
  if (!guruList || guruList.length === 0) {
    return { updatedNilai: nilaiList, countMatched: 0 };
  }

  let countMatched = 0;
  const updatedNilai = nilaiList.map(item => {
    const matched = matchGuruForMapel(item.namaMapel, grade, guruList);
    if (matched) {
      countMatched++;
      return {
        ...item,
        guruPengampu: formatGuruFullName(matched)
      };
    }
    return item;
  });

  return { updatedNilai, countMatched };
};

/**
 * Dapatkan opsi seluruh nama guru dari GTK untuk dropdown / datalist
 */
export const getAllGuruOptions = (guruList: GuruTendik[]): Array<{
  id: string;
  namaLengkap: string;
  nip: string;
  mapel?: string;
  jabatan?: string;
}> => {
  if (!guruList) return [];
  return guruList.map(g => ({
    id: g.id,
    namaLengkap: formatGuruFullName(g),
    nip: g.nip,
    mapel: g.mapel,
    jabatan: g.jabatan
  }));
};

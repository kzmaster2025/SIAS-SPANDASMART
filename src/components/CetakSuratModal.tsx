import { SuratResmi, ProfilSekolahData } from '../types';
import { X, Printer, CheckCircle2, QrCode } from 'lucide-react';

interface CetakSuratModalProps {
  surat: SuratResmi | null;
  onClose: () => void;
  profil?: ProfilSekolahData;
}

export const CetakSuratModal: React.FC<CetakSuratModalProps> = ({ surat, onClose, profil }) => {
  if (!surat) return null;

  const namaSekolah = profil?.nama || 'SMP NEGERI 2 KOTA SUKABUMI';
  const alamatSekolah = profil?.alamat || 'Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi 43113';
  const telepon = profil?.telepon || '(0266) 221584';
  const email = profil?.email || 'info@smpn2kotasukabumi.sch.id';
  const website = profil?.website?.replace(/^https?:\/\//, '') || 'smpn2kotasukabumi.sch.id';
  const kepalaNama = profil?.kepalaSekolah?.nama || 'H. Yusuf Hidayat, M.Pd.';
  const kepalaNip = profil?.kepalaSekolah?.nip || '19680512 199412 1 002';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-5 no-print">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format Surat Resmi Kedinasan</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lembar Surat Dinas A4 */}
        <div className="p-8 border border-slate-300 rounded-lg bg-white text-slate-900 font-serif leading-relaxed text-xs">
          {/* KOP SURAT RESMI */}
          <div className="pb-3 border-b-4 border-double border-slate-900 flex items-center justify-center gap-4 text-center">
            {profil?.logoUrl && (
              <img
                src={profil.logoUrl}
                alt="Logo Sekolah"
                className="w-16 h-16 object-contain shrink-0"
              />
            )}
            <div className="flex-1">
              <h4 className="font-sans text-xs tracking-widest font-semibold uppercase text-slate-700">
                PEMERINTAH KOTA SUKABUMI
              </h4>
              <h3 className="font-sans text-sm tracking-wider font-bold uppercase text-slate-800">
                DINAS PENDIDIKAN DAN KEBUDAYAAN
              </h3>
              <h2 className="font-sans text-base sm:text-lg font-black tracking-tight uppercase text-blue-950">
                {namaSekolah}
              </h2>
              <p className="font-sans text-[11px] text-slate-600">
                {alamatSekolah} · Telp. {telepon}
              </p>
              <p className="font-sans text-[10px] text-slate-500 font-mono">
                Website: {website} · Pos-el: {email}
              </p>
            </div>
          </div>

          {/* Nomor & Perihal */}
          <div className="my-5 flex justify-between items-start text-xs font-sans">
            <div className="space-y-0.5">
              <div className="flex gap-2">
                <span className="w-20 text-slate-600">Nomor</span>
                <span>: {surat.nomorSurat}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 text-slate-600">Sifat</span>
                <span>: Penting / Biasa</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 text-slate-600">Lampiran</span>
                <span>: - (Satu Berkas)</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 text-slate-600">Perihal</span>
                <span className="font-bold">: {surat.perihal}</span>
              </div>
            </div>

            <div className="text-right font-sans text-xs">
              <p>Sukabumi, {surat.tanggalSurat}</p>
            </div>
          </div>

          {/* Alamat Tujuan */}
          <div className="my-4 font-sans text-xs space-y-0.5">
            <p>Kepada Yth,</p>
            <p className="font-bold">{surat.tujuan}</p>
            <p>di Tempat</p>
          </div>

          {/* Isi Surat */}
          <div className="my-6 space-y-3 text-xs leading-relaxed text-justify">
            <p>
              Dengan hormat,
            </p>
            <p>
              Sehubungan dengan tertib administrasi sekolah serta pelayanan akademik peserta didik dan tenaga kependidikan di lingkungan SMP Negeri 2 Kota Sukabumi, bersama surat ini Kepala SMP Negeri 2 Kota Sukabumi menerangkan bahwa:
            </p>

            <div className="my-3 p-3 bg-slate-50 rounded border border-slate-200 font-sans space-y-1 text-xs">
              <div className="flex">
                <span className="w-36 text-slate-600">Nama Lengkap</span>
                <span className="font-bold text-slate-900">: {surat.namaTerkait}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-600">NISN / NIP</span>
                <span className="font-mono text-slate-800">: {surat.nisnNipTerkait || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-600">Satuan Pendidikan</span>
                <span className="text-slate-800">: SMP Negeri 2 Kota Sukabumi</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-600">Alamat Sekolah</span>
                <span className="text-slate-800">: Jl. Ir. H. Juanda No. 14 Cikole Kota Sukabumi</span>
              </div>
            </div>

            <p className="leading-relaxed">
              {surat.isiSuratKhusus || 'Menerangkan bahwa yang bersangkutan adalah benar terdaftar dan aktif melaksanakan kegiatan pendidikan/tugas dinas pada satuan pendidikan SMP Negeri 2 Kota Sukabumi.'}
            </p>

            <p>
              Demikian surat ini dibuat dan disampaikan dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya dengan penuh rasa tanggung jawab.
            </p>
          </div>

          {/* Tanda Tangan & QR Code */}
          <div className="mt-10 pt-4 flex justify-between items-end font-sans text-xs">
            {/* QR Verifikasi */}
            <div className="p-2 border border-slate-200 rounded flex items-center gap-2 bg-slate-50">
              <QrCode className="w-10 h-10 text-slate-800 shrink-0" />
              <div className="text-[9px] text-slate-500 font-mono leading-tight">
                <p className="font-bold text-slate-700">DOKUMEN RESMI DISDIKBUD</p>
                <p>Verifikasi Digital ID #{surat.id}</p>
                <p>SMPN 2 Kota Sukabumi</p>
              </div>
            </div>

            {/* Kolom Tanda Tangan */}
            <div className="text-center w-60">
              <p>Sukabumi, {surat.tanggalSurat}</p>
              <p className="font-bold mt-0.5">Kepala Sekolah,</p>
              <div className="relative my-2 h-16 flex items-center justify-center">
                {/* Simulated Digital Stamp */}
                <div className="absolute border-2 border-blue-600/70 rounded-full px-3 py-1 rotate-[-8deg] text-blue-700 font-mono text-[9px] font-bold">
                  ★ DINAS DIKBUD KOTA SUKABUMI ★<br />SMP NEGERI 2
                </div>
              </div>
              <p className="font-bold underline text-slate-900 text-sm">{kepalaNama}</p>
              <p className="text-[11px] font-mono text-slate-600">NIP {kepalaNip}</p>
              <p className="text-[10px] text-slate-500">{profil?.kepalaSekolah?.pangkat || 'Pembina Utama Muda, IV/c'}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500 font-mono">
            Format Dokumen Dinas Resmi Standar Permendikbud
          </span>
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
              <span>Cetak Surat (PDF)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { CustomMenuItem, CustomItemType } from '../types';
import { processVideoUrl } from '../utils/videoHelper';
import {
  X,
  Upload,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Play,
  ExternalLink,
  Plus,
  Save,
  Trash2,
  AlertCircle,
  Film,
  Camera,
  Globe
} from 'lucide-react';

interface CustomItemUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuId: string;
  menuLabel: string;
  editingItem: CustomMenuItem | null;
  onSaveItem: (item: CustomMenuItem) => void;
  onDeleteItem?: (id: string) => void;
}

export const CustomItemUploadModal: React.FC<CustomItemUploadModalProps> = ({
  isOpen,
  onClose,
  menuId,
  menuLabel,
  editingItem,
  onSaveItem,
  onDeleteItem
}) => {
  const [tipe, setTipe] = useState<CustomItemType>('video');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('Dokumentasi Kegiatan');
  const [uploader, setUploader] = useState('Admin SIAS SMPN 2');

  // Video states
  const [videoMethod, setVideoMethod] = useState<'url' | 'upload'>('url');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('');

  // Image states
  const [imageMethod, setImageMethod] = useState<'upload' | 'url'>('upload');
  const [gambarUrl, setGambarUrl] = useState('');
  const [caption, setCaption] = useState('');

  // Link states
  const [tautanUrl, setTautanUrl] = useState('');
  const [tautanLabel, setTautanLabel] = useState('Kunjungi Tautan');

  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileImageRef = useRef<HTMLInputElement>(null);
  const fileVideoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingItem) {
      setTipe(editingItem.tipe);
      setJudul(editingItem.judul);
      setDeskripsi(editingItem.deskripsi || '');
      setKategori(editingItem.kategori || 'Dokumentasi Kegiatan');
      setUploader(editingItem.uploader || 'Admin SIAS');

      // Video
      setVideoUrl(editingItem.videoUrl || '');
      setVideoDuration(editingItem.videoDuration || '');
      setVideoMethod(editingItem.videoUrl?.startsWith('data:') ? 'upload' : 'url');

      // Image
      setGambarUrl(editingItem.gambarUrl || '');
      setCaption(editingItem.caption || '');
      setImageMethod(editingItem.gambarUrl?.startsWith('data:') ? 'upload' : 'url');

      // Link
      setTautanUrl(editingItem.tautanUrl || '');
      setTautanLabel(editingItem.tautanLabel || 'Kunjungi Tautan');
    } else {
      setTipe('video');
      setJudul('');
      setDeskripsi('');
      setKategori('Dokumentasi Kegiatan');
      setUploader('Admin SIAS SMPN 2');

      setVideoUrl('');
      setVideoDuration('');
      setVideoMethod('url');

      setGambarUrl('');
      setCaption('');
      setImageMethod('upload');

      setTautanUrl('');
      setTautanLabel('Kunjungi Tautan');
    }
    setConfirmDelete(false);
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  // Handle Image File Upload (Convert to Base64 data URL)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Ukuran gambar maksimal 8MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setGambarUrl(reader.result);
          if (!caption) setCaption(file.name.replace(/\.[^/.]+$/, ''));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Video File Upload (Convert to Base64 / Blob URL)
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert('Ukuran berkas video upload langsung maksimal 25MB. Untuk video berdurasi panjang, disarankan menempelkan tautan YouTube atau Google Drive agar lebih cepat.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setVideoUrl(reader.result);
          if (!videoDuration) setVideoDuration('Video Lokal');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim()) return;

    let processedEmbedUrl: string | undefined = undefined;
    if (tipe === 'video' && videoUrl) {
      const processed = processVideoUrl(videoUrl);
      processedEmbedUrl = processed.embedUrl;
    }

    const item: CustomMenuItem = {
      id: editingItem ? editingItem.id : `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      menuId,
      tipe,
      judul: judul.trim(),
      deskripsi: deskripsi.trim(),
      kategori: kategori.trim() || undefined,
      tanggal: editingItem ? editingItem.tanggal : new Date().toISOString().split('T')[0],
      uploader: uploader.trim() || 'Admin SIAS',

      // Video fields
      videoUrl: tipe === 'video' ? videoUrl.trim() : undefined,
      videoEmbedUrl: tipe === 'video' ? processedEmbedUrl : undefined,
      videoDuration: tipe === 'video' ? videoDuration.trim() || undefined : undefined,

      // Image fields
      gambarUrl: tipe === 'gambar' ? gambarUrl.trim() : undefined,
      caption: tipe === 'gambar' ? caption.trim() || undefined : undefined,

      // Link fields
      tautanUrl: tipe === 'tautan' ? tautanUrl.trim() : undefined,
      tautanLabel: tipe === 'tautan' ? tautanLabel.trim() || 'Kunjungi Tautan' : undefined
    };

    onSaveItem(item);
    onClose();
  };

  const handleDelete = () => {
    if (editingItem && onDeleteItem) {
      onDeleteItem(editingItem.id);
      onClose();
    }
  };

  // Video preview processor
  const videoPreview = tipe === 'video' && videoUrl ? processVideoUrl(videoUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              {tipe === 'video' && <Video className="w-5 h-5 text-rose-400" />}
              {tipe === 'gambar' && <ImageIcon className="w-5 h-5 text-emerald-400" />}
              {tipe === 'tautan' && <LinkIcon className="w-5 h-5 text-sky-400" />}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {editingItem ? 'Edit Konten Menu' : 'Upload Data Baru ke Menu'}
              </h2>
              <p className="text-xs text-slate-300">
                Menu Tujuan: <span className="font-semibold text-white">{menuLabel}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTipe('video')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tipe === 'video'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Upload Video</span>
          </button>

          <button
            type="button"
            onClick={() => setTipe('gambar')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tipe === 'gambar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Gambar / Foto</span>
          </button>

          <button
            type="button"
            onClick={() => setTipe('tautan')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tipe === 'tautan'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Tambah Tautan / Link</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Judul & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Judul {tipe === 'video' ? 'Video' : tipe === 'gambar' ? 'Gambar / Foto' : 'Tautan'} <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder={
                  tipe === 'video'
                    ? 'Contoh: Liputan Gelar Karya Siswa P5 Semester Ganjil'
                    : tipe === 'gambar'
                    ? 'Contoh: Foto Bersama Dewan Guru & Komite Sekolah'
                    : 'Contoh: Platform Merdeka Mengajar (PMM) Kemdikbud'
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kategori / Tag
              </label>
              <input
                type="text"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="P5, Upacara, Ekskul, Belajar..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Keterangan / Deskripsi Singkat
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Berikan ringkasan materi, informasi tanggal liputan, atau petunjuk penggunaan..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          {/* TIPE 1: VIDEO */}
          {tipe === 'video' && (
            <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-rose-600" />
                  Sumber Video
                </span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-rose-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setVideoMethod('url')}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      videoMethod === 'url' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Link YouTube / Drive / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoMethod('upload')}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      videoMethod === 'upload' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Unggah File Video (.mp4)
                  </button>
                </div>
              </div>

              {videoMethod === 'url' ? (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tautan Video (YouTube, Google Drive, atau URL MP4) <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... atau https://drive.google.com/..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-rose-600 font-mono"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Mendukung link YouTube, YouTube Shorts, Google Drive Sharing, dan direct URL .mp4/.webm.
                  </p>
                </div>
              ) : (
                <div>
                  <input
                    ref={fileVideoRef}
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={handleVideoFileChange}
                  />
                  <div
                    onClick={() => fileVideoRef.current?.click()}
                    className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white rounded-xl p-4 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-rose-500 mx-auto mb-1" />
                    <p className="font-semibold text-rose-900">
                      {videoUrl.startsWith('data:video') ? 'Video Berhasil Dipilih (Klik untuk ganti)' : 'Klik untuk Unggah Berkas Video (.mp4 / .webm)'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Maksimal 25MB untuk penyimpanan langsung browser.</p>
                  </div>
                </div>
              )}

              {/* Video Preview */}
              {videoUrl && (
                <div className="pt-2 border-t border-rose-200/60">
                  <div className="text-[11px] font-semibold text-rose-900 mb-1 flex items-center justify-between">
                    <span>Pratinjau Video:</span>
                    <input
                      type="text"
                      placeholder="Durasi (e.g. 05:20)"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="px-2 py-0.5 bg-white border border-rose-200 rounded text-[10px] w-28 font-mono"
                    />
                  </div>
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
                    {videoPreview?.type === 'youtube' && videoPreview.embedUrl ? (
                      <iframe
                        src={videoPreview.embedUrl}
                        title="Preview Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : videoPreview?.type === 'direct' && videoPreview.directUrl ? (
                      <video
                        src={videoPreview.directUrl}
                        controls
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-4 text-slate-400">
                        <Play className="w-8 h-8 mx-auto mb-1 text-slate-500" />
                        <p className="text-[11px]">Preview video siap ditampilkan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TIPE 2: GAMBAR */}
          {tipe === 'gambar' && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  Sumber Gambar / Foto
                </span>
                <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-emerald-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageMethod('upload')}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      imageMethod === 'upload' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Unggah File Foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMethod('url')}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      imageMethod === 'url' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tempel Link URL Gambar
                  </button>
                </div>
              </div>

              {imageMethod === 'upload' ? (
                <div>
                  <input
                    ref={fileImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                  <div
                    onClick={() => fileImageRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white rounded-xl p-5 text-center cursor-pointer transition-colors"
                  >
                    <Upload className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                    <p className="font-semibold text-emerald-950">
                      {gambarUrl ? 'Foto Terpilih (Klik untuk mengganti)' : 'Klik untuk Pilih Foto dari Komputer / HP'}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Mendukung format JPG, PNG, WEBP hingga 8MB</p>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    URL Tautan Gambar (Web / Cloud) <span className="text-emerald-700">*</span>
                  </label>
                  <input
                    type="url"
                    value={gambarUrl}
                    onChange={(e) => setGambarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau https://..."
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                  />
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Keterangan Foto / Caption
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Suasana apel pagi peringatan hari pahlawan..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Preview image */}
              {gambarUrl && (
                <div className="pt-2 border-t border-emerald-200/60">
                  <div className="text-[11px] font-semibold text-emerald-900 mb-1">Pratinjau Foto:</div>
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-48 bg-slate-100 flex items-center justify-center">
                    <img
                      src={gambarUrl}
                      alt="Pratinjau"
                      className="max-h-48 w-full object-cover"
                      onError={() => alert('Gagal memuat pratinjau gambar. Periksa kembali link URL.')}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TIPE 3: TAUTAN */}
          {tipe === 'tautan' && (
            <div className="p-4 bg-sky-50/50 border border-sky-200 rounded-xl space-y-3">
              <span className="font-bold text-sky-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-600" />
                Informasi Tautan & Web
              </span>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Alamat Web / URL Tautan <span className="text-sky-700">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={tautanUrl}
                  onChange={(e) => setTautanUrl(e.target.value)}
                  placeholder="https://guru.kemdikbud.go.id atau https://..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-sky-600 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Tautan dapat menuju portal dinas, aplikasi guru, Google Classroom, Canva, atau tautan Drive.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Teks Tombol Aksi
                  </label>
                  <input
                    type="text"
                    value={tautanLabel}
                    onChange={(e) => setTautanLabel(e.target.value)}
                    placeholder="Buka Portal / Akses Tautan"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-sky-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nama Pengunggah / Sumber
                  </label>
                  <input
                    type="text"
                    value={uploader}
                    onChange={(e) => setUploader(e.target.value)}
                    placeholder="Admin SIAS / Tim Kurikulum"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-sky-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Delete Option */}
          {editingItem && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-600 font-semibold">Hapus item ini?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 text-[11px] text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Konten Ini</span>
                </button>
              )}
            </div>
          )}

          {/* Submit Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingItem ? 'Simpan Perubahan' : 'Upload & Publikasikan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

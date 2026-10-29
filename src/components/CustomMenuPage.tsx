import React, { useState, useMemo } from 'react';
import { CustomMenu, CustomMenuItem, CustomItemType } from '../types';
import { getCustomMenuIcon } from '../utils/customIconHelper';
import { processVideoUrl } from '../utils/videoHelper';
import {
  Plus,
  Settings,
  Search,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Play,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
  User,
  X,
  Download,
  Copy,
  Check,
  Maximize2,
  Lock,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface CustomMenuPageProps {
  menu: CustomMenu;
  items: CustomMenuItem[];
  isAdmin: boolean;
  onOpenEditMenu: (menu: CustomMenu) => void;
  onOpenAddItem: (menuId: string) => void;
  onOpenEditItem: (item: CustomMenuItem) => void;
  onDeleteItem: (id: string) => void;
  onOpenAdminLogin: () => void;
}

export const CustomMenuPage: React.FC<CustomMenuPageProps> = ({
  menu,
  items,
  isAdmin,
  onOpenEditMenu,
  onOpenAddItem,
  onOpenEditItem,
  onDeleteItem,
  onOpenAdminLogin
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'gambar' | 'tautan'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<CustomMenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<CustomMenuItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const MenuIcon = getCustomMenuIcon(menu.iconName);

  // Filter items belonging to this menu
  const menuItems = useMemo(() => {
    return items.filter(item => item.menuId === menu.id);
  }, [items, menu.id]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchType = activeFilter === 'all' || item.tipe === activeFilter;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        item.judul.toLowerCase().includes(query) ||
        (item.deskripsi && item.deskripsi.toLowerCase().includes(query)) ||
        (item.kategori && item.kategori.toLowerCase().includes(query)) ||
        (item.uploader && item.uploader.toLowerCase().includes(query));
      return matchType && matchSearch;
    });
  }, [menuItems, activeFilter, searchQuery]);

  const countVideo = menuItems.filter(i => i.tipe === 'video').length;
  const countGambar = menuItems.filter(i => i.tipe === 'gambar').length;
  const countTautan = menuItems.filter(i => i.tipe === 'tautan').length;

  const handleCopyLink = (id: string, url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <MenuIcon className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Menu Kustom Sekolah
                </span>
                {menu.adminOnly && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Khusus Admin
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">
                  {menuItems.length} Konten Tersedia
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {menu.label}
              </h1>

              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {menu.deskripsi || 'Halaman kelola konten multimedia, dokumentasi kegiatan, dan tautan resmi sekolah.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isAdmin ? (
              <>
                <button
                  onClick={() => onOpenEditMenu(menu)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
                  title="Ubah nama menu, ikon, atau hak akses"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Pengaturan Menu</span>
                </button>

                <button
                  onClick={() => onOpenAddItem(menu.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Data Baru</span>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-blue-700" />
                <span>Masuk Admin untuk Upload</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Badges */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-50 border border-rose-100 text-rose-800 font-medium">
            <Video className="w-3.5 h-3.5 text-rose-600" />
            <span>{countVideo} Video</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 font-medium">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{countGambar} Gambar / Foto</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-50 border border-sky-100 text-sky-800 font-medium">
            <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>{countTautan} Tautan / Link</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul video, foto, materi, atau tautan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveFilter('video')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'video'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-rose-600" />
            <span>Video ({countVideo})</span>
          </button>
          <button
            onClick={() => setActiveFilter('gambar')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'gambar'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Foto ({countGambar})</span>
          </button>
          <button
            onClick={() => setActiveFilter('tautan')}
            className={`px-3 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeFilter === 'tautan'
                ? 'bg-white text-sky-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5 text-sky-600" />
            <span>Tautan ({countTautan})</span>
          </button>
        </div>
      </div>

      {/* Grid of Content Cards */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">
            Belum Ada Konten di Menu Ini
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            {isAdmin
              ? 'Anda dapat mengunggah video kegiatan, galeri gambar/foto sekolah, serta tautan portal resmi menggunakan tombol di bawah.'
              : 'Belum ada data yang diunggah ke menu ini oleh administrator sekolah.'}
          </p>
          {isAdmin ? (
            <button
              onClick={() => onOpenAddItem(menu.id)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video / Foto / Tautan Pertama</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Masuk sebagai Admin</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const isVideo = item.tipe === 'video';
            const isGambar = item.tipe === 'gambar';
            const isTautan = item.tipe === 'tautan';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Media Visual Area */}
                  {isVideo && (
                    <div
                      onClick={() => setSelectedVideo(item)}
                      className="relative aspect-video w-full bg-slate-950 overflow-hidden cursor-pointer group/media flex items-center justify-center"
                    >
                      {item.videoUrl && processVideoUrl(item.videoUrl).type === 'direct' ? (
                        <video
                          src={item.videoUrl}
                          className="w-full h-full object-cover opacity-80 group-hover/media:opacity-100 transition-opacity"
                        />
                      ) : item.videoUrl?.includes('youtube') || item.videoUrl?.includes('youtu.be') ? (
                        <img
                          src={`https://img.youtube.com/vi/${item.videoUrl.match(/(?:youtu\.be\/|watch\?v=)([\w-]{11})/)?.[1] || ''}/hqdefault.jpg`}
                          alt={item.judul}
                          className="w-full h-full object-cover opacity-80 group-hover/media:opacity-95 transition-opacity"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-rose-950 flex items-center justify-center">
                          <Video className="w-10 h-10 text-rose-400/70" />
                        </div>
                      )}

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/30 group-hover/media:bg-black/20 flex items-center justify-center transition-colors">
                        <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover/media:scale-110 transition-transform">
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                      </div>

                      {/* Badges Overlay */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                          <Video className="w-3 h-3 text-rose-400" />
                          Video
                        </span>
                      </div>

                      {item.videoDuration && (
                        <div className="absolute bottom-2.5 right-2.5">
                          <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono">
                            {item.videoDuration}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {isGambar && (
                    <div
                      onClick={() => setSelectedImage(item)}
                      className="relative aspect-video w-full bg-slate-100 overflow-hidden cursor-pointer group/media flex items-center justify-center"
                    >
                      {item.gambarUrl ? (
                        <img
                          src={item.gambarUrl}
                          alt={item.judul}
                          className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-emerald-50 flex items-center justify-center">
                          <ImageIcon className="w-10 h-10 text-emerald-300" />
                        </div>
                      )}

                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-emerald-400" />
                          Foto
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover/media:opacity-100 transition-opacity">
                        <span className="p-1.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-xs inline-flex items-center">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  )}

                  {isTautan && (
                    <div className="p-4 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block">
                            Tautan Resmi / Portal
                          </span>
                          <span className="text-xs font-mono text-slate-500 truncate max-w-[200px] block">
                            {item.tautanUrl?.replace(/^https?:\/\//, '').split('/')[0] || 'Link Web'}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-semibold">
                        Link Eksternal
                      </span>
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="p-4.5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      {item.kategori && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {item.kategori}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {item.tanggal}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-700 transition-colors">
                      {item.judul}
                    </h3>

                    {item.deskripsi && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {item.deskripsi}
                      </p>
                    )}

                    {isGambar && item.caption && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        "{item.caption}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[130px]">
                    <User className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.uploader}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* View/Action Button */}
                    {isVideo && (
                      <button
                        onClick={() => setSelectedVideo(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Putar</span>
                      </button>
                    )}

                    {isGambar && (
                      <button
                        onClick={() => setSelectedImage(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Lihat Foto</span>
                      </button>
                    )}

                    {isTautan && item.tautanUrl && (
                      <>
                        <button
                          onClick={() => handleCopyLink(item.id, item.tautanUrl)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          title="Salin Tautan"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={item.tautanUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors cursor-pointer"
                        >
                          <span>{item.tautanLabel || 'Kunjungi'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}

                    {/* Admin Actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
                        <button
                          onClick={() => onOpenEditItem(item)}
                          className="p-1 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                          title="Edit Konten"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                          title="Hapus Konten"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Lightbox Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col text-white">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold truncate max-w-xl">{selectedVideo.judul}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedVideo.kategori} · Diunggah oleh {selectedVideo.uploader}</p>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black flex items-center justify-center">
              {(() => {
                const processed = processVideoUrl(selectedVideo.videoUrl || '');
                if (processed.type === 'youtube' && processed.embedUrl) {
                  return (
                    <iframe
                      src={processed.embedUrl}
                      title={selectedVideo.judul}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                }
                if (processed.type === 'drive' && processed.embedUrl) {
                  return (
                    <iframe
                      src={processed.embedUrl}
                      title={selectedVideo.judul}
                      className="w-full h-full"
                      allow="autoplay"
                    />
                  );
                }
                if (processed.type === 'direct' && processed.directUrl) {
                  return (
                    <video
                      src={processed.directUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  );
                }
                return (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">Video tidak dapat diputar langsung.</p>
                    {selectedVideo.videoUrl && (
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                      >
                        Buka di Tab Baru <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })()}
            </div>

            {selectedVideo.deskripsi && (
              <div className="p-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
                <p className="leading-relaxed">{selectedVideo.deskripsi}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 truncate max-w-xl">{selectedImage.judul}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{selectedImage.kategori} · {selectedImage.tanggal}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedImage.gambarUrl && (
                  <a
                    href={selectedImage.gambarUrl}
                    download={selectedImage.judul.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Unduh Gambar"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900 flex-1 overflow-auto flex items-center justify-center">
              <img
                src={selectedImage.gambarUrl}
                alt={selectedImage.judul}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {(selectedImage.caption || selectedImage.deskripsi) && (
              <div className="p-4 bg-white border-t border-slate-200 text-xs text-slate-700">
                {selectedImage.caption && (
                  <p className="font-semibold text-slate-900 mb-1">"{selectedImage.caption}"</p>
                )}
                {selectedImage.deskripsi && (
                  <p className="text-slate-600 leading-relaxed">{selectedImage.deskripsi}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Video,
  Film,
  Image,
  Images,
  Link,
  Link2,
  Globe,
  Tv,
  Sparkles,
  Folder,
  FolderPlus,
  BookOpen,
  Camera,
  Megaphone,
  Trophy,
  PlayCircle,
  Bookmark,
  Share2,
  Layers,
  Award,
  LucideIcon
} from 'lucide-react';

export const AVAILABLE_CUSTOM_ICONS: { name: string; label: string; icon: LucideIcon }[] = [
  { name: 'Video', label: 'Video / Kamera', icon: Video },
  { name: 'Film', label: 'Sinema / Liputan', icon: Film },
  { name: 'PlayCircle', label: 'Pemutar Media', icon: PlayCircle },
  { name: 'Image', label: 'Gambar / Foto', icon: Image },
  { name: 'Images', label: 'Galeri Album', icon: Images },
  { name: 'Camera', label: 'Dokumentasi', icon: Camera },
  { name: 'Link', label: 'Tautan / Web', icon: Link },
  { name: 'Globe', label: 'Portal Internet', icon: Globe },
  { name: 'Tv', label: 'Saluran Siaran / TV', icon: Tv },
  { name: 'Megaphone', label: 'Pengumuman / Humas', icon: Megaphone },
  { name: 'Sparkles', label: 'Kreasi / P5', icon: Sparkles },
  { name: 'Folder', label: 'Folder Berkas', icon: Folder },
  { name: 'BookOpen', label: 'Buku & Literasi', icon: BookOpen },
  { name: 'Trophy', label: 'Prestasi & Lomba', icon: Trophy },
  { name: 'Award', label: 'Penghargaan', icon: Award },
  { name: 'Layers', label: 'Kategori Khusus', icon: Layers }
];

export const getCustomMenuIcon = (name: string): LucideIcon => {
  const found = AVAILABLE_CUSTOM_ICONS.find(item => item.name.toLowerCase() === (name || '').toLowerCase());
  return found ? found.icon : Folder;
};

import React, { useState, useEffect } from 'react';
import { CustomMenu } from '../types';
import { AVAILABLE_CUSTOM_ICONS } from '../utils/customIconHelper';
import { X, Plus, Edit3, Trash2, ShieldCheck, Lock, Globe, Sparkles, FolderPlus } from 'lucide-react';

interface CustomMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingMenu: CustomMenu | null;
  onSaveMenu: (menu: CustomMenu) => void;
  onDeleteMenu?: (id: string) => void;
}

export const CustomMenuModal: React.FC<CustomMenuModalProps> = ({
  isOpen,
  onClose,
  editingMenu,
  onSaveMenu,
  onDeleteMenu
}) => {
  const [label, setLabel] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [iconName, setIconName] = useState('Video');
  const [adminOnly, setAdminOnly] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (editingMenu) {
      setLabel(editingMenu.label);
      setDeskripsi(editingMenu.deskripsi || '');
      setIconName(editingMenu.iconName || 'Video');
      setAdminOnly(editingMenu.adminOnly || false);
    } else {
      setLabel('');
      setDeskripsi('');
      setIconName('Video');
      setAdminOnly(false);
    }
    setConfirmDelete(false);
  }, [editingMenu, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const menuId = editingMenu ? editingMenu.id : `menu-${Date.now()}`;
    const newMenu: CustomMenu = {
      id: menuId,
      label: label.trim(),
      deskripsi: deskripsi.trim() || undefined,
      iconName,
      adminOnly,
      order: editingMenu ? editingMenu.order : Date.now(),
      createdAt: editingMenu ? editingMenu.createdAt : new Date().toISOString().split('T')[0]
    };

    onSaveMenu(newMenu);
    onClose();
  };

  const handleDelete = () => {
    if (editingMenu && onDeleteMenu) {
      onDeleteMenu(editingMenu.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <FolderPlus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {editingMenu ? 'Edit Menu Kustom' : 'Tambah Tombol Menu Baru'}
              </h2>
              <p className="text-xs text-slate-300">
                Menu akan otomatis muncul di Sidebar navigasi sekolah
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Menu Name */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Nama Tombol Menu <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Contoh: Galeri Video & Ekstrakurikuler, Media Ajar, Portal Web..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white font-medium"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Nama yang akan tertera pada daftar tombol navigasi Sidebar sebelah kiri.
            </p>
          </div>

          {/* Menu Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Deskripsi Singkat Halaman (Opsional)
            </label>
            <textarea
              rows={2}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Kumpulan video liputan, album foto kegiatan, dan tautan berkas resmi..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Pilih Ikon Menu
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50">
              {AVAILABLE_CUSTOM_ICONS.map((item) => {
                const IconComponent = item.icon;
                const isSelected = iconName.toLowerCase() === item.name.toLowerCase();
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setIconName(item.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50 hover:border-blue-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mb-1" />
                    <span className="text-[10px] truncate max-w-full font-medium leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Access Permission */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Hak Akses Menu
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  !adminOnly
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="accessType"
                  checked={!adminOnly}
                  onChange={() => setAdminOnly(false)}
                  className="mt-0.5 text-blue-600"
                />
                <div>
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Publik & Tamu</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Dapat dilihat oleh semua guru, siswa, orang tua, dan pengunjung tanpa login.
                  </p>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  adminOnly
                    ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="accessType"
                  checked={adminOnly}
                  onChange={() => setAdminOnly(true)}
                  className="mt-0.5 text-amber-600"
                />
                <div>
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Khusus Admin</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Hanya dapat dibuka oleh Admin setelah memasukkan password admin.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Delete Menu Confirmation */}
          {editingMenu && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-rose-600 font-semibold">Yakin hapus menu ini?</span>
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
                  <span>Hapus Menu Ini</span>
                </button>
              )}
            </div>
          )}

          {/* Footer Submit */}
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
              <Plus className="w-3.5 h-3.5" />
              <span>{editingMenu ? 'Simpan Perubahan Menu' : 'Buat Menu Sekarang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Siswa,
  GuruTendik,
  DokumenSekolah,
  SuratResmi,
  TransaksiKeuangan,
  AgendaSekolah,
  ProfilSekolahData,
  CustomMenu,
  CustomMenuItem,
  RaporSiswa
} from '../types';
import {
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_SURAT,
  INITIAL_TRANSAKSI,
  INITIAL_AGENDA,
  INITIAL_DOKUMEN,
  PROFIL_SEKOLAH
} from '../data/mockData';
import {
  INITIAL_CUSTOM_MENUS,
  INITIAL_CUSTOM_ITEMS
} from '../data/mockCustomData';

// -------------------------------------------------------------
// Real-time Listeners (onSnapshot) with fallback and sync
// -------------------------------------------------------------

export function subscribeProfilSekolah(onUpdate: (profil: ProfilSekolahData) => void): () => void {
  const docRef = doc(db, 'profil_sekolah', 'utama');
  return onSnapshot(
    docRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as ProfilSekolahData);
      } else {
        // Seed default profile if not exists
        try {
          const defaultData = PROFIL_SEKOLAH as unknown as ProfilSekolahData;
          await setDoc(docRef, defaultData);
          onUpdate(defaultData);
        } catch (e) {
          console.warn('Initial profile seed failed:', e);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'profil_sekolah/utama');
    }
  );
}

export function subscribeGuru(onUpdate: (gurus: GuruTendik[]) => void): () => void {
  const colRef = collection(db, 'guru');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: GuruTendik[] = [];
        snapshot.forEach((d) => list.push(d.data() as GuruTendik));
        onUpdate(list);
      } else {
        // Auto-seed initial GTK data to cloud
        try {
          const batch = writeBatch(db);
          INITIAL_GURU.forEach((g) => {
            batch.set(doc(db, 'guru', g.id), g);
          });
          await batch.commit();
        } catch (e) {
          console.warn('Initial guru seed failed:', e);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'guru');
    }
  );
}

export function subscribeSiswa(onUpdate: (siswa: Siswa[]) => void): () => void {
  const colRef = collection(db, 'siswa');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: Siswa[] = [];
        snapshot.forEach((d) => list.push(d.data() as Siswa));
        onUpdate(list);
      } else {
        try {
          const batch = writeBatch(db);
          INITIAL_SISWA.forEach((s) => {
            batch.set(doc(db, 'siswa', s.id), s);
          });
          await batch.commit();
        } catch (e) {
          console.warn('Initial siswa seed failed:', e);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'siswa');
    }
  );
}

export function subscribeCustomMenus(onUpdate: (menus: CustomMenu[]) => void): () => void {
  const colRef = collection(db, 'custom_menus');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: CustomMenu[] = [];
        snapshot.forEach((d) => list.push(d.data() as CustomMenu));
        list.sort((a, b) => a.order - b.order);
        onUpdate(list);
      } else {
        try {
          const batch = writeBatch(db);
          INITIAL_CUSTOM_MENUS.forEach((m) => {
            batch.set(doc(db, 'custom_menus', m.id), m);
          });
          await batch.commit();
        } catch (e) {
          console.warn('Initial custom menus seed failed:', e);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'custom_menus');
    }
  );
}

export function subscribeCustomItems(onUpdate: (items: CustomMenuItem[]) => void): () => void {
  const colRef = collection(db, 'custom_items');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: CustomMenuItem[] = [];
        snapshot.forEach((d) => list.push(d.data() as CustomMenuItem));
        onUpdate(list);
      } else {
        try {
          const batch = writeBatch(db);
          INITIAL_CUSTOM_ITEMS.forEach((it) => {
            batch.set(doc(db, 'custom_items', it.id), it);
          });
          await batch.commit();
        } catch (e) {
          console.warn('Initial custom items seed failed:', e);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'custom_items');
    }
  );
}

export function subscribeDokumen(onUpdate: (docs: DokumenSekolah[]) => void): () => void {
  const colRef = collection(db, 'dokumen');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: DokumenSekolah[] = [];
        snapshot.forEach((d) => list.push(d.data() as DokumenSekolah));
        onUpdate(list);
      } else {
        if (localStorage.getItem('sias_dokumen_seeded')) {
          onUpdate([]);
        } else {
          localStorage.setItem('sias_dokumen_seeded', 'true');
          try {
            const batch = writeBatch(db);
            INITIAL_DOKUMEN.forEach((docItem) => {
              batch.set(doc(db, 'dokumen', docItem.id), docItem);
            });
            await batch.commit();
          } catch (e) {
            console.warn('Initial dokumen seed failed:', e);
            onUpdate([]);
          }
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'dokumen');
    }
  );
}

export function subscribeSurat(onUpdate: (surat: SuratResmi[]) => void): () => void {
  const colRef = collection(db, 'surat');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: SuratResmi[] = [];
        snapshot.forEach((d) => list.push(d.data() as SuratResmi));
        onUpdate(list);
      } else {
        if (localStorage.getItem('sias_surat_seeded')) {
          onUpdate([]);
        } else {
          localStorage.setItem('sias_surat_seeded', 'true');
          try {
            const batch = writeBatch(db);
            INITIAL_SURAT.forEach((s) => {
              batch.set(doc(db, 'surat', s.id), s);
            });
            await batch.commit();
          } catch (e) {
            console.warn('Initial surat seed failed:', e);
            onUpdate([]);
          }
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'surat');
    }
  );
}

export function subscribeTransaksi(onUpdate: (transaksi: TransaksiKeuangan[]) => void): () => void {
  const colRef = collection(db, 'transaksi');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: TransaksiKeuangan[] = [];
      snapshot.forEach((d) => list.push(d.data() as TransaksiKeuangan));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'transaksi');
    }
  );
}

export function subscribeAgenda(onUpdate: (agenda: AgendaSekolah[]) => void): () => void {
  const colRef = collection(db, 'agenda');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const list: AgendaSekolah[] = [];
        snapshot.forEach((d) => list.push(d.data() as AgendaSekolah));
        onUpdate(list);
      } else {
        if (localStorage.getItem('sias_agenda_seeded')) {
          onUpdate([]);
        } else {
          localStorage.setItem('sias_agenda_seeded', 'true');
          try {
            const batch = writeBatch(db);
            INITIAL_AGENDA.forEach((a) => {
              batch.set(doc(db, 'agenda', a.id), a);
            });
            await batch.commit();
          } catch (e) {
            console.warn('Initial agenda seed failed:', e);
            onUpdate([]);
          }
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'agenda');
    }
  );
}

// -------------------------------------------------------------
// Mutation operations (Create, Update, Delete) with Firestore
// -------------------------------------------------------------

export async function saveProfilSekolahCloud(profil: ProfilSekolahData): Promise<void> {
  const path = 'profil_sekolah/utama';
  try {
    await setDoc(doc(db, 'profil_sekolah', 'utama'), profil);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSiswaCloud(siswa: Siswa): Promise<void> {
  const path = `siswa/${siswa.id}`;
  try {
    await setDoc(doc(db, 'siswa', siswa.id), siswa);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSiswaCloud(id: string): Promise<void> {
  const path = `siswa/${id}`;
  try {
    await deleteDoc(doc(db, 'siswa', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function batchImportSiswaCloud(imported: Siswa[], mode: 'append' | 'replace'): Promise<void> {
  try {
    if (mode === 'replace') {
      const existing = await getDocs(collection(db, 'siswa'));
      const delBatch = writeBatch(db);
      existing.forEach((d) => delBatch.delete(d.ref));
      await delBatch.commit();
    }

    // Firestore batch limit is 500 operations per batch, safely chunk by 400
    const chunkSize = 400;
    for (let i = 0; i < imported.length; i += chunkSize) {
      const chunk = imported.slice(i, i + chunkSize);
      const addBatch = writeBatch(db);
      chunk.forEach((s) => {
        addBatch.set(doc(db, 'siswa', s.id), s);
      });
      await addBatch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'siswa');
  }
}

export async function saveGuruCloud(guru: GuruTendik): Promise<void> {
  const path = `guru/${guru.id}`;
  try {
    await setDoc(doc(db, 'guru', guru.id), guru);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteGuruCloud(id: string): Promise<void> {
  const path = `guru/${id}`;
  try {
    await deleteDoc(doc(db, 'guru', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function batchImportGuruCloud(imported: GuruTendik[], mode: 'append' | 'replace'): Promise<void> {
  try {
    if (mode === 'replace') {
      // First get existing and batch delete, then add
      const existing = await getDocs(collection(db, 'guru'));
      const delBatch = writeBatch(db);
      existing.forEach((d) => delBatch.delete(d.ref));
      await delBatch.commit();
    }

    const addBatch = writeBatch(db);
    imported.forEach((g) => {
      addBatch.set(doc(db, 'guru', g.id), g);
    });
    await addBatch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'guru');
  }
}

export async function saveDokumenCloud(docItem: DokumenSekolah): Promise<void> {
  const path = `dokumen/${docItem.id}`;
  try {
    await setDoc(doc(db, 'dokumen', docItem.id), docItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteDokumenCloud(id: string): Promise<void> {
  const path = `dokumen/${id}`;
  try {
    await deleteDoc(doc(db, 'dokumen', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSuratCloud(surat: SuratResmi): Promise<void> {
  const path = `surat/${surat.id}`;
  try {
    await setDoc(doc(db, 'surat', surat.id), surat);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSuratCloud(id: string): Promise<void> {
  const path = `surat/${id}`;
  try {
    await deleteDoc(doc(db, 'surat', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveTransaksiCloud(trx: TransaksiKeuangan): Promise<void> {
  const path = `transaksi/${trx.id}`;
  try {
    await setDoc(doc(db, 'transaksi', trx.id), trx);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTransaksiCloud(id: string): Promise<void> {
  const path = `transaksi/${id}`;
  try {
    await deleteDoc(doc(db, 'transaksi', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function batchImportTransaksiCloud(imported: TransaksiKeuangan[]): Promise<void> {
  try {
    const chunkSize = 400;
    for (let i = 0; i < imported.length; i += chunkSize) {
      const chunk = imported.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      chunk.forEach((t) => {
        batch.set(doc(db, 'transaksi', t.id), t);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'transaksi');
  }
}

export async function clearAllTransaksiCloud(): Promise<void> {
  try {
    const existing = await getDocs(collection(db, 'transaksi'));
    const batch = writeBatch(db);
    existing.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'transaksi');
  }
}

export async function purgeMockTransaksiCloud(): Promise<void> {
  try {
    const dummyIds = ['tr-01', 'tr-02', 'tr-03', 'tr-04', 'tr-05'];
    const batch = writeBatch(db);
    dummyIds.forEach((id) => batch.delete(doc(db, 'transaksi', id)));
    await batch.commit();
  } catch (e) {
    console.warn('Purge mock transaksi failed:', e);
  }
}

export async function saveAgendaCloud(agenda: AgendaSekolah): Promise<void> {
  const path = `agenda/${agenda.id}`;
  try {
    await setDoc(doc(db, 'agenda', agenda.id), agenda);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAgendaCloud(id: string): Promise<void> {
  const path = `agenda/${id}`;
  try {
    await deleteDoc(doc(db, 'agenda', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveCustomMenuCloud(menu: CustomMenu): Promise<void> {
  const path = `custom_menus/${menu.id}`;
  try {
    await setDoc(doc(db, 'custom_menus', menu.id), menu);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomMenuCloud(menuId: string): Promise<void> {
  const path = `custom_menus/${menuId}`;
  try {
    // Also delete associated items
    const itemsSnapshot = await getDocs(collection(db, 'custom_items'));
    const batch = writeBatch(db);
    batch.delete(doc(db, 'custom_menus', menuId));
    itemsSnapshot.forEach((d) => {
      const data = d.data() as CustomMenuItem;
      if (data.menuId === menuId) {
        batch.delete(d.ref);
      }
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveCustomMenuItemCloud(item: CustomMenuItem): Promise<void> {
  const path = `custom_items/${item.id}`;
  try {
    await setDoc(doc(db, 'custom_items', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomMenuItemCloud(itemId: string): Promise<void> {
  const path = `custom_items/${itemId}`;
  try {
    await deleteDoc(doc(db, 'custom_items', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// -------------------------------------------------------------
// Rapor & Asesmen Kurikulum Merdeka Cloud Persistence
// -------------------------------------------------------------

export function subscribeRapor(onUpdate: (rapors: Record<string, RaporSiswa>) => void): () => void {
  const colRef = collection(db, 'rapor');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const store: Record<string, RaporSiswa> = {};
        snapshot.forEach((d) => {
          store[d.id] = d.data() as RaporSiswa;
        });
        onUpdate(store);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'rapor');
    }
  );
}

export async function saveRaporCloud(rapor: RaporSiswa): Promise<void> {
  const path = `rapor/${rapor.siswaId}`;
  try {
    await setDoc(doc(db, 'rapor', rapor.siswaId), rapor);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// -------------------------------------------------------------
// Presensi Kehadiran Harian Cloud Persistence
// -------------------------------------------------------------

export function subscribePresensi(
  onUpdate: (data: Record<string, { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }>) => void
): () => void {
  const colRef = collection(db, 'presensi');
  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const store: Record<string, { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }> = {};
        snapshot.forEach((d) => {
          store[d.id] = d.data() as { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> };
        });
        onUpdate(store);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'presensi');
    }
  );
}

export async function savePresensiDateCloud(
  tanggal: string,
  data: { status: Record<string, 'H' | 'S' | 'I' | 'A'>; keterangan: Record<string, string> }
): Promise<void> {
  const path = `presensi/${tanggal}`;
  try {
    await setDoc(doc(db, 'presensi', tanggal), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}


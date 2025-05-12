
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getAnggotaById } from "../anggotaService";
import { PengajuanData, PENGAJUAN_KEY } from "./types";
import { initialPengajuan } from "./initialData";
import { PersyaratanDokumen } from "@/types";

/**
 * Get all pengajuan from local storage
 */
export function getPengajuanList(): PengajuanData[] {
  return getFromLocalStorage<PengajuanData[]>(PENGAJUAN_KEY, initialPengajuan);
}

/**
 * Get pengajuan by ID
 */
export function getPengajuanById(id: string): PengajuanData | undefined {
  const pengajuanList = getPengajuanList();
  return pengajuanList.find(pengajuan => pengajuan.id === id);
}

/**
 * Get pengajuan by anggota ID
 */
export function getPengajuanByAnggotaId(anggotaId: string): PengajuanData[] {
  const pengajuanList = getPengajuanList();
  return pengajuanList.filter(pengajuan => pengajuan.anggotaId === anggotaId);
}

/**
 * Generate a new pengajuan ID
 */
export function generatePengajuanId(): string {
  const pengajuanList = getPengajuanList();
  const lastId = pengajuanList.length > 0 
    ? parseInt(pengajuanList[pengajuanList.length - 1].id.replace("PG", "")) 
    : 0;
  const newId = `PG${String(lastId + 1).padStart(4, "0")}`;
  return newId;
}

/**
 * Create a new pengajuan
 */
export function createPengajuan(
  pengajuan: Omit<PengajuanData, "id" | "anggotaNama" | "createdAt" | "updatedAt"> & { dokumen?: PersyaratanDokumen[] }
): PengajuanData | null {
  const anggota = getAnggotaById(pengajuan.anggotaId);
  if (!anggota) return null;
  
  const pengajuanList = getPengajuanList();
  const now = new Date().toISOString();
  
  const newPengajuan: PengajuanData = {
    ...pengajuan,
    id: generatePengajuanId(),
    anggotaNama: anggota.nama,
    createdAt: now,
    updatedAt: now,
  };
  
  pengajuanList.push(newPengajuan);
  saveToLocalStorage(PENGAJUAN_KEY, pengajuanList);
  
  return newPengajuan;
}

/**
 * Update an existing pengajuan
 */
export function updatePengajuan(
  id: string, 
  pengajuan: Partial<PengajuanData & { dokumen?: PersyaratanDokumen[] }>
): PengajuanData | null {
  const pengajuanList = getPengajuanList();
  const index = pengajuanList.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (pengajuan.anggotaId) {
    const anggota = getAnggotaById(pengajuan.anggotaId);
    if (!anggota) return null;
    pengajuan.anggotaNama = anggota.nama;
  }
  
  pengajuanList[index] = {
    ...pengajuanList[index],
    ...pengajuan,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage(PENGAJUAN_KEY, pengajuanList);
  return pengajuanList[index];
}

/**
 * Delete a pengajuan by ID
 */
export function deletePengajuan(id: string): boolean {
  const pengajuanList = getPengajuanList();
  const filteredList = pengajuanList.filter(pengajuan => pengajuan.id !== id);
  
  if (filteredList.length === pengajuanList.length) return false;
  
  saveToLocalStorage(PENGAJUAN_KEY, filteredList);
  return true;
}

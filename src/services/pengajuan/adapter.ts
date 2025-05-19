import { PengajuanData } from "./types";
import { PengajuanWithDetails, PengajuanInsert, PengajuanUpdate } from "./supabaseTypes";
import * as supabaseService from "./supabaseService";
import { v4 as uuidv4 } from 'uuid';

/**
 * Adapter to convert Supabase pengajuan data to the format expected by the UI
 */
export function adaptPengajuanFromSupabase(pengajuan: PengajuanWithDetails): PengajuanData {
  return {
    id: pengajuan.id,
    tanggal: pengajuan.tanggalpengajuan.toString(),
    anggotaId: pengajuan.anggotaid,
    anggotaNama: pengajuan.anggotanama,
    jenis: pengajuan.jenis,
    jumlah: Number(pengajuan.jumlah),
    status: pengajuan.status as "Menunggu" | "Disetujui" | "Ditolak",
    kategori: pengajuan.jenispengajuan, // Using jenispengajuan as kategori for now
    keterangan: pengajuan.alasan || undefined,
    dokumen: pengajuan.dokumen ? JSON.parse(pengajuan.dokumen as unknown as string) : undefined,
    createdAt: pengajuan.created_at?.toString() || new Date().toISOString(),
    updatedAt: pengajuan.updated_at?.toString() || new Date().toISOString(),
  };
}

/**
 * Get all pengajuan from Supabase
 */
export async function getPengajuanListFromSupabase(): Promise<PengajuanData[]> {
  const pengajuanList = await supabaseService.fetchPengajuanList();
  return pengajuanList.map(adaptPengajuanFromSupabase);
}

/**
 * Get pengajuan by ID from Supabase
 */
export async function getPengajuanByIdFromSupabase(id: string): Promise<PengajuanData | undefined> {
  const pengajuan = await supabaseService.fetchPengajuanById(id);
  return pengajuan ? adaptPengajuanFromSupabase(pengajuan) : undefined;
}

/**
 * Get pengajuan by anggota ID from Supabase
 */
export async function getPengajuanByAnggotaIdFromSupabase(anggotaId: string): Promise<PengajuanData[]> {
  const pengajuanList = await supabaseService.fetchPengajuanByAnggotaId(anggotaId);
  return pengajuanList.map(adaptPengajuanFromSupabase);
}

/**
 * Create a new pengajuan in Supabase
 */
export async function createPengajuanInSupabase(pengajuan: Omit<PengajuanData, "id" | "createdAt" | "updatedAt">): Promise<PengajuanData | null> {
  try {
    // Generate a unique ID for the pengajuan
    const id = `PG${Date.now().toString().substring(6)}`;
    
    // Map the PengajuanData to PengajuanInsert format for Supabase
    const pengajuanInsert: PengajuanInsert = {
      id: id,
      anggotaid: pengajuan.anggotaId,
      anggotanama: pengajuan.anggotaNama,
      jenispengajuan: pengajuan.jenis,
      tanggalpengajuan: new Date(pengajuan.tanggal),
      jumlah: pengajuan.jumlah,
      status: pengajuan.status,
      alasan: pengajuan.keterangan || null,
      dokumen: pengajuan.dokumen ? JSON.stringify(pengajuan.dokumen) : null,
      jangkawaktu: pengajuan.jenis === "Pinjaman" ? 12 : null // Default to 12 months for loans
    };
    
    // Create the pengajuan record in Supabase
    const result = await supabaseService.createPengajuanRecord(pengajuanInsert);
    
    if (!result) return null;
    
    // Convert the result back to PengajuanData format
    return adaptPengajuanFromSupabase(result);
  } catch (error) {
    console.error('Error creating pengajuan in Supabase:', error);
    return null;
  }
}

/**
 * Update an existing pengajuan in Supabase
 */
export async function updatePengajuanInSupabase(id: string, pengajuan: Partial<PengajuanData>): Promise<PengajuanData | null> {
  try {
    // Map the PengajuanData to PengajuanUpdate format for Supabase
    const pengajuanUpdate: PengajuanUpdate = {};
    
    if (pengajuan.anggotaId !== undefined) pengajuanUpdate.anggotaid = pengajuan.anggotaId;
    if (pengajuan.anggotaNama !== undefined) pengajuanUpdate.anggotanama = pengajuan.anggotaNama;
    if (pengajuan.jenis !== undefined) pengajuanUpdate.jenispengajuan = pengajuan.jenis;
    if (pengajuan.tanggal !== undefined) pengajuanUpdate.tanggalpengajuan = new Date(pengajuan.tanggal);
    if (pengajuan.jumlah !== undefined) pengajuanUpdate.jumlah = pengajuan.jumlah;
    if (pengajuan.status !== undefined) pengajuanUpdate.status = pengajuan.status;
    if (pengajuan.keterangan !== undefined) pengajuanUpdate.alasan = pengajuan.keterangan || null;
    if (pengajuan.dokumen !== undefined) pengajuanUpdate.dokumen = pengajuan.dokumen ? JSON.stringify(pengajuan.dokumen) : null;
    
    // Update the pengajuan record in Supabase
    const result = await supabaseService.updatePengajuanRecord(id, pengajuanUpdate);
    
    if (!result) return null;
    
    // Convert the result back to PengajuanData format
    return adaptPengajuanFromSupabase(result);
  } catch (error) {
    console.error('Error updating pengajuan in Supabase:', error);
    return null;
  }
}

/**
 * Delete a pengajuan by ID from Supabase
 */
export async function deletePengajuanFromSupabase(id: string): Promise<boolean> {
  return await supabaseService.deletePengajuanRecord(id);
}

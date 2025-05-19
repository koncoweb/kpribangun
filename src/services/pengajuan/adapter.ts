import { PengajuanData } from "./types";
import { PengajuanWithDetails, PengajuanInsert, PengajuanUpdate } from "./supabaseTypes";
import * as supabaseService from "./supabaseService";
import { v4 as uuidv4 } from 'uuid';

/**
 * Adapter to convert Supabase pengajuan data to the format expected by the UI
 */
export function adaptPengajuanFromSupabase(pengajuan: PengajuanWithDetails): PengajuanData {
  // Parse dokumen if it's a string
  let dokumenData;
  if (pengajuan.dokumen) {
    try {
      dokumenData = typeof pengajuan.dokumen === 'string' 
        ? JSON.parse(pengajuan.dokumen) 
        : pengajuan.dokumen;
    } catch (error) {
      console.error('Error parsing dokumen JSON:', error);
      dokumenData = [];
    }
  }

  return {
    id: pengajuan.id,
    tanggal: pengajuan.tanggalpengajuan.toString(),
    anggotaId: pengajuan.anggotaid,
    anggotaNama: pengajuan.anggotanama,
    jenis: pengajuan.jenispengajuan, // This is the enum type from the database
    jumlah: Number(pengajuan.jumlah),
    status: pengajuan.status as "Menunggu" | "Disetujui" | "Ditolak",
    kategori: pengajuan.jenispengajuan, // Using jenispengajuan as kategori for now
    keterangan: pengajuan.alasan || undefined,
    dokumen: dokumenData,
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
    
    console.log('Creating pengajuan with data:', pengajuan);
    
    // Ensure we're using the correct enum value for jenispengajuan
    if (pengajuan.jenis !== "Simpanan" && pengajuan.jenis !== "Pinjaman") {
      throw new Error(`Invalid jenis value: ${pengajuan.jenis}. Must be either "Simpanan" or "Pinjaman".`);
    }
    
    // Map the PengajuanData to PengajuanInsert format for Supabase
    const pengajuanInsert: PengajuanInsert = {
      id: id,
      anggotaid: pengajuan.anggotaId,
      anggotanama: pengajuan.anggotaNama,
      jenispengajuan: pengajuan.jenis, // This must be either "Simpanan" or "Pinjaman"
      tanggalpengajuan: new Date(pengajuan.tanggal),
      jumlah: pengajuan.jumlah,
      status: pengajuan.status || "Diajukan", // Default to "Diajukan" if not provided
      alasan: pengajuan.keterangan || null,
      dokumen: pengajuan.dokumen ? JSON.stringify(pengajuan.dokumen) : null,
      jangkawaktu: pengajuan.jenis === "Pinjaman" ? 12 : null // Default to 12 months for loans
    };
    
    console.log('Mapped to Supabase format:', pengajuanInsert);
    
    // Create the pengajuan record in Supabase
    const result = await supabaseService.createPengajuanRecord(pengajuanInsert);
    
    if (!result) {
      console.error('Failed to create pengajuan record, no result returned');
      return null;
    }
    
    console.log('Pengajuan created successfully:', result);
    
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

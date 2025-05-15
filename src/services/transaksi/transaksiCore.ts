
import { Transaksi } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { generateTransaksiId } from "./idGenerator";

// Helper function to map database fields to Transaksi model
function mapDbToTransaksi(dbRecord: any): Transaksi {
  return {
    id: dbRecord.id,
    anggotaId: dbRecord.anggotaid,
    anggotaNama: dbRecord.anggotanama,
    jenis: dbRecord.jenis,
    kategori: dbRecord.kategori,
    jumlah: dbRecord.jumlah,
    keterangan: dbRecord.keterangan,
    tanggal: dbRecord.tanggal,
    status: dbRecord.status,
    createdAt: dbRecord.created_at,
    updatedAt: dbRecord.updated_at
  };
}

// Helper function to map Transaksi model to database fields
function mapTransaksiToDb(transaksi: Partial<Transaksi>): any {
  return {
    id: transaksi.id,
    anggotaid: transaksi.anggotaId,
    anggotanama: transaksi.anggotaNama,
    jenis: transaksi.jenis,
    kategori: transaksi.kategori,
    jumlah: transaksi.jumlah,
    keterangan: transaksi.keterangan,
    tanggal: transaksi.tanggal,
    status: transaksi.status,
    created_at: transaksi.createdAt,
    updated_at: transaksi.updatedAt
  };
}

/**
 * Get all transaksi from Supabase
 */
export async function getAllTransaksi(): Promise<Transaksi[]> {
  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .order("tanggal", { ascending: false });
  
  if (error) {
    console.error("Error fetching transaksi:", error);
    throw error;
  }
  
  return data.map(mapDbToTransaksi);
}

/**
 * Get transaksi by anggota ID
 */
export async function getTransaksiByAnggotaId(anggotaId: string): Promise<Transaksi[]> {
  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .eq("anggotaid", anggotaId)
    .order("tanggal", { ascending: false });
  
  if (error) {
    console.error("Error fetching transaksi by anggota ID:", error);
    throw error;
  }
  
  return data.map(mapDbToTransaksi);
}

/**
 * Get transaksi by ID
 */
export async function getTransaksiById(id: string): Promise<Transaksi | undefined> {
  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    if (error.code === "PGRST116") { // Record not found
      return undefined;
    }
    console.error("Error fetching transaksi by ID:", error);
    throw error;
  }
  
  return mapDbToTransaksi(data);
}

/**
 * Create a new transaksi
 */
export async function createTransaksi(data: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    const newId = await generateTransaksiId();
    const now = new Date().toISOString();
    
    const transaksiData = {
      id: newId,
      tanggal: data.tanggal || new Date().toISOString().split('T')[0],
      anggotaid: data.anggotaId || "",
      anggotanama: data.anggotaNama || "",
      jenis: data.jenis || "Simpan",
      kategori: data.kategori || null,
      jumlah: data.jumlah || 0,
      keterangan: data.keterangan || "",
      status: data.status || "Sukses",
      created_at: now,
      updated_at: now,
    };
    
    const { data: result, error } = await supabase
      .from("transaksi")
      .insert([transaksiData])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating transaksi:", error);
      throw error;
    }
    
    return mapDbToTransaksi(result);
  } catch (error) {
    console.error("Error creating transaksi:", error);
    return null;
  }
}

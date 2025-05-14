
import { Transaksi } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { generateTransaksiId } from "./idGenerator";

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
  
  return data as Transaksi[];
}

/**
 * Get transaksi by anggota ID
 */
export async function getTransaksiByAnggotaId(anggotaId: string): Promise<Transaksi[]> {
  const { data, error } = await supabase
    .from("transaksi")
    .select("*")
    .eq("anggotaId", anggotaId)
    .order("tanggal", { ascending: false });
  
  if (error) {
    console.error("Error fetching transaksi by anggota ID:", error);
    throw error;
  }
  
  return data as Transaksi[];
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
  
  return data as Transaksi;
}

/**
 * Create a new transaksi
 */
export async function createTransaksi(data: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    const newId = await generateTransaksiId();
    const now = new Date().toISOString();
    
    const newTransaksi = {
      id: newId,
      tanggal: data.tanggal || new Date().toISOString().split('T')[0],
      anggotaId: data.anggotaId || "",
      anggotaNama: data.anggotaNama || "",
      jenis: data.jenis || "Simpan",
      kategori: data.kategori || undefined,
      jumlah: data.jumlah || 0,
      keterangan: data.keterangan || "",
      status: data.status || "Sukses",
      created_at: now,
      updated_at: now,
    };
    
    const { data: result, error } = await supabase
      .from("transaksi")
      .insert([newTransaksi])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating transaksi:", error);
      throw error;
    }
    
    return result as Transaksi;
  } catch (error) {
    console.error("Error creating transaksi:", error);
    return null;
  }
}

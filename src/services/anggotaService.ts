
import { supabase } from "@/integrations/supabase/client";
import { Anggota, AnggotaDokumen, AnggotaKeluarga } from "../types";

/**
 * Map database object to Anggota type
 */
function mapDbToAnggota(dbObject: any): Anggota {
  return {
    id: dbObject.id,
    nama: dbObject.nama,
    nip: dbObject.nip || "",
    alamat: dbObject.alamat || "",
    noHp: dbObject.nohp || "",
    jenisKelamin: (dbObject.jeniskelamin || "L") as "L" | "P",
    agama: dbObject.agama || "",
    status: dbObject.status || "active",
    unitKerja: dbObject.unitkerja || "",
    pekerjaan: dbObject.pekerjaan || "",
    tanggalBergabung: dbObject.tanggalbergabung || "",
    foto: dbObject.foto || "",
    email: dbObject.email || "",
    dokumen: (dbObject.dokumen || []) as AnggotaDokumen[],
    keluarga: (dbObject.keluarga || []) as AnggotaKeluarga[],
    createdAt: dbObject.created_at || new Date().toISOString(),
    updatedAt: dbObject.updated_at || new Date().toISOString()
  };
}

/**
 * Get all anggota from Supabase
 */
export async function getAllAnggota(): Promise<Anggota[]> {
  try {
    const { data, error } = await supabase
      .from("anggota")
      .select("*")
      .order("nama");
    
    if (error) {
      console.error("Error fetching anggota:", error);
      throw error;
    }
    
    return data.map(mapDbToAnggota);
  } catch (error) {
    console.error("Error in getAllAnggota:", error);
    return [];
  }
}

// Alias function for getAllAnggota to fix the import issue
export async function getAnggotaList(): Promise<Anggota[]> {
  return getAllAnggota();
}

/**
 * Get anggota by ID
 */
export async function getAnggotaById(id: string): Promise<Anggota | undefined> {
  try {
    const { data, error } = await supabase
      .from("anggota")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      if (error.code === "PGRST116") { // Record not found
        return undefined;
      }
      console.error("Error fetching anggota:", error);
      throw error;
    }
    
    return mapDbToAnggota(data);
  } catch (error) {
    console.error("Error in getAnggotaById:", error);
    return undefined;
  }
}

/**
 * Generate a new anggota ID
 */
export async function generateAnggotaId(): Promise<string> {
  const { data, error } = await supabase
    .from("anggota")
    .select("id")
    .order("id", { ascending: false })
    .limit(1);
  
  if (error) {
    console.error("Error generating anggota ID:", error);
    throw error;
  }
  
  const lastId = data && data.length > 0 ? parseInt(data[0].id.replace("AG", "")) : 0;
  return `AG${String(lastId + 1).padStart(4, "0")}`;
}

/**
 * Create a new anggota
 */
export async function createAnggota(anggota: Omit<Anggota, "id" | "createdAt" | "updatedAt">): Promise<Anggota> {
  try {
    const id = await generateAnggotaId();
    const now = new Date().toISOString();
    
    // Map Anggota to database structure
    const dbAnggota = {
      id,
      nama: anggota.nama,
      nip: anggota.nip,
      alamat: anggota.alamat,
      nohp: anggota.noHp,
      jeniskelamin: anggota.jenisKelamin,
      agama: anggota.agama,
      status: anggota.status,
      unitkerja: anggota.unitKerja,
      pekerjaan: anggota.pekerjaan,
      tanggalbergabung: anggota.tanggalBergabung,
      foto: anggota.foto,
      email: anggota.email,
      dokumen: anggota.dokumen,
      keluarga: anggota.keluarga,
      created_at: now,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from("anggota")
      .insert([dbAnggota])
      .select()
      .single();
    
    if (error) {
      console.error("Error creating anggota:", error);
      throw error;
    }
    
    return mapDbToAnggota(data);
  } catch (error) {
    console.error("Error in createAnggota:", error);
    throw error;
  }
}

/**
 * Update an existing anggota
 */
export async function updateAnggota(id: string, anggota: Partial<Anggota>): Promise<Anggota | null> {
  try {
    const now = new Date().toISOString();
    
    // Map Anggota to database structure
    const dbAnggota = {
      nama: anggota.nama,
      nip: anggota.nip,
      alamat: anggota.alamat,
      nohp: anggota.noHp,
      jeniskelamin: anggota.jenisKelamin,
      agama: anggota.agama,
      status: anggota.status,
      unitkerja: anggota.unitKerja,
      pekerjaan: anggota.pekerjaan,
      tanggalbergabung: anggota.tanggalBergabung,
      foto: anggota.foto,
      email: anggota.email,
      dokumen: anggota.dokumen,
      keluarga: anggota.keluarga,
      updated_at: now
    };
    
    const { data, error } = await supabase
      .from("anggota")
      .update(dbAnggota)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating anggota:", error);
      throw error;
    }
    
    return mapDbToAnggota(data);
  } catch (error) {
    console.error("Error in updateAnggota:", error);
    return null;
  }
}

/**
 * Delete an anggota by ID
 */
export async function deleteAnggota(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("anggota")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error("Error deleting anggota:", error);
    throw error;
  }
  
  return true;
}

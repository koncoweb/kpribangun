
import { Pengaturan } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { PinjamanCategory } from "./transaksi/categories";

const DEFAULT_SETTINGS_ID = "default_settings";

// Default pengaturan initial data
const initialPengaturan: Pengaturan = {
  sukuBunga: {
    pinjaman: 1.5, // 1.5% per bulan 
    simpanan: 0.5, // 0.5% per bulan
    metodeBunga: "flat",
    pinjamanByCategory: {
      [PinjamanCategory.REGULER]: 1.5,    // 1.5% per month
      [PinjamanCategory.SERTIFIKASI]: 1.0, // 1.0% per month
      [PinjamanCategory.MUSIMAN]: 2.0      // 2.0% per month
    }
  },
  tenor: {
    minTenor: 3,     // minimum 3 bulan
    maxTenor: 36,    // maximum 36 bulan
    defaultTenor: 12, // default 12 bulan
    tenorOptions: [3, 6, 12, 18, 24, 36]
  },
  denda: {
    persentase: 0.1, // 0.1% per hari
    gracePeriod: 3,  // 3 hari masa tenggang
    metodeDenda: "harian"
  }
};

/**
 * Get pengaturan from Supabase
 */
export async function getPengaturan(): Promise<Pengaturan> {
  const { data, error } = await supabase
    .from("pengaturan")
    .select("*")
    .eq("id", DEFAULT_SETTINGS_ID)
    .single();
  
  if (error) {
    console.error("Error fetching pengaturan:", error);
    
    // If settings don't exist, create default settings
    if (error.code === "PGRST116") { // Record not found
      return createDefaultSettings();
    }
    
    throw error;
  }
  
  // Transform the data to match our type structure
  return {
    sukuBunga: data.sukubunga, // Map from sukubunga (DB) to sukuBunga (app)
    tenor: data.tenor,
    denda: data.denda
  } as Pengaturan;
}

/**
 * Create default settings if they don't exist
 */
async function createDefaultSettings(): Promise<Pengaturan> {
  const { data, error } = await supabase
    .from("pengaturan")
    .insert([{
      id: DEFAULT_SETTINGS_ID,
      sukubunga: initialPengaturan.sukuBunga, // Map from sukuBunga (app) to sukubunga (DB)
      tenor: initialPengaturan.tenor,
      denda: initialPengaturan.denda
    }])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating default pengaturan:", error);
    throw error;
  }
  
  return {
    sukuBunga: data.sukubunga, // Map from sukubunga (DB) to sukuBunga (app)
    tenor: data.tenor,
    denda: data.denda
  } as Pengaturan;
}

/**
 * Save pengaturan to Supabase
 */
export async function savePengaturan(pengaturan: Pengaturan): Promise<void> {
  const { error } = await supabase
    .from("pengaturan")
    .update({
      sukubunga: pengaturan.sukuBunga, // Map from sukuBunga (app) to sukubunga (DB)
      tenor: pengaturan.tenor,
      denda: pengaturan.denda
    })
    .eq("id", DEFAULT_SETTINGS_ID);
  
  if (error) {
    console.error("Error saving pengaturan:", error);
    throw error;
  }
}

/**
 * Update specific pengaturan fields
 */
export async function updatePengaturan(updatedFields: Partial<Pengaturan>): Promise<Pengaturan> {
  const currentPengaturan = await getPengaturan();
  
  // Deep merge the current pengaturan with the updated fields
  const updatedPengaturan = {
    ...currentPengaturan,
    ...updatedFields,
    sukuBunga: {
      ...currentPengaturan.sukuBunga,
      ...(updatedFields.sukuBunga || {})
    },
    tenor: {
      ...currentPengaturan.tenor,
      ...(updatedFields.tenor || {})
    },
    denda: {
      ...currentPengaturan.denda,
      ...(updatedFields.denda || {})
    }
  };
  
  await savePengaturan(updatedPengaturan);
  return updatedPengaturan;
}

/**
 * Reset pengaturan to default values
 */
export async function resetPengaturan(): Promise<Pengaturan> {
  await savePengaturan(initialPengaturan);
  return initialPengaturan;
}

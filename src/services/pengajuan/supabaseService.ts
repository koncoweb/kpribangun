import { supabase } from "@/integrations/supabase/client";
import { PengajuanRow, PengajuanInsert, PengajuanUpdate, PengajuanWithDetails, mapPengajuanRowToModel } from "./supabaseTypes";

/**
 * Fetch all pengajuan records from Supabase
 */
export async function fetchPengajuanList(): Promise<PengajuanWithDetails[]> {
  try {
    const { data, error } = await supabase
      .from('pengajuan')
      .select('*')
      .order('tanggalpengajuan', { ascending: false });
    
    if (error) {
      console.error('Error fetching pengajuan list:', error);
      return [];
    }
    
    return (data || []).map(mapPengajuanRowToModel);
  } catch (error) {
    console.error('Unexpected error fetching pengajuan list:', error);
    return [];
  }
}

/**
 * Fetch a pengajuan record by ID
 */
export async function fetchPengajuanById(id: string): Promise<PengajuanWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('pengajuan')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching pengajuan by ID:', error);
      return null;
    }
    
    return data ? mapPengajuanRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error fetching pengajuan by ID:', error);
    return null;
  }
}

/**
 * Fetch pengajuan records by anggota ID
 */
export async function fetchPengajuanByAnggotaId(anggotaId: string): Promise<PengajuanWithDetails[]> {
  try {
    const { data, error } = await supabase
      .from('pengajuan')
      .select('*')
      .eq('anggotaid', anggotaId)
      .order('tanggalpengajuan', { ascending: false });
    
    if (error) {
      console.error('Error fetching pengajuan by anggota ID:', error);
      return [];
    }
    
    return (data || []).map(mapPengajuanRowToModel);
  } catch (error) {
    console.error('Unexpected error fetching pengajuan by anggota ID:', error);
    return [];
  }
}

/**
 * Create a new pengajuan record
 */
export async function createPengajuanRecord(pengajuan: PengajuanInsert): Promise<PengajuanWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('pengajuan')
      .insert(pengajuan)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating pengajuan:', error);
      return null;
    }
    
    return data ? mapPengajuanRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error creating pengajuan:', error);
    return null;
  }
}

/**
 * Update an existing pengajuan record
 */
export async function updatePengajuanRecord(id: string, pengajuan: PengajuanUpdate): Promise<PengajuanWithDetails | null> {
  try {
    const { data, error } = await supabase
      .from('pengajuan')
      .update(pengajuan)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating pengajuan:', error);
      return null;
    }
    
    return data ? mapPengajuanRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error updating pengajuan:', error);
    return null;
  }
}

/**
 * Delete a pengajuan record
 */
export async function deletePengajuanRecord(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pengajuan')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting pengajuan:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting pengajuan:', error);
    return false;
  }
}

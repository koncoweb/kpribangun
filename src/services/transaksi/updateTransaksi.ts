
import { Transaksi } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { getAnggotaById } from "../anggotaService";

/**
 * Update an existing transaksi
 * @param id Transaction ID to update
 * @param updatedData Updated transaction data
 * @returns The updated transaction or null if not found
 */
export async function updateTransaksi(id: string, updatedData: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    // Check if the transaction exists
    const { data: existingTransaksi, error: checkError } = await supabase
      .from("transaksi")
      .select("*")
      .eq("id", id)
      .single();
    
    if (checkError || !existingTransaksi) {
      return null;
    }
    
    // If anggotaId is being updated, we need to update anggotaNama as well
    let anggotaNama = updatedData.anggotaNama;
    if (updatedData.anggotaId && updatedData.anggotaId !== existingTransaksi.anggotaid) {
      const anggota = await getAnggotaById(updatedData.anggotaId);
      if (!anggota) return null;
      anggotaNama = anggota.nama;
    }
    
    // Prepare data for update
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Map fields from our Transaksi model to database field names
    if (updatedData.anggotaId) updateData.anggotaid = updatedData.anggotaId;
    if (anggotaNama) updateData.anggotanama = anggotaNama;
    if (updatedData.jenis) {
      // Ensure jenis is one of the allowed values
      const jenis = updatedData.jenis as "Simpan" | "Pinjam" | "Angsuran";
      updateData.jenis = jenis;
    }
    if (updatedData.kategori !== undefined) updateData.kategori = updatedData.kategori;
    if (updatedData.jumlah !== undefined) updateData.jumlah = updatedData.jumlah;
    if (updatedData.keterangan !== undefined) updateData.keterangan = updatedData.keterangan;
    if (updatedData.tanggal) updateData.tanggal = updatedData.tanggal;
    if (updatedData.status) {
      // Ensure status is one of the allowed values
      const status = updatedData.status as "Sukses" | "Pending" | "Gagal";
      updateData.status = status;
    }
    
    // Perform the update
    const { data: updatedTransaksi, error } = await supabase
      .from("transaksi")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating transaction:", error);
      return null;
    }
    
    // Convert database format to Transaksi type
    return {
      id: updatedTransaksi.id,
      anggotaId: updatedTransaksi.anggotaid,
      anggotaNama: updatedTransaksi.anggotanama,
      jenis: updatedTransaksi.jenis as "Simpan" | "Pinjam" | "Angsuran",
      kategori: updatedTransaksi.kategori,
      jumlah: updatedTransaksi.jumlah,
      keterangan: updatedTransaksi.keterangan,
      tanggal: updatedTransaksi.tanggal,
      status: updatedTransaksi.status as "Sukses" | "Pending" | "Gagal",
      createdAt: updatedTransaksi.created_at,
      updatedAt: updatedTransaksi.updated_at
    };
  } catch (error) {
    console.error("Error in updateTransaksi:", error);
    return null;
  }
}

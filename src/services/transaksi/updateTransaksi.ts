
import { Transaksi } from "@/types";
import { getAllTransaksi } from "./transaksiCore";
import { saveToLocalStorage } from "@/utils/localStorage";
import { TRANSAKSI_KEY } from "./baseService";
import { getAnggotaById } from "../anggotaService";

/**
 * Update an existing transaksi
 * @param id Transaction ID to update
 * @param updatedData Updated transaction data
 * @returns The updated transaction or null if not found
 */
export function updateTransaksi(id: string, updatedData: Partial<Transaksi>): Transaksi | null {
  const transaksiList = getAllTransaksi();
  const index = transaksiList.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (updatedData.anggotaId && updatedData.anggotaId !== transaksiList[index].anggotaId) {
    const anggota = getAnggotaById(updatedData.anggotaId);
    if (!anggota) return null;
    updatedData.anggotaNama = anggota.nama;
  }
  
  transaksiList[index] = {
    ...transaksiList[index],
    ...updatedData,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage(TRANSAKSI_KEY, transaksiList);
  return transaksiList[index];
}

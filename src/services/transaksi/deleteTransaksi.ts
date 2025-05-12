
import { Transaksi } from "@/types";
import { getAllTransaksi } from "./transaksiCore";
import { saveToLocalStorage } from "@/utils/localStorage";
import { TRANSAKSI_KEY } from "./baseService";

/**
 * Delete a transaksi by ID
 * @param id Transaction ID to delete
 * @returns true if successful, false if not found
 */
export function deleteTransaksi(id: string): boolean {
  const transaksiList = getAllTransaksi();
  const initialLength = transaksiList.length;
  
  const filteredList = transaksiList.filter(transaksi => transaksi.id !== id);
  
  // If no transaction was removed, return false
  if (filteredList.length === initialLength) {
    return false;
  }
  
  // Save the updated list to local storage
  saveToLocalStorage(TRANSAKSI_KEY, filteredList);
  return true;
}

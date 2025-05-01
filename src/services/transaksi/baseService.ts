
import { getFromLocalStorage, saveToLocalStorage } from "../../utils/localStorage";

export const TRANSAKSI_KEY = "koperasi_transaksi";

/**
 * Get all items from local storage
 */
export function getAllItems<T>(key: string, initialData: T[]): T[] {
  return getFromLocalStorage<T[]>(key, initialData);
}

/**
 * Save items to local storage
 */
export function saveItems<T>(key: string, items: T[]): void {
  saveToLocalStorage(key, items);
}

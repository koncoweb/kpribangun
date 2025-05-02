import { Transaksi } from "@/types";
import { getFromLocalStorage } from "@/utils/localStorage";
import { initialTransaksi } from "./initialData";

const TRANSAKSI_KEY = "koperasi_transaksi";

/**
 * Get all transaksi from local storage
 */
export function getAllTransaksi(): Transaksi[] {
  return getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, initialTransaksi);
}

/**
 * Get transaksi by anggota ID
 */
export function getTransaksiByAnggotaId(anggotaId: string): Transaksi[] {
  const transaksiList = getAllTransaksi();
  return transaksiList.filter(
    (transaksi) => transaksi.anggotaId === anggotaId
  );
}

/**
 * Get transaksi by ID
 */
export function getTransaksiById(id: string): Transaksi | undefined {
  const transaksiList = getAllTransaksi();
  return transaksiList.find((transaksi) => transaksi.id === id);
}

// The generateTransaksiId function has been moved to idGenerator.ts

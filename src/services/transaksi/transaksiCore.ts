
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

/**
 * Create a new transaksi ID
 */
export function generateTransaksiId(): string {
  const transaksiList = getAllTransaksi();
  const lastId = transaksiList.length > 0
    ? parseInt(transaksiList[transaksiList.length - 1].id.replace("TR", ""))
    : 0;
  const newId = `TR${String(lastId + 1).padStart(6, "0")}`;
  return newId;
}

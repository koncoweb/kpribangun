
import { Transaksi } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { initialTransaksi } from "./initialData";
import { generateTransaksiId } from "./idGenerator";

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
 * Create a new transaksi
 */
export function createTransaksi(data: Partial<Transaksi>): Transaksi | null {
  try {
    const transaksiList = getAllTransaksi();
    const newId = generateTransaksiId();
    const now = new Date().toISOString();
    
    const newTransaksi: Transaksi = {
      id: newId,
      tanggal: data.tanggal || new Date().toISOString().split('T')[0],
      anggotaId: data.anggotaId || "",
      anggotaNama: data.anggotaNama || "",
      jenis: data.jenis || "Simpan",
      kategori: data.kategori || undefined,
      jumlah: data.jumlah || 0,
      keterangan: data.keterangan || "",
      status: data.status || "Sukses",
      createdAt: now,
      updatedAt: now,
    };
    
    transaksiList.push(newTransaksi);
    saveToLocalStorage(TRANSAKSI_KEY, transaksiList);
    
    return newTransaksi;
  } catch (error) {
    console.error("Error creating transaksi:", error);
    return null;
  }
}


import { Transaksi } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { getAnggotaById } from "./anggotaService";

const TRANSAKSI_KEY = "koperasi_transaksi";

// Initial sample data
const initialTransaksi: Transaksi[] = [
  { 
    id: "TR0001", 
    tanggal: "2025-04-20",
    anggotaId: "AG0001",
    anggotaNama: "Budi Santoso",
    jenis: "Simpan",
    jumlah: 500000,
    status: "Sukses",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "TR0002", 
    tanggal: "2025-04-18",
    anggotaId: "AG0004",
    anggotaNama: "Sri Wahyuni",
    jenis: "Pinjam",
    jumlah: 2000000,
    keterangan: "Pinjaman untuk modal usaha",
    status: "Sukses",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "TR0003", 
    tanggal: "2025-04-17",
    anggotaId: "AG0003",
    anggotaNama: "Ahmad Hidayat",
    jenis: "Angsuran",
    jumlah: 250000,
    status: "Sukses",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "TR0004", 
    tanggal: "2025-04-15",
    anggotaId: "AG0002",
    anggotaNama: "Dewi Lestari",
    jenis: "Simpan",
    jumlah: 750000,
    status: "Sukses",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "TR0005", 
    tanggal: "2025-04-12",
    anggotaId: "AG0005",
    anggotaNama: "Agus Setiawan",
    jenis: "Pinjam",
    jumlah: 5000000,
    keterangan: "Pinjaman untuk renovasi rumah",
    status: "Sukses",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get all transaksi from local storage
 */
export function getAllTransaksi(): Transaksi[] {
  return getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, initialTransaksi);
}

/**
 * Get transaksi by ID
 */
export function getTransaksiById(id: string): Transaksi | undefined {
  const transaksiList = getAllTransaksi();
  return transaksiList.find(transaksi => transaksi.id === id);
}

/**
 * Get transaksi by anggota ID
 */
export function getTransaksiByAnggotaId(anggotaId: string): Transaksi[] {
  const transaksiList = getAllTransaksi();
  return transaksiList.filter(transaksi => transaksi.anggotaId === anggotaId);
}

/**
 * Generate a new transaksi ID
 */
export function generateTransaksiId(): string {
  const transaksiList = getAllTransaksi();
  const lastId = transaksiList.length > 0 
    ? parseInt(transaksiList[transaksiList.length - 1].id.replace("TR", "")) 
    : 0;
  const newId = `TR${String(lastId + 1).padStart(4, "0")}`;
  return newId;
}

/**
 * Create a new transaksi
 */
export function createTransaksi(transaksi: Omit<Transaksi, "id" | "anggotaNama" | "createdAt" | "updatedAt">): Transaksi | null {
  const anggota = getAnggotaById(transaksi.anggotaId);
  if (!anggota) return null;
  
  const transaksiList = getAllTransaksi();
  const now = new Date().toISOString();
  
  const newTransaksi: Transaksi = {
    ...transaksi,
    id: generateTransaksiId(),
    anggotaNama: anggota.nama,
    createdAt: now,
    updatedAt: now,
  };
  
  transaksiList.push(newTransaksi);
  saveToLocalStorage(TRANSAKSI_KEY, transaksiList);
  
  return newTransaksi;
}

/**
 * Update an existing transaksi
 */
export function updateTransaksi(id: string, transaksi: Partial<Transaksi>): Transaksi | null {
  const transaksiList = getAllTransaksi();
  const index = transaksiList.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (transaksi.anggotaId) {
    const anggota = getAnggotaById(transaksi.anggotaId);
    if (!anggota) return null;
    transaksi.anggotaNama = anggota.nama;
  }
  
  transaksiList[index] = {
    ...transaksiList[index],
    ...transaksi,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage(TRANSAKSI_KEY, transaksiList);
  return transaksiList[index];
}

/**
 * Delete a transaksi by ID
 */
export function deleteTransaksi(id: string): boolean {
  const transaksiList = getAllTransaksi();
  const filteredList = transaksiList.filter(transaksi => transaksi.id !== id);
  
  if (filteredList.length === transaksiList.length) return false;
  
  saveToLocalStorage(TRANSAKSI_KEY, filteredList);
  return true;
}

/**
 * Calculate total simpanan for an anggota
 */
export function calculateTotalSimpanan(anggotaId: string): number {
  const transaksiList = getTransaksiByAnggotaId(anggotaId);
  return transaksiList
    .filter(t => t.jenis === "Simpan")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Calculate total pinjaman for an anggota
 */
export function calculateTotalPinjaman(anggotaId: string): number {
  const transaksiList = getTransaksiByAnggotaId(anggotaId);
  const pinjaman = transaksiList
    .filter(t => t.jenis === "Pinjam")
    .reduce((total, t) => total + t.jumlah, 0);
  
  const angsuran = transaksiList
    .filter(t => t.jenis === "Angsuran")
    .reduce((total, t) => total + t.jumlah, 0);
  
  return pinjaman - angsuran;
}

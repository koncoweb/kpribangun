
import { getAllTransaksi } from "./transaksiCore";

/**
 * Calculate total simpanan for an anggota
 */
export function calculateTotalSimpanan(anggotaId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Calculate total outstanding pinjaman for an anggota
 */
export function calculateTotalPinjaman(anggotaId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Total pinjaman
  const totalPinjaman = transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Total angsuran as payment
  const totalAngsuran = transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Outstanding balance
  return Math.max(0, totalPinjaman - totalAngsuran);
}

/**
 * Get total simpanan for all members
 */
export function getTotalAllSimpanan(): number {
  const transaksiList = getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Get total pinjaman for all members
 */
export function getTotalAllPinjaman(): number {
  const transaksiList = getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Get total angsuran for all members
 */
export function getTotalAllAngsuran(): number {
  const transaksiList = getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

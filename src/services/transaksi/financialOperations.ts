
import { Transaksi } from "../../types";
import { getTransaksiByAnggotaId } from "./transaksiCore";

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

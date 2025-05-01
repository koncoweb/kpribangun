
import { Transaksi } from "../../types";
import { getAllTransaksi } from "./transaksiCore";
import { calculateJatuhTempo, calculatePenalty } from "./utils";
import { getPengaturan } from "../pengaturanService";
import { isPastDue, getDaysOverdue } from "../../utils/formatters";

/**
 * Get all pinjaman transactions
 */
export function getAllPinjaman(): Transaksi[] {
  return getAllTransaksi().filter(t => t.jenis === "Pinjam");
}

/**
 * Get all overdue loans
 */
export function getOverdueLoans(): { transaksi: Transaksi, daysOverdue: number, jatuhTempo: string }[] {
  const pinjaman = getAllPinjaman();
  const pengaturan = getPengaturan();
  const defaultTenor = pengaturan.tenor.defaultTenor;
  
  return pinjaman
    .map(transaksi => {
      const jatuhTempo = calculateJatuhTempo(transaksi.tanggal, defaultTenor);
      return {
        transaksi,
        daysOverdue: getDaysOverdue(jatuhTempo),
        jatuhTempo
      };
    })
    .filter(item => item.daysOverdue > 0);
}

/**
 * Get upcoming due loans
 */
export function getUpcomingDueLoans(daysThreshold: number = 30): { transaksi: Transaksi, daysUntilDue: number, jatuhTempo: string }[] {
  const pinjaman = getAllPinjaman();
  const pengaturan = getPengaturan();
  const defaultTenor = pengaturan.tenor.defaultTenor;
  const today = new Date();
  
  return pinjaman
    .map(transaksi => {
      const jatuhTempo = calculateJatuhTempo(transaksi.tanggal, defaultTenor);
      const dueDate = new Date(jatuhTempo);
      const diffTime = Math.abs(dueDate.getTime() - today.getTime());
      const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        transaksi,
        daysUntilDue,
        jatuhTempo
      };
    })
    .filter(item => !isPastDue(item.jatuhTempo) && item.daysUntilDue <= daysThreshold);
}

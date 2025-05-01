
import { Transaksi } from "../../types";
import { getAllTransaksi } from "./transaksiCore";
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

/**
 * Calculate jatuh tempo (due date) for a loan
 */
export function calculateJatuhTempo(tanggalPinjam: string, tenorBulan: number = 12): string {
  const date = new Date(tanggalPinjam);
  date.setMonth(date.getMonth() + tenorBulan);
  return date.toISOString().split('T')[0];
}

/**
 * Calculate penalty amount for overdue loan
 */
export function calculatePenalty(jumlahPinjaman: number, daysOverdue: number): number {
  const pengaturan = getPengaturan();
  const dendaPercentage = pengaturan.denda.persentase;
  const gracePeriod = pengaturan.denda.gracePeriod;
  
  if (daysOverdue <= gracePeriod) return 0;
  
  const effectiveDaysOverdue = daysOverdue - gracePeriod;
  
  if (pengaturan.denda.metodeDenda === "harian") {
    return jumlahPinjaman * (dendaPercentage / 100) * effectiveDaysOverdue;
  } else {
    // For monthly calculation, we divide by 30 days to get months
    const monthsOverdue = Math.ceil(effectiveDaysOverdue / 30);
    return jumlahPinjaman * (dendaPercentage / 100) * monthsOverdue;
  }
}

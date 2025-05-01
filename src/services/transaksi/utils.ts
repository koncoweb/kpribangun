
import { Transaksi } from "../../types";
import { TRANSAKSI_KEY } from "./baseService";
import { getAllItems } from "./baseService";
import { getPengaturan } from "../pengaturanService";
import { getAnggotaById } from "../anggotaService";
import { isPastDue, getDaysOverdue } from "../../utils/formatters";

/**
 * Generate a new transaksi ID
 */
export function generateTransaksiId(): string {
  const transaksiList = getAllItems<Transaksi>(TRANSAKSI_KEY, []);
  const lastId = transaksiList.length > 0 
    ? parseInt(transaksiList[transaksiList.length - 1].id.replace("TR", "")) 
    : 0;
  const newId = `TR${String(lastId + 1).padStart(4, "0")}`;
  return newId;
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

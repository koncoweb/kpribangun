
import { Transaksi } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { initialTransaksi } from "./transaksi/initialData";

const TRANSAKSI_KEY = "koperasi_transaksi";

/**
 * Get all transactions from local storage
 */
export function getAllTransaksi(): Transaksi[] {
  return getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, initialTransaksi);
}

/**
 * Get transactions by anggota ID
 */
export function getTransaksiByAnggotaId(anggotaId: string): Transaksi[] {
  const transaksiList = getAllTransaksi();
  return transaksiList.filter(transaksi => transaksi.anggotaId === anggotaId);
}

/**
 * Calculate total simpanan for an anggota
 */
export function calculateTotalSimpanan(anggotaId: string): number {
  const transaksiList = getTransaksiByAnggotaId(anggotaId);
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Calculate total outstanding pinjaman for an anggota
 */
export function calculateTotalPinjaman(anggotaId: string): number {
  const transaksiList = getTransaksiByAnggotaId(anggotaId);
  
  // Total pinjaman
  const totalPinjaman = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Total angsuran as payment
  const totalAngsuran = transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Outstanding balance
  return Math.max(0, totalPinjaman - totalAngsuran);
}

/**
 * Get all due loans (both upcoming and overdue)
 */
export function getAllDueLoans(): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysUntilDue: number;
}[] {
  const transaksiList = getAllTransaksi();
  const currentDate = new Date();
  
  // Filter for pinjaman transactions
  const pinjamanList = transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
  
  // Calculate due dates for each loan (dummy implementation)
  return pinjamanList.map(transaksi => {
    // For this example, let's assume loan is due in 30 days from creation
    const createdDate = new Date(transaksi.createdAt);
    const dueDate = new Date(createdDate);
    dueDate.setDate(dueDate.getDate() + 30);
    
    // Calculate days until due
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return {
      transaksi,
      jatuhTempo: dueDate.toISOString(),
      daysUntilDue
    };
  });
}

/**
 * Get upcoming due loans (not yet overdue)
 */
export function getUpcomingDueLoans(): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysUntilDue: number;
}[] {
  return getAllDueLoans().filter(loan => loan.daysUntilDue > 0);
}

/**
 * Get overdue loans
 */
export function getOverdueLoans(): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysOverdue: number;
}[] {
  return getAllDueLoans()
    .filter(loan => loan.daysUntilDue <= 0)
    .map(loan => ({
      transaksi: loan.transaksi,
      jatuhTempo: loan.jatuhTempo,
      daysOverdue: Math.abs(loan.daysUntilDue)
    }));
}

/**
 * Calculate jatuh tempo date for a loan
 */
export function calculateJatuhTempo(createdDate: string): string {
  const date = new Date(createdDate);
  date.setDate(date.getDate() + 30); // Assuming 30-day term
  return date.toISOString();
}

/**
 * Calculate penalty for overdue loans
 */
export function calculatePenalty(loanAmount: number, daysOverdue: number): number {
  // Example: 0.1% penalty per day
  return loanAmount * 0.001 * daysOverdue;
}

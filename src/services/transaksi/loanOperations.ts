
import { Transaksi } from "@/types";
import { getAllTransaksi } from "./transaksiCore";
import { getPengaturan } from "@/services/pengaturanService";

/**
 * Get all pinjaman transactions
 */
export function getAllPinjaman(): Transaksi[] {
  return getAllTransaksi().filter(t => t.jenis === "Pinjam");
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
export function getUpcomingDueLoans(daysThreshold: number = 30): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysUntilDue: number;
}[] {
  return getAllDueLoans()
    .filter(loan => loan.daysUntilDue > 0 && loan.daysUntilDue <= daysThreshold);
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
export function calculateJatuhTempo(createdDate: string, tenorBulan: number = 12): string {
  const date = new Date(createdDate);
  date.setMonth(date.getMonth() + tenorBulan);
  return date.toISOString();
}

/**
 * Calculate penalty for overdue loans
 */
export function calculatePenalty(loanAmount: number, daysOverdue: number): number {
  const pengaturan = getPengaturan();
  const persentaseDenda = pengaturan?.denda?.persentase || 0.1; // Default 0.1%
  const gracePeriod = pengaturan?.denda?.gracePeriod || 3; // Default 3 days grace period
  
  // Apply grace period
  const effectiveDaysOverdue = Math.max(0, daysOverdue - gracePeriod);
  
  if (effectiveDaysOverdue <= 0) {
    return 0;
  }
  
  // Calculate penalty based on method
  if (pengaturan?.denda?.metodeDenda === "harian") {
    // Daily calculation
    return loanAmount * (persentaseDenda / 100) * effectiveDaysOverdue;
  } else {
    // Monthly calculation (simplified)
    const monthsOverdue = Math.ceil(effectiveDaysOverdue / 30);
    return loanAmount * (persentaseDenda / 100) * monthsOverdue;
  }
}

/**
 * Get remaining loan amount for a specific loan
 */
export function getRemainingLoanAmount(pinjamanId: string): number {
  const transactions = getAllTransaksi();
  
  // Find the pinjaman transaction
  const pinjaman = transactions.find(t => t.id === pinjamanId && t.jenis === "Pinjam");
  if (!pinjaman) return 0;
  
  // Calculate total angsuran paid for this pinjaman
  const totalAngsuran = transactions
    .filter(t => 
      t.jenis === "Angsuran" && 
      t.status === "Sukses" && 
      t.keterangan?.includes(pinjamanId)
    )
    .reduce((sum, t) => sum + t.jumlah, 0);
  
  // Return remaining amount
  return Math.max(0, pinjaman.jumlah - totalAngsuran);
}

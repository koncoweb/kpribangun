
import { Transaksi } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { initialTransaksi } from "./transaksi/initialData";
import { getPengaturan } from "./pengaturanService";
import { getAnggotaById } from "./anggotaService";
import { calculateSHU as calculateSHUFromFinancialOperations } from "./transaksi/financialOperations";
import { TRANSAKSI_KEY } from "./transaksi/baseService";
import { updateTransaksi } from "./transaksi/updateTransaksi";
import { deleteTransaksi } from "./transaksi/deleteTransaksi";

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
 * Get transaksi by ID
 */
export function getTransaksiById(id: string): Transaksi | undefined {
  const transaksiList = getAllTransaksi();
  return transaksiList.find(transaksi => transaksi.id === id);
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
export async function createTransaksi(transaksi: Omit<Transaksi, "id" | "anggotaNama" | "createdAt" | "updatedAt">): Promise<Transaksi | null> {
  try {
    const anggota = await getAnggotaById(transaksi.anggotaId);
    if (!anggota) return null;
    
    const transaksiList = getAllTransaksi();
    const now = new Date().toISOString();
    
    const newTransaksi: Transaksi = {
      ...transaksi,
      id: generateTransaksiId(),
      anggotaNama: anggota.nama || "",
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
export function getUpcomingDueLoans(anggotaId: string = "ALL", daysThreshold: number = 30): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysUntilDue: number;
}[] {
  const allLoans = getAllDueLoans();
  const filteredLoans = anggotaId === "ALL" 
    ? allLoans 
    : allLoans.filter(loan => loan.transaksi.anggotaId === anggotaId);
  
  return filteredLoans.filter(loan => loan.daysUntilDue > 0 && loan.daysUntilDue <= daysThreshold);
}

/**
 * Get overdue loans
 */
export function getOverdueLoans(anggotaId: string = "ALL"): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysOverdue: number;
}[] {
  const allLoans = getAllDueLoans();
  const filteredLoans = anggotaId === "ALL" 
    ? allLoans 
    : allLoans.filter(loan => loan.transaksi.anggotaId === anggotaId);
  
  return filteredLoans
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
  // Example: 0.1% penalty per day
  return loanAmount * 0.001 * daysOverdue;
}

/**
 * Calculate SHU (Sisa Hasil Usaha) for an anggota
 */
export function calculateSHU(anggotaId: string): number {
  // This is now a local service function, not from financialOperations
  const transaksiList = getTransaksiByAnggotaId(anggotaId);
  
  // Calculate the member's loan interest payments (a portion goes to SHU)
  let loanInterestPaid = 0;
  
  // Extract loan data from member transactions
  const loans = transaksiList.filter(t => t.jenis === "Pinjam");
  
  // For each loan, calculate interest portion that contributes to SHU
  loans.forEach(loan => {
    // Parse keterangan for loan details
    const bungaMatch = loan.keterangan?.match(/bunga (\d+(?:\.\d+)?)%/);
    const tenorMatch = loan.keterangan?.match(/Pinjaman (\d+) bulan/);
    
    if (bungaMatch && tenorMatch) {
      const bunga = parseFloat(bungaMatch[1]);
      const tenor = parseInt(tenorMatch[1]);
      
      // Calculate interest portion based on flat rate
      const interestRate = bunga / 100;
      const interestPortion = loan.jumlah * interestRate * tenor * 0.6; // 60% of interest goes to SHU
      
      loanInterestPaid += interestPortion;
    }
  });
  
  // Calculate SHU based on savings and loan interest
  const savingsSHU = calculateTotalSimpanan(anggotaId) * 0.05; // 5% of total savings
  const totalSHU = savingsSHU + loanInterestPaid;
  
  return Math.round(totalSHU);
}

// Export the modular functions for updating and deleting transactions
export { updateTransaksi, deleteTransaksi };


import { getAllTransaksi } from "./transaksiCore";

/**
 * Calculate total simpanan for an anggota
 */
export async function calculateTotalSimpanan(anggotaId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Calculate total outstanding pinjaman for an anggota
 */
export async function calculateTotalPinjaman(anggotaId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
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
export async function getTotalAllSimpanan(): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Get total pinjaman for all members
 */
export async function getTotalAllPinjaman(): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Get total angsuran for all members
 */
export async function getTotalAllAngsuran(): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Calculate SHU (Sisa Hasil Usaha) for an anggota.
 * This is typically calculated based on member's contribution (savings, loans, etc.)
 * 
 * @param anggotaId The anggota ID
 * @returns The SHU amount
 */
export async function calculateSHU(anggotaId: string): Promise<number> {
  const totalSimpanan = await calculateTotalSimpanan(anggotaId);
  const allTransaksi = await getAllTransaksi();
  
  // Filter transactions for this member
  const memberTransaksi = allTransaksi.filter(t => t.anggotaId === anggotaId);
  
  // Calculate the member's loan interest payments (a portion goes to SHU)
  let loanInterestPaid = 0;
  
  // Extract loan data from member transactions
  const loans = memberTransaksi.filter(t => t.jenis === "Pinjam");
  const angsuran = memberTransaksi.filter(t => t.jenis === "Angsuran");
  
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
  const savingsSHU = totalSimpanan * 0.05; // 5% of total savings
  const totalSHU = savingsSHU + loanInterestPaid;
  
  return Math.round(totalSHU);
}

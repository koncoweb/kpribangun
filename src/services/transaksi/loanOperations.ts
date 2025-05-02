
import { Transaksi } from "@/types";
import { getAllTransaksi, getTransaksiById } from "./transaksiCore";

/**
 * Get overdue loans for an anggota or all anggota
 */
export function getOverdueLoans(anggotaId: string): {
  transaksi: Transaksi;
  jatuhTempo: string;
  daysOverdue: number;
  penalty: number;
}[] {
  const transaksiList = getAllTransaksi();
  let pinjamanList;
  
  if (anggotaId === "ALL") {
    pinjamanList = transaksiList.filter(
      (transaksi) => transaksi.jenis === "Pinjam" && transaksi.status === "Sukses"
    );
  } else {
    pinjamanList = transaksiList.filter(
      (transaksi) => transaksi.anggotaId === anggotaId && 
                    transaksi.jenis === "Pinjam" && 
                    transaksi.status === "Sukses"
    );
  }
  
  const overdueLoans = [];
  
  for (const pinjaman of pinjamanList) {
    // Calculate jatuh tempo based on tenor in keterangan
    const jatuhTempoDate = calculateJatuhTempo(pinjaman);
    const currentDate = new Date();
    
    // If jatuh tempo is already due
    if (jatuhTempoDate && jatuhTempoDate < currentDate) {
      const daysOverdue = Math.floor((currentDate.getTime() - jatuhTempoDate.getTime()) / (1000 * 60 * 60 * 24));
      const penalty = calculatePenalty(pinjaman.jumlah, daysOverdue);
      
      overdueLoans.push({
        transaksi: pinjaman,
        jatuhTempo: jatuhTempoDate.toISOString(),
        daysOverdue,
        penalty
      });
    }
  }
  
  return overdueLoans;
}

/**
 * Get upcoming due loans for an anggota or all anggota
 */
export function getUpcomingDueLoans(anggotaId: string, daysInFuture: number = 30): {
  transaksi: Transaksi;
  jatuhTempo: string;
  daysUntilDue: number;
}[] {
  const transaksiList = getAllTransaksi();
  let pinjamanList;
  
  if (anggotaId === "ALL") {
    pinjamanList = transaksiList.filter(
      (transaksi) => transaksi.jenis === "Pinjam" && transaksi.status === "Sukses"
    );
  } else {
    pinjamanList = transaksiList.filter(
      (transaksi) => transaksi.anggotaId === anggotaId && 
                    transaksi.jenis === "Pinjam" && 
                    transaksi.status === "Sukses"
    );
  }
  
  const upcomingLoans = [];
  
  for (const pinjaman of pinjamanList) {
    // Calculate jatuh tempo based on tenor in keterangan
    const jatuhTempoDate = calculateJatuhTempo(pinjaman);
    const currentDate = new Date();
    
    // If jatuh tempo is upcoming within specified days
    if (jatuhTempoDate && jatuhTempoDate > currentDate) {
      const daysUntilDue = Math.floor((jatuhTempoDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= daysInFuture) {
        upcomingLoans.push({
          transaksi: pinjaman,
          jatuhTempo: jatuhTempoDate.toISOString(),
          daysUntilDue
        });
      }
    }
  }
  
  return upcomingLoans;
}

/**
 * Calculate jatuh tempo date based on transaksi data
 */
export function calculateJatuhTempo(transaksi: Transaksi): Date | null {
  if (transaksi.jenis !== "Pinjam" || !transaksi.keterangan) {
    return null;
  }
  
  // Extract tenor from keterangan
  const tenorMatch = transaksi.keterangan.match(/Tenor: (\d+) bulan/);
  if (!tenorMatch || !tenorMatch[1]) {
    return null;
  }
  
  const tenor = parseInt(tenorMatch[1]);
  const tanggalPinjam = new Date(transaksi.tanggal);
  
  // Calculate jatuh tempo by adding tenor months to pinjam date
  const jatuhTempoDate = new Date(tanggalPinjam);
  jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + tenor);
  
  return jatuhTempoDate;
}

/**
 * Calculate penalty for overdue loans
 */
export function calculatePenalty(jumlahPinjaman: number, daysOverdue: number): number {
  // Default penalty rate: 0.1% per day
  const penaltyRatePerDay = 0.001;
  
  return jumlahPinjaman * penaltyRatePerDay * daysOverdue;
}

/**
 * Calculate remaining loan amount
 */
export function getRemainingLoanAmount(pinjamanId: string): number {
  const pinjaman = getTransaksiById(pinjamanId);
  if (!pinjaman || pinjaman.jenis !== "Pinjam") {
    return 0;
  }
  
  const transaksiList = getAllTransaksi();
  const angsuranList = transaksiList.filter(
    transaksi => 
      transaksi.jenis === "Angsuran" && 
      transaksi.status === "Sukses" && 
      transaksi.keterangan && 
      transaksi.keterangan.includes(pinjamanId)
  );
  
  const totalAngsuran = angsuranList.reduce((total, angsuran) => total + angsuran.jumlah, 0);
  const remainingAmount = Math.max(0, pinjaman.jumlah - totalAngsuran);
  
  return remainingAmount;
}

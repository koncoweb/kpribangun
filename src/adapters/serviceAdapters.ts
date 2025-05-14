
import { Anggota, Pengaturan, Transaksi, Pengajuan } from "@/types";
import * as anggotaService from "@/services/anggotaService";
import * as transaksiService from "@/services/transaksi";
import * as pengajuanService from "@/services/pengajuanService";
import * as pengaturanService from "@/services/pengaturanService";

// Environment flag to determine which data source to use
// This would be controlled by the migration process
export const USE_SUPABASE = false;

// Anggota Service Adapters
export const getAnggotaById = (id: string): Anggota | undefined => {
  if (USE_SUPABASE) {
    // For now we return a synchronous result with the same data shape
    // In a fully migrated app we would handle this properly with async/await
    return anggotaService.getAnggotaById(id) as unknown as Anggota;
  }
  return anggotaService.getAnggotaById(id);
};

export const getAnggotaList = (): Anggota[] => {
  if (USE_SUPABASE) {
    // Same approach for the list
    return anggotaService.getAllAnggota() as unknown as Anggota[];
  }
  return anggotaService.getAllAnggota();
};

export const getAllAnggota = getAnggotaList;

// Transaksi Service Adapters
export const getTransaksiByAnggotaId = (anggotaId: string): Transaksi[] => {
  if (USE_SUPABASE) {
    return transaksiService.getTransaksiByAnggotaId(anggotaId) as unknown as Transaksi[];
  }
  return transaksiService.getTransaksiByAnggotaId(anggotaId);
};

export const getTransaksiById = (id: string): Transaksi | undefined => {
  if (USE_SUPABASE) {
    return transaksiService.getTransaksiById(id) as unknown as Transaksi;
  }
  return transaksiService.getTransaksiById(id);
};

export const getAllTransaksi = (): Transaksi[] => {
  if (USE_SUPABASE) {
    return transaksiService.getAllTransaksi() as unknown as Transaksi[];
  }
  return transaksiService.getAllTransaksi();
};

export const createTransaksi = (data: Partial<Transaksi>): Transaksi | null => {
  if (USE_SUPABASE) {
    return transaksiService.createTransaksi(data) as unknown as Transaksi;
  }
  return transaksiService.createTransaksi(data);
};

// Re-export other transaksi functions that are commonly used
export const calculateTotalSimpanan = transaksiService.calculateTotalSimpanan;
export const calculateTotalPinjaman = transaksiService.calculateTotalPinjaman;
export const getOverdueLoans = transaksiService.getOverdueLoans;
export const getUpcomingDueLoans = transaksiService.getUpcomingDueLoans;
export const calculatePenalty = transaksiService.calculatePenalty;
export const calculateSHU = transaksiService.calculateSHU;
export const getRemainingLoanAmount = transaksiService.getRemainingLoanAmount;

// Pengaturan Service Adapters
export const getPengaturan = (): Pengaturan => {
  if (USE_SUPABASE) {
    return pengaturanService.getPengaturan() as unknown as Pengaturan;
  }
  return pengaturanService.getPengaturan();
};

// Pengajuan Service Adapters
export const getPengajuanById = (id: string): Pengajuan | undefined => {
  if (USE_SUPABASE) {
    return pengajuanService.getPengajuanById(id) as unknown as Pengajuan;
  }
  return pengajuanService.getPengajuanById(id);
};

export const getPengajuanList = (): Pengajuan[] => {
  if (USE_SUPABASE) {
    return pengajuanService.getPengajuanList() as unknown as Pengajuan[];
  }
  return pengajuanService.getPengajuanList();
};

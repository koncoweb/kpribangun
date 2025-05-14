
import { Anggota, Pengaturan, Transaksi, Pengajuan } from "@/types";
import * as anggotaService from "@/services/anggotaService";
import * as transaksiService from "@/services/transaksi";
import * as pengajuanService from "@/services/pengajuanService";
import * as pengaturanService from "@/services/pengaturanService";

// Environment flag to determine which data source to use
// This would be controlled by the migration process
export const USE_SUPABASE = false;

// Anggota Service Adapters
export const getAnggotaById = async (id: string): Promise<Anggota | undefined> => {
  if (USE_SUPABASE) {
    return await anggotaService.getAnggotaById(id);
  }
  return anggotaService.getAnggotaById(id);
};

export const getAnggotaList = async (): Promise<Anggota[]> => {
  if (USE_SUPABASE) {
    return await anggotaService.getAllAnggota();
  }
  return anggotaService.getAllAnggota();
};

export const getAllAnggota = getAnggotaList;

// Transaksi Service Adapters
export const getTransaksiByAnggotaId = async (anggotaId: string): Promise<Transaksi[]> => {
  if (USE_SUPABASE) {
    return await transaksiService.getTransaksiByAnggotaId(anggotaId);
  }
  return transaksiService.getTransaksiByAnggotaId(anggotaId);
};

export const getTransaksiById = async (id: string): Promise<Transaksi | undefined> => {
  if (USE_SUPABASE) {
    return await transaksiService.getTransaksiById(id);
  }
  return transaksiService.getTransaksiById(id);
};

export const getAllTransaksi = async (): Promise<Transaksi[]> => {
  if (USE_SUPABASE) {
    return await transaksiService.getAllTransaksi();
  }
  return transaksiService.getAllTransaksi();
};

export const createTransaksi = async (data: Partial<Transaksi>): Promise<Transaksi | null> => {
  if (USE_SUPABASE) {
    return await transaksiService.createTransaksi(data);
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
export const getPengaturan = async (): Promise<Pengaturan> => {
  if (USE_SUPABASE) {
    return await pengaturanService.getPengaturan();
  }
  return pengaturanService.getPengaturan();
};

// Pengajuan Service Adapters
export const getPengajuanById = async (id: string): Promise<Pengajuan | undefined> => {
  if (USE_SUPABASE) {
    return await pengajuanService.getPengajuanById(id);
  }
  return pengajuanService.getPengajuanById(id);
};

export const getPengajuanList = async (): Promise<Pengajuan[]> => {
  if (USE_SUPABASE) {
    return await pengajuanService.getPengajuanList();
  }
  return pengajuanService.getPengajuanList();
};

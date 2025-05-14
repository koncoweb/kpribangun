
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
    return anggotaService.getAnggotaById(id);
  }
  return Promise.resolve(anggotaService.getAnggotaById(id));
};

export const getAnggotaList = async (): Promise<Anggota[]> => {
  if (USE_SUPABASE) {
    return anggotaService.getAllAnggota();
  }
  return Promise.resolve(anggotaService.getAllAnggota());
};

export const getAllAnggota = getAnggotaList;

// Transaksi Service Adapters
export const getTransaksiByAnggotaId = async (anggotaId: string): Promise<Transaksi[]> => {
  if (USE_SUPABASE) {
    return transaksiService.getTransaksiByAnggotaId(anggotaId);
  }
  return Promise.resolve(transaksiService.getTransaksiByAnggotaId(anggotaId));
};

export const getTransaksiById = async (id: string): Promise<Transaksi | undefined> => {
  if (USE_SUPABASE) {
    return transaksiService.getTransaksiById(id);
  }
  return Promise.resolve(transaksiService.getTransaksiById(id));
};

export const getAllTransaksi = async (): Promise<Transaksi[]> => {
  if (USE_SUPABASE) {
    return transaksiService.getAllTransaksi();
  }
  return Promise.resolve(transaksiService.getAllTransaksi());
};

export const createTransaksi = async (data: Partial<Transaksi>): Promise<Transaksi | null> => {
  if (USE_SUPABASE) {
    return transaksiService.createTransaksi(data);
  }
  return Promise.resolve(transaksiService.createTransaksi(data));
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
    return pengaturanService.getPengaturan();
  }
  return Promise.resolve(pengaturanService.getPengaturan());
};

// Pengajuan Service Adapters
export const getPengajuanById = async (id: string): Promise<Pengajuan | undefined> => {
  if (USE_SUPABASE) {
    return pengajuanService.getPengajuanById(id);
  }
  return Promise.resolve(pengajuanService.getPengajuanById(id));
};

export const getPengajuanList = async (): Promise<Pengajuan[]> => {
  if (USE_SUPABASE) {
    return pengajuanService.getPengajuanList();
  }
  return Promise.resolve(pengajuanService.getPengajuanList());
};

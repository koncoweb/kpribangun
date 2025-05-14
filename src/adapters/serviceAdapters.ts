
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
  try {
    if (USE_SUPABASE) {
      return await anggotaService.getAnggotaById(id);
    }
    return anggotaService.getAnggotaById(id);
  } catch (error) {
    console.error("Error fetching anggota by ID:", error);
    return undefined;
  }
};

export const getAnggotaList = async (): Promise<Anggota[]> => {
  try {
    if (USE_SUPABASE) {
      return await anggotaService.getAllAnggota();
    }
    return anggotaService.getAllAnggota();
  } catch (error) {
    console.error("Error fetching anggota list:", error);
    return [];
  }
};

export const getAllAnggota = getAnggotaList;

// Transaksi Service Adapters
export const getTransaksiByAnggotaId = async (anggotaId: string): Promise<Transaksi[]> => {
  try {
    if (USE_SUPABASE) {
      return await transaksiService.getTransaksiByAnggotaId(anggotaId);
    }
    return transaksiService.getTransaksiByAnggotaId(anggotaId);
  } catch (error) {
    console.error("Error fetching transaksi by anggota ID:", error);
    return [];
  }
};

export const getTransaksiById = async (id: string): Promise<Transaksi | undefined> => {
  try {
    if (USE_SUPABASE) {
      return await transaksiService.getTransaksiById(id);
    }
    return transaksiService.getTransaksiById(id);
  } catch (error) {
    console.error("Error fetching transaksi by ID:", error);
    return undefined;
  }
};

export const getAllTransaksi = async (): Promise<Transaksi[]> => {
  try {
    if (USE_SUPABASE) {
      return await transaksiService.getAllTransaksi();
    }
    return transaksiService.getAllTransaksi();
  } catch (error) {
    console.error("Error fetching all transaksi:", error);
    return [];
  }
};

export const createTransaksi = async (data: Partial<Transaksi>): Promise<Transaksi | null> => {
  try {
    if (USE_SUPABASE) {
      return await transaksiService.createTransaksi(data);
    }
    return transaksiService.createTransaksi(data);
  } catch (error) {
    console.error("Error creating transaksi:", error);
    return null;
  }
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
  try {
    if (USE_SUPABASE) {
      return await pengaturanService.getPengaturan();
    }
    return pengaturanService.getPengaturan();
  } catch (error) {
    console.error("Error fetching pengaturan:", error);
    return pengaturanService.getPengaturan(); // Fallback to default
  }
};

// Pengajuan Service Adapters
export const getPengajuanById = async (id: string): Promise<Pengajuan | undefined> => {
  try {
    if (USE_SUPABASE) {
      return await pengajuanService.getPengajuanById(id);
    }
    return pengajuanService.getPengajuanById(id);
  } catch (error) {
    console.error("Error fetching pengajuan by ID:", error);
    return undefined;
  }
};

export const getPengajuanList = async (): Promise<Pengajuan[]> => {
  try {
    if (USE_SUPABASE) {
      return await pengajuanService.getPengajuanList();
    }
    return pengajuanService.getPengajuanList();
  } catch (error) {
    console.error("Error fetching pengajuan list:", error);
    return [];
  }
};

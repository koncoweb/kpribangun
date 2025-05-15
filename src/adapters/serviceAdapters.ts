
import { Anggota, Pengaturan, Transaksi, Pengajuan } from "@/types";
import * as anggotaService from "@/services/anggotaService";
import * as transaksiService from "@/services/transaksi";
import * as pengajuanService from "@/services/pengajuanService";
import * as pengaturanService from "@/services/pengaturanService";

// Environment flag to determine which data source to use
// This would be controlled by the migration process
export const USE_SUPABASE = true;

// Anggota Service Adapters
export const getAnggotaById = async (id: string): Promise<Anggota | undefined> => {
  try {
    if (USE_SUPABASE) {
      return await anggotaService.getAnggotaById(id);
    }
    return await Promise.resolve(anggotaService.getAnggotaById(id));
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
    return await Promise.resolve(anggotaService.getAllAnggota());
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
    return await Promise.resolve(transaksiService.getTransaksiByAnggotaId(anggotaId));
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
    return await Promise.resolve(transaksiService.getTransaksiById(id));
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
    return await Promise.resolve(transaksiService.getAllTransaksi());
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
    return await Promise.resolve(transaksiService.createTransaksi(data as any));
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
    // If not using Supabase, still treat as async for consistency
    return await Promise.resolve(pengaturanService.getPengaturan());
  } catch (error) {
    console.error("Error fetching pengaturan:", error);
    // Return a default value or throw an error
    return await pengaturanService.getPengaturan(); // Fallback to default
  }
};

// Pengajuan Service Adapters
export const getPengajuanById = async (id: string): Promise<Pengajuan | undefined> => {
  try {
    if (USE_SUPABASE) {
      return await pengajuanService.getPengajuanById(id);
    }
    return await Promise.resolve(pengajuanService.getPengajuanById(id));
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
    return await Promise.resolve(pengajuanService.getPengajuanList());
  } catch (error) {
    console.error("Error fetching pengajuan list:", error);
    return [];
  }
};

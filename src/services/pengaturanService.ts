
import { Pengaturan } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

const PENGATURAN_KEY = "koperasi_pengaturan";

// Default pengaturan
const defaultPengaturan: Pengaturan = {
  tenor: {
    minTenor: 3,
    maxTenor: 36,
    defaultTenor: 12,
    tenorOptions: [3, 6, 12, 24, 36],
  },
  sukuBunga: {
    pinjaman: 1.5,
    simpanan: 0.5,
    metodeBunga: "flat",
  },
  denda: {
    persentase: 0.1,
    gracePeriod: 3,
    metodeDenda: "harian"
  }
};

/**
 * Get all pengaturan from local storage
 */
export function getPengaturan(): Pengaturan {
  return getFromLocalStorage<Pengaturan>(PENGATURAN_KEY, defaultPengaturan);
}

/**
 * Update pengaturan
 */
export function updatePengaturan(pengaturan: Partial<Pengaturan>): Pengaturan {
  const currentPengaturan = getPengaturan();
  
  const updatedPengaturan: Pengaturan = {
    tenor: {
      ...currentPengaturan.tenor,
      ...(pengaturan.tenor || {})
    },
    sukuBunga: {
      ...currentPengaturan.sukuBunga,
      ...(pengaturan.sukuBunga || {})
    },
    denda: {
      ...currentPengaturan.denda,
      ...(pengaturan.denda || {})
    }
  };
  
  saveToLocalStorage(PENGATURAN_KEY, updatedPengaturan);
  return updatedPengaturan;
}

/**
 * Calculate angsuran per bulan
 */
export function calculateAngsuran(jumlahPinjaman: number, tenor: number): {
  angsuranPerBulan: number;
  totalBayar: number;
} {
  const pengaturan = getPengaturan();
  const bungaPerBulan = pengaturan.sukuBunga.pinjaman / 100;
  
  let angsuranPerBulan = 0;
  let totalBayar = 0;
  
  if (pengaturan.sukuBunga.metodeBunga === "flat") {
    // Flat rate calculation
    const bunga = jumlahPinjaman * bungaPerBulan * tenor;
    totalBayar = jumlahPinjaman + bunga;
    angsuranPerBulan = totalBayar / tenor;
  } else {
    // Sliding/declining rate calculation (simplified)
    angsuranPerBulan = jumlahPinjaman / tenor;
    let sisaPinjaman = jumlahPinjaman;
    let totalBungaSliding = 0;
    
    for (let i = 0; i < tenor; i++) {
      const bungaBulanIni = sisaPinjaman * bungaPerBulan;
      totalBungaSliding += bungaBulanIni;
      sisaPinjaman -= angsuranPerBulan;
    }
    
    totalBayar = jumlahPinjaman + totalBungaSliding;
    // Adjust monthly payment to include average interest
    angsuranPerBulan = totalBayar / tenor;
  }
  
  return {
    angsuranPerBulan,
    totalBayar
  };
}

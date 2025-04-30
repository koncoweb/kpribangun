
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
 * Calculate flat interest rate
 */
function calculateFlatInterest(jumlahPinjaman: number, tenor: number, bungaPerBulan: number): {
  angsuranPerBulan: number;
  totalBayar: number;
} {
  const bunga = jumlahPinjaman * bungaPerBulan * tenor;
  const totalBayar = jumlahPinjaman + bunga;
  const angsuranPerBulan = totalBayar / tenor;
  
  return { angsuranPerBulan, totalBayar };
}

/**
 * Calculate sliding/declining interest rate
 */
function calculateSlidingInterest(jumlahPinjaman: number, tenor: number, bungaPerBulan: number): {
  angsuranPerBulan: number;
  totalBayar: number;
} {
  const pokokPerBulan = jumlahPinjaman / tenor;
  let sisaPinjaman = jumlahPinjaman;
  let totalBungaSliding = 0;
  
  for (let i = 0; i < tenor; i++) {
    const bungaBulanIni = sisaPinjaman * bungaPerBulan;
    totalBungaSliding += bungaBulanIni;
    sisaPinjaman -= pokokPerBulan;
  }
  
  const totalBayar = jumlahPinjaman + totalBungaSliding;
  // Adjust monthly payment to include average interest
  const angsuranPerBulan = totalBayar / tenor;
  
  return { angsuranPerBulan, totalBayar };
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
  
  if (pengaturan.sukuBunga.metodeBunga === "flat") {
    return calculateFlatInterest(jumlahPinjaman, tenor, bungaPerBulan);
  } else {
    return calculateSlidingInterest(jumlahPinjaman, tenor, bungaPerBulan);
  }
}


import { Pengaturan } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { PinjamanCategory, defaultPinjamanInterestRates } from "./transaksi/categories";

const PENGATURAN_KEY = "koperasi_pengaturan";

// Default pengaturan initial data
const initialPengaturan: Pengaturan = {
  sukuBunga: {
    pinjaman: 1.5, // 1.5% per bulan 
    simpanan: 0.5, // 0.5% per bulan
    metodeBunga: "flat",
    pinjamanByCategory: {
      [PinjamanCategory.REGULER]: 1.5,    // 1.5% per month
      [PinjamanCategory.SERTIFIKASI]: 1.0, // 1.0% per month
      [PinjamanCategory.MUSIMAN]: 2.0      // 2.0% per month
    }
  },
  tenor: {
    minTenor: 3,     // minimum 3 bulan
    maxTenor: 36,    // maximum 36 bulan
    defaultTenor: 12, // default 12 bulan
    tenorOptions: [3, 6, 12, 18, 24, 36]
  },
  denda: {
    persentase: 0.1, // 0.1% per hari
    gracePeriod: 3,  // 3 hari masa tenggang
    metodeDenda: "harian"
  }
};

/**
 * Get pengaturan from local storage
 */
export function getPengaturan(): Pengaturan {
  return getFromLocalStorage<Pengaturan>(PENGATURAN_KEY, initialPengaturan);
}

/**
 * Save pengaturan to local storage
 */
export function savePengaturan(pengaturan: Pengaturan): void {
  saveToLocalStorage(PENGATURAN_KEY, pengaturan);
}

/**
 * Update specific pengaturan fields
 */
export function updatePengaturan(updatedFields: Partial<Pengaturan>): Pengaturan {
  const currentPengaturan = getPengaturan();
  
  // Deep merge the current pengaturan with the updated fields
  const updatedPengaturan = {
    ...currentPengaturan,
    ...updatedFields,
    sukuBunga: {
      ...currentPengaturan.sukuBunga,
      ...(updatedFields.sukuBunga || {})
    },
    tenor: {
      ...currentPengaturan.tenor,
      ...(updatedFields.tenor || {})
    },
    denda: {
      ...currentPengaturan.denda,
      ...(updatedFields.denda || {})
    }
  };
  
  saveToLocalStorage(PENGATURAN_KEY, updatedPengaturan);
  return updatedPengaturan;
}

/**
 * Reset pengaturan to default values
 */
export function resetPengaturan(): Pengaturan {
  saveToLocalStorage(PENGATURAN_KEY, initialPengaturan);
  return initialPengaturan;
}


import { Anggota, Transaksi } from "@/types";

// Form props
export interface PinjamanFormProps {
  anggotaList: Anggota[];
}

// Calculation utilities
export interface LoanCalculationResult {
  angsuranPerBulan: number;
  totalBunga: number;
  totalBayar: number;
}

// Calculate loan payments based on principal, interest, and term
export function calculateAngsuran(
  pokok: number,
  bungaPersenPerBulan: number,
  tenorBulan: number
): LoanCalculationResult {
  // Simple flat interest calculation
  const bungaPerBulan = pokok * (bungaPersenPerBulan / 100);
  const totalBunga = bungaPerBulan * tenorBulan;
  const totalBayar = pokok + totalBunga;
  const angsuranPerBulan = totalBayar / tenorBulan;
  
  return {
    angsuranPerBulan: Math.ceil(angsuranPerBulan),
    totalBunga,
    totalBayar
  };
}

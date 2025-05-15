
import { Anggota, Pengaturan } from "@/types";

// Form props
export interface PinjamanFormProps {
  anggotaList: Anggota[];
}

// Function to calculate installment amounts
export const calculateAngsuran = (
  jumlah: number,
  bunga: number,
  tenor: number,
  metode: "flat" | "menurun" = "flat"
) => {
  // Flat rate calculation
  if (metode === "flat") {
    const bungaPerBulan = jumlah * (bunga / 100);
    const totalBunga = bungaPerBulan * tenor;
    const totalBayar = jumlah + totalBunga;
    const angsuranPerBulan = totalBayar / tenor;

    return {
      pokok: jumlah / tenor,
      bunga: bungaPerBulan,
      total: angsuranPerBulan,
      totalKeseluruhan: totalBayar
    };
  }
  
  // Declining balance calculation (menurun)
  const angsuran = [];
  let sisaPokok = jumlah;
  const pokokPerBulan = jumlah / tenor;
  
  for (let i = 0; i < tenor; i++) {
    const bungaBulanIni = sisaPokok * (bunga / 100);
    const totalBulanIni = pokokPerBulan + bungaBulanIni;
    
    angsuran.push({
      bulan: i + 1,
      pokok: pokokPerBulan,
      bunga: bungaBulanIni,
      total: totalBulanIni,
      sisaPokok: sisaPokok - pokokPerBulan
    });
    
    sisaPokok -= pokokPerBulan;
  }
  
  const totalBunga = angsuran.reduce((sum, a) => sum + a.bunga, 0);
  const totalBayar = jumlah + totalBunga;
  
  return {
    angsuran,
    totalBunga,
    totalBayar,
    rataRata: totalBayar / tenor
  };
};

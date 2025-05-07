
// Settings
export interface Pengaturan {
  sukuBunga: {
    pinjaman: number;
    simpanan: number;
    metodeBunga: "flat" | "menurun";
    pinjamanByCategory?: {
      [key: string]: number;
    };
  };
  tenor: {
    minTenor: number;
    maxTenor: number;
    defaultTenor: number;
    tenorOptions: number[];
  };
  denda: {
    persentase: number;
    gracePeriod: number;
    metodeDenda: "harian" | "bulanan";
  };
}

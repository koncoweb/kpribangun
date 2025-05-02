
export interface AngsuranDetail {
  nomorAngsuran: number;
  tanggalJatuhTempo: string;
  nominal: number;
  status: "Terbayar" | "Belum Terbayar";
  transaksiId?: string;
}

export interface AngsuranListProps {
  pinjamanTransaksi: any[];
}

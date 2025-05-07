
import { Transaksi } from "@/types";

export interface AngsuranListProps {
  pinjamanTransaksi: Transaksi[];
  disableSelfPayment?: boolean;
}

export interface AngsuranDetailItem {
  angsuranKe: number;
  jatuhTempo: string;
  jumlah: number;
  status: "lunas" | "belum-bayar" | "terlambat";
  tanggalBayar?: string;
  petugas?: string;
  metodePembayaran?: string;
}

export interface LoanSelectorProps {
  pinjamanTransaksi: Transaksi[];
  selectedPinjaman: string;
  onLoanSelect: (pinjamanId: string) => void;
}


import { Pengaturan } from "@/types";

export interface PinjamanFormData {
  kategori: string;
  jumlah: string;
  keterangan: string;
}

export interface PinjamanFormSummaryProps {
  kategori: string;
  jumlah: string;
  bunga: number;
  pengaturan: Pengaturan;
}

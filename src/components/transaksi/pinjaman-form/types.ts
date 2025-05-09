
import { Anggota } from "@/types";

export interface PinjamanFormProps {
  anggotaList: Anggota[];
}

export interface PinjamanFormData {
  tanggal: string;
  anggotaId: string;
  jumlah: number;
  tenor: number;
  kategori: string;
  bunga: number;
  angsuran: number;
  keterangan: string;
}

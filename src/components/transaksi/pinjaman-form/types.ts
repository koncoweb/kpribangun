
import { Anggota } from "@/types";

export interface PinjamanFormProps {
  anggota?: Anggota;
  anggotaList?: Anggota[];
}

export interface PinjamanParameters {
  sukuBunga: number;
  biayaAdmin: number;
  biayaProvisi: number;
  asuransi: number;
}

export interface PinjamanHasil {
  jumlahDiterima: number;
  totalBiaya: number;
  angsuranPerBulan: number;
  totalPembayaran: number;
}

export interface PinjamanFormState {
  tanggal: string;
  anggotaId: string;
  kategori: string;
  jumlahPinjaman: number;
  tenor: number;
  keterangan: string;
  isDisbursing: boolean;
}

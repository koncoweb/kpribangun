
import { PersyaratanDokumen } from "@/types";

// Define the status type to match what's in the database
export type PengajuanStatus = "Diajukan" | "Menunggu" | "Disetujui" | "Ditolak";

export interface PengajuanData {
  id: string;
  tanggal: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpanan" | "Pinjaman";
  jumlah: number;
  status: PengajuanStatus;
  kategori: string;
  keterangan?: string;
  dokumen?: PersyaratanDokumen[];
  createdAt: string;
  updatedAt: string;
}

export const PENGAJUAN_KEY = "koperasi_pengajuan";

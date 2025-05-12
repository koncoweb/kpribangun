
import { PersyaratanDokumen } from "@/types";

export interface PengajuanData {
  id: string;
  tanggal: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam";
  jumlah: number;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  kategori: string;
  keterangan?: string;
  dokumen?: PersyaratanDokumen[];
  createdAt: string;
  updatedAt: string;
}

export const PENGAJUAN_KEY = "koperasi_pengajuan";


import { createTransaksi } from "../transaksiService";
import { getPengajuanById, updatePengajuan } from "./crud";
import { PengajuanData } from "./types";

/**
 * Approve a pengajuan and convert it to a transaction
 */
export function approvePengajuan(id: string): boolean {
  const pengajuan = getPengajuanById(id);
  if (!pengajuan || pengajuan.status !== "Menunggu") return false;
  
  // Update the pengajuan status
  const updatedPengajuan = updatePengajuan(id, { status: "Disetujui" });
  if (!updatedPengajuan) return false;
  
  // Create a transaction based on the approved pengajuan
  const transaction = createTransaksi({
    tanggal: pengajuan.tanggal,
    anggotaId: pengajuan.anggotaId,
    jenis: pengajuan.jenis,
    jumlah: pengajuan.jumlah,
    kategori: pengajuan.kategori, // Make sure to include kategori in the transaction
    keterangan: `Dari Pengajuan #${pengajuan.id}: ${pengajuan.keterangan || ""}`.trim(),
    status: "Sukses"
  });
  
  return !!transaction;
}

/**
 * Reject a pengajuan
 */
export function rejectPengajuan(id: string): boolean {
  const pengajuan = getPengajuanById(id);
  if (!pengajuan || pengajuan.status !== "Menunggu") return false;
  
  // Update the pengajuan status
  const updatedPengajuan = updatePengajuan(id, { status: "Ditolak" });
  
  return !!updatedPengajuan;
}

/**
 * Get pengajuan by status
 */
export function getPengajuanByStatus(status: "Menunggu" | "Disetujui" | "Ditolak"): PengajuanData[] {
  const pengajuanList = require("./crud").getPengajuanList();
  return pengajuanList.filter(pengajuan => pengajuan.status === status);
}

/**
 * Get pengajuan by jenis
 */
export function getPengajuanByJenis(jenis: "Simpan" | "Pinjam"): PengajuanData[] {
  const pengajuanList = require("./crud").getPengajuanList();
  return pengajuanList.filter(pengajuan => pengajuan.jenis === jenis);
}

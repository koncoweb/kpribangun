
import { PengajuanData } from "./types";

// Initial sample data
export const initialPengajuan: PengajuanData[] = [
  { 
    id: "PG0001", 
    tanggal: "2025-04-20",
    anggotaId: "AG0001",
    anggotaNama: "Budi Santoso",
    jenis: "Simpan",
    jumlah: 500000,
    status: "Disetujui",
    kategori: "Wajib",
    keterangan: "Simpanan wajib bulan April",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "PG0002", 
    tanggal: "2025-04-18",
    anggotaId: "AG0004",
    anggotaNama: "Sri Wahyuni",
    jenis: "Pinjam",
    jumlah: 2000000,
    kategori: "Reguler",
    keterangan: "Pinjaman untuk modal usaha",
    status: "Menunggu",
    dokumen: [
      {
        id: "doc-1",
        jenis: "KTP",
        file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        namaFile: "ktp_sri_wahyuni.jpg",
        required: true,
        kategori: "All"
      },
      {
        id: "doc-2",
        jenis: "KK",
        file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
        namaFile: "kk_sri_wahyuni.pdf",
        required: true,
        kategori: "All"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "PG0003", 
    tanggal: "2025-04-15",
    anggotaId: "AG0002",
    anggotaNama: "Dewi Lestari",
    jenis: "Simpan",
    jumlah: 750000,
    status: "Ditolak",
    kategori: "Sukarela",
    keterangan: "Simpanan sukarela",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

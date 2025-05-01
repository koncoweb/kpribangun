// Anggota (Member) type
export interface Anggota {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  pekerjaan: string;
  status: string; // Added status field
  tanggalBergabung?: string; // Added tanggalBergabung field
  foto?: string;
  email: string; // Ensuring email is required
  dokumen?: AnggotaDokumen[];
  keluarga?: AnggotaKeluarga[];
  createdAt: string;
  updatedAt: string;
}

export interface AnggotaDokumen {
  id: string;
  jenis: "KTP" | "KK" | "Sertifikat" | "BPKB" | "SK";
  file: string; // base64 string
  namaFile: string;
  tanggalUpload: string;
}

export interface AnggotaKeluarga {
  id: string;
  nama: string;
  hubungan: "Anak" | "Suami" | "Istri" | "Orang Tua" | "Saudara Kandung" | "Kerabat";
  alamat: string;
  noHp: string;
}

// Transaksi (Transaction) type
export interface Transaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam" | "Angsuran";
  jumlah: number;
  tanggal: string;
  keterangan?: string;
  status: "Sukses" | "Pending" | "Gagal"; // Added status field
  createdAt: string;
  updatedAt: string;
}

// Pengajuan (Application) type
export interface Pengajuan {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam";
  jumlah: number;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

// POS Types
export interface ProdukItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  satuan: string;
  deskripsi?: string;
  gambar?: string;
  createdAt: string;
}

export interface Kasir {
  id: string;
  nama: string;
  noHp: string;
  username: string;
  role: "admin" | "kasir";
  aktif: boolean;
  createdAt: string;
}

export interface PenjualanItem {
  produkId: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
  diskon?: number;
}

export interface Penjualan {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  kasirId: string;
  items: PenjualanItem[];
  subtotal: number;
  diskon?: number;
  pajak?: number;
  total: number;
  dibayar: number;
  kembalian: number;
  metodePembayaran: "cash" | "debit" | "kredit" | "qris";
  status: "sukses" | "dibatalkan";
  catatan?: string;
  createdAt: string;
}

// Pembelian (Purchase) Types
export interface PembelianItem {
  produkId: string;
  produkNama: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
}

export interface Pembelian {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  pemasokId?: string;
  pemasok: string;
  items: PembelianItem[];
  subtotal: number;
  diskon?: number;
  ppn?: number;
  total: number;
  status: "selesai" | "proses" | "dibatalkan";
  catatan?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Pemasok {
  id: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  kontak?: string;
  createdAt: string;
}

// User Management Types
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: "read" | "create" | "update" | "delete" | "all";
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[]; // Permission IDs
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  foto?: string;
  jabatan?: string;
  noHP?: string;
  alamat?: string;
  roleId: string;
  roleName?: string;
  aktif: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  anggotaId?: string;
}

// Settings
export interface Pengaturan {
  sukuBunga: {
    pinjaman: number;
    simpanan: number;
    metodeBunga: "flat" | "menurun";
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

// Auth Types
export interface AuthUser extends User {
  nama: string;
}

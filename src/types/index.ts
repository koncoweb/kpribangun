export interface Anggota {
  id: string;
  nama: string;
  noAnggota: string;
  alamat: string;
  noHp: string;
  email: string;
  tanggalMasuk: string;
  status: "aktif" | "tidak aktif";
  jenisKelamin: "pria" | "wanita";
  foto: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaksi {
  id: string;
  anggotaId: string;
  tanggal: string;
  jenis: "simpanan" | "pinjaman" | "angsuran";
  jumlah: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Simpanan {
  id: string;
  anggotaId: string;
  tanggal: string;
  jenis: "pokok" | "wajib" | "sukarela";
  jumlah: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pinjaman {
  id: string;
  anggotaId: string;
  tanggal: string;
  jumlah: number;
  tenor: number;
  sukuBunga: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Angsuran {
  id: string;
  pinjamanId: string;
  tanggal: string;
  jumlah: number;
  keterangan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pengajuan {
  id: string;
  anggotaId: string;
  tanggal: string;
  jenis: "simpanan" | "pinjaman";
  jumlah: number;
  keterangan: string;
  status: "diajukan" | "disetujui" | "ditolak";
  createdAt: string;
  updatedAt: string;
}

export interface Pengaturan {
  id: string;
  namaKoperasi: string;
  alamatKoperasi: string;
  noHpKoperasi: string;
  emailKoperasi: string;
  sukuBungaSimpanan: number;
  sukuBungaPinjaman: number;
  dendaKeterlambatan: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProdukItem {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  kategori: string;
  gambar: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pemasok {
  id: string;
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Penjualan {
  id: string;
  tanggal: string;
  totalHarga: number;
  metodePembayaran: string;
  status: "pending" | "selesai" | "batal";
  detailPenjualan: DetailPenjualan[];
  kasir: string;
  createdAt: string;
  updatedAt: string;
}

export interface DetailPenjualan {
  id: string;
  produkId: string;
  namaProduk: string;
  jumlah: number;
  hargaSatuan: number;
  subtotal: number;
}

export interface Pembelian {
  id: string;
  pemasokId: string;
  tanggal: string;
  totalHarga: number;
  metodePembayaran: string;
  status: "pending" | "selesai" | "batal";
  detailPembelian: DetailPembelian[];
  createdAt: string;
  updatedAt: string;
}

export interface DetailPembelian {
  id: string;
  produkId: string;
  namaProduk: string;
  jumlah: number;
  hargaSatuan: number;
  subtotal: number;
}

export interface Kasir {
  id: string;
  nama: string;
  noHp: string;
  username: string;
  role: "admin" | "kasir";
  aktif: boolean;
  createdAt: string;
  updatedAt: string;
}

// User Management Types
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  action: "read" | "create" | "update" | "delete" | "all";
}

// User Type is defined in user.ts

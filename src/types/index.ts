
export interface Anggota {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  pekerjaan: string;
  foto?: string;
  createdAt: string;
}

export interface Transaksi {
  id: string;
  tanggal: string;
  anggotaId: string;
  jenis: "Simpan" | "Pinjam" | "Angsuran";
  jumlah: number;
  keterangan: string;
  status: "Sukses" | "Pending" | "Gagal";
  createdAt: string;
}

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


export type Anggota = {
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
  updatedAt: string;
};

export type Transaksi = {
  id: string;
  tanggal: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam" | "Angsuran";
  jumlah: number;
  keterangan?: string;
  status: "Sukses" | "Pending" | "Ditolak";
  createdAt: string;
  updatedAt: string;
};

export type PengaturanTenor = {
  minTenor: number;
  maxTenor: number;
  defaultTenor: number;
  tenorOptions: number[];
};

export type PengaturanSukuBunga = {
  pinjaman: number;
  simpanan: number;
  metodeBunga: "flat" | "menurun";
};

export type PengaturanDenda = {
  persentase: number;
  gracePeriod: number;
  metodeDenda: "harian" | "bulanan";
};

export type Pengaturan = {
  tenor: PengaturanTenor;
  sukuBunga: PengaturanSukuBunga;
  denda: PengaturanDenda;
};

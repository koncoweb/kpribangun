
// Anggota (Member) type
export interface Anggota {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  jenisKelamin: string;
  agama: string;
  pekerjaan: string;
  status: string; // Added status field
  tanggalBergabung?: string; // Added tanggalBergabung field
  createdAt: string;
  updatedAt: string;
}

// Transaksi (Transaction) type
export interface Transaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: string; // "Simpan" | "Pinjam" | "Angsuran"
  jumlah: number;
  tanggal: string;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

// Pengajuan (Application) type
export interface Pengajuan {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: string; // "Simpan" | "Pinjam"
  jumlah: number;
  tanggal: string;
  status: string; // "Menunggu" | "Disetujui" | "Ditolak"
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

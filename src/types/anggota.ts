
// Anggota (Member) types
export interface Anggota {
  id: string;
  nama: string;
  nip?: string; // Changed from required to optional
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  status: string;
  unitKerja: string; // Changed from array to single string for single select
  pekerjaan?: string; // Added missing pekerjaan property
  tanggalBergabung?: string;
  foto?: string;
  email: string;
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

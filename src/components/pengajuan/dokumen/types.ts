
export interface PersyaratanDokumen {
  id: string;
  jenis: "KTP" | "KK" | "Sertifikat Tanah" | "Sertifikat Sertifikasi" | "Buku Rekening" | "ATM Sertifikasi";
  file: string | null; // base64 string
  namaFile: string;
  required: boolean;
  kategori: "Reguler" | "Sertifikasi" | "Musiman" | "All"; // Which loan category requires this document
}

export interface RequiredDocument {
  jenis: PersyaratanDokumen["jenis"];
  kategori: PersyaratanDokumen["kategori"];
  required: boolean;
}

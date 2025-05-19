import { Database } from "@/integrations/supabase/types";

// Database row type for pengajuan table
export interface PengajuanRow {
  id: string;
  anggotaid: string;
  anggotanama: string;
  jenispengajuan: "Simpanan" | "Pinjaman";
  tanggalpengajuan: string;
  jumlah: number;
  jangkawaktu: number | null;
  status: string;
  alasan: string | null;
  dokumen: any | null;
  created_at?: string;
  updated_at?: string;
}

// Type for inserting a new pengajuan record
export interface PengajuanInsert {
  id: string;
  anggotaid: string;
  anggotanama: string;
  jenispengajuan: "Simpanan" | "Pinjaman";
  tanggalpengajuan: Date;
  jumlah: number;
  jangkawaktu?: number | null;
  status: string;
  alasan?: string | null;
  dokumen?: any | null;
}

// Type for updating an existing pengajuan record
export interface PengajuanUpdate {
  anggotaid?: string;
  anggotanama?: string;
  jenispengajuan?: "Simpanan" | "Pinjaman";
  tanggalpengajuan?: Date;
  jumlah?: number;
  jangkawaktu?: number | null;
  status?: string;
  alasan?: string | null;
  dokumen?: any | null;
}

// Enhanced type with additional fields for UI display
export interface PengajuanWithDetails extends PengajuanRow {
  // Any additional UI-specific fields can be added here
  jenis: "Simpanan" | "Pinjaman"; // For type safety in UI
}

// Mapping function to convert database row to UI model
export function mapPengajuanRowToModel(row: PengajuanRow): PengajuanWithDetails {
  return {
    ...row,
    jenis: row.jenispengajuan as "Simpanan" | "Pinjaman",
  };
}

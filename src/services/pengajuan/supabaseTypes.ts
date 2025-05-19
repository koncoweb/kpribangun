import { Database } from "@/integrations/supabase/types";
import { PengajuanStatus } from "./types";

// Define the enum type to match the database
export type JenisPengajuan = "Simpanan" | "Pinjaman";

// Database row type for pengajuan table
export interface PengajuanRow {
  id: string;
  anggotaid: string;
  anggotanama: string;
  jenispengajuan: JenisPengajuan; // This is the enum type in the database
  tanggalpengajuan: string;
  jumlah: number;
  jangkawaktu: number | null;
  status: PengajuanStatus; // Using our status enum type
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
  jenispengajuan: JenisPengajuan; // Using our enum type
  tanggalpengajuan: Date;
  jumlah: number;
  jangkawaktu?: number | null;
  status: PengajuanStatus; // Using our status enum type
  alasan?: string | null;
  dokumen?: any | null;
}

// Type for updating an existing pengajuan record
export interface PengajuanUpdate {
  anggotaid?: string;
  anggotanama?: string;
  jenispengajuan?: JenisPengajuan; // Using our enum type
  tanggalpengajuan?: Date;
  jumlah?: number;
  jangkawaktu?: number | null;
  status?: PengajuanStatus; // Using our status enum type
  alasan?: string | null;
  dokumen?: any | null;
}

// Enhanced type with additional fields for UI display
export interface PengajuanWithDetails extends PengajuanRow {
  // Any additional UI-specific fields can be added here
  jenis: JenisPengajuan; // For type safety in UI
}

// Mapping function to convert database row to UI model
export function mapPengajuanRowToModel(row: PengajuanRow): PengajuanWithDetails {
  return {
    ...row,
    jenis: row.jenispengajuan,
  };
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      anggota: {
        Row: {
          agama: string | null
          alamat: string | null
          created_at: string | null
          dokumen: Json | null
          email: string | null
          foto: string | null
          id: string
          jeniskelamin: string | null
          keluarga: Json | null
          nama: string
          nip: string | null
          nohp: string | null
          status: string | null
          tanggalbergabung: string | null
          unitkerja: string | null
          updated_at: string | null
        }
        Insert: {
          agama?: string | null
          alamat?: string | null
          created_at?: string | null
          dokumen?: Json | null
          email?: string | null
          foto?: string | null
          id: string
          jeniskelamin?: string | null
          keluarga?: Json | null
          nama: string
          nip?: string | null
          nohp?: string | null
          status?: string | null
          tanggalbergabung?: string | null
          unitkerja?: string | null
          updated_at?: string | null
        }
        Update: {
          agama?: string | null
          alamat?: string | null
          created_at?: string | null
          dokumen?: Json | null
          email?: string | null
          foto?: string | null
          id?: string
          jeniskelamin?: string | null
          keluarga?: Json | null
          nama?: string
          nip?: string | null
          nohp?: string | null
          status?: string | null
          tanggalbergabung?: string | null
          unitkerja?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kasir: {
        Row: {
          aktif: boolean | null
          created_at: string | null
          id: string
          nama: string
          nohp: string | null
          role: string
          username: string
        }
        Insert: {
          aktif?: boolean | null
          created_at?: string | null
          id: string
          nama: string
          nohp?: string | null
          role: string
          username: string
        }
        Update: {
          aktif?: boolean | null
          created_at?: string | null
          id?: string
          nama?: string
          nohp?: string | null
          role?: string
          username?: string
        }
        Relationships: []
      }
      pemasok: {
        Row: {
          alamat: string | null
          created_at: string | null
          email: string | null
          id: string
          kontak: string | null
          nama: string
          telepon: string | null
        }
        Insert: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          kontak?: string | null
          nama: string
          telepon?: string | null
        }
        Update: {
          alamat?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          kontak?: string | null
          nama?: string
          telepon?: string | null
        }
        Relationships: []
      }
      pembelian: {
        Row: {
          catatan: string | null
          created_at: string | null
          diskon: number | null
          id: string
          items: Json
          nomortransaksi: string
          pemasokid: string
          ppn: number | null
          status: string
          subtotal: number
          tanggal: string
          total: number
          updated_at: string | null
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          diskon?: number | null
          id: string
          items?: Json
          nomortransaksi: string
          pemasokid: string
          ppn?: number | null
          status: string
          subtotal: number
          tanggal: string
          total: number
          updated_at?: string | null
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          diskon?: number | null
          id?: string
          items?: Json
          nomortransaksi?: string
          pemasokid?: string
          ppn?: number | null
          status?: string
          subtotal?: number
          tanggal?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pembelian_pemasokid_fkey"
            columns: ["pemasokid"]
            isOneToOne: false
            referencedRelation: "pemasok"
            referencedColumns: ["id"]
          },
        ]
      }
      pengajuan: {
        Row: {
          alasan: string | null
          anggotaid: string
          anggotanama: string
          created_at: string | null
          dokumen: Json | null
          id: string
          jangkawaktu: number | null
          jenispengajuan: string
          jumlah: number
          status: string
          tanggalpengajuan: string
          updated_at: string | null
        }
        Insert: {
          alasan?: string | null
          anggotaid: string
          anggotanama: string
          created_at?: string | null
          dokumen?: Json | null
          id: string
          jangkawaktu?: number | null
          jenispengajuan: string
          jumlah: number
          status?: string
          tanggalpengajuan: string
          updated_at?: string | null
        }
        Update: {
          alasan?: string | null
          anggotaid?: string
          anggotanama?: string
          created_at?: string | null
          dokumen?: Json | null
          id?: string
          jangkawaktu?: number | null
          jenispengajuan?: string
          jumlah?: number
          status?: string
          tanggalpengajuan?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pengajuan_anggotaid_fkey"
            columns: ["anggotaid"]
            isOneToOne: false
            referencedRelation: "anggota"
            referencedColumns: ["id"]
          },
        ]
      }
      pengaturan: {
        Row: {
          denda: Json
          id: string
          sukubunga: Json
          tenor: Json
        }
        Insert: {
          denda?: Json
          id?: string
          sukubunga?: Json
          tenor?: Json
        }
        Update: {
          denda?: Json
          id?: string
          sukubunga?: Json
          tenor?: Json
        }
        Relationships: []
      }
      penjualan: {
        Row: {
          catatan: string | null
          created_at: string | null
          dibayar: number
          diskon: number | null
          id: string
          items: Json
          kasirid: string
          kembalian: number
          metodepembayaran: string
          nomortransaksi: string
          pajak: number | null
          status: string
          subtotal: number
          tanggal: string
          total: number
        }
        Insert: {
          catatan?: string | null
          created_at?: string | null
          dibayar: number
          diskon?: number | null
          id: string
          items?: Json
          kasirid: string
          kembalian: number
          metodepembayaran: string
          nomortransaksi: string
          pajak?: number | null
          status: string
          subtotal: number
          tanggal: string
          total: number
        }
        Update: {
          catatan?: string | null
          created_at?: string | null
          dibayar?: number
          diskon?: number | null
          id?: string
          items?: Json
          kasirid?: string
          kembalian?: number
          metodepembayaran?: string
          nomortransaksi?: string
          pajak?: number | null
          status?: string
          subtotal?: number
          tanggal?: string
          total?: number
        }
        Relationships: []
      }
      permissions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          module: string | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          module?: string | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string | null
          name?: string
        }
        Relationships: []
      }
      produk: {
        Row: {
          created_at: string | null
          deskripsi: string | null
          gambar: string | null
          hargabeli: number
          hargajual: number
          id: string
          kategori: string | null
          kode: string
          nama: string
          satuan: string | null
          stok: number | null
        }
        Insert: {
          created_at?: string | null
          deskripsi?: string | null
          gambar?: string | null
          hargabeli: number
          hargajual: number
          id: string
          kategori?: string | null
          kode: string
          nama: string
          satuan?: string | null
          stok?: number | null
        }
        Update: {
          created_at?: string | null
          deskripsi?: string | null
          gambar?: string | null
          hargabeli?: number
          hargajual?: number
          id?: string
          kategori?: string | null
          kode?: string
          nama?: string
          satuan?: string | null
          stok?: number | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transaksi: {
        Row: {
          anggotaid: string
          anggotanama: string
          created_at: string | null
          id: string
          jenis: string
          jumlah: number
          kategori: string | null
          keterangan: string | null
          status: string | null
          tanggal: string
          updated_at: string | null
        }
        Insert: {
          anggotaid: string
          anggotanama: string
          created_at?: string | null
          id: string
          jenis: string
          jumlah: number
          kategori?: string | null
          keterangan?: string | null
          status?: string | null
          tanggal: string
          updated_at?: string | null
        }
        Update: {
          anggotaid?: string
          anggotanama?: string
          created_at?: string | null
          id?: string
          jenis?: string
          jumlah?: number
          kategori?: string | null
          keterangan?: string | null
          status?: string | null
          tanggal?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaksi_anggotaid_fkey"
            columns: ["anggotaid"]
            isOneToOne: false
            referencedRelation: "anggota"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          aktif: boolean | null
          alamat: string | null
          anggotaid: string | null
          created_at: string | null
          email: string | null
          foto: string | null
          id: string
          jabatan: string | null
          lastlogin: string | null
          nama: string
          nohp: string | null
          roleid: string
          updated_at: string | null
          username: string
        }
        Insert: {
          aktif?: boolean | null
          alamat?: string | null
          anggotaid?: string | null
          created_at?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          jabatan?: string | null
          lastlogin?: string | null
          nama: string
          nohp?: string | null
          roleid: string
          updated_at?: string | null
          username: string
        }
        Update: {
          aktif?: boolean | null
          alamat?: string | null
          anggotaid?: string | null
          created_at?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          jabatan?: string | null
          lastlogin?: string | null
          nama?: string
          nohp?: string | null
          roleid?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

/**
 * Utility functions for migrating data to Supabase
 * This file is not currently used in the application
 * but can be helpful for data migration tasks
 */

// Sample data structure for an anggota (member)
interface AnggotaData {
  id: string;
  nama: string;
  nip?: string;
  email?: string;
  nohp?: string;
  alamat?: string;
  unitkerja?: string;
  jeniskelamin?: string;
  agama?: string;
  tanggalbergabung?: string;
  status?: string;
  foto?: string;
  dokumen?: Json;
  keluarga?: Json;
}

// Sample data structure for a user
interface UserData {
  id: string;
  username: string;
  nama: string;
  email?: string;
  roleid: string;
  anggotaid?: string;
  nohp?: string;
  alamat?: string;
  jabatan?: string;
  foto?: string;
  aktif?: boolean;
}

// Sample data structure for a transaction
interface TransaksiData {
  id: string;
  anggotaid: string;
  anggotanama: string;
  jenis: string;
  kategori?: string;
  jumlah: number;
  tanggal: string;
  keterangan?: string;
  status?: string;
}

// Sample data structure for a submission
interface PengajuanData {
  id: string;
  anggotaid: string;
  anggotanama: string;
  jenispengajuan: string;
  jumlah: number;
  tanggalpengajuan: string;
  jangkawaktu?: number;
  status?: string;
  alasan?: string;
  dokumen?: Json;
}

/**
 * Migrate anggota (members) data to Supabase
 * @param data Array of anggota data
 */
export async function migrateAnggota(data: AnggotaData[]): Promise<void> {
  try {
    console.log(`Migrating ${data.length} anggota records...`);
    
    for (const item of data) {
      const { error } = await supabase
        .from('anggota')
        .upsert({
          id: item.id,
          nama: item.nama,
          nip: item.nip,
          email: item.email,
          nohp: item.nohp,
          alamat: item.alamat,
          unitkerja: item.unitkerja,
          jeniskelamin: item.jeniskelamin,
          agama: item.agama,
          tanggalbergabung: item.tanggalbergabung,
          status: item.status || 'active',
          foto: item.foto,
          dokumen: item.dokumen || [],
          keluarga: item.keluarga || []
        });
      
      if (error) {
        console.error(`Error migrating anggota ${item.id}:`, error);
      }
    }
    
    console.log('Anggota migration completed.');
  } catch (err) {
    console.error('Error in migrateAnggota:', err);
  }
}

/**
 * Migrate users data to Supabase
 * @param data Array of user data
 */
export async function migrateUsers(data: UserData[]): Promise<void> {
  try {
    console.log(`Migrating ${data.length} user records...`);
    
    for (const item of data) {
      const { error } = await supabase
        .from('users')
        .upsert({
          id: item.id,
          username: item.username,
          nama: item.nama,
          email: item.email,
          roleid: item.roleid,
          anggotaid: item.anggotaid,
          nohp: item.nohp,
          alamat: item.alamat,
          jabatan: item.jabatan,
          foto: item.foto,
          aktif: item.aktif !== undefined ? item.aktif : true
        });
      
      if (error) {
        console.error(`Error migrating user ${item.id}:`, error);
      }
    }
    
    console.log('Users migration completed.');
  } catch (err) {
    console.error('Error in migrateUsers:', err);
  }
}

/**
 * Migrate transaksi (transactions) data to Supabase
 * @param data Array of transaction data
 */
export async function migrateTransaksi(data: TransaksiData[]): Promise<void> {
  try {
    console.log(`Migrating ${data.length} transaksi records...`);
    
    for (const item of data) {
      const { error } = await supabase
        .from('transaksi')
        .upsert({
          id: item.id,
          anggotaid: item.anggotaid,
          anggotanama: item.anggotanama,
          jenis: item.jenis,
          kategori: item.kategori,
          jumlah: item.jumlah,
          tanggal: item.tanggal,
          keterangan: item.keterangan,
          status: item.status || 'Sukses'
        });
      
      if (error) {
        console.error(`Error migrating transaksi ${item.id}:`, error);
      }
    }
    
    console.log('Transaksi migration completed.');
  } catch (err) {
    console.error('Error in migrateTransaksi:', err);
  }
}

/**
 * Migrate pengajuan (submissions) data to Supabase
 * @param data Array of submission data
 */
export async function migratePengajuan(data: PengajuanData[]): Promise<void> {
  try {
    console.log(`Migrating ${data.length} pengajuan records...`);
    
    for (const item of data) {
      const { error } = await supabase
        .from('pengajuan')
        .upsert({
          id: item.id,
          anggotaid: item.anggotaid,
          anggotanama: item.anggotanama,
          jenispengajuan: item.jenispengajuan,
          jumlah: item.jumlah,
          tanggalpengajuan: item.tanggalpengajuan,
          jangkawaktu: item.jangkawaktu,
          status: item.status || 'Diajukan',
          alasan: item.alasan,
          dokumen: item.dokumen || []
        });
      
      if (error) {
        console.error(`Error migrating pengajuan ${item.id}:`, error);
      }
    }
    
    console.log('Pengajuan migration completed.');
  } catch (err) {
    console.error('Error in migratePengajuan:', err);
  }
}


import { supabase } from "@/integrations/supabase/client";
import { getFromLocalStorage } from "./localStorage";
import { Anggota, Transaksi, User, Role, Permission, Pengaturan } from "@/types";

// Local storage keys
const ANGGOTA_KEY = "koperasi_anggota";
const TRANSAKSI_KEY = "koperasi_transaksi";
const USER_MANAGEMENT_KEY = "koperasi_user_management";
const ROLES_KEY = "koperasi_roles";
const PERMISSIONS_KEY = "koperasi_permissions";
const PENGATURAN_KEY = "koperasi_pengaturan";
const PENGAJUAN_KEY = "koperasi_pengajuan";
const KASIR_KEY = "koperasi_kasir_data";
const PEMASOK_KEY = "koperasi_pemasok";
const PRODUK_KEY = "koperasi_produk";
const PENJUALAN_KEY = "koperasi_penjualan";
const PEMBELIAN_KEY = "koperasi_pembelian";

// Migration status tracking
const MIGRATION_STATUS_KEY = "supabase_migration_status";

export async function migrateAllData() {
  // Check if migration has already been performed
  const migrationStatus = localStorage.getItem(MIGRATION_STATUS_KEY);
  
  if (migrationStatus === "completed") {
    console.log("Migration has already been completed.");
    return { success: true, message: "Migration already completed" };
  }
  
  try {
    console.log("Starting data migration to Supabase...");
    
    // Migrate all data types
    await migrateAnggota();
    await migrateUsers();
    await migrateRoles();
    await migratePermissions();
    await migratePengaturan();
    await migrateTransaksi();
    await migratePengajuan();
    await migrateKasir();
    await migratePemasok();
    await migrateProduk();
    await migratePenjualan();
    await migratePembelian();
    
    // Mark migration as completed
    localStorage.setItem(MIGRATION_STATUS_KEY, "completed");
    
    console.log("Migration completed successfully!");
    return { success: true, message: "Migration completed successfully" };
  } catch (error) {
    console.error("Migration failed:", error);
    return { 
      success: false, 
      message: "Migration failed", 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// Migrate Anggota data
async function migrateAnggota() {
  console.log("Migrating Anggota data...");
  const anggotaList = getFromLocalStorage<Anggota[]>(ANGGOTA_KEY, []);
  
  if (anggotaList.length === 0) {
    console.log("No Anggota data to migrate.");
    return;
  }
  
  // Process in batches to avoid payload size limits
  const batchSize = 20;
  for (let i = 0; i < anggotaList.length; i += batchSize) {
    const batch = anggotaList.slice(i, i + batchSize);
    
    for (const anggota of batch) {
      const { error } = await supabase.from("anggota").upsert({
        id: anggota.id,
        nama: anggota.nama,
        nip: anggota.nip || null,
        alamat: anggota.alamat || null,
        nohp: anggota.noHp || null,
        jeniskelamin: anggota.jenisKelamin || null,
        agama: anggota.agama || null,
        status: anggota.status || 'active',
        unitkerja: anggota.unitKerja || null,
        tanggalbergabung: anggota.tanggalBergabung || null,
        foto: anggota.foto || null,
        email: anggota.email || null,
        dokumen: anggota.dokumen || [],
        keluarga: anggota.keluarga || [],
        created_at: anggota.createdAt || new Date().toISOString(),
        updated_at: anggota.updatedAt || new Date().toISOString()
      });
      
      if (error) {
        console.error(`Error migrating anggota ${anggota.id}:`, error);
        throw error;
      }
    }
    
    console.log(`Migrated ${batch.length} anggota records (batch ${i/batchSize + 1})`);
  }
  
  console.log(`Successfully migrated ${anggotaList.length} anggota records.`);
}

// Migrate Users data
async function migrateUsers() {
  console.log("Migrating Users data...");
  const users = getFromLocalStorage<User[]>(USER_MANAGEMENT_KEY, []);
  
  if (users.length === 0) {
    console.log("No Users data to migrate.");
    return;
  }
  
  for (const user of users) {
    const { error } = await supabase.from("users").upsert({
      id: user.id,
      username: user.username,
      nama: user.nama,
      email: user.email || null,
      roleid: user.roleId,
      foto: user.foto || null,
      jabatan: user.jabatan || null,
      nohp: user.noHP || null,
      alamat: user.alamat || null,
      aktif: user.aktif,
      lastlogin: user.lastLogin || null,
      anggotaid: user.anggotaId || null,
      created_at: user.createdAt || new Date().toISOString(),
      updated_at: user.updatedAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating user ${user.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${users.length} user records.`);
}

// Migrate Roles data
async function migrateRoles() {
  console.log("Migrating Roles data...");
  const roles = getFromLocalStorage<Role[]>(ROLES_KEY, []);
  
  if (roles.length === 0) {
    console.log("No Roles data to migrate.");
    return;
  }
  
  for (const role of roles) {
    const { error } = await supabase.from("roles").upsert({
      id: role.id,
      name: role.name,
      description: role.description || null,
      permissions: role.permissions || [],
      created_at: role.createdAt || new Date().toISOString(),
      updated_at: role.updatedAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating role ${role.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${roles.length} role records.`);
}

// Migrate Permissions data
async function migratePermissions() {
  console.log("Migrating Permissions data...");
  const permissions = getFromLocalStorage<Permission[]>(PERMISSIONS_KEY, []);
  
  if (permissions.length === 0) {
    console.log("No Permissions data to migrate.");
    return;
  }
  
  for (const permission of permissions) {
    const { error } = await supabase.from("permissions").upsert({
      id: permission.id,
      name: permission.name,
      description: permission.description || null,
      module: permission.module || null,
      created_at: new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating permission ${permission.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${permissions.length} permission records.`);
}

// Migrate Pengaturan data
async function migratePengaturan() {
  console.log("Migrating Pengaturan data...");
  const pengaturan = getFromLocalStorage<Pengaturan>(PENGATURAN_KEY, null);
  
  if (!pengaturan) {
    console.log("No Pengaturan data to migrate.");
    return;
  }
  
  const { error } = await supabase.from("pengaturan").upsert({
    id: "default_settings",
    sukubunga: pengaturan.sukuBunga,
    tenor: pengaturan.tenor,
    denda: pengaturan.denda
  });
  
  if (error) {
    console.error("Error migrating pengaturan:", error);
    throw error;
  }
  
  console.log("Successfully migrated pengaturan record.");
}

// Migrate Transaksi data
async function migrateTransaksi() {
  console.log("Migrating Transaksi data...");
  const transaksiList = getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, []);
  
  if (transaksiList.length === 0) {
    console.log("No Transaksi data to migrate.");
    return;
  }
  
  // Process in batches to avoid payload size limits
  const batchSize = 20;
  for (let i = 0; i < transaksiList.length; i += batchSize) {
    const batch = transaksiList.slice(i, i + batchSize);
    
    for (const transaksi of batch) {
      const { error } = await supabase.from("transaksi").upsert({
        id: transaksi.id,
        tanggal: transaksi.tanggal ? transaksi.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
        anggotaid: transaksi.anggotaId,
        anggotanama: transaksi.anggotaNama,
        jenis: transaksi.jenis,
        kategori: transaksi.kategori || null,
        jumlah: transaksi.jumlah,
        keterangan: transaksi.keterangan || null,
        status: transaksi.status || "Sukses",
        created_at: transaksi.createdAt || new Date().toISOString(),
        updated_at: transaksi.updatedAt || new Date().toISOString()
      });
      
      if (error) {
        console.error(`Error migrating transaksi ${transaksi.id}:`, error);
        throw error;
      }
    }
    
    console.log(`Migrated ${batch.length} transaksi records (batch ${i/batchSize + 1})`);
  }
  
  console.log(`Successfully migrated ${transaksiList.length} transaksi records.`);
}

// Migrate Pengajuan data
async function migratePengajuan() {
  console.log("Migrating Pengajuan data...");
  const pengajuanList = getFromLocalStorage(PENGAJUAN_KEY, []);
  
  if (pengajuanList.length === 0) {
    console.log("No Pengajuan data to migrate.");
    return;
  }
  
  for (const pengajuan of pengajuanList) {
    const { error } = await supabase.from("pengajuan").upsert({
      id: pengajuan.id,
      anggotaid: pengajuan.anggotaId,
      anggotanama: pengajuan.anggotaNama,
      jenispengajuan: pengajuan.jenis || "Pinjam",
      tanggalpengajuan: pengajuan.tanggal ? pengajuan.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
      jumlah: pengajuan.jumlah,
      jangkawaktu: pengajuan.jangkaWaktu || null,
      status: pengajuan.status || "Menunggu",
      alasan: pengajuan.keterangan || null,
      dokumen: pengajuan.dokumen || [],
      created_at: pengajuan.createdAt || new Date().toISOString(),
      updated_at: pengajuan.updatedAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating pengajuan ${pengajuan.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${pengajuanList.length} pengajuan records.`);
}

// Migrate Kasir data
async function migrateKasir() {
  console.log("Migrating Kasir data...");
  const kasirList = getFromLocalStorage(KASIR_KEY, []);
  
  if (kasirList.length === 0) {
    console.log("No Kasir data to migrate.");
    return;
  }
  
  for (const kasir of kasirList) {
    const { error } = await supabase.from("kasir").upsert({
      id: kasir.id,
      nama: kasir.nama,
      username: kasir.username,
      nohp: kasir.noHp || null,
      role: kasir.role,
      aktif: kasir.aktif !== undefined ? kasir.aktif : true,
      created_at: kasir.createdAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating kasir ${kasir.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${kasirList.length} kasir records.`);
}

// Migrate Pemasok data
async function migratePemasok() {
  console.log("Migrating Pemasok data...");
  const pemasokList = getFromLocalStorage(PEMASOK_KEY, []);
  
  if (pemasokList.length === 0) {
    console.log("No Pemasok data to migrate.");
    return;
  }
  
  for (const pemasok of pemasokList) {
    const { error } = await supabase.from("pemasok").upsert({
      id: pemasok.id,
      nama: pemasok.nama,
      alamat: pemasok.alamat || null,
      telepon: pemasok.telepon || null,
      email: pemasok.email || null,
      kontak: pemasok.kontak || null,
      created_at: pemasok.createdAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating pemasok ${pemasok.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${pemasokList.length} pemasok records.`);
}

// Migrate Produk data
async function migrateProduk() {
  console.log("Migrating Produk data...");
  const produkList = getFromLocalStorage("koperasi_produk", []);
  
  if (produkList.length === 0) {
    console.log("No Produk data to migrate.");
    return;
  }
  
  for (const produk of produkList) {
    const { error } = await supabase.from("produk").upsert({
      id: produk.id,
      kode: produk.kode,
      nama: produk.nama,
      kategori: produk.kategori || null,
      hargabeli: produk.hargaBeli,
      hargajual: produk.hargaJual,
      stok: produk.stok || 0,
      satuan: produk.satuan || null,
      deskripsi: produk.deskripsi || null,
      gambar: produk.gambar || null,
      created_at: produk.createdAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating produk ${produk.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${produkList.length} produk records.`);
}

// Migrate Penjualan data
async function migratePenjualan() {
  console.log("Migrating Penjualan data...");
  const penjualanList = getFromLocalStorage("koperasi_penjualan", []);
  
  if (penjualanList.length === 0) {
    console.log("No Penjualan data to migrate.");
    return;
  }
  
  for (const penjualan of penjualanList) {
    const { error } = await supabase.from("penjualan").upsert({
      id: penjualan.id,
      nomortransaksi: penjualan.nomorTransaksi,
      tanggal: penjualan.tanggal ? penjualan.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
      kasirid: penjualan.kasirId,
      items: penjualan.items || [],
      subtotal: penjualan.subtotal,
      diskon: penjualan.diskon || 0,
      pajak: penjualan.pajak || 0,
      total: penjualan.total,
      dibayar: penjualan.dibayar,
      kembalian: penjualan.kembalian,
      metodepembayaran: penjualan.metodePembayaran,
      status: penjualan.status,
      catatan: penjualan.catatan || null,
      created_at: penjualan.createdAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating penjualan ${penjualan.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${penjualanList.length} penjualan records.`);
}

// Migrate Pembelian data
async function migratePembelian() {
  console.log("Migrating Pembelian data...");
  const pembelianList = getFromLocalStorage("koperasi_pembelian", []);
  
  if (pembelianList.length === 0) {
    console.log("No Pembelian data to migrate.");
    return;
  }
  
  for (const pembelian of pembelianList) {
    const { error } = await supabase.from("pembelian").upsert({
      id: pembelian.id,
      nomortransaksi: pembelian.nomorTransaksi,
      tanggal: pembelian.tanggal ? pembelian.tanggal.split('T')[0] : new Date().toISOString().split('T')[0],
      pemasokid: pembelian.pemasokId,
      items: pembelian.items || [],
      subtotal: pembelian.subtotal,
      diskon: pembelian.diskon || 0,
      ppn: pembelian.ppn || 0,
      total: pembelian.total,
      status: pembelian.status,
      catatan: pembelian.catatan || null,
      created_at: pembelian.createdAt || new Date().toISOString(),
      updated_at: pembelian.updatedAt || new Date().toISOString()
    });
    
    if (error) {
      console.error(`Error migrating pembelian ${pembelian.id}:`, error);
      throw error;
    }
  }
  
  console.log(`Successfully migrated ${pembelianList.length} pembelian records.`);
}

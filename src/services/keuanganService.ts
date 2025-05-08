
import { PemasukanPengeluaran, KategoriTransaksi, NeracaKeuangan } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

const PEMASUKAN_PENGELUARAN_KEY = "koperasi_pemasukan_pengeluaran";
const KATEGORI_TRANSAKSI_KEY = "koperasi_kategori_transaksi";

// Initial sample data for transactions
const initialPemasukanPengeluaran: PemasukanPengeluaran[] = [
  {
    id: "PP0001",
    tanggal: "2025-04-01",
    kategori: "Operasional",
    jumlah: 2500000,
    keterangan: "Biaya sewa kantor bulan April",
    jenis: "Pengeluaran",
    createdAt: "2025-04-01T10:00:00.000Z",
    updatedAt: "2025-04-01T10:00:00.000Z",
    createdBy: "user_1"
  },
  {
    id: "PP0002",
    tanggal: "2025-04-05",
    kategori: "Pendapatan Bunga",
    jumlah: 5000000,
    keterangan: "Pendapatan bunga pinjaman bulan Maret",
    jenis: "Pemasukan",
    createdAt: "2025-04-05T09:30:00.000Z",
    updatedAt: "2025-04-05T09:30:00.000Z",
    createdBy: "user_1"
  },
  {
    id: "PP0003",
    tanggal: "2025-04-10",
    kategori: "Gaji Karyawan",
    jumlah: 3500000,
    keterangan: "Gaji staf administrasi bulan April",
    jenis: "Pengeluaran",
    createdAt: "2025-04-10T14:00:00.000Z",
    updatedAt: "2025-04-10T14:00:00.000Z",
    createdBy: "user_1"
  }
];

// Initial sample data for transaction categories
const initialKategoriTransaksi: KategoriTransaksi[] = [
  {
    id: "KT0001",
    nama: "Operasional",
    deskripsi: "Biaya operasional koperasi seperti sewa, listrik, dll",
    jenis: "Pengeluaran"
  },
  {
    id: "KT0002",
    nama: "Gaji Karyawan",
    deskripsi: "Pengeluaran untuk gaji dan tunjangan karyawan",
    jenis: "Pengeluaran"
  },
  {
    id: "KT0003",
    nama: "Pendapatan Bunga",
    deskripsi: "Pendapatan dari bunga pinjaman anggota",
    jenis: "Pemasukan"
  },
  {
    id: "KT0004",
    nama: "Administrasi",
    deskripsi: "Pendapatan dari biaya administrasi simpan pinjam",
    jenis: "Pemasukan"
  },
  {
    id: "KT0005",
    nama: "Lain-lain",
    deskripsi: "Pendapatan dari sumber lain",
    jenis: "Pemasukan"
  },
  {
    id: "KT0006",
    nama: "Lain-lain",
    deskripsi: "Pengeluaran untuk keperluan lain",
    jenis: "Pengeluaran"
  }
];

/**
 * Get all pemasukan & pengeluaran transactions
 */
export function getAllPemasukanPengeluaran(): PemasukanPengeluaran[] {
  return getFromLocalStorage<PemasukanPengeluaran[]>(PEMASUKAN_PENGELUARAN_KEY, initialPemasukanPengeluaran);
}

/**
 * Get all transaction categories
 */
export function getAllKategoriTransaksi(): KategoriTransaksi[] {
  return getFromLocalStorage<KategoriTransaksi[]>(KATEGORI_TRANSAKSI_KEY, initialKategoriTransaksi);
}

/**
 * Get transaction by ID
 */
export function getPemasukanPengeluaranById(id: string): PemasukanPengeluaran | undefined {
  const transactions = getAllPemasukanPengeluaran();
  return transactions.find(transaction => transaction.id === id);
}

/**
 * Generate new transaction ID
 */
export function generatePemasukanPengeluaranId(): string {
  const transactions = getAllPemasukanPengeluaran();
  const lastId = transactions.length > 0
    ? parseInt(transactions[transactions.length - 1].id.replace("PP", ""))
    : 0;
  
  return `PP${String(lastId + 1).padStart(4, "0")}`;
}

/**
 * Generate new category ID
 */
export function generateKategoriTransaksiId(): string {
  const categories = getAllKategoriTransaksi();
  const lastId = categories.length > 0
    ? parseInt(categories[categories.length - 1].id.replace("KT", ""))
    : 0;
  
  return `KT${String(lastId + 1).padStart(4, "0")}`;
}

/**
 * Create new income or expense transaction
 */
export function createPemasukanPengeluaran(transaction: Omit<PemasukanPengeluaran, "id" | "createdAt" | "updatedAt">): PemasukanPengeluaran {
  const transactions = getAllPemasukanPengeluaran();
  const now = new Date().toISOString();
  
  const newTransaction: PemasukanPengeluaran = {
    ...transaction,
    id: generatePemasukanPengeluaranId(),
    createdAt: now,
    updatedAt: now
  };
  
  transactions.push(newTransaction);
  saveToLocalStorage(PEMASUKAN_PENGELUARAN_KEY, transactions);
  
  return newTransaction;
}

/**
 * Update transaction
 */
export function updatePemasukanPengeluaran(id: string, transaction: Partial<PemasukanPengeluaran>): PemasukanPengeluaran | null {
  const transactions = getAllPemasukanPengeluaran();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  transactions[index] = {
    ...transactions[index],
    ...transaction,
    updatedAt: new Date().toISOString()
  };
  
  saveToLocalStorage(PEMASUKAN_PENGELUARAN_KEY, transactions);
  return transactions[index];
}

/**
 * Delete transaction
 */
export function deletePemasukanPengeluaran(id: string): boolean {
  const transactions = getAllPemasukanPengeluaran();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  if (filteredTransactions.length === transactions.length) return false;
  
  saveToLocalStorage(PEMASUKAN_PENGELUARAN_KEY, filteredTransactions);
  return true;
}

/**
 * Create new transaction category
 */
export function createKategoriTransaksi(category: Omit<KategoriTransaksi, "id">): KategoriTransaksi {
  const categories = getAllKategoriTransaksi();
  
  const newCategory: KategoriTransaksi = {
    ...category,
    id: generateKategoriTransaksiId()
  };
  
  categories.push(newCategory);
  saveToLocalStorage(KATEGORI_TRANSAKSI_KEY, categories);
  
  return newCategory;
}

/**
 * Update transaction category
 */
export function updateKategoriTransaksi(id: string, category: Partial<KategoriTransaksi>): KategoriTransaksi | null {
  const categories = getAllKategoriTransaksi();
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  categories[index] = {
    ...categories[index],
    ...category
  };
  
  saveToLocalStorage(KATEGORI_TRANSAKSI_KEY, categories);
  return categories[index];
}

/**
 * Delete transaction category
 */
export function deleteKategoriTransaksi(id: string): boolean {
  const categories = getAllKategoriTransaksi();
  const filteredCategories = categories.filter(c => c.id !== id);
  
  if (filteredCategories.length === categories.length) return false;
  
  saveToLocalStorage(KATEGORI_TRANSAKSI_KEY, filteredCategories);
  return true;
}

/**
 * Get transactions by type
 */
export function getPemasukanPengeluaranByJenis(jenis: "Pemasukan" | "Pengeluaran"): PemasukanPengeluaran[] {
  const transactions = getAllPemasukanPengeluaran();
  return transactions.filter(t => t.jenis === jenis);
}

/**
 * Get transactions by period
 */
export function getPemasukanPengeluaranByPeriod(startDate: string, endDate: string): PemasukanPengeluaran[] {
  const transactions = getAllPemasukanPengeluaran();
  return transactions.filter(t => {
    const transactionDate = new Date(t.tanggal).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return transactionDate >= start && transactionDate <= end;
  });
}

/**
 * Calculate total by type and period
 */
export function calculateTotalByJenisAndPeriod(
  jenis: "Pemasukan" | "Pengeluaran", 
  startDate: string, 
  endDate: string
): number {
  const transactions = getPemasukanPengeluaranByPeriod(startDate, endDate);
  return transactions
    .filter(t => t.jenis === jenis)
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Generate monthly financial statement
 */
export function generateNeracaKeuangan(month: number, year: number): NeracaKeuangan {
  // Format dates for filtering transactions
  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;
  
  // Calculate totals for the month
  const totalPemasukan = calculateTotalByJenisAndPeriod("Pemasukan", startDate, endDate);
  const totalPengeluaran = calculateTotalByJenisAndPeriod("Pengeluaran", startDate, endDate);
  
  // Determine saldo awal (this is simplified - in a real app, would calculate from previous months)
  // For demo purposes, let's use a fixed value or derive it
  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;
  const prevStartDate = `${previousYear}-${String(previousMonth).padStart(2, "0")}-01`;
  const prevLastDay = new Date(previousYear, previousMonth, 0).getDate();
  const prevEndDate = `${previousYear}-${String(previousMonth).padStart(2, "0")}-${prevLastDay}`;
  
  let saldoAwal = 10000000; // Default starting balance for demo
  
  // Try to calculate from previous month
  try {
    const prevPemasukan = calculateTotalByJenisAndPeriod("Pemasukan", prevStartDate, prevEndDate);
    const prevPengeluaran = calculateTotalByJenisAndPeriod("Pengeluaran", prevStartDate, prevEndDate);
    
    // Start with base amount and add previous month's difference
    saldoAwal += (prevPemasukan - prevPengeluaran);
  } catch (e) {
    console.log("Using default saldo awal");
  }
  
  // Calculate end balance
  const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;
  
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  return {
    bulan: months[month - 1],
    tahun: year,
    totalPemasukan,
    totalPengeluaran,
    saldoAwal,
    saldoAkhir
  };
}

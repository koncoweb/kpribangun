
import { Penjualan, PenjualanItem, ProdukItem } from "@/types";
import { generateId } from "@/lib/utils";
import { updateProdukStock, getProdukItemById } from "./produkService";

// Utility to get sales from localStorage
const getPenjualanList = (): Penjualan[] => {
  const penjualanData = localStorage.getItem("penjualanList");
  if (penjualanData) {
    return JSON.parse(penjualanData);
  }
  return [];
};

// Utility to save sales to localStorage
const savePenjualanList = (penjualanList: Penjualan[]): void => {
  localStorage.setItem("penjualanList", JSON.stringify(penjualanList));
};

// Get all sales
export const getAllPenjualan = (): Penjualan[] => {
  return getPenjualanList();
};

// Create new sale
export const createPenjualan = (penjualanData: Omit<Penjualan, "id" | "nomorTransaksi" | "createdAt">): Penjualan => {
  const penjualanList = getPenjualanList();
  
  // Generate transaction number (format: TRX-YYYYMMDD-XXXX)
  const date = new Date();
  const dateStr = date.getFullYear().toString() +
                 (date.getMonth() + 1).toString().padStart(2, '0') +
                 date.getDate().toString().padStart(2, '0');
  const count = penjualanList.length + 1;
  const nomorTransaksi = `TRX-${dateStr}-${count.toString().padStart(4, '0')}`;
  
  const newPenjualan: Penjualan = {
    id: generateId("POS"),
    nomorTransaksi,
    tanggal: penjualanData.tanggal,
    kasirId: penjualanData.kasirId,
    items: penjualanData.items,
    subtotal: penjualanData.subtotal,
    diskon: penjualanData.diskon || 0,
    pajak: penjualanData.pajak || 0,
    total: penjualanData.total,
    dibayar: penjualanData.dibayar,
    kembalian: penjualanData.kembalian,
    metodePembayaran: penjualanData.metodePembayaran,
    status: penjualanData.status,
    catatan: penjualanData.catatan || "",
    createdAt: new Date().toISOString()
  };
  
  // Update product stock for each item
  if (newPenjualan.status === "sukses") {
    newPenjualan.items.forEach(item => {
      updateProdukStock(item.produkId, -item.jumlah);
    });
  }
  
  penjualanList.push(newPenjualan);
  savePenjualanList(penjualanList);
  
  return newPenjualan;
};

// Get sale by ID
export const getPenjualanById = (id: string): Penjualan | null => {
  const penjualanList = getPenjualanList();
  const penjualan = penjualanList.find(item => item.id === id);
  
  return penjualan || null;
};

// Update sale
export const updatePenjualan = (id: string, penjualanData: Partial<Penjualan>): Penjualan | null => {
  const penjualanList = getPenjualanList();
  const index = penjualanList.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const oldPenjualan = penjualanList[index];
  
  // If status changes from sukses to dibatalkan, revert stock updates
  if (oldPenjualan.status === "sukses" && penjualanData.status === "dibatalkan") {
    oldPenjualan.items.forEach(item => {
      updateProdukStock(item.produkId, item.jumlah); // Add stock back
    });
  }
  
  // If status changes from dibatalkan to sukses, apply stock updates
  if (oldPenjualan.status === "dibatalkan" && penjualanData.status === "sukses") {
    oldPenjualan.items.forEach(item => {
      updateProdukStock(item.produkId, -item.jumlah); // Reduce stock
    });
  }
  
  penjualanList[index] = {
    ...oldPenjualan,
    ...penjualanData
  };
  
  savePenjualanList(penjualanList);
  
  return penjualanList[index];
};

// Delete sale
export const deletePenjualan = (id: string): boolean => {
  const penjualanList = getPenjualanList();
  const penjualan = penjualanList.find(item => item.id === id);
  
  if (!penjualan) return false;
  
  // If deleting a successful sale, add back the stock
  if (penjualan.status === "sukses") {
    penjualan.items.forEach(item => {
      updateProdukStock(item.produkId, item.jumlah); // Add stock back
    });
  }
  
  const newPenjualanList = penjualanList.filter(item => item.id !== id);
  savePenjualanList(newPenjualanList);
  
  return true;
};

// Calculate total for a list of items
export const calculateTotal = (items: PenjualanItem[], diskon: number = 0, pajak: number = 0): {
  subtotal: number;
  total: number;
} => {
  const subtotal = items.reduce((acc, item) => acc + item.total, 0);
  const diskonAmount = (subtotal * diskon) / 100;
  const afterDiskon = subtotal - diskonAmount;
  const pajakAmount = (afterDiskon * pajak) / 100;
  const total = afterDiskon + pajakAmount;
  
  return {
    subtotal,
    total
  };
};

// Initialize sample sales data
export const initSamplePenjualanData = (): void => {
  if (getAllPenjualan().length === 0) {
    // First ensure we have products to reference
    const allProducts = getProdukItemById("PRD001"); // Just check if any product exists
    
    if (!allProducts) {
      console.warn("Cannot initialize sample sales data: No products found");
      return;
    }
    
    const pastDates = [
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      new Date().toISOString(), // today
    ];

    const sampleSales = [
      // Day 1
      {
        tanggal: pastDates[0],
        kasirId: "KSR001",
        items: [
          { produkId: "PRD001", jumlah: 2, hargaSatuan: 12000, total: 24000 },
          { produkId: "PRD002", jumlah: 1, hargaSatuan: 14000, total: 14000 }
        ],
        subtotal: 38000,
        diskon: 0,
        pajak: 0,
        total: 38000,
        dibayar: 50000,
        kembalian: 12000,
        metodePembayaran: "cash",
        status: "sukses",
        catatan: "Pembelian pertama"
      },
      // Day 2
      {
        tanggal: pastDates[1],
        kasirId: "KSR001",
        items: [
          { produkId: "PRD003", jumlah: 3, hargaSatuan: 18000, total: 54000 }
        ],
        subtotal: 54000,
        diskon: 5,
        pajak: 0,
        total: 51300,
        dibayar: 100000,
        kembalian: 48700,
        metodePembayaran: "cash",
        status: "sukses"
      },
      // Day 3
      {
        tanggal: pastDates[2],
        kasirId: "KSR002",
        items: [
          { produkId: "PRD004", jumlah: 2, hargaSatuan: 7500, total: 15000 },
          { produkId: "PRD005", jumlah: 1, hargaSatuan: 25000, total: 25000 }
        ],
        subtotal: 40000,
        diskon: 0,
        pajak: 0,
        total: 40000,
        dibayar: 40000,
        kembalian: 0,
        metodePembayaran: "debit",
        status: "sukses"
      },
      // Day 4
      {
        tanggal: pastDates[3],
        kasirId: "KSR001",
        items: [
          { produkId: "PRD001", jumlah: 5, hargaSatuan: 12000, total: 60000 },
          { produkId: "PRD002", jumlah: 3, hargaSatuan: 14000, total: 42000 },
          { produkId: "PRD003", jumlah: 2, hargaSatuan: 18000, total: 36000 }
        ],
        subtotal: 138000,
        diskon: 10,
        pajak: 0,
        total: 124200,
        dibayar: 124200,
        kembalian: 0,
        metodePembayaran: "qris",
        status: "sukses"
      },
      // Day 5
      {
        tanggal: pastDates[4],
        kasirId: "KSR002",
        items: [
          { produkId: "PRD006", jumlah: 4, hargaSatuan: 4500, total: 18000 },
          { produkId: "PRD007", jumlah: 2, hargaSatuan: 22000, total: 44000 }
        ],
        subtotal: 62000,
        diskon: 0,
        pajak: 10,
        total: 68200,
        dibayar: 70000,
        kembalian: 1800,
        metodePembayaran: "cash",
        status: "sukses"
      },
      // Day 6
      {
        tanggal: pastDates[5],
        kasirId: "KSR001",
        items: [
          { produkId: "PRD002", jumlah: 10, hargaSatuan: 14000, total: 140000 }
        ],
        subtotal: 140000,
        diskon: 15,
        pajak: 0,
        total: 119000,
        dibayar: 119000,
        kembalian: 0,
        metodePembayaran: "kredit",
        status: "sukses",
        catatan: "Pembelian untuk toko"
      },
      // Day 7
      {
        tanggal: pastDates[6],
        kasirId: "KSR002",
        items: [
          { produkId: "PRD004", jumlah: 5, hargaSatuan: 7500, total: 37500 },
          { produkId: "PRD005", jumlah: 3, hargaSatuan: 25000, total: 75000 },
          { produkId: "PRD008", jumlah: 2, hargaSatuan: 10000, total: 20000 }
        ],
        subtotal: 132500,
        diskon: 0,
        pajak: 0,
        total: 132500,
        dibayar: 132500,
        kembalian: 0,
        metodePembayaran: "debit",
        status: "sukses"
      },
      // Today
      {
        tanggal: pastDates[7],
        kasirId: "KSR001",
        items: [
          { produkId: "PRD001", jumlah: 3, hargaSatuan: 12000, total: 36000 },
          { produkId: "PRD003", jumlah: 1, hargaSatuan: 18000, total: 18000 },
          { produkId: "PRD005", jumlah: 2, hargaSatuan: 25000, total: 50000 }
        ],
        subtotal: 104000,
        diskon: 5,
        pajak: 10,
        total: 108780,
        dibayar: 110000,
        kembalian: 1220,
        metodePembayaran: "cash",
        status: "sukses"
      },
      // Cancelled transaction
      {
        tanggal: pastDates[7],
        kasirId: "KSR002",
        items: [
          { produkId: "PRD002", jumlah: 2, hargaSatuan: 14000, total: 28000 }
        ],
        subtotal: 28000,
        diskon: 0,
        pajak: 0,
        total: 28000,
        dibayar: 0,
        kembalian: 0,
        metodePembayaran: "cash",
        status: "dibatalkan",
        catatan: "Pelanggan membatalkan pesanan"
      }
    ];
    
    // Create each sample sale
    sampleSales.forEach(sale => {
      createPenjualan(sale as Omit<Penjualan, "id" | "nomorTransaksi" | "createdAt">);
    });
  }
};

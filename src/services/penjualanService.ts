
import { Penjualan, PenjualanItem, ProdukItem } from "@/types";
import { generateId } from "@/lib/utils";
import { updateProdukStock } from "./produkService";

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

// Initialize with sample data if none exists
export const initSamplePenjualanData = (): void => {
  // We'll let users create their own sales data
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

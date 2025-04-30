
import { ProdukItem } from "@/types";
import { generateId } from "@/lib/utils";

// Utility to get products from localStorage
const getProdukItems = (): ProdukItem[] => {
  const produkItemsData = localStorage.getItem("produkItems");
  if (produkItemsData) {
    return JSON.parse(produkItemsData);
  }
  return [];
};

// Utility to save products to localStorage
const saveProdukItems = (produkItems: ProdukItem[]): void => {
  localStorage.setItem("produkItems", JSON.stringify(produkItems));
};

// Get all products
export const getAllProdukItems = (): ProdukItem[] => {
  return getProdukItems();
};

// Create new product
export const createProdukItem = (produkData: Omit<ProdukItem, "id" | "createdAt">): ProdukItem => {
  const produkItems = getProdukItems();
  const newProdukItem: ProdukItem = {
    id: generateId("PRD"),
    kode: produkData.kode || generateId("KD"),
    nama: produkData.nama,
    kategori: produkData.kategori,
    hargaBeli: produkData.hargaBeli,
    hargaJual: produkData.hargaJual,
    stok: produkData.stok,
    satuan: produkData.satuan,
    deskripsi: produkData.deskripsi || "",
    gambar: produkData.gambar || "",
    createdAt: new Date().toISOString()
  };
  
  produkItems.push(newProdukItem);
  saveProdukItems(produkItems);
  
  return newProdukItem;
};

// Get product by ID
export const getProdukItemById = (id: string): ProdukItem | null => {
  const produkItems = getProdukItems();
  const produkItem = produkItems.find(item => item.id === id);
  
  return produkItem || null;
};

// Update product
export const updateProdukItem = (id: string, produkData: Partial<ProdukItem>): ProdukItem | null => {
  const produkItems = getProdukItems();
  const index = produkItems.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  // Update the product
  produkItems[index] = {
    ...produkItems[index],
    ...produkData
  };
  
  saveProdukItems(produkItems);
  
  return produkItems[index];
};

// Delete product
export const deleteProdukItem = (id: string): boolean => {
  const produkItems = getProdukItems();
  const newProdukItems = produkItems.filter(item => item.id !== id);
  
  if (newProdukItems.length === produkItems.length) {
    return false;
  }
  
  saveProdukItems(newProdukItems);
  return true;
};

// Update product stock
export const updateProdukStock = (id: string, quantity: number): boolean => {
  const produkItems = getProdukItems();
  const index = produkItems.findIndex(item => item.id === id);
  
  if (index === -1) return false;
  
  produkItems[index].stok += quantity;
  saveProdukItems(produkItems);
  
  return true;
};

// Initialize with sample data if none exists
export const initSampleProdukData = (): void => {
  if (getAllProdukItems().length === 0) {
    const sampleProduk: Omit<ProdukItem, "id" | "createdAt">[] = [
      {
        kode: "PRD001",
        nama: "Beras Premium",
        kategori: "Sembako",
        hargaBeli: 10000,
        hargaJual: 12000,
        stok: 50,
        satuan: "kg",
        deskripsi: "Beras premium kualitas terbaik"
      },
      {
        kode: "PRD002",
        nama: "Gula Pasir",
        kategori: "Sembako",
        hargaBeli: 12000,
        hargaJual: 14000,
        stok: 30,
        satuan: "kg",
        deskripsi: "Gula pasir berkualitas"
      },
      {
        kode: "PRD003",
        nama: "Minyak Goreng",
        kategori: "Sembako",
        hargaBeli: 15000,
        hargaJual: 18000,
        stok: 40,
        satuan: "liter",
        deskripsi: "Minyak goreng berkualitas"
      }
    ];
    
    sampleProduk.forEach(produk => {
      createProdukItem(produk);
    });
  }
};

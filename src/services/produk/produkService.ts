
import { ProdukItem } from "@/types";
import { generateId } from "@/lib/utils";
import { getProdukItems, saveProdukItems, generateProductCode } from "./utils";

// Get all products
export const getAllProdukItems = (): ProdukItem[] => {
  return getProdukItems();
};

// Create new product
export const createProdukItem = (produkData: Omit<ProdukItem, "id" | "createdAt">): ProdukItem => {
  const produkItems = getProdukItems();
  const newProdukItem: ProdukItem = {
    id: generateId("PRD"),
    kode: produkData.kode || generateProductCode(),
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
  
  // Preserve the image if none is provided
  if (produkData.gambar === undefined) {
    produkData.gambar = produkItems[index].gambar;
  }
  
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


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
        deskripsi: "Beras premium kualitas terbaik",
        gambar: "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
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
      },
      {
        kode: "PRD004",
        nama: "Teh Celup",
        kategori: "Minuman",
        hargaBeli: 5000,
        hargaJual: 7500,
        stok: 100,
        satuan: "box",
        deskripsi: "Teh celup isi 25 sachet"
      },
      {
        kode: "PRD005",
        nama: "Kopi Bubuk",
        kategori: "Minuman",
        hargaBeli: 20000,
        hargaJual: 25000,
        stok: 25,
        satuan: "pack",
        deskripsi: "Kopi bubuk premium 250gr"
      },
      {
        kode: "PRD006",
        nama: "Sabun Mandi",
        kategori: "Perlengkapan Mandi",
        hargaBeli: 3000,
        hargaJual: 4500,
        stok: 75,
        satuan: "pcs",
        deskripsi: "Sabun mandi wangi tahan lama"
      },
      {
        kode: "PRD007",
        nama: "Sampo",
        kategori: "Perlengkapan Mandi",
        hargaBeli: 18000,
        hargaJual: 22000,
        stok: 45,
        satuan: "botol",
        deskripsi: "Sampo anti ketombe 170ml"
      },
      {
        kode: "PRD008",
        nama: "Sikat Gigi",
        kategori: "Perlengkapan Mandi",
        hargaBeli: 7000,
        hargaJual: 10000,
        stok: 60,
        satuan: "pcs",
        deskripsi: "Sikat gigi dengan bulu halus"
      }
    ];
    
    sampleProduk.forEach(produk => {
      createProdukItem(produk);
    });
  }
};

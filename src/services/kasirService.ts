
import { Kasir } from "@/types";
import { generateId } from "@/lib/utils";

// Utility to get cashiers from localStorage
const getKasirList = (): Kasir[] => {
  const kasirData = localStorage.getItem("kasirList");
  if (kasirData) {
    return JSON.parse(kasirData);
  }
  return [];
};

// Utility to save cashiers to localStorage
const saveKasirList = (kasirList: Kasir[]): void => {
  localStorage.setItem("kasirList", JSON.stringify(kasirList));
};

// Get all cashiers
export const getAllKasir = (): Kasir[] => {
  return getKasirList();
};

// Create new cashier
export const createKasir = (kasirData: Omit<Kasir, "id" | "createdAt">): Kasir => {
  const kasirList = getKasirList();
  
  const newKasir: Kasir = {
    id: generateId("KSR"),
    nama: kasirData.nama,
    noHp: kasirData.noHp,
    username: kasirData.username,
    role: kasirData.role,
    aktif: kasirData.aktif,
    createdAt: new Date().toISOString()
  };
  
  kasirList.push(newKasir);
  saveKasirList(kasirList);
  
  return newKasir;
};

// Get cashier by ID
export const getKasirById = (id: string): Kasir | null => {
  const kasirList = getKasirList();
  const kasir = kasirList.find(item => item.id === id);
  
  return kasir || null;
};

// Get cashier by username
export const getKasirByUsername = (username: string): Kasir | null => {
  const kasirList = getKasirList();
  const kasir = kasirList.find(item => item.username === username);
  
  return kasir || null;
};

// Update cashier
export const updateKasir = (id: string, kasirData: Partial<Kasir>): Kasir | null => {
  const kasirList = getKasirList();
  const index = kasirList.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  kasirList[index] = {
    ...kasirList[index],
    ...kasirData
  };
  
  saveKasirList(kasirList);
  
  return kasirList[index];
};

// Delete cashier
export const deleteKasir = (id: string): boolean => {
  const kasirList = getKasirList();
  const newKasirList = kasirList.filter(item => item.id !== id);
  
  if (newKasirList.length === kasirList.length) {
    return false;
  }
  
  saveKasirList(newKasirList);
  return true;
};

// Initialize with sample data if none exists
export const initSampleKasirData = (): void => {
  if (getAllKasir().length === 0) {
    const sampleKasir: Omit<Kasir, "id" | "createdAt">[] = [
      {
        nama: "Admin Utama",
        noHp: "08123456789",
        username: "admin",
        role: "admin",
        aktif: true
      },
      {
        nama: "Budi Santoso",
        noHp: "08567891234",
        username: "budi",
        role: "kasir",
        aktif: true
      },
      {
        nama: "Siti Rahmawati",
        noHp: "08123987654",
        username: "siti",
        role: "kasir",
        aktif: true
      },
      {
        nama: "Agus Darmawan",
        noHp: "08765432190",
        username: "agus",
        role: "kasir",
        aktif: false
      }
    ];
    
    sampleKasir.forEach(kasir => {
      createKasir(kasir);
    });
  }
};

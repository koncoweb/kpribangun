
import { Kasir } from "@/types";
import { generateId } from "@/lib/utils";

// Utility to get kasir from localStorage
const getKasirList = (): Kasir[] => {
  const kasirData = localStorage.getItem("kasirList");
  if (kasirData) {
    return JSON.parse(kasirData);
  }
  return [];
};

// Utility to save kasir to localStorage
const saveKasirList = (kasirList: Kasir[]): void => {
  localStorage.setItem("kasirList", JSON.stringify(kasirList));
};

// Get all kasir
export const getAllKasir = (): Kasir[] => {
  return getKasirList();
};

// Create new kasir
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

// Get kasir by ID
export const getKasirById = (id: string): Kasir | null => {
  const kasirList = getKasirList();
  const kasir = kasirList.find(item => item.id === id);
  
  return kasir || null;
};

// Update kasir
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

// Delete kasir
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
        nama: "Kasir 1",
        noHp: "08198765432",
        username: "kasir1",
        role: "kasir",
        aktif: true
      }
    ];
    
    sampleKasir.forEach(kasir => {
      createKasir(kasir);
    });
  }
};

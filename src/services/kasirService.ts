
import { Kasir } from "@/types";

// Local storage key
const KASIR_STORAGE_KEY = "koperasi_kasir_data";

// Get all kasir from local storage
export const getAllKasir = (): Kasir[] => {
  const kasirData = localStorage.getItem(KASIR_STORAGE_KEY);
  if (!kasirData) return [];
  return JSON.parse(kasirData);
};

// Get kasir by ID
export const getKasirById = (id: string): Kasir | null => {
  const kasirList = getAllKasir();
  return kasirList.find(kasir => kasir.id === id) || null;
};

// Save kasir to local storage
export const saveKasir = (kasirList: Kasir[]): void => {
  localStorage.setItem(KASIR_STORAGE_KEY, JSON.stringify(kasirList));
};

// Initialize sample kasir data if not exist
export const initSampleKasirData = (): void => {
  const existingData = localStorage.getItem(KASIR_STORAGE_KEY);
  if (existingData) return;
  
  const sampleKasir: Kasir[] = [
    {
      id: "KSR001",
      nama: "John Doe",
      username: "john.doe",
      password: "password123", // In a real app, use hashed passwords
      aktif: true,
      role: "Kasir",
      createdAt: new Date().toISOString()
    },
    {
      id: "KSR002",
      nama: "Jane Smith",
      username: "jane.smith",
      password: "password123",
      aktif: true,
      role: "Kasir",
      createdAt: new Date().toISOString()
    },
    {
      id: "KSR003",
      nama: "Robert Johnson",
      username: "robert.j",
      password: "password123",
      aktif: false,
      role: "Kasir",
      createdAt: new Date().toISOString()
    }
  ];
  
  saveKasir(sampleKasir);
};

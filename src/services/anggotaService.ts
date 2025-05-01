
import { Anggota } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

const ANGGOTA_KEY = "koperasi_anggota";

// Initial sample data
const initialAnggota: Anggota[] = [
  { 
    id: "AG0001", 
    nama: "Budi Santoso", 
    nik: "3201011001800001",
    alamat: "Jl. Merdeka No. 123, Jakarta",
    noHp: "081234567890",
    jenisKelamin: "L",
    agama: "Islam",
    pekerjaan: "PNS",
    status: "active", // Adding status field
    tanggalBergabung: "2023-01-15", // Adding tanggalBergabung field
    foto: null,
    email: "budi.santoso@example.com", // Added email field
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0002", 
    nama: "Dewi Lestari", 
    nik: "3201012002800002",
    alamat: "Jl. Pahlawan No. 45, Bandung",
    noHp: "081234567891",
    jenisKelamin: "P",
    agama: "Kristen",
    pekerjaan: "Guru",
    status: "active",
    tanggalBergabung: "2023-02-20",
    foto: null,
    email: "dewi.lestari@example.com", // Added email field
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0003", 
    nama: "Ahmad Hidayat", 
    nik: "3201013003800003",
    alamat: "Jl. Sudirman No. 78, Surabaya",
    noHp: "081234567892",
    jenisKelamin: "L",
    agama: "Islam",
    pekerjaan: "Wiraswasta",
    status: "active",
    tanggalBergabung: "2023-03-10",
    foto: null,
    email: "ahmad.hidayat@example.com", // Added email field
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0004", 
    nama: "Sri Wahyuni", 
    nik: "3201014004800004",
    alamat: "Jl. Gatot Subroto No. 55, Medan",
    noHp: "081234567893",
    jenisKelamin: "P",
    agama: "Hindu",
    pekerjaan: "Dosen",
    status: "active",
    tanggalBergabung: "2023-04-05",
    foto: null,
    email: "sri.wahyuni@example.com", // Added email field
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  { 
    id: "AG0005", 
    nama: "Agus Setiawan", 
    nik: "3201015005800005",
    alamat: "Jl. Ahmad Yani No. 12, Semarang",
    noHp: "081234567894",
    jenisKelamin: "L",
    agama: "Katolik",
    pekerjaan: "Pedagang",
    status: "active",
    tanggalBergabung: "2023-05-15",
    foto: null,
    email: "agus.setiawan@example.com", // Added email field
    dokumen: [],
    keluarga: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get all anggota from local storage
 */
export function getAllAnggota(): Anggota[] {
  return getFromLocalStorage<Anggota[]>(ANGGOTA_KEY, initialAnggota);
}

// Alias function for getAllAnggota to fix the import issue
export function getAnggotaList(): Anggota[] {
  return getAllAnggota();
}

/**
 * Get anggota by ID
 */
export function getAnggotaById(id: string): Anggota | undefined {
  const anggotaList = getAllAnggota();
  return anggotaList.find(anggota => anggota.id === id);
}

/**
 * Generate a new anggota ID
 */
export function generateAnggotaId(): string {
  const anggotaList = getAllAnggota();
  const lastId = anggotaList.length > 0 
    ? parseInt(anggotaList[anggotaList.length - 1].id.replace("AG", "")) 
    : 0;
  const newId = `AG${String(lastId + 1).padStart(4, "0")}`;
  return newId;
}

/**
 * Create a new anggota
 */
export function createAnggota(anggota: Omit<Anggota, "id" | "createdAt" | "updatedAt">): Anggota {
  const anggotaList = getAllAnggota();
  const now = new Date().toISOString();
  
  const newAnggota: Anggota = {
    ...anggota,
    id: generateAnggotaId(),
    createdAt: now,
    updatedAt: now,
  };
  
  anggotaList.push(newAnggota);
  saveToLocalStorage(ANGGOTA_KEY, anggotaList);
  
  return newAnggota;
}

/**
 * Update an existing anggota
 */
export function updateAnggota(id: string, anggota: Partial<Anggota>): Anggota | null {
  const anggotaList = getAllAnggota();
  const index = anggotaList.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  anggotaList[index] = {
    ...anggotaList[index],
    ...anggota,
    updatedAt: new Date().toISOString(),
  };
  
  saveToLocalStorage(ANGGOTA_KEY, anggotaList);
  return anggotaList[index];
}

/**
 * Delete an anggota by ID
 */
export function deleteAnggota(id: string): boolean {
  const anggotaList = getAllAnggota();
  const filteredList = anggotaList.filter(anggota => anggota.id !== id);
  
  if (filteredList.length === anggotaList.length) return false;
  
  saveToLocalStorage(ANGGOTA_KEY, filteredList);
  return true;
}

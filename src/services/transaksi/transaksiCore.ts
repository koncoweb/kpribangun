
import { Transaksi } from "../../types";
import { TRANSAKSI_KEY, getAllItems, saveItems } from "./baseService";
import { generateTransaksiId } from "./utils";
import { getAnggotaById } from "../anggotaService";

/**
 * Get all transaksi from local storage
 */
export function getAllTransaksi(): Transaksi[] {
  // We'll import the initial data from a separate file
  const { initialTransaksi } = require("./initialData");
  return getAllItems<Transaksi>(TRANSAKSI_KEY, initialTransaksi);
}

/**
 * Get transaksi by ID
 */
export function getTransaksiById(id: string): Transaksi | undefined {
  const transaksiList = getAllTransaksi();
  return transaksiList.find(transaksi => transaksi.id === id);
}

/**
 * Get transaksi by anggota ID
 */
export function getTransaksiByAnggotaId(anggotaId: string): Transaksi[] {
  const transaksiList = getAllTransaksi();
  return transaksiList.filter(transaksi => transaksi.anggotaId === anggotaId);
}

/**
 * Create a new transaksi
 */
export function createTransaksi(transaksi: Omit<Transaksi, "id" | "anggotaNama" | "createdAt" | "updatedAt">): Transaksi | null {
  const anggota = getAnggotaById(transaksi.anggotaId);
  if (!anggota) return null;
  
  const transaksiList = getAllTransaksi();
  const now = new Date().toISOString();
  
  const newTransaksi: Transaksi = {
    ...transaksi,
    id: generateTransaksiId(),
    anggotaNama: anggota.nama,
    createdAt: now,
    updatedAt: now,
  };
  
  transaksiList.push(newTransaksi);
  saveItems(TRANSAKSI_KEY, transaksiList);
  
  return newTransaksi;
}

/**
 * Update an existing transaksi
 */
export function updateTransaksi(id: string, transaksi: Partial<Transaksi>): Transaksi | null {
  const transaksiList = getAllTransaksi();
  const index = transaksiList.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  // If anggotaId is being updated, we need to update anggotaNama as well
  if (transaksi.anggotaId) {
    const anggota = getAnggotaById(transaksi.anggotaId);
    if (!anggota) return null;
    transaksi.anggotaNama = anggota.nama;
  }
  
  transaksiList[index] = {
    ...transaksiList[index],
    ...transaksi,
    updatedAt: new Date().toISOString(),
  };
  
  saveItems(TRANSAKSI_KEY, transaksiList);
  return transaksiList[index];
}

/**
 * Delete a transaksi by ID
 */
export function deleteTransaksi(id: string): boolean {
  const transaksiList = getAllTransaksi();
  const filteredList = transaksiList.filter(transaksi => transaksi.id !== id);
  
  if (filteredList.length === transaksiList.length) return false;
  
  saveItems(TRANSAKSI_KEY, transaksiList);
  return true;
}

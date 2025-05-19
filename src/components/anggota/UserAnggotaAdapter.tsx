import { User, Anggota } from "@/types";

/**
 * Adapter to convert User objects to Anggota format for compatibility with existing components
 */
export function adaptUserToAnggota(user: User): Anggota {
  return {
    id: user.id,
    nama: user.nama,
    nip: user.anggotaId || "",  // Use anggotaId as nip
    alamat: user.alamat || "",
    noHp: user.noHP || "",
    jenisKelamin: "L", // Default value since users don't have this field
    agama: "",         // Default value since users don't have this field
    status: user.aktif ? "active" : "inactive",
    unitKerja: user.jabatan || "",
    email: user.email,
    foto: user.foto || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

/**
 * Convert a list of User objects to Anggota format
 */
export function adaptUsersToAnggota(users: User[]): Anggota[] {
  return users.map(adaptUserToAnggota);
}

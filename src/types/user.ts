
import { Role } from "./index";

export interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  foto?: string;
  jabatan?: string;
  noHP?: string;
  alamat?: string;
  roleId: string;
  roleName?: string;
  aktif: boolean;  // Changed from "active" to "aktif" for consistency
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  anggotaId?: string;
  password?: string;  // Added password as optional field
}

export interface UserFormData extends Omit<User, "id" | "createdAt" | "updatedAt" | "lastLogin" | "roleName"> {
  id?: string;
  password?: string;
}

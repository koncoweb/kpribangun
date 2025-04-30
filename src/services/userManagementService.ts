
import { User, Role, Permission } from "@/types";
import { generateId } from "@/lib/utils";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

// Local Storage Keys
const USERS_KEY = "koperasi_users";
const ROLES_KEY = "koperasi_roles";
const PERMISSIONS_KEY = "koperasi_permissions";

// Default permissions for the system
const defaultPermissions: Permission[] = [
  // Anggota permissions
  { id: "perm_anggota_read", name: "Lihat Anggota", description: "Melihat data anggota", module: "anggota", action: "read" },
  { id: "perm_anggota_create", name: "Tambah Anggota", description: "Menambah anggota baru", module: "anggota", action: "create" },
  { id: "perm_anggota_update", name: "Edit Anggota", description: "Mengubah data anggota", module: "anggota", action: "update" },
  { id: "perm_anggota_delete", name: "Hapus Anggota", description: "Menghapus anggota", module: "anggota", action: "delete" },
  
  // Transaksi permissions
  { id: "perm_transaksi_read", name: "Lihat Transaksi", description: "Melihat transaksi", module: "transaksi", action: "read" },
  { id: "perm_transaksi_create", name: "Tambah Transaksi", description: "Membuat transaksi baru", module: "transaksi", action: "create" },
  { id: "perm_transaksi_update", name: "Edit Transaksi", description: "Mengubah data transaksi", module: "transaksi", action: "update" },
  { id: "perm_transaksi_delete", name: "Batalkan Transaksi", description: "Membatalkan transaksi", module: "transaksi", action: "delete" },
  
  // Laporan permissions
  { id: "perm_laporan_read", name: "Lihat Laporan", description: "Melihat laporan", module: "laporan", action: "read" },
  { id: "perm_laporan_export", name: "Export Laporan", description: "Mengexport laporan", module: "laporan", action: "create" },
  
  // POS permissions
  { id: "perm_pos_read", name: "Akses POS", description: "Mengakses modul POS", module: "pos", action: "read" },
  { id: "perm_pos_sell", name: "Penjualan", description: "Melakukan penjualan", module: "pos", action: "create" },
  { id: "perm_pos_inventory", name: "Kelola Inventori", description: "Mengelola stok barang", module: "pos", action: "update" },
  
  // User Management permissions
  { id: "perm_users_read", name: "Lihat Pengguna", description: "Melihat daftar pengguna", module: "users", action: "read" },
  { id: "perm_users_create", name: "Tambah Pengguna", description: "Menambah pengguna baru", module: "users", action: "create" },
  { id: "perm_users_update", name: "Edit Pengguna", description: "Mengubah data pengguna", module: "users", action: "update" },
  { id: "perm_users_delete", name: "Hapus Pengguna", description: "Menghapus pengguna", module: "users", action: "delete" },
  
  // Role Management permissions
  { id: "perm_roles_read", name: "Lihat Role", description: "Melihat daftar role", module: "roles", action: "read" },
  { id: "perm_roles_create", name: "Tambah Role", description: "Menambah role baru", module: "roles", action: "create" },
  { id: "perm_roles_update", name: "Edit Role", description: "Mengubah data role", module: "roles", action: "update" },
  { id: "perm_roles_delete", name: "Hapus Role", description: "Menghapus role", module: "roles", action: "delete" },
  
  // Pengaturan permissions
  { id: "perm_pengaturan_read", name: "Lihat Pengaturan", description: "Melihat pengaturan", module: "pengaturan", action: "read" },
  { id: "perm_pengaturan_update", name: "Ubah Pengaturan", description: "Mengubah pengaturan", module: "pengaturan", action: "update" },
];

// Default roles
const defaultRoles: Role[] = [
  {
    id: "role_superadmin",
    name: "Super Admin",
    description: "Akses penuh ke semua fitur sistem",
    permissions: defaultPermissions.map(p => p.id),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "role_admin",
    name: "Admin",
    description: "Akses untuk mengelola data koperasi",
    permissions: [
      "perm_anggota_read", "perm_anggota_create", "perm_anggota_update",
      "perm_transaksi_read", "perm_transaksi_create", "perm_transaksi_update",
      "perm_laporan_read", "perm_laporan_export",
      "perm_pos_read", "perm_pos_sell", "perm_pos_inventory",
      "perm_users_read", "perm_pengaturan_read"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "role_kasir",
    name: "Kasir",
    description: "Akses untuk melakukan transaksi penjualan",
    permissions: [
      "perm_pos_read", "perm_pos_sell"
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Default users
const defaultUsers: User[] = [
  {
    id: "user_1",
    username: "superadmin",
    nama: "Super Administrator",
    email: "superadmin@koperasi.com",
    roleId: "role_superadmin",
    aktif: true,
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user_2",
    username: "admin",
    nama: "Administrator",
    email: "admin@koperasi.com",
    roleId: "role_admin",
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "user_3",
    username: "kasir1",
    nama: "Kasir Utama",
    email: "kasir@koperasi.com",
    roleId: "role_kasir",
    aktif: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Users Service
export const getUsers = (): User[] => {
  return getFromLocalStorage(USERS_KEY, []);
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const createUser = (userData: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
  const users = getUsers();
  const newUser: User = {
    id: generateId("USR"),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  users.push(newUser);
  saveToLocalStorage(USERS_KEY, users);
  return newUser;
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) return null;
  
  // Update user data
  const updatedUser = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  users[index] = updatedUser;
  saveToLocalStorage(USERS_KEY, users);
  return updatedUser;
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false;
  }
  
  saveToLocalStorage(USERS_KEY, filteredUsers);
  return true;
};

// Roles Service
export const getRoles = (): Role[] => {
  return getFromLocalStorage(ROLES_KEY, []);
};

export const getRoleById = (id: string): Role | undefined => {
  const roles = getRoles();
  return roles.find(role => role.id === id);
};

export const createRole = (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Role => {
  const roles = getRoles();
  const newRole: Role = {
    id: generateId("ROLE"),
    ...roleData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  roles.push(newRole);
  saveToLocalStorage(ROLES_KEY, roles);
  return newRole;
};

export const updateRole = (id: string, roleData: Partial<Role>): Role | null => {
  const roles = getRoles();
  const index = roles.findIndex(role => role.id === id);
  
  if (index === -1) return null;
  
  const updatedRole = {
    ...roles[index],
    ...roleData,
    updatedAt: new Date().toISOString()
  };
  
  roles[index] = updatedRole;
  saveToLocalStorage(ROLES_KEY, roles);
  return updatedRole;
};

export const deleteRole = (id: string): boolean => {
  // Check if any user is using this role
  const users = getUsers();
  const hasUsers = users.some(user => user.roleId === id);
  
  if (hasUsers) {
    return false; // Cannot delete a role that is being used
  }
  
  const roles = getRoles();
  const filteredRoles = roles.filter(role => role.id !== id);
  
  if (filteredRoles.length === roles.length) {
    return false;
  }
  
  saveToLocalStorage(ROLES_KEY, filteredRoles);
  return true;
};

// Permissions Service
export const getPermissions = (): Permission[] => {
  return getFromLocalStorage(PERMISSIONS_KEY, []);
};

export const getPermissionsByModule = (module: string): Permission[] => {
  const permissions = getPermissions();
  return permissions.filter(perm => perm.module === module);
};

// Initialize default data
export const initUserManagementData = (): void => {
  // Initialize permissions
  const existingPermissions = getPermissions();
  if (existingPermissions.length === 0) {
    saveToLocalStorage(PERMISSIONS_KEY, defaultPermissions);
  }
  
  // Initialize roles
  const existingRoles = getRoles();
  if (existingRoles.length === 0) {
    saveToLocalStorage(ROLES_KEY, defaultRoles);
  }
  
  // Initialize users
  const existingUsers = getUsers();
  if (existingUsers.length === 0) {
    saveToLocalStorage(USERS_KEY, defaultUsers);
  }
};

// Helper function to check if user has a specific permission
export const hasPermission = (user: User | undefined, permissionId: string): boolean => {
  if (!user) return false;
  
  const role = getRoleById(user.roleId);
  if (!role) return false;
  
  return role.permissions.includes(permissionId);
};

// Helper function to check if user has permission for a specific module and action
export const hasModulePermission = (user: User | undefined, module: string, action: "read" | "create" | "update" | "delete" | "all"): boolean => {
  if (!user) return false;
  
  const role = getRoleById(user.roleId);
  if (!role) return false;
  
  const permissions = getPermissions();
  const modulePermissions = permissions.filter(p => 
    p.module === module && (p.action === action || p.action === "all")
  );
  
  return modulePermissions.some(p => role.permissions.includes(p.id));
};

// Call this function on app startup to initialize data
initUserManagementData();

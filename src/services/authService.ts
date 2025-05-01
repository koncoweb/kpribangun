
import { User } from "@/types";
import { getUsers, getUserById } from "@/services/userManagementService";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getAnggotaById } from "./anggotaService";

const AUTH_STORAGE_KEY = "koperasi_auth";

// Extending User type to add anggotaId for anggota users
export interface AuthUser extends User {
  anggotaId?: string;
}

interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
}

// Get authentication state from local storage
export const getAuthState = (): AuthState => {
  return getFromLocalStorage(AUTH_STORAGE_KEY, {
    currentUser: null,
    isAuthenticated: false
  });
};

// Save authentication state to local storage
export const saveAuthState = (authState: AuthState): void => {
  saveToLocalStorage(AUTH_STORAGE_KEY, authState);
};

// Login function
export const loginUser = async (username: string, password: string): Promise<AuthUser> => {
  // In a real app, this would make an API call to validate credentials
  // For demo, we'll check against our mock users
  const users = getUsers();
  const user = users.find(user => user.username === username);
  
  // For demo purposes, any password will work
  // In production, you would compare password hashes
  if (!user) {
    throw new Error("User not found");
  }
  
  // For demo: If username contains "anggota", assign an anggotaId
  let authUser: AuthUser = user;
  if (user.username.includes("anggota")) {
    // Assign a mock anggotaId - in a real app, this would come from the database
    authUser = {
      ...user,
      anggotaId: `AGT${user.id.split('_')[1]}`
    };
  }
  
  // Save the authenticated user
  saveAuthState({
    currentUser: authUser,
    isAuthenticated: true
  });
  
  return authUser;
};

// Login with Anggota ID
export const loginWithAnggotaId = async (anggotaId: string, password: string): Promise<AuthUser> => {
  // Check if anggota exists
  const anggota = getAnggotaById(anggotaId);
  if (!anggota) {
    throw new Error("ID Anggota tidak ditemukan");
  }
  
  // In a real app, we would check the password against a hashed version
  // For demo purposes, we'll accept any password for testing
  // You would implement proper password validation in production
  
  // Find or create a user account for this anggota
  const users = getUsers();
  let anggotaUser = users.find(user => user.anggotaId === anggotaId);
  
  if (!anggotaUser) {
    // For demo purposes, create a temporary user for this anggota
    anggotaUser = {
      id: `user_anggota_${anggota.id}`,
      username: `anggota_${anggota.id}`,
      nama: anggota.nama,
      email: "",
      roleId: "role_anggota",
      aktif: true,
      anggotaId: anggota.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
  
  // Save the authenticated user
  saveAuthState({
    currentUser: anggotaUser,
    isAuthenticated: true
  });
  
  return anggotaUser;
};

// Logout function
export const logoutUser = (): void => {
  saveAuthState({
    currentUser: null,
    isAuthenticated: false
  });
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated && !!authState.currentUser;
};

// Get the current user
export const getCurrentUser = (): AuthUser | null => {
  const authState = getAuthState();
  return authState.currentUser;
};

// Update user password
export const updatePassword = (userId: string, newPassword: string): boolean => {
  // In a real app, you would hash the password and update it in the database
  // For demo purposes, we'll just log that the password was updated
  console.log(`Password updated for user ${userId}`);
  return true;
};

// Check if user has permission
export const hasPermission = (permissionId: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Assuming userManagementService has this function
  return require("@/services/userManagementService").hasPermission(user, permissionId);
};

// Check if user has role
export const hasRole = (roleId: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  return user.roleId === roleId;
};

// Initialize demo user data if not exists
export const initDemoUserData = (): void => {
  const users = getUsers();
  
  // If users already exist, don't add demo users
  if (users.length > 0) return;
  
  // This function is called in App.tsx or main.tsx to ensure demo users are available
  console.log("Initializing demo user data...");
  
  // Note: This would normally be handled by userManagementService
  // But we add this here for completeness of the auth demo
};

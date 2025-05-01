
import { User } from "@/types";
import { getUsers, getUserById } from "@/services/userManagementService";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getAnggotaById } from "@/services/anggotaService";

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
  
  // Update last login time
  user.lastLogin = new Date().toISOString();
  
  // Save the authenticated user
  saveAuthState({
    currentUser: user,
    isAuthenticated: true
  });
  
  return user;
};

// Login function for anggota
export const loginWithAnggotaId = async (anggotaId: string, password: string): Promise<AuthUser> => {
  // In a real app, this would make an API call to validate credentials
  try {
    // Get anggota by ID
    const anggota = getAnggotaById(anggotaId);
    
    if (!anggota) {
      throw new Error("ID Anggota tidak ditemukan");
    }
    
    // For demo purposes, we're not doing real password verification
    // In production, you would compare password hashes
    // Simple verification (for demo)
    if (password !== "password123" && password !== anggota.id) {
      throw new Error("Password salah");
    }
    
    // Create an auth user with anggota details
    const authUser: AuthUser = {
      id: `anggota-${anggota.id}`,
      username: anggota.nama,
      nama: anggota.nama,
      email: anggota.email || "",
      roleId: "anggota", // Special role for anggota
      anggotaId: anggota.id,
      active: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Save the authenticated anggota
    saveAuthState({
      currentUser: authUser,
      isAuthenticated: true
    });
    
    return authUser;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    throw error;
  }
};

// Update password function
export const updatePassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
  // In a real app, this would make an API call to update password
  // For demo, we'll just pretend it worked
  
  // Validate current password (would be more complex in a real app)
  // For anggota users
  const currentUser = getCurrentUser();
  if (currentUser?.anggotaId) {
    // Handle anggota password change
    if (currentPassword !== "password123" && currentPassword !== currentUser.anggotaId) {
      throw new Error("Password lama tidak sesuai");
    }
  } else {
    // Handle admin/staff password change
    // For demo, any current password is accepted
  }
  
  // In a real app, you would update the password in database
  // For demo, we'll just return success
  return true;
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

// Check if user has permission
export const hasPermission = (permissionId: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Import from userManagementService
  return require("@/services/userManagementService").hasPermission(user, permissionId);
};

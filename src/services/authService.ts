
import { User } from "@/types";
import { ExtendedUser } from "@/types/auth";
import { getUsers, getUserById } from "@/services/userManagementService";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { getAnggotaById } from "@/services/anggotaService";
import { getRoleById } from "@/services/user-management/roleService";

const AUTH_STORAGE_KEY = "koperasi_auth";

interface AuthState {
  currentUser: ExtendedUser | null;
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
  console.log("Auth state saved:", authState);
};

// Login function
export const loginUser = async (username: string, password: string): Promise<ExtendedUser> => {
  // In a real app, this would make an API call to validate credentials
  console.log("Attempting login with:", { username, password });
  
  // For demo, we'll check against our mock users
  const users = getUsers();
  const user = users.find(user => user.username === username);
  
  if (!user) {
    console.error("User not found:", username);
    throw new Error("User not found");
  }
  
  // For demo purposes, any password matching "password123" will work
  // In production, you would compare password hashes
  if (password !== "password123") {
    console.error("Invalid password for user:", username);
    throw new Error("Invalid password");
  }
  
  // Update last login time
  user.lastLogin = new Date().toISOString();
  
  // Get role information if available
  const role = user.roleId ? getRoleById(user.roleId) : undefined;
  
  // Create extended user with role information
  const extendedUser: ExtendedUser = {
    ...user,
    role: role ? {
      id: role.id,
      name: role.name,
      permissions: role.permissions
    } : undefined
  };
  
  console.log("User authenticated successfully:", extendedUser);
  
  // Save the authenticated user
  saveAuthState({
    currentUser: extendedUser,
    isAuthenticated: true
  });
  
  return extendedUser;
};

// Login function for anggota
export const loginWithAnggotaId = async (anggotaId: string, password: string): Promise<ExtendedUser> => {
  // In a real app, this would make an API call to validate credentials
  console.log("Attempting anggota login with ID:", anggotaId);
  
  try {
    // Get anggota by ID
    const anggota = getAnggotaById(anggotaId);
    
    if (!anggota) {
      console.error("Anggota not found:", anggotaId);
      throw new Error("ID Anggota tidak ditemukan");
    }
    
    // For demo purposes, we're not doing real password verification
    // In production, you would compare password hashes
    // Simple verification (for demo)
    if (password !== "password123" && password !== anggota.id) {
      console.error("Invalid password for anggota:", anggotaId);
      throw new Error("Password salah");
    }
    
    // Create an auth user with anggota details
    const authUser: ExtendedUser = {
      id: `anggota-${anggota.id}`,
      username: anggota.nama,
      nama: anggota.nama,
      email: anggota.email || "",
      roleId: "anggota", // Special role for anggota
      anggotaId: anggota.id,
      aktif: true,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      role: {
        id: "anggota",
        name: "Anggota",
        permissions: ["view_own_data"]
      }
    };
    
    console.log("Anggota authenticated successfully:", authUser);
    
    // Save the authenticated anggota
    saveAuthState({
      currentUser: authUser,
      isAuthenticated: true
    });
    
    return authUser;
  } catch (error) {
    // Re-throw the error to be handled by the calling component
    console.error("Anggota login failed:", error);
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
  console.log("Logging out user");
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
export const getCurrentUser = (): ExtendedUser | null => {
  const authState = getAuthState();
  return authState.currentUser;
};

// Check if user has permission
export const hasPermission = (permissionId: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Check if user has the permission directly or through their role
  if (user.permissions?.includes(permissionId)) {
    return true;
  }
  
  if (user.role?.permissions?.includes(permissionId)) {
    return true;
  }
  
  return false;
};

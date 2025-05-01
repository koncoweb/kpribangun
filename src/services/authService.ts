
import { User } from "@/types";
import { getUsers, getUserById } from "@/services/userManagementService";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

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


import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { AUTH_USER_KEY } from "./constants";
import { LoginResult } from "./types";
import { toast } from "@/components/ui/use-toast";

/**
 * Login user with username and password
 */
export async function login(username: string, password: string): Promise<LoginResult> {
  try {
    console.log("Attempting to login with username:", username);
    
    // First, check if users exist in the Supabase database
    let { count } = await supabase
      .from("users")
      .select("*", { count: 'exact', head: true });
    
    console.log("Users count check:", count);
    
    // If no users exist, initialize the users in Supabase
    if (!count || count === 0) {
      console.log("No users found in Supabase, creating default users");
      await initDefaultUsers();
    }
    
    // Try to fetch user by username
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("aktif", true)
      .single();
    
    if (fetchError) {
      console.error("Login error:", fetchError);
      return {
        success: false,
        message: "Username tidak ditemukan atau akun tidak aktif"
      };
    }
    
    console.log("User found:", userData);
    
    // For now, since we're not using Supabase Auth but just our users table,
    // we'll simulate authentication by checking the password directly
    // Note: In a production app, you would set up proper Supabase Auth
    if (password !== "password123") { // Replace with proper password check
      return {
        success: false,
        message: "Password tidak valid"
      };
    }
    
    // Map database fields to User type
    const user: User = {
      id: userData.id,
      username: userData.username,
      nama: userData.nama,
      email: userData.email || "",
      roleId: userData.roleid || "",
      anggotaId: userData.anggotaid || "",
      noHP: userData.nohp || "",
      alamat: userData.alamat || "",
      aktif: userData.aktif || true,
      foto: userData.foto || "",
      createdAt: userData.created_at || new Date().toISOString(),
      updatedAt: userData.updated_at || new Date().toISOString()
    };

    // Store user in session storage
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    
    // Update last login
    const now = new Date().toISOString();
    await supabase
      .from("users")
      .update({ lastlogin: now })
      .eq("id", user.id);
    
    return {
      success: true,
      user
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Login failed"
    };
  }
}

/**
 * Login with anggota ID
 */
export async function loginAsAnggota(anggotaId: string, password: string): Promise<LoginResult> {
  try {
    // First, check if anggota exists and is associated with a user
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("anggotaid", anggotaId)
      .eq("aktif", true)
      .single();
    
    if (fetchError || !userData) {
      console.error("Login error:", fetchError);
      return {
        success: false,
        message: "ID Anggota tidak ditemukan atau akun tidak aktif"
      };
    }
    
    // Simple password check (should be replaced with proper auth)
    if (password !== "password123") {
      return {
        success: false,
        message: "Password tidak valid"
      };
    }

    // Map database fields to User type
    const user: User = {
      id: userData.id,
      username: userData.username,
      nama: userData.nama,
      email: userData.email || "",
      roleId: userData.roleid || "",
      anggotaId: userData.anggotaid || "",
      noHP: userData.nohp || "",
      alamat: userData.alamat || "",
      aktif: userData.aktif || true,
      foto: userData.foto || "",
      createdAt: userData.created_at || new Date().toISOString(),
      updatedAt: userData.updated_at || new Date().toISOString()
    };
    
    // Store user in session storage
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    
    // Update last login
    const now = new Date().toISOString();
    await supabase
      .from("users")
      .update({ lastlogin: now })
      .eq("id", user.id);
    
    return {
      success: true,
      user
    };
  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || "Login failed"
    };
  }
}

/**
 * Logout user
 */
export function logoutUser(): void {
  sessionStorage.removeItem(AUTH_USER_KEY);
}

/**
 * Get current logged in user
 */
export function getCurrentUser(): User | null {
  const userJson = sessionStorage.getItem(AUTH_USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error("Error parsing user from session:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getCurrentUser();
}

/**
 * Check user login status
 */
export function checkLoginStatus(): boolean {
  const isLoggedIn = isAuthenticated();
  
  // If not logged in and not on login page, redirect to login
  if (!isLoggedIn && !window.location.pathname.includes("/login")) {
    window.location.href = "/login";
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please log in again.",
      variant: "destructive",
    });
    return false;
  }
  
  return isLoggedIn;
}

// Import from initialization.ts to avoid circular dependencies
import { initDefaultUsers } from "./initialization";

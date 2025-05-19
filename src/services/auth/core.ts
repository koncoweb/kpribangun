
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { AUTH_USER_KEY } from "./constants";
import { LoginResult } from "./types";
import { toast } from "@/components/ui/use-toast";

/**
 * Login user with email and password using Supabase Auth
 */
export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    console.log("Attempting to login with email:", email);
    
    // Use Supabase Auth to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error("Login error:", authError);
      return {
        success: false,
        message: authError.message || "Email atau password tidak valid"
      };
    }
    
    if (!authData.user) {
      return {
        success: false,
        message: "Gagal login: User tidak ditemukan"
      };
    }
    
    // Get user data from the users table - no need to join with roles table
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .eq("aktif", true)
      .single();
    
    if (fetchError || !userData) {
      console.error("User data fetch error:", fetchError);
      // Sign out if we can't get the user data
      await supabase.auth.signOut();
      return {
        success: false,
        message: "Akun tidak aktif atau tidak ditemukan"
      };
    }
    
    // Map database fields to User type
    const user: User = {
      id: userData.id,
      username: userData.username,
      nama: userData.nama,
      email: userData.email || "",
      roleId: userData.roleid || "",
      roleName: undefined, // We're not fetching role name directly
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
 * Login with anggota ID - This function is now deprecated
 * Users should use the standard login function with email and password
 */
export async function loginAsAnggota(anggotaId: string, password: string): Promise<LoginResult> {
  try {
    // First, find the user with this anggota ID to get their email
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("email")
      .eq("anggotaid", anggotaId)
      .eq("aktif", true)
      .single();
    
    if (fetchError || !userData || !userData.email) {
      console.error("Anggota lookup error:", fetchError);
      return {
        success: false,
        message: "ID Anggota tidak ditemukan atau akun tidak aktif"
      };
    }
    
    // Use the standard login function with the email
    return login(userData.email, password);
  } catch (error: any) {
    console.error("Login as anggota error:", error);
    return {
      success: false,
      message: error.message || "Login failed"
    };
  }
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<void> {
  // Sign out from Supabase Auth
  await supabase.auth.signOut();
  // Clear local session storage
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

// No longer need to import initDefaultUsers since we're using Supabase Auth

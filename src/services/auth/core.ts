
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
    
    // Use Supabase Auth for authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (authError) {
      console.error("Supabase Auth login error:", authError);
      return {
        success: false,
        message: authError.message || "Email atau password tidak valid"
      };
    }
    
    if (!authData.user) {
      return {
        success: false,
        message: "Login gagal: User tidak ditemukan"
      };
    }
    
    // Fetch additional user data from the users table
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .eq("aktif", true)
      .single();
    
    if (fetchError || !userData) {
      console.error("User data fetch error:", fetchError);
      // Sign out since we couldn't get the user data
      await supabase.auth.signOut();
      return {
        success: false,
        message: "Akun tidak aktif atau data tidak ditemukan"
      };
    }
    
    // Map database fields to User type
    const user: User = {
      id: userData.id,
      username: userData.username || email,
      nama: userData.nama,
      email: userData.email || email,
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
 * Login with anggota ID using Supabase Auth
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
      console.error("Anggota login error:", fetchError);
      return {
        success: false,
        message: "ID Anggota tidak ditemukan atau akun tidak aktif"
      };
    }
    
    // Use Supabase Auth to sign in with the user's email
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password
    });
    
    if (authError) {
      console.error("Supabase Auth login error:", authError);
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
 * Logout user using Supabase Auth
 */
export async function logoutUser(): Promise<void> {
  try {
    // Sign out from Supabase Auth
    await supabase.auth.signOut();
    // Remove user from session storage
    sessionStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error("Logout error:", error);
    // Still remove from session storage even if Supabase logout fails
    sessionStorage.removeItem(AUTH_USER_KEY);
  }
}

/**
 * Get current logged in user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    // First check Supabase Auth session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // No active session, clear local storage
      sessionStorage.removeItem(AUTH_USER_KEY);
      return null;
    }
    
    // Try to get from session storage first for performance
    const userJson = sessionStorage.getItem(AUTH_USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson) as User;
      } catch (error) {
        console.error("Error parsing user from session:", error);
        // Continue to fetch from database
      }
    }
    
    // If not in session storage or parsing failed, fetch from database
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .eq("aktif", true)
      .single();
    
    if (error || !userData) {
      console.error("Error fetching current user:", error);
      return null;
    }
    
    // Map and store user
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
    
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Check user login status
 */
export async function checkLoginStatus(): Promise<boolean> {
  const isLoggedIn = await isAuthenticated();
  
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

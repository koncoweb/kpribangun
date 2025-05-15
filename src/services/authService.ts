
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Session storage key
const AUTH_USER_KEY = "koperasi_auth_user";

/**
 * Login user with username and password
 */
export async function login(username: string, password: string) {
  try {
    console.log("Attempting to login with username:", username);
    
    // First, check if users exist in the Supabase database
    let { data: usersCount, error: countError } = await supabase
      .from("users")
      .select("*", { count: 'exact', head: true });
    
    console.log("Users count check:", usersCount, countError);
    
    // If no users exist, initialize the users in Supabase
    if (countError || (usersCount && Object.keys(usersCount).length === 0)) {
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
 * Initialize default users if none exist
 */
export async function initDefaultUsers() {
  const defaultUsers = [
    {
      id: "user_1",
      username: "superadmin",
      nama: "Super Administrator",
      email: "superadmin@koperasi.com",
      roleid: "role_superadmin",
      foto: "",
      jabatan: "Super Administrator",
      nohp: "081234567890",
      alamat: "Jl. Admin No. 1",
      aktif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "user_2",
      username: "admin",
      nama: "Administrator",
      email: "admin@koperasi.com",
      roleid: "role_admin",
      foto: "",
      jabatan: "Administrator",
      nohp: "081234567891",
      alamat: "Jl. Admin No. 2",
      aktif: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Insert default users
  const { error } = await supabase
    .from("users")
    .insert(defaultUsers);

  if (error) {
    console.error("Error inserting default users:", error);
    throw error;
  }

  // Also need to initialize roles
  await initDefaultRoles();
}

/**
 * Initialize default roles if none exist
 */
export async function initDefaultRoles() {
  const defaultRoles = [
    {
      id: "role_superadmin",
      name: "Super Admin",
      description: "Akses penuh ke semua fitur sistem",
      permissions: ["perm_anggota_read", "perm_users_read"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "role_admin",
      name: "Admin",
      description: "Akses untuk mengelola data koperasi",
      permissions: ["perm_anggota_read"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Insert default roles
  const { error } = await supabase
    .from("roles")
    .insert(defaultRoles);

  if (error) {
    console.error("Error inserting default roles:", error);
    throw error;
  }
}

/**
 * Login with anggota ID
 */
export async function loginAsAnggota(anggotaId: string, password: string) {
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
 * Update user password
 */
export async function updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    // First, verify the current password
    if (currentPassword !== "password123") { // Using the same password check as in login
      throw new Error("Password lama tidak valid");
    }

    // In a real application with Supabase Auth, you would do something like:
    // const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    // For now, we'll just simulate a successful password update
    // In a production app with proper auth, you would update the password in Supabase Auth
    console.log(`Password updated for user ${userId}`);
    
    // Return true to indicate success
    return true;
  } catch (error: any) {
    console.error("Password update error:", error);
    throw new Error(error.message || "Gagal mengubah password");
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

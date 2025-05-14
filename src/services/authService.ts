
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Session storage key
const AUTH_USER_KEY = "koperasi_auth_user";

/**
 * Login user with username and password
 */
export async function loginUser(username: string, password: string): Promise<User> {
  try {
    // First, fetch the user from our 'users' table using username
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .eq("aktif", true)
      .single();
    
    if (fetchError || !users) {
      console.error("Login error:", fetchError);
      throw new Error("Username tidak ditemukan atau akun tidak aktif");
    }
    
    // In a real application with Supabase auth, we would do something like this:
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: users.email,
    //   password: password
    // });
    
    // For now, since we're not using Supabase Auth but just our users table,
    // we'll simulate authentication by checking the password directly
    // Note: In a production app, you would set up proper Supabase Auth
    if (password !== "password123") { // Replace with proper password check
      throw new Error("Password tidak valid");
    }
    
    // Store user in session storage
    const user: User = users;
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    
    // Update last login
    const now = new Date().toISOString();
    await supabase
      .from("users")
      .update({ lastLogin: now })
      .eq("id", user.id);
    
    return user;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
}

/**
 * Login with anggota ID
 */
export async function loginWithAnggotaId(anggotaId: string, password: string): Promise<User> {
  try {
    // First, check if anggota exists and is associated with a user
    const { data: users, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("anggotaId", anggotaId)
      .eq("aktif", true)
      .single();
    
    if (fetchError || !users) {
      console.error("Login error:", fetchError);
      throw new Error("ID Anggota tidak ditemukan atau akun tidak aktif");
    }
    
    // Simple password check (should be replaced with proper auth)
    if (password !== "password123") {
      throw new Error("Password tidak valid");
    }
    
    // Store user in session storage
    const user: User = users;
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    
    // Update last login
    const now = new Date().toISOString();
    await supabase
      .from("users")
      .update({ lastLogin: now })
      .eq("id", user.id);
    
    return user;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
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

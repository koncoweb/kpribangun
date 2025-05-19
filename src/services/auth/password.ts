
import { supabase } from "@/integrations/supabase/client";
import { PasswordUpdateResult } from "./types";

/**
 * Update user password using Supabase Auth
 */
export async function updatePassword(
  currentPassword: string, 
  newPassword: string
): Promise<PasswordUpdateResult> {
  try {
    // First, verify the current session is valid
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Sesi tidak valid. Silakan login kembali.");
    }

    // Update password using Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error("Supabase password update error:", error);
      throw new Error(error.message || "Gagal mengubah password");
    }
    
    console.log(`Password updated successfully`);
    
    return {
      success: true
    };
  } catch (error: any) {
    console.error("Password update error:", error);
    return {
      success: false,
      message: error.message || "Gagal mengubah password"
    };
  }
}

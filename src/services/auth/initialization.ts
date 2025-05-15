
import { supabase } from "@/integrations/supabase/client";

/**
 * Initialize default users if none exist
 */
export async function initDefaultUsers() {
  try {
    // Generate proper UUIDs instead of string IDs
    const defaultUsers = [
      {
        // Use UUID format instead of "user_1"
        id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
    return true;
  } catch (error) {
    console.error("Error in initDefaultUsers:", error);
    throw error;
  }
}

/**
 * Initialize default roles if none exist
 */
export async function initDefaultRoles() {
  try {
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
    
    return true;
  } catch (error) {
    console.error("Error in initDefaultRoles:", error);
    throw error;
  }
}

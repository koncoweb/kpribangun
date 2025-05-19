
import { supabase } from "@/integrations/supabase/client";

/**
 * Initialize default users if none exist
 */
export async function initDefaultUsers() {
  try {
    // First check if users exist
    const { count } = await supabase
      .from("users")
      .select("*", { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log("Users already exist, skipping initialization");
      return true;
    }

    // Create default users with Supabase Auth
    const defaultUsers = [
      {
        email: "superadmin@koperasi.com",
        password: "password123", // This should be changed after first login
        userData: {
          username: "superadmin",
          nama: "Super Administrator",
          roleid: "role_superadmin",
          foto: "",
          jabatan: "Super Administrator",
          nohp: "081234567890",
          alamat: "Jl. Admin No. 1",
          aktif: true
        }
      },
      {
        email: "admin@koperasi.com",
        password: "password123", // This should be changed after first login
        userData: {
          username: "admin",
          nama: "Administrator",
          roleid: "role_admin",
          foto: "",
          jabatan: "Administrator",
          nohp: "081234567891",
          alamat: "Jl. Admin No. 2",
          aktif: true
        }
      }
    ];

    // Create users one by one
    for (const user of defaultUsers) {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (authError) {
        console.error("Error creating user in Supabase Auth:", authError);
        throw authError;
      }

      if (!authData.user) {
        throw new Error("Failed to create user in Supabase Auth");
      }

      // Insert user data in the users table
      const { error: insertError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: user.email,
          ...user.userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error("Error inserting user data:", insertError);
        throw insertError;
      }
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
    // First check if roles exist
    const { count } = await supabase
      .from("roles")
      .select("*", { count: 'exact', head: true });
    
    if (count && count > 0) {
      console.log("Roles already exist, skipping initialization");
      return true;
    }
    
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

import { supabase } from "@/integrations/supabase/client";
import { User, Role } from "@/types";

// Define the database schema types to match the actual table structure
interface DbUser {
  id: string;
  username: string | null;
  nama: string;
  email: string;
  roleid: string | null; // Note: database uses roleid, not role_id
  foto: string | null;
  jabatan: string | null;
  nohp: string | null;
  alamat: string | null;
  aktif: boolean | null;
  lastlogin: string | null;
  anggotaid: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface DbRole {
  id: string;
  name: string;
  description: string | null;
  permissions: string[] | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Map database object to User type
 */
function mapDbToUser(dbObject: DbUser, role?: DbRole): User {
  return {
    id: dbObject.id,
    username: dbObject.username || "",
    nama: dbObject.nama,
    email: dbObject.email,
    roleId: dbObject.roleid || "",
    roleName: role?.name,
    foto: dbObject.foto || "",
    jabatan: dbObject.jabatan || "",
    noHP: dbObject.nohp || "",
    alamat: dbObject.alamat || "",
    aktif: dbObject.aktif || true,
    lastLogin: dbObject.lastlogin || "",
    anggotaId: dbObject.anggotaid || "",
    createdAt: dbObject.created_at || new Date().toISOString(),
    updatedAt: dbObject.updated_at || new Date().toISOString()
  };
}

/**
 * Get all users from Supabase
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    // First, fetch all roles to be able to include role names
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("*");
    
    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      throw rolesError;
    }
    
    // Then fetch all users
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("nama");
    
    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
    
    // Map database objects to User type with role names
    return data.map(user => {
      const userRole = roles.find(role => role.id === user.roleid);
      return mapDbToUser(user as DbUser, userRole as DbRole);
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}

/**
 * Get user by ID from Supabase
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Get the user's role
    const { data: roleData } = await supabase
      .from("roles")
      .select("*")
      .eq("id", data.roleid)
      .single();
    
    return mapDbToUser(data as DbUser, roleData as DbRole);
  } catch (error) {
    console.error("Error in getUserById:", error);
    return null;
  }
}

/**
 * Create a new user in Supabase
 */
export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert({
        username: userData.username,
        nama: userData.nama,
        email: userData.email,
        roleid: userData.roleId,
        foto: userData.foto,
        jabatan: userData.jabatan,
        nohp: userData.noHP,
        alamat: userData.alamat,
        aktif: userData.aktif,
        anggotaid: userData.anggotaId
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }
    
    // Get the user's role
    const { data: roleData } = await supabase
      .from("roles")
      .select("*")
      .eq("id", data.roleid)
      .single();
    
    return mapDbToUser(data as DbUser, roleData as DbRole);
  } catch (error) {
    console.error("Error in createUser:", error);
    return null;
  }
}

/**
 * Update an existing user in Supabase
 */
export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    // Convert from User type to database fields
    const dbData: Partial<DbUser> = {};
    if (userData.username !== undefined) dbData.username = userData.username;
    if (userData.nama !== undefined) dbData.nama = userData.nama;
    if (userData.email !== undefined) dbData.email = userData.email;
    if (userData.roleId !== undefined) dbData.roleid = userData.roleId;
    if (userData.foto !== undefined) dbData.foto = userData.foto;
    if (userData.jabatan !== undefined) dbData.jabatan = userData.jabatan;
    if (userData.noHP !== undefined) dbData.nohp = userData.noHP;
    if (userData.alamat !== undefined) dbData.alamat = userData.alamat;
    if (userData.aktif !== undefined) dbData.aktif = userData.aktif;
    if (userData.anggotaId !== undefined) dbData.anggotaid = userData.anggotaId;
    
    const { data, error } = await supabase
      .from("users")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating user:", error);
      throw error;
    }
    
    // Get the user's role
    const { data: roleData } = await supabase
      .from("roles")
      .select("*")
      .eq("id", data.roleid)
      .single();
    
    return mapDbToUser(data as DbUser, roleData as DbRole);
  } catch (error) {
    console.error("Error in updateUser:", error);
    return null;
  }
}

/**
 * Delete a user from Supabase
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);
    
    if (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return false;
  }
}

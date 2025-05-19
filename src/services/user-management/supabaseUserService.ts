import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { registerUser } from "@/services/auth/registration";

/**
 * Fetch all users from Supabase
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, roles(name)')
      .order('nama');
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return (data || []).map(mapUserRowToModel);
  } catch (error) {
    console.error('Unexpected error fetching users:', error);
    return [];
  }
}

/**
 * Fetch a user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
    
    return data ? mapUserRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error fetching user by ID:', error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt"> & { password?: string }): Promise<User | null> {
  try {
    // First, register the user with Supabase Auth
    if (!userData.password) {
      console.error('Password is required to create a new user');
      return null;
    }

    // Register the user with Supabase Auth
    const registrationResult = await registerUser(
      userData.email,
      userData.password,
      {
        fullName: userData.nama,
        username: userData.username
      }
    );

    if (!registrationResult.success || !registrationResult.id) {
      console.error('Error registering user with Supabase Auth:', registrationResult.message);
      return null;
    }

    // The database trigger should automatically create a user in the users table
    // with a default role, but we need to update it with the additional information
    
    // Format the data for Supabase update
    const userUpdate = {
      username: userData.username,
      nama: userData.nama,
      role_id: userData.roleId,
      foto: userData.foto || null,
      jabatan: userData.jabatan || null,
      nohp: userData.noHP || null,
      alamat: userData.alamat || null,
      aktif: userData.aktif,
      anggotaid: userData.anggotaId || null
    };
    
    // Update the user record that was created by the trigger
    const { data, error } = await supabase
      .from('users')
      .update(userUpdate as any)
      .eq('id', registrationResult.id)
      .select('*, roles(name)')
      .single();
    
    if (error) {
      console.error('Error updating user after registration:', error);
      return null;
    }
    
    return data ? mapUserRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    return null;
  }
}

/**
 * Update an existing user
 */
export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  try {
    // Format the data for Supabase
    const userUpdate: Record<string, any> = {};
    
    if (userData.username) userUpdate.username = userData.username;
    if (userData.nama) userUpdate.nama = userData.nama;
    if (userData.email) userUpdate.email = userData.email;
    if (userData.roleId) userUpdate.role_id = userData.roleId;
    if (userData.foto !== undefined) userUpdate.foto = userData.foto || null;
    if (userData.jabatan !== undefined) userUpdate.jabatan = userData.jabatan || null;
    if (userData.noHP !== undefined) userUpdate.nohp = userData.noHP || null;
    if (userData.alamat !== undefined) userUpdate.alamat = userData.alamat || null;
    if (userData.aktif !== undefined) userUpdate.aktif = userData.aktif;
    if (userData.anggotaId !== undefined) userUpdate.anggotaid = userData.anggotaId || null;
    
    // Add updated_at timestamp
    userUpdate.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('users')
      .update(userUpdate as any)
      .eq('id', id)
      .select('*, roles(name)')
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      return null;
    }
    
    return data ? mapUserRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error updating user:', error);
    return null;
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting user:', error);
    return false;
  }
}

/**
 * Map a Supabase user row to our User model
 */
function mapUserRowToModel(row: any): User {
  return {
    id: row.id,
    username: row.username,
    nama: row.nama,
    email: row.email,
    foto: row.foto || undefined,
    jabatan: row.jabatan || undefined,
    noHP: row.nohp || undefined,
    alamat: row.alamat || undefined,
    roleId: row.role_id,
    roleName: row.roles?.name || undefined,
    aktif: row.aktif,
    lastLogin: row.lastlogin || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    anggotaId: row.anggotaid || undefined
  };
}

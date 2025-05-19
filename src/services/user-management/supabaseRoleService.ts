import { supabase } from "@/integrations/supabase/client";
import { Role } from "@/types/user";

/**
 * Fetch all roles from Supabase
 */
export async function getAllRoles(): Promise<Role[]> {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
    
    return (data || []).map(mapRoleRowToModel);
  } catch (error) {
    console.error('Unexpected error fetching roles:', error);
    return [];
  }
}

/**
 * Fetch a role by ID
 */
export async function getRoleById(id: string): Promise<Role | null> {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching role by ID:', error);
      return null;
    }
    
    return data ? mapRoleRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error fetching role by ID:', error);
    return null;
  }
}

/**
 * Create a new role
 */
export async function createRole(roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role | null> {
  try {
    const roleInsert = {
      name: roleData.name,
      description: roleData.description || null,
      permissions: roleData.permissions || []
    };
    
    const { data, error } = await supabase
      .from('roles')
      .insert(roleInsert as any)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating role:', error);
      return null;
    }
    
    return data ? mapRoleRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error creating role:', error);
    return null;
  }
}

/**
 * Update an existing role
 */
export async function updateRole(id: string, roleData: Partial<Role>): Promise<Role | null> {
  try {
    const roleUpdate: Record<string, any> = {};
    
    if (roleData.name) roleUpdate.name = roleData.name;
    if (roleData.description !== undefined) roleUpdate.description = roleData.description || null;
    if (roleData.permissions !== undefined) roleUpdate.permissions = roleData.permissions || [];
    
    // Add updated_at timestamp
    roleUpdate.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('roles')
      .update(roleUpdate as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating role:', error);
      return null;
    }
    
    return data ? mapRoleRowToModel(data) : null;
  } catch (error) {
    console.error('Unexpected error updating role:', error);
    return null;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error deleting role:', error);
    return false;
  }
}

/**
 * Map a Supabase role row to our Role model
 */
function mapRoleRowToModel(row: any): Role {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    permissions: row.permissions || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

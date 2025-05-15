
import { supabase } from "@/integrations/supabase/client";

/**
 * Delete a transaksi by ID
 * @param id Transaction ID to delete
 * @returns true if successful, false if not found
 */
export async function deleteTransaksi(id: string): Promise<boolean> {
  try {
    const { error, count } = await supabase
      .from("transaksi")
      .delete()
      .eq("id", id)
      .select("count");
    
    if (error) {
      console.error("Error deleting transaction:", error);
      throw error;
    }
    
    // If no rows were affected, return false (not found)
    return count !== null && count > 0;
  } catch (error) {
    console.error("Error in deleteTransaksi:", error);
    return false;
  }
}

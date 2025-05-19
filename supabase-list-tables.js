// This script uses the Supabase JavaScript client to list tables
// You'll need to install the required packages:
// npm install @supabase/supabase-js

const { createClient } = require('@supabase/supabase-js');

// Supabase project details
const SUPABASE_URL = 'https://mvigmyzmcfjfxikasvuq.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'; // Replace with your anon key, not the service_role key

// Create a Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listTables() {
  try {
    // Query to list all tables in the public schema
    const { data, error } = await supabase.rpc('get_tables');
    
    if (error) {
      throw error;
    }
    
    console.log('Tables in your Supabase project:');
    if (!data || data.length === 0) {
      console.log('No tables found');
    } else {
      data.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
  } catch (err) {
    console.error('Error fetching tables:', err);
  }
}

// Create a stored procedure to get tables if it doesn't exist
async function setupStoredProcedure() {
  try {
    const { error } = await supabase.rpc('get_tables');
    
    // If the function doesn't exist, create it
    if (error && error.message.includes('function get_tables() does not exist')) {
      console.log('Creating stored procedure to get tables...');
      
      // SQL to create the stored procedure
      const { error: createError } = await supabase.rpc('create_get_tables_function', {
        sql: `
          CREATE OR REPLACE FUNCTION get_tables()
          RETURNS TABLE (table_name text) 
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $$
          BEGIN
            RETURN QUERY 
            SELECT information_schema.tables.table_name::text
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
          END;
          $$;
        `
      });
      
      if (createError) {
        throw createError;
      }
      
      console.log('Stored procedure created successfully');
    }
  } catch (err) {
    console.error('Error setting up stored procedure:', err);
  }
}

// Run the functions
(async () => {
  await setupStoredProcedure();
  await listTables();
})();

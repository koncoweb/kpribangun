// This script uses the Supabase REST API to list tables
// First, install the required packages:
// npm install node-fetch

const fetch = require('node-fetch');

// Supabase project details
const SUPABASE_URL = 'https://mvigmyzmcfjfxikasvuq.supabase.co';
const SUPABASE_KEY = 'sbp_d33ef4f891654b56fad161d9b27c670176dabd9d';

async function listTables() {
  try {
    // Make a request to the Supabase REST API to list tables
    const response = await fetch(`${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_KEY}`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response to get the list of tables
    const data = await response.json();
    
    console.log('Tables in your Supabase project:');
    if (Object.keys(data).length === 0) {
      console.log('No tables found');
    } else {
      Object.keys(data).forEach(table => {
        console.log(`- ${table}`);
      });
    }
  } catch (err) {
    console.error('Error fetching tables:', err);
  }
}

listTables();

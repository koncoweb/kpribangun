
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mvigmyzmcfjfxikasvuq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12aWdteXptY2ZqZnhpa2FzdnVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxODEyMjMsImV4cCI6MjA2Mjc1NzIyM30.tK7OzvOU1054GABJDub0s4nKId1rxdGdWXFxkwugbKQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

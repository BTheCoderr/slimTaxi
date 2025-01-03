import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

let supabaseInstance = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'slimtaxi-auth',
        autoRefreshToken: true,
        detectSessionInUrl: false
      }
    });
  }
  return supabaseInstance;
};

// Create a single instance that will be exported and reused
export const supabase = getSupabaseClient();
export const auth = supabase.auth;

export default getSupabaseClient; 
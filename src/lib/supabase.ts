
import { createClient } from '@supabase/supabase-js';

// These environment variables are automatically injected by Lovable when Supabase is connected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the required environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure you have connected your Lovable project to Supabase.');
}

// Create a fallback client for development if env vars are not set
// This allows the app to at least render in development even without proper Supabase connection
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient(
      'https://placeholder-url.supabase.co', 
      'placeholder-key'
    );

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!supabaseUrl && !!supabaseAnonKey;
};

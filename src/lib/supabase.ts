
import { createClient } from '@supabase/supabase-js';

// Import the client directly from the integration path
import { supabase as integrationSupabase } from '@/integrations/supabase/client';

// This ensures we're always using the correct client
export const supabase = integrationSupabase;

// This function is kept for backward compatibility
export const isSupabaseConfigured = () => {
  return true; // We're using the integration client which is always configured
};

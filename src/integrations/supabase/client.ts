
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://znwbuwzhbqshbhjowjab.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpud2J1d3poYnFzaGJoam93amFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzQ4MjYsImV4cCI6MjA1OTExMDgyNn0.P2HXg25eY9yLoPnn3_atdGG81nf8oDSMFvK72TQfPpg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Enable detection of OAuth redirects
    flowType: 'implicit'  // Use implicit flow for simpler auth handling
  },
  // Enable vector type support
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-App-Info': 'Finance-Buddy'
    }
  }
});

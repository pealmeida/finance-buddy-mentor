
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Create a wrapper for the Supabase client to handle the monthly_expenses table
export const supabaseWrapper = {
  // Wrap the original supabase client
  ...supabase,
  
  // Add custom methods for monthly_expenses
  monthlyExpenses: {
    select: async () => {
      return supabase.from('monthly_expenses').select('*');
    },
    
    upsert: async (values: {
      id: string;
      user_id: string;
      year: number;
      data: Json;
    }, options?: { onConflict?: string }) => {
      return supabase.from('monthly_expenses').upsert(values, options);
    },
    
    // Fetch specific record
    getByUserAndYear: async (userId: string, year: number) => {
      return supabase
        .from('monthly_expenses')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .maybeSingle();
    }
  }
};


import { useState } from 'react';
import { useSupabaseBase } from './useSupabaseBase';
import { MonthlySavings } from '@/types/finance';
import { Json } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';

export function useSaveMonthlySavings() {
  const { supabase, loading: baseLoading, setLoading, handleError } = useSupabaseBase();
  const [loading, setLocalLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  /**
   * Save monthly savings data
   * @param monthlySavings Monthly savings data to save
   * @returns Boolean indicating success
   */
  const saveMonthlySavings = async (
    monthlySavings: MonthlySavings,
    maxRetries = 2
  ): Promise<boolean> => {
    try {
      setLocalLoading(true);
      setLoading(true);

      // Ensure we have an id
      if (!monthlySavings.id) {
        monthlySavings.id = uuidv4();
      }
      // Check authentication before saving
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log("No active session found, trying to refresh token...");
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Failed to refresh auth token:", refreshError);
          throw new Error("Authentication required. Please log in again.");
        }
      }

      // Use a raw upsert operation with explicit conflict target
      const { error } = await supabase
        .from('monthly_savings')
        .upsert({
          id: monthlySavings.id,
          user_id: monthlySavings.userId,
          year: monthlySavings.year,
          // Cast the MonthlyAmount[] to Json using type assertion
          data: monthlySavings.data as unknown as Json
        }, {
          onConflict: 'user_id,year'
        });

      if (error) {
        console.error("Database error when saving monthly savings:", error);
        
        // If it's a network error and we haven't exceeded max retries, try again
        if (error.message?.includes("Failed to fetch") && retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          console.log(`Retrying save (${retryCount + 1}/${maxRetries})...`);
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return saveMonthlySavings(monthlySavings, maxRetries);
        }
        
        throw error;
      }

      // Reset retry count on success
      setRetryCount(0);
      
      console.log("Monthly savings saved successfully");
      return true;
    } catch (err) {
      handleError(err, "Error saving monthly savings");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return {
    loading: baseLoading || loading,
    saveMonthlySavings
  };
}

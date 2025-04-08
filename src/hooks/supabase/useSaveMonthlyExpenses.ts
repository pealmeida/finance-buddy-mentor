
import { useState } from 'react';
import { useSupabaseBase } from './useSupabaseBase';
import { MonthlyExpenses } from '@/types/finance';
import { Json } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';
import { supabaseWrapper } from './utils/supabaseWrapper';

export function useSaveMonthlyExpenses() {
  const { supabase, loading: baseLoading, setLoading, handleError } = useSupabaseBase();
  const [loading, setLocalLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  /**
   * Save monthly expenses data
   * @param monthlyExpenses Monthly expenses data to save
   * @returns Boolean indicating success
   */
  const saveMonthlyExpenses = async (
    monthlyExpenses: MonthlyExpenses,
    maxRetries = 2
  ): Promise<boolean> => {
    try {
      setLocalLoading(true);
      setLoading(true);

      // Ensure we have an id
      if (!monthlyExpenses.id) {
        monthlyExpenses.id = uuidv4();
      }

      console.log("Attempting to save monthly expenses:", monthlyExpenses);

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

      // Use our custom wrapper for the upsert operation
      const { error } = await supabaseWrapper.monthlyExpenses.upsert({
        id: monthlyExpenses.id,
        user_id: monthlyExpenses.userId,
        year: monthlyExpenses.year,
        // Cast the MonthlyAmount[] to Json using type assertion
        data: monthlyExpenses.data as unknown as Json
      }, {
        onConflict: 'user_id,year'
      });

      if (error) {
        console.error("Database error when saving monthly expenses:", error);
        
        // If it's a network error and we haven't exceeded max retries, try again
        if (error.message?.includes("Failed to fetch") && retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          console.log(`Retrying save (${retryCount + 1}/${maxRetries})...`);
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return saveMonthlyExpenses(monthlyExpenses, maxRetries);
        }
        
        throw error;
      }

      // Reset retry count on success
      setRetryCount(0);
      
      console.log("Monthly expenses saved successfully");
      return true;
    } catch (err) {
      handleError(err, "Error saving monthly expenses");
      return false;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return {
    loading: baseLoading || loading,
    saveMonthlyExpenses
  };
}

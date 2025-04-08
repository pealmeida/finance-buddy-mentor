
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyAmount } from '@/types/finance';
import { toast } from '@/components/ui/use-toast';
import { convertExpensesDataToJson } from '@/hooks/expenses/utils/expensesDataUtils';

/**
 * Hook to save monthly expenses data to Supabase
 * Improved with better error handling and retry logic
 */
export const useSaveMonthlyExpenses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const saveMonthlyExpenses = useCallback(async (expenses: { 
    id: string;
    userId: string;
    year: number;
    data: MonthlyAmount[];
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setRetryCount(0);
      
      if (!expenses.userId) {
        throw new Error("Missing user ID");
      }
      
      if (!expenses.data || !Array.isArray(expenses.data)) {
        throw new Error("Invalid expenses data");
      }
      
      console.log("Saving monthly expenses:", expenses);
      
      // First, check the auth session and refresh if needed
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Authentication required. Please log in again.");
      }
      
      if (!sessionData.session) {
        console.log("No active session found, trying to refresh token...");
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Failed to refresh auth token:", refreshError);
          toast({
            title: 'Authentication Error',
            description: 'Your session has expired. Please log in again.',
            variant: 'destructive'
          });
          
          // Don't redirect here, let the auth check handle it
          return false;
        }
      }
      
      // Convert array data to Json type for Supabase using the utility function
      const jsonData = convertExpensesDataToJson(expenses.data);
      console.log("Converted expenses data to JSON format:", jsonData);
      
      // Format the data correctly for Supabase
      const formattedData = {
        id: expenses.id,
        user_id: expenses.userId,
        year: expenses.year,
        data: jsonData
      };
      
      console.log("Formatted data for Supabase:", formattedData);
      
      // Add retry logic for intermittent connection issues
      return await saveWithRetry(formattedData);
      
    } catch (err) {
      console.error("Unexpected error saving monthly expenses:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast({
        title: 'Error',
        description: 'An unexpected error occurred while saving expenses',
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Implement retry logic as a separate helper function for clarity
  const saveWithRetry = async (formattedData: any, attempt = 0): Promise<boolean> => {
    if (attempt >= MAX_RETRIES) {
      console.error(`Failed after ${MAX_RETRIES} attempts`);
      toast({
        title: 'Error',
        description: `Failed to save after ${MAX_RETRIES} attempts. Please try again later.`,
        variant: 'destructive'
      });
      return false;
    }
    
    try {
      console.log(`Save attempt ${attempt + 1}/${MAX_RETRIES}`);
      
      const { data, error } = await supabase
        .from('monthly_expenses')
        .upsert(formattedData, {
          onConflict: 'user_id,year' // Handle conflict on these columns
        })
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error(`Attempt ${attempt + 1}: Error saving monthly expenses:`, error);
        
        // If it's a network or temporary error, retry
        if (error.message?.includes("network") || 
            error.message?.includes("timeout") || 
            error.code === '23505') { // Duplicate key error
          
          const delay = Math.min(2000 * Math.pow(2, attempt), 10000); // Exponential backoff, max 10s
          console.log(`Retrying in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return saveWithRetry(formattedData, attempt + 1);
        }
        
        throw error;
      }
      
      console.log("Monthly expenses saved successfully:", data);
      
      toast({
        title: 'Success',
        description: 'Monthly expenses saved successfully',
      });
      
      return true;
    } catch (err) {
      if (attempt < MAX_RETRIES - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(`Error during save, retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return saveWithRetry(formattedData, attempt + 1);
      }
      
      console.error("Error saving after retries:", err);
      throw err;
    }
  };

  return {
    saveMonthlyExpenses,
    loading,
    error
  };
};

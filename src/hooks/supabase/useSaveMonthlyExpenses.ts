
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyAmount } from '@/types/finance';
import { toast } from '@/components/ui/use-toast';
import { convertExpensesDataToJson } from '@/hooks/expenses/utils/expensesDataUtils';

/**
 * Hook to save monthly expenses data to Supabase
 */
export const useSaveMonthlyExpenses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMonthlyExpenses = useCallback(async (expenses: { 
    id: string;
    userId: string;
    year: number;
    data: MonthlyAmount[];
  }): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!expenses.userId || !expenses.data) {
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
      let attempts = 0;
      let success = false;
      
      while (attempts < 3 && !success) {
        try {
          const { data, error } = await supabase
            .from('monthly_expenses')
            .upsert(formattedData, {
              onConflict: 'user_id,year' // Handle conflict on these columns
            })
            .select('*')
            .maybeSingle();
          
          if (error) {
            console.error(`Attempt ${attempts + 1}: Error saving monthly expenses:`, error);
            throw error;
          }
          
          console.log("Monthly expenses saved successfully:", data);
          success = true;
        } catch (err) {
          attempts++;
          if (attempts >= 3) throw err;
          // Wait briefly before retrying
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      toast({
        title: 'Success',
        description: 'Monthly expenses saved successfully',
      });
      return true;
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

  return {
    saveMonthlyExpenses,
    loading,
    error
  };
};

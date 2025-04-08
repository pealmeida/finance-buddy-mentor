
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
          
          // Wait a moment before redirecting to login (prevents redirect loops)
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          
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
      
      const { data, error } = await supabase
        .from('monthly_expenses')
        .upsert(formattedData, {
          onConflict: 'user_id,year' // Handle conflict on these columns
        })
        .select('*')
        .single();
      
      if (error) {
        console.error("Error saving monthly expenses:", error);
        setError(error.message);
        toast({
          title: 'Error',
          description: `Failed to save expenses: ${error.message}`,
          variant: 'destructive'
        });
        return false;
      }
      
      console.log("Monthly expenses saved successfully:", data);
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


import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
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
    data: any;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!expenses.userId || !expenses.data) {
        throw new Error("Invalid expenses data");
      }
      
      console.log("Saving monthly expenses:", expenses);
      
      // Convert array data to Json type for Supabase
      const jsonData = convertExpensesDataToJson(expenses.data);
      
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
        .upsert(formattedData)
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

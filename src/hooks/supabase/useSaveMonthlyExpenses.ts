
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyExpenses } from '@/types/finance';
import { Json } from '@/integrations/supabase/types';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook to save monthly expenses data to Supabase
 */
export const useSaveMonthlyExpenses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveMonthlyExpenses = useCallback(async (expenses: MonthlyExpenses & { data: Json }): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!expenses.userId || !expenses.data) {
        throw new Error("Invalid expenses data");
      }
      
      console.log("Saving monthly expenses:", expenses);
      
      // Format the data correctly for Supabase
      const formattedData = {
        id: expenses.id,
        user_id: expenses.userId,
        year: expenses.year,
        data: expenses.data
      };
      
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

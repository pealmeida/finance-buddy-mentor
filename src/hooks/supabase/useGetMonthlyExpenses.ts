
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyAmount, MonthlyExpenses } from '@/types/finance';
import { Json } from '@/integrations/supabase/types';
import { convertToTypedExpensesData } from '@/hooks/expenses/utils/expensesDataUtils';

/**
 * Hook to fetch monthly expenses data from Supabase
 */
export const useGetMonthlyExpenses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyExpenses = useCallback(async (userId: string, year: number) => {
    try {
      setLoading(true);
      console.log(`Fetching expenses for user ${userId} and year ${year}`);
      
      const { data, error } = await supabase
        .from('monthly_expenses')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching monthly expenses:", error);
        setError(error.message);
        return null;
      }
      
      if (!data) {
        console.log("No monthly expenses found for this user and year");
        return null;
      }
      
      console.log("Monthly expenses fetched successfully:", data);
      
      // Log the data type to help with debugging
      console.log("Data type:", typeof data.data);
      console.log("Is array?", Array.isArray(data.data));
      
      // Transform the data into a MonthlyExpenses object
      const monthlyExpenses: MonthlyExpenses = {
        id: data.id,
        userId: data.user_id,
        year: data.year,
        data: convertToTypedExpensesData(data.data)
      };
      
      console.log("Transformed monthly expenses:", monthlyExpenses);
      return monthlyExpenses;
    } catch (err) {
      console.error("Unexpected error fetching monthly expenses:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate average expenses from monthly data
  const calculateAverageExpenses = useCallback((monthlyData: MonthlyAmount[]) => {
    if (!monthlyData || monthlyData.length === 0) return 0;
    
    const total = monthlyData.reduce((sum, item) => {
      const amount = typeof item.amount === 'number' ? item.amount : 0;
      return sum + amount;
    }, 0);
    
    return total / monthlyData.length;
  }, []);

  return {
    fetchMonthlyExpenses,
    calculateAverageExpenses,
    loading,
    error
  };
};

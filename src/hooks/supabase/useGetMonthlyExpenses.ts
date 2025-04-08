
import { useState } from 'react';
import { useSupabaseBase } from './useSupabaseBase';
import { MonthlyAmount } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { Json } from '@/integrations/supabase/types';
import { supabaseWrapper } from './utils/supabaseWrapper';

export function useGetMonthlyExpenses() {
  const { loading: baseLoading, setLoading, handleError } = useSupabaseBase();
  const [loading, setLocalLoading] = useState(false);
  
  /**
   * Fetch monthly expenses data for a specific user and year
   */
  const fetchMonthlyExpenses = async (userId: string, year: number) => {
    try {
      setLocalLoading(true);
      setLoading(true);
      
      console.log(`Fetching monthly expenses for user ${userId} and year ${year}`);
      
      const { data, error } = await supabaseWrapper.monthlyExpenses.getByUserAndYear(userId, year);
      
      if (error) throw error;
      
      if (data) {
        return {
          id: data.id,
          userId: data.user_id,
          year: data.year,
          data: Array.isArray(data.data) ? data.data.map((item: any) => ({
            month: typeof item.month === 'number' ? item.month : parseInt(item.month),
            amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount)
          })) as MonthlyAmount[] : []
        };
      }
      
      // Return empty data structure if no data found
      return {
        id: '',
        userId,
        year,
        data: MONTHS.map((_, index) => ({
          month: index + 1,
          amount: 0
        }))
      };
    } catch (err) {
      handleError(err, "Error fetching monthly expenses");
      return null;
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };
  
  return {
    loading: baseLoading || loading,
    fetchMonthlyExpenses
  };
}

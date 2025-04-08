
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyAmount, MonthlySavings } from '@/types/finance';
import { Json } from '@/integrations/supabase/types';
import { convertToTypedSavingsData } from './utils/savingsUtils';

/**
 * Hook to fetch monthly savings data from Supabase
 */
export function useGetMonthlySavings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMonthlySavings = useCallback(async (
    userId: string, 
    year: number,
    maxRetries = 2
  ): Promise<MonthlySavings | null> => {
    try {
      setLoading(true);
      console.log(`Fetching monthly savings for user ${userId} and year ${year}`);
      
      // First check the session is valid
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.log("No active session found, trying to refresh token...");
        const { error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error("Failed to refresh auth token:", refreshError);
          throw new Error("Authentication required. Please log in again.");
        }
      }
      
      // Fetch monthly savings data
      const { data, error } = await supabase
        .from('monthly_savings')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .maybeSingle();

      if (error) {
        console.error("Error fetching monthly savings:", error);
        
        // If it's a network error and we haven't exceeded max retries, try again
        if (error.message?.includes("Failed to fetch") && retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          console.log(`Retrying fetch (${retryCount + 1}/${maxRetries})...`);
          
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchMonthlySavings(userId, year, maxRetries);
        }
        
        setError(error.message);
        throw error;
      }

      // Reset retry count on success
      setRetryCount(0);

      // If no data found, return null
      if (!data) {
        console.log(`No savings data found for user ${userId} and year ${year}`);
        return null;
      }

      console.log("Monthly savings data retrieved:", data);
      
      // Transform data to the expected format
      const monthlySavings: MonthlySavings = {
        id: data.id,
        userId: data.user_id,
        year: data.year,
        data: convertToTypedSavingsData(data.data)
      };
      
      console.log("Transformed monthly savings:", monthlySavings);
      return monthlySavings;
    } catch (err) {
      console.error("Error in fetchMonthlySavings:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Calculate average savings from monthly data
  const calculateAverageSavings = useCallback((monthlyData: MonthlyAmount[]) => {
    if (!monthlyData || monthlyData.length === 0) return 0;
    
    const total = monthlyData.reduce((sum, item) => {
      const amount = typeof item.amount === 'number' ? item.amount : 0;
      return sum + amount;
    }, 0);
    
    return total / monthlyData.length;
  }, []);

  return {
    loading,
    error,
    fetchMonthlySavings,
    calculateAverageSavings
  };
}

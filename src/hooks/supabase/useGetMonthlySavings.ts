import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MonthlyAmount, MonthlySavings } from '@/types/finance';
import { convertToTypedSavingsData } from './utils/savingsUtils';
import { useQuery } from '@tanstack/react-query';

/**
 * Hook to fetch monthly savings data from Supabase using React Query
 */
export function useGetMonthlySavings(userId: string, year: number) {
  const queryKey = ['monthlySavings', userId, year];

  const fetcher = useCallback(async (): Promise<MonthlySavings | null> => {
    // First check the session is valid
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error("Authentication required. Please log in again.");
    }

    // Fetch monthly savings data
    const { data, error } = await supabase
      .from('monthly_savings')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .maybeSingle();

    if (error) {
      throw error;
    }

    // If no data found, return null
    if (!data) {
      return null;
    }

    // Transform data to the expected format
    const monthlySavings: MonthlySavings = {
      id: data.id,
      userId: data.user_id,
      year: data.year,
      data: convertToTypedSavingsData(data.data)
    };

    return monthlySavings;
  }, [userId, year]);

  const { data, isLoading, error, refetch } = useQuery<MonthlySavings | null, Error>({
    queryKey: queryKey,
    queryFn: fetcher,
    enabled: !!userId, // Only run the query if userId is available
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Data will be kept in cache for 30 minutes (garbage collection time)
    refetchOnWindowFocus: false, // Don't refetch on window focus
    retry: 1, // Retry once on failure
  });

  // Calculate average savings from monthly data (this can remain as a utility)
  const calculateAverageSavings = useCallback((monthlyData: MonthlyAmount[]) => {
    if (!monthlyData || monthlyData.length === 0) return 0;

    const total = monthlyData.reduce((sum, item) => {
      const amount = typeof item.amount === 'number' ? item.amount : 0;
      return sum + amount;
    }, 0);

    return total / monthlyData.length;
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchMonthlySavings: fetcher, // Expose fetcher for manual refetch if needed
    calculateAverageSavings,
    refetch // Expose refetch for manual invalidation
  };
}

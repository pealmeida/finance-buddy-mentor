import { useCallback } from 'react';
import { supabase } from '../../integrations/supabase/client';
import { MonthlyAmount } from '../../types/finance';
import { useQuery } from '@tanstack/react-query';
/**
 * Hook to fetch monthly expenses summary data from Supabase using React Query
 */
export function useGetMonthlyExpensesSummary(userId: string, year: number) {
    const queryKey = ['monthlyExpensesSummary', userId, year];

    const fetcher = useCallback(async (): Promise<MonthlyAmount[]> => {
        console.log("useGetMonthlyExpensesSummary: Fetching monthly_expenses summary for userId:", userId, "year:", year);

        // Check session validity
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
            console.log("No active session found, trying to refresh token...");
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                console.error("Failed to refresh auth token:", refreshError);
                throw new Error("Authentication required. Please log in again.");
            }
        }

        const { data, error } = await supabase
            .from('monthly_expenses')
            .select('data')
            .eq('user_id', userId)
            .eq('year', year)
            .single();

        console.log("useGetMonthlyExpensesSummary: Supabase response for monthly_expenses - data:", data, "error:", error);

        if (error) {
            if (error.code === 'PGRST116') {
                console.log("useGetMonthlyExpensesSummary: No monthly_expenses entry found for this user/year (PGRST116). Returning default empty array.");
                return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 0 }));
            }
            throw error;
        }

        if (data && data.data) {
            console.log("useGetMonthlyExpensesSummary: Found monthly_expenses data:", data.data);
            return data.data as unknown as MonthlyAmount[];
        }

        console.log("useGetMonthlyExpensesSummary: No data.data found in monthly_expenses response. Returning default empty array.");
        return Array.from({ length: 12 }, (_, i) => ({ month: i + 1, amount: 0 }));
    }, [userId, year]);

    const { data, isLoading, error } = useQuery<MonthlyAmount[], Error>({
        queryKey: queryKey,
        queryFn: fetcher,
        enabled: !!userId, // Only run the query if userId is available
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
        gcTime: 30 * 60 * 1000, // Data will be kept in cache for 30 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        retry: 1, // Retry once on failure
    });

    return {
        data,
        isLoading,
        error,
        getMonthlyExpensesSummary: fetcher, // Expose fetcher for manual refetch if needed
    };
} 
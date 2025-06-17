import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { ExpenseItem } from '../../types/finance';

/**
 * Hook to fetch detailed expense items from Supabase
 */
export function useDetailedExpenses(userId: string, year: number) {
    const queryKey = ['detailedExpenses', userId, year];

    // First, check if user has a valid session
    const { data: hasValidSession } = useQuery({
        queryKey: ['sessionCheck'],
        queryFn: async () => {
            try {
                const { data: sessionData, error } = await supabase.auth.getSession();
                return !!sessionData.session && !error;
            } catch {
                return false;
            }
        },
        staleTime: 30 * 1000,
        gcTime: 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const { data: detailedExpenses, isLoading, error } = useQuery<ExpenseItem[], Error>({
        queryKey: queryKey,
        queryFn: async (): Promise<ExpenseItem[]> => {
            console.log("useDetailedExpenses: Fetching detailed expenses for userId:", userId, "year:", year);

            // Get the date range for the year
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;

            const { data, error } = await supabase
                .from('detailed_expenses')
                .select('*')
                .eq('user_id', userId)
                .gte('date', startDate)
                .lte('date', endDate)
                .order('date', { ascending: false });

            console.log("useDetailedExpenses: Supabase response - data:", data, "error:", error);
            console.log("useDetailedExpenses: Date range filter - start:", startDate, "end:", endDate);

            if (error) {
                console.error("useDetailedExpenses: Error fetching detailed expenses:", error);
                throw error;
            }

            // Transform the data to match ExpenseItem interface
            const transformedData: ExpenseItem[] = (data || []).map(item => ({
                id: item.id,
                date: item.date,
                amount: item.amount,
                category: item.category as ExpenseItem['category'],
                description: item.description,
            }));

            console.log("useDetailedExpenses: Transformed data with dates:", transformedData.map(item => ({ id: item.id, date: item.date, amount: item.amount })));

            return transformedData;
        },
        enabled: !!userId && hasValidSession === true,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: false,
    });

    return {
        detailedExpenses: detailedExpenses || [],
        isLoading,
        error,
        hasValidSession,
    };
} 
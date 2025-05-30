
import { useState, useCallback } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useToast } from '@/components/ui/use-toast';
import { ensureCompleteExpensesData } from './utils/expensesDataUtils';

/**
 * Hook for core data fetching operations
 */
export const useExpensesDataFetcher = (
  profile: UserProfile,
  selectedYear: number,
  setExpensesData: (data: MonthlyAmount[]) => void,
  setError: (error: string | null) => void,
  initializeEmptyData: () => void,
  retryFetchWithBackoff: () => Promise<void>
) => {
  const { fetchMonthlyExpenses } = useMonthlyExpenses();
  const { toast } = useToast();
  const [initialFetchAttempted, setInitialFetchAttempted] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      console.log(`Fetching monthly expenses for user ${profile.id} and year ${selectedYear}`);
      
      // Try to fetch data from Supabase
      const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
      
      if (savedData && savedData.data && Array.isArray(savedData.data)) {
        console.log("Setting expenses data from fetch:", savedData.data);
        
        // Ensure data is complete and in the right order
        const completeData = ensureCompleteExpensesData(savedData.data);
        
        console.log("Complete processed data being set:", completeData);
        setExpensesData(completeData);
        
        toast({
          title: "Expenses Data Loaded",
          description: "Your monthly expenses have been loaded successfully."
        });
      } else {
        console.log("No saved data found, initializing empty data");
        initializeEmptyData();
        
        toast({
          title: "No Data Found",
          description: "No expenses data found for this year. Starting with empty data."
        });
      }
    } catch (err) {
      console.error("Error fetching expenses data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      
      // Attempt to retry the fetch with backoff
      retryFetchWithBackoff();
      
      toast({
        title: "Error Loading Data",
        description: "There was a problem loading your expenses data. Retrying...",
        variant: "destructive"
      });
    }
  }, [profile.id, selectedYear, fetchMonthlyExpenses, setExpensesData, initializeEmptyData, setError, retryFetchWithBackoff, toast]);

  return {
    fetchData,
    initialFetchAttempted,
    setInitialFetchAttempted
  };
};

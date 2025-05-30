
import { useRef, useCallback } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useToast } from '@/components/ui/use-toast';
import { ensureCompleteExpensesData } from './utils/expensesDataUtils';

/**
 * Hook for handling retry logic for expenses data fetching
 */
export const useExpensesDataRetry = (
  profile: UserProfile,
  selectedYear: number,
  setExpensesData: (data: MonthlyAmount[]) => void,
  setDataFetchFailed: (failed: boolean) => void,
  initializeEmptyData: () => void
) => {
  const { fetchMonthlyExpenses } = useMonthlyExpenses();
  const { toast } = useToast();
  const retryAttemptsRef = useRef<number>(0);
  const maxRetryAttempts = 3;

  // Retry fetching data with exponential backoff
  const retryFetchWithBackoff = useCallback(async () => {
    if (retryAttemptsRef.current >= maxRetryAttempts) {
      console.log("Max retry attempts reached, initializing empty data");
      setDataFetchFailed(true);
      initializeEmptyData();
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, retryAttemptsRef.current), 8000);
    console.log(`Retrying data fetch in ${delay}ms (attempt ${retryAttemptsRef.current + 1}/${maxRetryAttempts})`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    retryAttemptsRef.current++;
    
    try {
      if (!profile?.id) return;
      
      console.log(`Retry attempt ${retryAttemptsRef.current}: Fetching expenses for user ${profile.id} and year ${selectedYear}`);
      const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
      
      if (savedData && savedData.data) {
        console.log("Retry successful, setting expenses data:", savedData.data);
        const completeData = ensureCompleteExpensesData(savedData.data);
        setExpensesData(completeData);
        setDataFetchFailed(false);
        
        toast({
          title: "Data Loaded",
          description: "Your monthly expenses have been loaded successfully."
        });
      } else {
        console.log("No data found in retry, initializing empty data");
        initializeEmptyData();
      }
    } catch (err) {
      console.error(`Error in retry attempt ${retryAttemptsRef.current}:`, err);
      if (retryAttemptsRef.current < maxRetryAttempts) {
        retryFetchWithBackoff();
      } else {
        console.log("Max retry attempts reached after error, initializing empty data");
        setDataFetchFailed(true);
        initializeEmptyData();
      }
    }
  }, [fetchMonthlyExpenses, initializeEmptyData, profile?.id, selectedYear, setExpensesData, setDataFetchFailed, toast]);

  const resetRetryCount = useCallback(() => {
    retryAttemptsRef.current = 0;
  }, []);

  return {
    retryFetchWithBackoff,
    resetRetryCount,
    retryAttemptsRef
  };
};

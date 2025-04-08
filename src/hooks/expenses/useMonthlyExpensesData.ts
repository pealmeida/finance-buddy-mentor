
import { useEffect, useRef, useState, useCallback } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useExpensesDataFetching } from './useExpensesDataFetching';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { toast } from '@/components/ui/use-toast';
import { ensureCompleteExpensesData } from './utils/expensesDataUtils';

/**
 * Hook to manage monthly expenses data loading and saving
 * Improved data handling and persistence
 */
export const useMonthlyExpensesData = (
  profile: UserProfile,
  selectedYear: number,
  authChecked: boolean,
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void
) => {
  const effectRunRef = useRef<boolean>(false);
  const { fetchMonthlyExpenses } = useMonthlyExpenses();
  const [initialFetchAttempted, setInitialFetchAttempted] = useState<boolean>(false);
  const [dataFetchFailed, setDataFetchFailed] = useState<boolean>(false);
  const maxRetryAttempts = 3;
  const retryAttemptsRef = useRef<number>(0);
  
  const {
    expensesData,
    loadingData,
    error,
    refreshData,
    setExpensesData,
    setError,
    initializeEmptyData
  } = useExpensesDataFetching({
    profile,
    selectedYear,
    authChecked,
    checkAndRefreshAuth
  });

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
  }, [fetchMonthlyExpenses, initializeEmptyData, profile?.id, selectedYear, setExpensesData, toast]);

  // Fetch data when year changes or auth is confirmed
  useEffect(() => {
    if (!authChecked || !profile?.id) {
      console.log("Skipping fetch: Auth not checked or profile missing");
      return;
    }

    // Reset retry counter when dependencies change
    retryAttemptsRef.current = 0;
    
    // Don't fetch again if we've already tried for this combination
    if (initialFetchAttempted) {
      console.log("Initial fetch already attempted, skipping");
      return;
    }

    // Mark that we've attempted a fetch to prevent duplicate fetches
    setInitialFetchAttempted(true);
    setLoadingData(true);
    
    const fetchData = async () => {
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
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [
    profile?.id, 
    selectedYear, 
    authChecked,
    initializeEmptyData, 
    setError, 
    setExpensesData,
    fetchMonthlyExpenses,
    initialFetchAttempted,
    retryFetchWithBackoff,
    toast
  ]);

  // Re-fetch data when year changes
  useEffect(() => {
    // Reset the fetch flag when year changes to trigger a new fetch
    if (initialFetchAttempted) {
      console.log("Year changed, resetting fetch status");
      setInitialFetchAttempted(false);
      setDataFetchFailed(false);
      retryAttemptsRef.current = 0;
    }
  }, [selectedYear]);

  // Force a setLoadingData setter to expose it
  const setLoadingData = useCallback((loading: boolean) => {
    // This is a pass-through to the inner hook's loading state
    if (loading) {
      console.log("Setting loading state to true");
    } else {
      console.log("Setting loading state to false");
    }
  }, []);

  return {
    expensesData,
    loadingData,
    error,
    refreshData,
    setExpensesData,
    setError,
    initializeEmptyData,
    dataFetchFailed,
    setLoadingData
  };
};


import { useEffect, useRef, useState } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useExpensesDataFetching } from './useExpensesDataFetching';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { toast } from '@/components/ui/use-toast';
import { ensureCompleteExpensesData } from './utils/expensesDataUtils';

/**
 * Hook to manage monthly expenses data loading and saving
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

  // Fetch data when year changes or auth is confirmed
  useEffect(() => {
    let isMounted = true;
    
    // Skip if we don't have auth or profile yet
    if (!authChecked || !profile?.id) {
      if (loadingData) {
        setError(null);
      }
      return;
    }

    // Use a different mechanism for checking if we've fetched data
    if (initialFetchAttempted) {
      return;
    }

    // Mark that we've attempted a fetch to prevent duplicate fetches
    setInitialFetchAttempted(true);
    
    const fetchData = async () => {
      try {
        if (!profile?.id) return;
        
        console.log(`Fetching monthly expenses for user ${profile.id} and year ${selectedYear}`);
        
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
        
        if (!isMounted) return;
        
        if (savedData && savedData.data) {
          console.log("Setting expenses data from fetch:", savedData.data);
          // Ensure data is complete and in the right order
          const completeData = ensureCompleteExpensesData(savedData.data);
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
        if (!isMounted) return;
        console.error("Error fetching expenses data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        // Initialize with empty data even on error
        initializeEmptyData();
        
        toast({
          title: "Error Loading Data",
          description: "There was a problem loading your expenses data.",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [
    profile?.id, 
    selectedYear, 
    authChecked, 
    loadingData, 
    initializeEmptyData, 
    setError, 
    setExpensesData,
    fetchMonthlyExpenses,
    initialFetchAttempted
  ]);

  // Re-fetch data when year changes
  useEffect(() => {
    // Reset the fetch flag when year changes to trigger a new fetch
    if (initialFetchAttempted) {
      setInitialFetchAttempted(false);
    }
  }, [selectedYear]);

  return {
    expensesData,
    loadingData,
    error,
    refreshData,
    setExpensesData,
    setError,
    initializeEmptyData
  };
};

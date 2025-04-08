
import { useEffect, useRef } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useExpensesDataFetching } from './useExpensesDataFetching';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';

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

    // Skip if this effect has already run for the current selection
    if (effectRunRef.current) {
      return;
    }

    // Mark this effect as having run
    effectRunRef.current = true;
    
    const fetchData = async () => {
      try {
        if (!profile?.id) return;
        
        console.log(`Fetching monthly expenses for user ${profile.id} and year ${selectedYear}`);
        
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
        
        if (!isMounted) return;
        
        if (savedData && savedData.data) {
          console.log("Setting expenses data from fetch:", savedData.data);
          // The data is already properly typed from fetchMonthlyExpenses
          setExpensesData(savedData.data);
        } else {
          console.log("No saved data found, initializing empty data");
          initializeEmptyData();
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching expenses data:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        // Initialize with empty data even on error
        initializeEmptyData();
      }
    };
    
    fetchData();
    
    return () => {
      isMounted = false;
      effectRunRef.current = false;
    };
  }, [
    profile?.id, 
    selectedYear, 
    authChecked, 
    loadingData, 
    initializeEmptyData, 
    setError, 
    setExpensesData,
    fetchMonthlyExpenses
  ]);

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

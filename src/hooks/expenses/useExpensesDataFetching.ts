
import { useState, useCallback, useRef } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useToast } from '@/components/ui/use-toast';
import { 
  convertToTypedExpensesData, 
  initializeEmptyExpensesData
} from './utils/expensesDataUtils';

interface UseExpensesDataFetchingProps {
  profile: UserProfile;
  selectedYear: number;
  authChecked: boolean;
  checkAndRefreshAuth: () => Promise<boolean>;
}

interface UseExpensesDataFetchingResult {
  expensesData: MonthlyAmount[];
  loadingData: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  setExpensesData: (data: MonthlyAmount[]) => void;
  setError: (error: string | null) => void;
  initializeEmptyData: () => void;
}

/**
 * Hook to manage expenses data fetching operations
 */
export const useExpensesDataFetching = ({
  profile,
  selectedYear,
  authChecked,
  checkAndRefreshAuth
}: UseExpensesDataFetchingProps): UseExpensesDataFetchingResult => {
  const { toast } = useToast();
  const { fetchMonthlyExpenses } = useMonthlyExpenses();
  const [expensesData, setExpensesData] = useState<MonthlyAmount[]>(initializeEmptyExpensesData());
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchingRef = useRef<boolean>(false);
  const dataInitializedRef = useRef<boolean>(false);

  // Initialize empty data for all months
  const initializeEmptyData = useCallback(() => {
    if (dataInitializedRef.current) {
      console.log("Data already initialized, skipping");
      return;
    }
    
    const emptyData = initializeEmptyExpensesData();
    console.log("Initializing empty expenses data for all months:", emptyData);
    setExpensesData(emptyData);
    setLoadingData(false);
    dataInitializedRef.current = true;
  }, []);

  // Manual refresh function that can be called by user action
  const refreshData = useCallback(async () => {
    if (!profile?.id || dataFetchingRef.current) {
      console.log("Skipping data fetch: profile missing or fetch in progress");
      return;
    }
    
    // Reset to initial state
    setLoadingData(true);
    setError(null);
    dataFetchingRef.current = true;
    
    try {
      // Verify auth before proceeding
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        console.error("Authentication failed during data refresh");
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        setLoadingData(false);
        dataFetchingRef.current = false;
        return;
      }
      
      console.log(`Fetching expenses data for user ${profile.id} and year ${selectedYear}`);
      
      // Fetch data from Supabase
      const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
      
      console.log("Received expenses data:", savedData);
      
      if (savedData && savedData.data) {
        // We already get converted data from fetchMonthlyExpenses
        console.log("Setting fetched expenses data:", savedData.data);
        setExpensesData(savedData.data);
        dataInitializedRef.current = true;
        
        toast({
          title: "Data Refreshed",
          description: "Your expenses data has been refreshed successfully."
        });
      } else {
        console.log("No expenses data found, initializing empty data");
        initializeEmptyData();
        dataInitializedRef.current = true;
        
        toast({
          title: "No Data Found",
          description: "No expenses data was found for the selected year. Starting with empty data."
        });
      }
    } catch (err) {
      console.error("Error refreshing expenses data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      // Initialize empty data even on error
      initializeEmptyData();
      dataInitializedRef.current = true;
      
      toast({
        title: "Error",
        description: "Failed to refresh expenses data. Starting with empty data.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
      dataFetchingRef.current = false;
    }
  }, [checkAndRefreshAuth, fetchMonthlyExpenses, initializeEmptyData, profile?.id, selectedYear, toast]);

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

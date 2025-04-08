
import { useState, useCallback, useRef } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useToast } from '@/components/ui/use-toast';
import { 
  convertToTypedExpensesData, 
  initializeEmptyExpensesData,
  ensureCompleteExpensesData
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
 * Improved for better reliability and error handling
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
  const retryCountRef = useRef<number>(0);
  const MAX_RETRIES = 3;

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
    if (!profile?.id) {
      console.log("Skipping data fetch: missing profile ID");
      return;
    }
    
    if (dataFetchingRef.current) {
      console.log("Data fetch already in progress, skipping");
      return;
    }
    
    // Reset to initial state
    setLoadingData(true);
    setError(null);
    dataFetchingRef.current = true;
    retryCountRef.current = 0;
    
    try {
      // Verify auth before proceeding
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        console.error("Authentication failed during data refresh");
        setError("Authentication error. Please log in again.");
        setLoadingData(false);
        dataFetchingRef.current = false;
        return;
      }
      
      await fetchWithRetry();
    } catch (err) {
      console.error("Error refreshing expenses data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      // Initialize empty data even on error
      initializeEmptyData();
    } finally {
      setLoadingData(false);
      dataFetchingRef.current = false;
    }
  }, [checkAndRefreshAuth, fetchMonthlyExpenses, initializeEmptyData, profile?.id]);

  // Helper function to implement fetch with retry logic
  const fetchWithRetry = useCallback(async (): Promise<void> => {
    if (retryCountRef.current >= MAX_RETRIES) {
      console.error(`Failed to fetch data after ${MAX_RETRIES} attempts`);
      throw new Error(`Failed to fetch data after ${MAX_RETRIES} attempts`);
    }
    
    try {
      console.log(`Fetching expenses data, attempt ${retryCountRef.current + 1}/${MAX_RETRIES}`);
      console.log(`Fetching expenses data for user ${profile.id} and year ${selectedYear}`);
      
      // Fetch data from Supabase
      const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
      
      console.log("Received expenses data:", savedData);
      
      if (savedData && savedData.data) {
        console.log("Setting fetched expenses data:", savedData.data);
        // Ensure complete and properly formatted data
        const completeData = ensureCompleteExpensesData(savedData.data);
        setExpensesData(completeData);
        dataInitializedRef.current = true;
        
        toast({
          title: "Data Refreshed",
          description: "Your expenses data has been refreshed successfully."
        });
      } else {
        console.log("No expenses data found, initializing empty data");
        initializeEmptyData();
      }
    } catch (err) {
      console.error(`Fetch attempt ${retryCountRef.current + 1} failed:`, err);
      
      // Determine if we should retry
      const shouldRetry = err instanceof Error && 
        (err.message.includes("network") || 
         err.message.includes("timeout") || 
         err.message.includes("connection"));
      
      if (shouldRetry && retryCountRef.current < MAX_RETRIES - 1) {
        retryCountRef.current++;
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 8000);
        console.log(`Retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry();
      }
      
      // If we shouldn't retry or we've exhausted retries, re-throw
      throw err;
    }
  }, [fetchMonthlyExpenses, initializeEmptyData, profile.id, selectedYear, toast]);

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

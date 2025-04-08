
import { useState, useCallback, useRef } from 'react';
import { UserProfile, MonthlyAmount } from '@/types/finance';
import { useMonthlyExpenses } from '@/hooks/supabase/useMonthlyExpenses';
import { useToast } from '@/components/ui/use-toast';
import { 
  convertToTypedExpensesData, 
  initializeEmptyExpensesData,
  convertExpensesDataToJson
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
  const [expensesData, setExpensesData] = useState<MonthlyAmount[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dataFetchingRef = useRef<boolean>(false);

  // Initialize empty data for all months
  const initializeEmptyData = useCallback(() => {
    setExpensesData(initializeEmptyExpensesData());
  }, []);

  // Manual refresh function that can be called by user action
  const refreshData = useCallback(async () => {
    if (!profile?.id || dataFetchingRef.current) return;
    
    // Reset to initial state
    setLoadingData(true);
    setError(null);
    dataFetchingRef.current = true;
    
    try {
      // Verify auth before proceeding
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        setLoadingData(false);
        dataFetchingRef.current = false;
        return;
      }
      
      // Properly convert the data before passing to fetchMonthlyExpenses
      const savedData = await fetchMonthlyExpenses(profile.id, selectedYear);
      
      if (savedData && savedData.data) {
        // Convert data to proper MonthlyAmount type
        const typedData = convertToTypedExpensesData(savedData.data);
        setExpensesData(typedData);
        
        toast({
          title: "Data Refreshed",
          description: "Your expenses data has been refreshed successfully."
        });
      } else {
        initializeEmptyData();
        toast({
          title: "No Data Found",
          description: "No expenses data was found for the selected year."
        });
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: "Failed to refresh expenses data. Please try again.",
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

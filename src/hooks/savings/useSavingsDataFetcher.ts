
import { useCallback, useRef, useState } from 'react';
import { MonthlyAmount, MonthlySavings, UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';

/**
 * Hook to manage fetching savings data from the backend
 */
export const useSavingsDataFetcher = (
  profile: UserProfile,
  selectedYear: number,
  checkAndRefreshAuth: () => Promise<boolean>
) => {
  const { toast } = useToast();
  const { fetchMonthlySavings } = useMonthlySavings();
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;
  const dataFetchingRef = useRef<boolean>(false);

  // Fetch data from Supabase
  const fetchData = useCallback(async (): Promise<MonthlySavings | null> => {
    // Don't run concurrent fetch operations
    if (dataFetchingRef.current || !profile?.id) {
      console.log("Data fetch skipped: already in progress or missing profile");
      return null;
    }
    
    try {
      dataFetchingRef.current = true;
      console.log(`Fetching monthly savings for user ${profile.id} and year ${selectedYear}`);
      
      // Try to fetch data from Supabase
      const savedData = await fetchMonthlySavings(profile.id, selectedYear);
      
      // Store the fetch time to track data freshness
      const fetchTime = Date.now();
      setLastFetchTime(fetchTime);
      setFetchAttempts(0); // Reset attempt counter on success
      
      return savedData;
    } catch (err) {
      console.error("Error fetching savings data:", err);
      
      // Increment fetch attempts
      const newAttemptCount = fetchAttempts + 1;
      setFetchAttempts(newAttemptCount);
      
      // Notify user if we've exceeded max attempts
      if (newAttemptCount >= MAX_FETCH_ATTEMPTS) {
        console.log(`Max fetch attempts (${MAX_FETCH_ATTEMPTS}) reached`);
        toast({
          title: "Error",
          description: "Failed to load savings data. Please try refreshing the page.",
          variant: "destructive"
        });
      }
      
      return null;
    } finally {
      dataFetchingRef.current = false;
    }
  }, [fetchMonthlySavings, profile.id, selectedYear, fetchAttempts, toast]);

  // Manual refresh function that can be called by user action
  const refreshData = useCallback(async (): Promise<MonthlySavings | null> => {
    if (!profile?.id || dataFetchingRef.current) return null;
    
    try {
      // Verify auth before proceeding
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive"
        });
        return null;
      }
      
      return await fetchData();
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast({
        title: "Error",
        description: "Failed to refresh savings data. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [checkAndRefreshAuth, fetchData, profile?.id, toast]);

  return {
    fetchData,
    refreshData,
    isFetching: dataFetchingRef.current,
    fetchAttempts,
    lastFetchTime
  };
};

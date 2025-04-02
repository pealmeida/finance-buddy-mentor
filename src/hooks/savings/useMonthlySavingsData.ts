
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile, MonthlyAmount, MonthlySavings as MonthlySavingsType } from '@/types/finance';
import { MONTHS } from '@/constants/months';
import { useMonthlySavings } from '@/hooks/supabase/useMonthlySavings';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to manage monthly savings data loading and saving
 */
export const useMonthlySavingsData = (
  profile: UserProfile,
  selectedYear: number,
  authChecked: boolean,
  checkAndRefreshAuth: () => Promise<boolean>,
  onSave: (updatedProfile: UserProfile) => void
) => {
  const { toast } = useToast();
  const { fetchMonthlySavings, saveMonthlySavings } = useMonthlySavings();
  const [savingsData, setSavingsData] = useState<MonthlyAmount[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const MAX_FETCH_ATTEMPTS = 3;
  const dataFetchingRef = useRef<boolean>(false);
  const effectRunRef = useRef<boolean>(false);

  // Initialize empty data for all months
  const initializeEmptyData = useCallback(() => {
    const initialData: MonthlyAmount[] = MONTHS.map((_, index) => ({
      month: index + 1,
      amount: 0
    }));
    setSavingsData(initialData);
  }, []);

  // Fetch data when year changes or auth is confirmed
  useEffect(() => {
    let isMounted = true;
    
    // Skip if we don't have auth or profile yet
    if (!authChecked || !profile?.id) {
      if (loadingData) {
        setLoadingData(false); // Stop loader if we can't proceed
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
      // Don't run concurrent fetch operations
      if (dataFetchingRef.current) {
        console.log("Data fetch already in progress, skipping");
        return;
      }
      
      // Reset state at the beginning of the fetch
      if (isMounted) {
        dataFetchingRef.current = true;
        setLoadingData(true);
        setError(null);
      }
      
      try {
        // We won't check auth again to avoid potential loop
        console.log(`Fetching monthly savings for user ${profile.id} and year ${selectedYear}`);
        
        // Try to fetch data from Supabase
        const savedData = await fetchMonthlySavings(profile.id, selectedYear);
        
        // Store the fetch time to track data freshness
        const fetchTime = Date.now();
        
        if (!isMounted) return;
        
        setLastFetchTime(fetchTime);
        setFetchAttempts(0); // Reset attempt counter on success
        
        if (savedData && savedData.data) {
          console.log("Setting savings data from fetch:", savedData.data);
          setSavingsData(savedData.data);
        } else {
          console.log("No saved data found, initializing empty data");
          initializeEmptyData();
        }
      } catch (err) {
        if (!isMounted) return;
        
        console.error("Error fetching savings data:", err);
        
        // Increment fetch attempts and try again if under max attempts
        if (fetchAttempts < MAX_FETCH_ATTEMPTS) {
          console.log(`Fetch attempt ${fetchAttempts + 1}/${MAX_FETCH_ATTEMPTS} failed, retrying...`);
          setFetchAttempts(prev => prev + 1);
          
          // Retry after a short delay
          setTimeout(() => {
            if (isMounted) {
              fetchData();
            }
          }, 3000); // Longer delay between retries
          
          return;
        }
        
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        toast({
          title: "Error",
          description: "Failed to load savings data. Please try refreshing the page.",
          variant: "destructive"
        });
        initializeEmptyData();
      } finally {
        if (isMounted) {
          setLoadingData(false);
          dataFetchingRef.current = false;
        }
      }
    };
    
    fetchData();
    
    // No auto-refresh to reduce chance of loops
    
    return () => {
      isMounted = false;
      effectRunRef.current = false;
    };
  }, [profile?.id, selectedYear, authChecked, fetchMonthlySavings, initializeEmptyData, onSave, toast, loadingData]);

  // Manual refresh function that can be called by user action
  const refreshData = useCallback(async () => {
    if (!profile?.id || dataFetchingRef.current) return;
    
    // Reset the effect flag to allow a fresh fetch
    effectRunRef.current = false;
    
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
      
      const savedData = await fetchMonthlySavings(profile.id, selectedYear);
      setLastFetchTime(Date.now());
      
      if (savedData && savedData.data) {
        setSavingsData(savedData.data);
        toast({
          title: "Data Refreshed",
          description: "Your savings data has been refreshed successfully."
        });
      } else {
        initializeEmptyData();
        toast({
          title: "No Data Found",
          description: "No savings data was found for the selected year."
        });
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: "Failed to refresh savings data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
      dataFetchingRef.current = false;
    }
  }, [checkAndRefreshAuth, fetchMonthlySavings, initializeEmptyData, profile?.id, selectedYear, toast]);

  return {
    savingsData,
    loadingData,
    error,
    refreshData,
    setSavingsData,
    setError,
    initializeEmptyData
  };
};

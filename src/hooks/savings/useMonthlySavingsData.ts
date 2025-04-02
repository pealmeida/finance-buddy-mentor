
import { useState, useEffect, useCallback } from 'react';
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
    
    if (!authChecked || !profile?.id) return;

    const fetchData = async () => {
      // Reset state at the beginning of the fetch
      if (isMounted) {
        setLoadingData(true);
        setError(null);
      }
      
      try {
        // Refresh auth token before fetching data
        await checkAndRefreshAuth();
        
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
          
          // Update profile with fetched data if needed
          if (profile.monthlySavings?.year !== selectedYear || 
              !profile.monthlySavings?.data || 
              JSON.stringify(savedData.data) !== JSON.stringify(profile.monthlySavings.data)) {
            
            const updatedMonthlySavings: MonthlySavingsType = {
              id: savedData.id,
              userId: profile.id,
              year: selectedYear,
              data: savedData.data
            };
            
            const updatedProfile = {
              ...profile,
              monthlySavings: updatedMonthlySavings
            };
            
            onSave(updatedProfile);
          }
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
          }, 1000);
          
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
        }
      }
    };
    
    fetchData();
    
    // Set up auto-refresh every 5 minutes
    const refreshTimer = setInterval(() => {
      if (Date.now() - lastFetchTime >= 300000) { // 5 minutes
        fetchData();
      }
    }, 60000); // Check every minute
    
    return () => {
      isMounted = false;
      clearInterval(refreshTimer);
    };
  }, [profile?.id, selectedYear, authChecked, fetchMonthlySavings, initializeEmptyData, onSave, profile, toast, lastFetchTime, fetchAttempts, checkAndRefreshAuth]);

  const refreshData = useCallback(async () => {
    if (!profile?.id) return;
    
    // Refresh auth token before fetching data
    const isAuthenticated = await checkAndRefreshAuth();
    if (!isAuthenticated) {
      toast({
        title: "Authentication Error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingData(true);
    setError(null);
    
    try {
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

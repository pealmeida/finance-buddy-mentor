
import { useEffect, useRef } from 'react';
import { UserProfile } from '@/types/finance';
import { useToast } from '@/components/ui/use-toast';
import { useSavingsDataFetcher } from './useSavingsDataFetcher';
import { useSavingsDataState } from './useSavingsDataState';
import { initializeEmptySavingsData, processFetchedData } from './savingsDataUtils';

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
  const effectRunRef = useRef<boolean>(false);
  
  // Use the extracted hooks
  const {
    savingsData,
    setSavingsData,
    loadingData,
    setLoadingData,
    error,
    setError
  } = useSavingsDataState();
  
  const {
    fetchData,
    refreshData,
    isFetching
  } = useSavingsDataFetcher(profile, selectedYear, checkAndRefreshAuth);

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
    
    const loadData = async () => {
      if (isFetching) {
        console.log("Data fetch already in progress, skipping");
        return;
      }
      
      // Reset state at the beginning of the fetch
      if (isMounted) {
        setLoadingData(true);
        setError(null);
      }
      
      try {
        const savedData = await fetchData();
        
        if (!isMounted) return;
        
        if (savedData && savedData.data) {
          setSavingsData(processFetchedData(savedData.data));
        } else {
          console.log("No saved data found, initializing empty data");
          setSavingsData(initializeEmptySavingsData());
        }
      } finally {
        if (isMounted) {
          setLoadingData(false);
        }
      }
    };
    
    loadData();
    
    return () => {
      isMounted = false;
      effectRunRef.current = false;
    };
  }, [
    profile?.id, 
    selectedYear, 
    authChecked, 
    fetchData, 
    loadingData, 
    isFetching, 
    toast, 
    setLoadingData, 
    setError, 
    setSavingsData
  ]);

  // Wrapper around refreshData to handle UI state
  const handleRefreshData = async () => {
    if (!profile?.id) return;
    
    // Reset the effect flag to allow a fresh fetch
    effectRunRef.current = false;
    
    // Reset to initial state
    setLoadingData(true);
    setError(null);
    
    try {
      const savedData = await refreshData();
      
      if (savedData && savedData.data) {
        setSavingsData(processFetchedData(savedData.data));
        toast({
          title: "Data Refreshed",
          description: "Your savings data has been refreshed successfully."
        });
      } else {
        setSavingsData(initializeEmptySavingsData());
        toast({
          title: "No Data Found",
          description: "No savings data was found for the selected year."
        });
      }
    } finally {
      setLoadingData(false);
    }
  };

  return {
    savingsData,
    loadingData,
    error,
    refreshData: handleRefreshData,
    setSavingsData,
    setError,
    initializeEmptyData: () => setSavingsData(initializeEmptySavingsData())
  };
};

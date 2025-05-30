
import { useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/finance';
import { useExpensesDataState } from './useExpensesDataState';
import { useExpensesDataRetry } from './useExpensesDataRetry';
import { useExpensesDataFetcher } from './useExpensesDataFetcher';

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
  const {
    expensesData,
    setExpensesData,
    loadingData,
    setLoadingData,
    error,
    setError,
    dataFetchFailed,
    setDataFetchFailed,
    initializeEmptyData
  } = useExpensesDataState();

  const {
    retryFetchWithBackoff,
    resetRetryCount
  } = useExpensesDataRetry(
    profile,
    selectedYear,
    setExpensesData,
    setDataFetchFailed,
    initializeEmptyData
  );

  const {
    fetchData,
    initialFetchAttempted,
    setInitialFetchAttempted
  } = useExpensesDataFetcher(
    profile,
    selectedYear,
    setExpensesData,
    setError,
    initializeEmptyData,
    retryFetchWithBackoff
  );

  // Refresh data function for manual refresh
  const refreshData = useCallback(async () => {
    if (!profile?.id) {
      console.log("Skipping data refresh: missing profile ID");
      return;
    }
    
    setLoadingData(true);
    setError(null);
    resetRetryCount();
    
    try {
      // Verify auth before proceeding
      const isAuthenticated = await checkAndRefreshAuth();
      if (!isAuthenticated) {
        console.error("Authentication failed during data refresh");
        setError("Authentication error. Please log in again.");
        return;
      }
      
      await fetchData();
    } catch (err) {
      console.error("Error refreshing expenses data:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      initializeEmptyData();
    } finally {
      setLoadingData(false);
    }
  }, [profile?.id, checkAndRefreshAuth, fetchData, setLoadingData, setError, resetRetryCount, initializeEmptyData]);

  // Fetch data when year changes or auth is confirmed
  useEffect(() => {
    if (!authChecked || !profile?.id) {
      console.log("Skipping fetch: Auth not checked or profile missing");
      return;
    }

    // Reset retry counter when dependencies change
    resetRetryCount();
    
    // Don't fetch again if we've already tried for this combination
    if (initialFetchAttempted) {
      console.log("Initial fetch already attempted, skipping");
      return;
    }

    // Mark that we've attempted a fetch to prevent duplicate fetches
    setInitialFetchAttempted(true);
    setLoadingData(true);
    
    fetchData().finally(() => {
      setLoadingData(false);
    });
  }, [
    profile?.id, 
    selectedYear, 
    authChecked,
    initialFetchAttempted,
    fetchData,
    setInitialFetchAttempted,
    setLoadingData,
    resetRetryCount
  ]);

  // Re-fetch data when year changes
  useEffect(() => {
    // Reset the fetch flag when year changes to trigger a new fetch
    if (initialFetchAttempted) {
      console.log("Year changed, resetting fetch status");
      setInitialFetchAttempted(false);
      setDataFetchFailed(false);
      resetRetryCount();
    }
  }, [selectedYear, initialFetchAttempted, setInitialFetchAttempted, setDataFetchFailed, resetRetryCount]);

  // Force a setLoadingData setter to expose it
  const forceSetLoadingData = useCallback((loading: boolean) => {
    // This is a pass-through to the inner hook's loading state
    if (loading) {
      console.log("Setting loading state to true");
    } else {
      console.log("Setting loading state to false");
    }
    setLoadingData(loading);
  }, [setLoadingData]);

  return {
    expensesData,
    loadingData,
    error,
    refreshData,
    setExpensesData,
    setError,
    initializeEmptyData,
    dataFetchFailed,
    setLoadingData: forceSetLoadingData
  };
};

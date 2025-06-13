import { useCallback } from 'react';
import { MonthlySavings, UserProfile } from '../../types/finance';
import { useToast } from '../../components/ui/use-toast';
import { useMonthlySavings } from '../supabase/useMonthlySavings';

/**
 * Hook to manage fetching savings data from the backend
 */
export const useSavingsDataFetcher = (
  profile: UserProfile,
  selectedYear: number,
  checkAndRefreshAuth: () => Promise<boolean>
) => {
  const { toast } = useToast();
  const { monthlySavingsData, isLoading, error: fetchError, refetch } = useMonthlySavings(profile.id, selectedYear); // Use the new hook

  // Manual refresh function that can be called by user action
  const refreshData = useCallback(async (): Promise<MonthlySavings | null> => {
    if (!profile?.id || isLoading) return null;

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

      // Trigger refetching through the underlying useMonthlySavings hook
      const { data, error } = await refetch(); // Call refetch without arguments
      if (error) throw error;
      return data || null;
    } catch (err) {
      console.error("Error refreshing data:", err);
      toast({
        title: "Error",
        description: "Failed to refresh savings data. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [checkAndRefreshAuth, profile?.id, isLoading, refetch, toast]);

  return {
    data: monthlySavingsData,
    isLoading: isLoading,
    error: fetchError,
    refreshData,
  };
};

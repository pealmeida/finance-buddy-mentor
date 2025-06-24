
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to handle authentication checking and refreshing
 */
export const useAuthCheck = (userId?: string) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkAndRefreshAuth = useCallback(async (): Promise<boolean> => {
    try {
      if (!userId) {
        setError("User ID is not available");
        toast({
          title: "Authentication Error",
          description: "User ID is not available. Please log in.",
          variant: "destructive"
        });
        return false;
      }
      
      // Check current session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setError(sessionError.message);
        setAuthChecked(false);
        return false;
      }
      
      if (!sessionData.session) {
        console.log("No active session, trying to refresh");
        
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError || !refreshData.session) {
          console.error("Error refreshing session:", refreshError);
          setError(refreshError?.message || "Session expired");
          setAuthChecked(false);
          return false;
        }
      }
      
      // Session is valid
      setAuthChecked(true);
      setError(null);
      return true;
    } catch (err) {
      console.error("Unexpected auth check error:", err);
      setError(err instanceof Error ? err.message : "Authentication check failed");
      setAuthChecked(false);
      return false;
    }
  }, [userId, toast]);
  
  return {
    authChecked,
    error,
    checkAndRefreshAuth,
    setError
  };
};

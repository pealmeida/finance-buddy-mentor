
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to check authentication status and refresh token if needed
 */
export const useAuthCheck = (userId?: string) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status and refresh token if needed
  const checkAndRefreshAuth = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth session error:", error);
        return false;
      }
      
      // If session exists but expires soon, refresh it
      if (data.session) {
        const expiresAt = data.session.expires_at;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // If token expires in less than 10 minutes, refresh it
        if (expiresAt && expiresAt - currentTime < 600) {
          console.log("Token expiring soon, refreshing...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Error refreshing token:", refreshError);
            return false;
          }
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error("Auth check error:", err);
      return false;
    }
  }, []);

  // Initial authentication check
  useEffect(() => {
    const checkAuth = async () => {
      if (!userId) {
        setError("Authentication required. Please log in.");
        setAuthChecked(true);
        return;
      }
      
      const isAuthenticated = await checkAndRefreshAuth();
      
      if (!isAuthenticated) {
        setError("Authentication session expired. Please log in again.");
      }
      
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [userId, checkAndRefreshAuth]);

  return {
    authChecked,
    error,
    checkAndRefreshAuth,
    setError
  };
};

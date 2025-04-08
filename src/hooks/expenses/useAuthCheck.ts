
import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to check authentication status and refresh token if needed
 * Improved to prevent redirect loops and unwanted logouts
 */
export const useAuthCheck = (userId?: string) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authCheckingRef = useRef(false);
  const redirectingRef = useRef(false);
  const navigate = useNavigate();

  // Check authentication status and refresh token if needed
  const checkAndRefreshAuth = useCallback(async () => {
    // Prevent concurrent auth checks
    if (authCheckingRef.current) {
      console.log("Auth check already in progress, skipping");
      return false;
    }
    
    try {
      authCheckingRef.current = true;
      console.log("Checking authentication...");
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth session error:", error);
        return false;
      }
      
      // If no session exists, we can't proceed
      if (!data.session) {
        console.log("No active session found");
        return false;
      }
      
      // If session exists but expires soon, refresh it
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
        
        console.log("Token refreshed successfully");
      }
      
      return true;
    } catch (err) {
      console.error("Auth check error:", err);
      return false;
    } finally {
      authCheckingRef.current = false;
    }
  }, []);

  // Initial authentication check - improved to prevent redirect loops
  useEffect(() => {
    const checkAuth = async () => {
      if (!userId) {
        setError("Authentication required. Please log in.");
        setAuthChecked(true);
        return;
      }
      
      const isAuthenticated = await checkAndRefreshAuth();
      
      if (!isAuthenticated) {
        console.log("Authentication failed or session expired");
        
        // Only navigate to login if we're not already there and we're not already redirecting
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && !redirectingRef.current) {
          setError("Authentication session expired. Please log in again.");
          
          // Set redirecting flag to prevent multiple redirects
          redirectingRef.current = true;
          
          // Short delay before redirect to prevent immediate redirects during app initialization
          setTimeout(() => {
            navigate('/login');
            redirectingRef.current = false;
          }, 300);
        } else {
          // We're already on login page or redirecting, just set error but don't navigate
          setError("Authentication required. Please log in.");
        }
      } else {
        // Clear any previous errors if authentication is successful
        setError(null);
        console.log("Authentication successful");
      }
      
      setAuthChecked(true);
    };
    
    checkAuth();
  }, [userId, checkAndRefreshAuth, navigate]);

  return {
    authChecked,
    error,
    checkAndRefreshAuth,
    setError
  };
};

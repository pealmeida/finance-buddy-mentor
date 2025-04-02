
import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

export const useAuthSessionCheck = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check if auth session is valid and refresh token if needed
  const checkAndRefreshSession = useCallback(async () => {
    setCheckingAuth(true);
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      // If there's an error or no session, redirect to login
      if (error || !data.session) {
        throw new Error("Authentication required to access monthly savings");
      }
      
      // Session exists but check if token needs refresh
      if (data.session) {
        const expiresAt = data.session.expires_at;
        const currentTime = Math.floor(Date.now() / 1000);
        
        // If token expires in less than 10 minutes, refresh it
        if (expiresAt && expiresAt - currentTime < 600) {
          console.log("Token expiring soon, refreshing...");
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            console.error("Token refresh error:", refreshError);
            throw new Error("Failed to refresh authentication. Please log in again.");
          }
        }
      }
      
      return true;
    } catch (err) {
      console.error("Session error:", err);
      setError("Authentication required to access monthly savings");
      toast({
        title: "Authentication Required",
        description: "Please log in to access the monthly savings feature.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setCheckingAuth(false);
    }
  }, [toast]);
  
  // Set up refresh interval
  useEffect(() => {
    // Set up refresh interval every 4 minutes (240000ms)
    const refreshInterval = setInterval(() => {
      checkAndRefreshSession();
    }, 240000);
    
    return () => clearInterval(refreshInterval);
  }, [checkAndRefreshSession]);

  return {
    checkingAuth,
    error, 
    setError,
    checkAndRefreshSession
  };
};

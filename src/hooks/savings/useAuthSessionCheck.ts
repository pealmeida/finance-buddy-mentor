
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

export const useAuthSessionCheck = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const lastCheckTime = useRef<number>(0);
  const checkingRef = useRef<boolean>(false);
  const checkAttemptsRef = useRef<number>(0);
  const MAX_CHECK_ATTEMPTS = 3;
  const CHECK_COOLDOWN = 30000; // Increased to 30 seconds between checks
  
  // Check if auth session is valid and refresh token if needed
  const checkAndRefreshSession = useCallback(async (force = false) => {
    // Prevent concurrent checks
    if (checkingRef.current) {
      console.log("Auth check already in progress, skipping");
      return true;
    }
    
    const now = Date.now();
    // Don't check more often than every CHECK_COOLDOWN milliseconds unless forced
    if (!force && now - lastCheckTime.current < CHECK_COOLDOWN && lastCheckTime.current !== 0) {
      console.log(`Auth was checked recently (${Math.round((now - lastCheckTime.current) / 1000)}s ago), using cached result`);
      return !error;
    }
    
    // Limit number of consecutive check attempts
    if (checkAttemptsRef.current >= MAX_CHECK_ATTEMPTS) {
      console.log(`Max check attempts (${MAX_CHECK_ATTEMPTS}) reached, cooling down`);
      setTimeout(() => {
        checkAttemptsRef.current = 0;
      }, 60000); // Reset after 60 seconds
      return false;
    }
    
    checkAttemptsRef.current += 1;
    checkingRef.current = true;
    setCheckingAuth(true);
    
    try {
      console.log("Checking auth session...");
      const { data, error: sessionError } = await supabase.auth.getSession();
      lastCheckTime.current = Date.now();
      
      // If there's an error or no session, redirect to login
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!data.session) {
        console.log("No active session found");
        throw new Error("Authentication required to access monthly savings");
      }
      
      // Success - reset error state and check attempts
      setError(null);
      checkAttemptsRef.current = 0;
      return true;
    } catch (err) {
      console.error("Session check error:", err);
      setError(err instanceof Error ? err.message : "Authentication required to access monthly savings");
      
      if (checkAttemptsRef.current >= MAX_CHECK_ATTEMPTS) {
        toast({
          title: "Authentication Required",
          description: "Multiple authentication attempts failed. Please log in again.",
          variant: "destructive"
        });
        
        // Navigate to login after repeated failures
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (checkAttemptsRef.current === 1) {
        // Only show toast on first attempt
        toast({
          title: "Authentication Required",
          description: "Please log in to access the monthly savings feature.",
          variant: "destructive"
        });
      }
      
      return false;
    } finally {
      setCheckingAuth(false);
      checkingRef.current = false;
    }
  }, [toast, navigate, error]);
  
  // Set up refresh interval - less frequent to avoid hammering the server
  useEffect(() => {
    // Initial auth check
    checkAndRefreshSession(true);
    
    // No refresh interval - removed to prevent potential loops
    // We'll only check auth when explicitly called now
    
    return () => {
      // Nothing to clean up now
    };
  }, [checkAndRefreshSession]);

  return {
    checkingAuth,
    error, 
    setError,
    checkAndRefreshSession
  };
};

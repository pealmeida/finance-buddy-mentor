
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '@/types/finance';

interface UseUnifiedAuthResult {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  error: string | null;
  userProfile: UserProfile | null;
  checkAuth: (redirectToLogin?: boolean) => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  handleAuthError: (err: unknown, message: string) => void;
}

export const useUnifiedAuth = (
  redirectToLogin = true,
  loadProfile = false
): UseUnifiedAuthResult => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAuthError = useCallback((err: unknown, message: string) => {
    const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
    setError(errorMessage);
    
    toast({
      title: message,
      description: errorMessage,
      variant: "destructive"
    });
    
    return false;
  }, [toast]);

  const checkAuth = useCallback(async (shouldRedirect = redirectToLogin): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw new Error(sessionError.message);
      
      const isValid = !!data.session;
      setIsAuthenticated(isValid);
      
      if (!isValid && shouldRedirect) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access this feature"
        });
        navigate('/login');
        return false;
      }
      
      return isValid;
    } catch (err) {
      handleAuthError(err, "Authentication Error");
      if (shouldRedirect) {
        navigate('/login');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [navigate, redirectToLogin, toast, handleAuthError]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw new Error(error.message);
      
      const isValid = !!data.session;
      setIsAuthenticated(isValid);
      return isValid;
    } catch (err) {
      handleAuthError(err, "Session Refresh Failed");
      return false;
    }
  }, [handleAuthError]);

  // Load profile data if requested
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!loadProfile || !isAuthenticated) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', (await supabase.auth.getSession()).data.session?.user?.id)
          .single();
          
        if (error) throw new Error(error.message);
        
        if (data) {
          // Create a complete user profile with defaults for missing properties
          // This fixes the TypeScript error by ensuring all required UserProfile properties exist
          const completeProfile: UserProfile = {
            id: data.id,
            email: data.email,
            name: data.name,
            age: data.age,
            // Add default values for the missing properties
            monthlyIncome: 0,
            riskProfile: 'moderate',
            hasEmergencyFund: false,
            hasDebts: false,
            financialGoals: [],
            investments: []
          };
          
          setUserProfile(completeProfile);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated, loadProfile]);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    isAuthenticated,
    isLoading,
    error,
    userProfile,
    checkAuth,
    refreshSession,
    handleAuthError
  };
};

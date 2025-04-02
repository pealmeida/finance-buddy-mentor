
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export const useSimpleAuthCheck = (redirectToLogin = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw new Error(sessionError.message);
        
        if (!data.session) {
          if (redirectToLogin) {
            toast({
              title: "Authentication Required",
              description: "Please sign in to access this feature",
              variant: "destructive"
            });
            navigate('/login');
          }
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setError(err instanceof Error ? err.message : "Authentication error");
        setIsAuthenticated(false);
        
        if (redirectToLogin) {
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive"
          });
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, redirectToLogin, toast]);

  return { isAuthenticated, isLoading, error };
};

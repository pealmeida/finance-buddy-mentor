
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { validateSession } from '@/utils/security/authSecurity';

export const useSimpleAuthCheck = (redirectToLogin = true) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const validation = await validateSession();
        
        if (!validation.isValid) {
          setIsAuthenticated(false);
          setError(validation.error || 'Authentication failed');
          
          if (redirectToLogin) {
            toast({
              title: t('auth.authRequired'),
              description: validation.error === 'Session expired' 
                ? t('auth.sessionExpired') 
                : t('auth.pleaseSignIn'),
              variant: "destructive"
            });
            navigate('/login');
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        const errorMessage = err instanceof Error ? err.message : "Authentication error";
        setError(errorMessage);
        setIsAuthenticated(false);
        
        if (redirectToLogin) {
          toast({
            title: t('auth.authError'),
            description: t('auth.signInAgain'),
            variant: "destructive"
          });
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, redirectToLogin, toast, t]);

  return { isAuthenticated, isLoading, error };
};

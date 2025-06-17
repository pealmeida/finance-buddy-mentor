
/**
 * Enhanced authentication hook with security features
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { validateSession, secureSignOut, authRateLimiter } from '@/utils/security/authSecurity';
import { secureSetItem, secureGetItem, secureRemoveItem } from '@/utils/security/secureStorage';
import { supabase } from '@/integrations/supabase/client';

interface SecureAuthState {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  userId: string | null;
  sessionChecked: boolean;
  lastSecurityCheck: number | null;
}

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    isAuthenticated: null,
    isLoading: true,
    userId: null,
    sessionChecked: false,
    lastSecurityCheck: null
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Security check interval (5 minutes)
  const SECURITY_CHECK_INTERVAL = 5 * 60 * 1000;

  const performSecurityCheck = useCallback(async () => {
    try {
      const validation = await validateSession();
      const now = Date.now();

      if (!validation.isValid) {
        console.warn('Security check failed:', validation.error);
        
        // Clear stored data
        secureRemoveItem('userProfile');
        secureRemoveItem('authState');
        
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          userId: null,
          isLoading: false,
          lastSecurityCheck: now
        }));

        if (validation.error === 'Session expired') {
          toast({
            title: "Session Expired",
            description: "Please sign in again for security.",
            variant: "destructive"
          });
          navigate('/login');
        }

        return false;
      }

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        userId: validation.userId || null,
        isLoading: false,
        lastSecurityCheck: now
      }));

      return true;
    } catch (error) {
      console.error('Security check error:', error);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        userId: null,
        isLoading: false,
        lastSecurityCheck: Date.now()
      }));
      return false;
    }
  }, [navigate, toast]);

  const secureLogin = useCallback(async (email: string, password: string) => {
    const rateLimitResult = authRateLimiter.checkRateLimit(email);
    
    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime!);
      toast({
        title: "Too Many Attempts",
        description: `Please try again after ${resetTime.toLocaleTimeString()}`,
        variant: "destructive"
      });
      return { success: false, error: 'Rate limit exceeded' };
    }

    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Clear rate limit on successful login
        authRateLimiter.clearAttempts(email);

        // Store auth state securely
        secureSetItem('authState', {
          userId: data.user.id,
          email: data.user.email,
          lastLogin: Date.now()
        });

        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          userId: data.user.id,
          isLoading: false,
          sessionChecked: true,
          lastSecurityCheck: Date.now()
        }));

        toast({
          title: "Login Successful",
          description: "Welcome back!"
        });

        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Login failed' };
    }
  }, [toast]);

  const secureLogout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const result = await secureSignOut();
      
      if (result.success) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          sessionChecked: true,
          lastSecurityCheck: Date.now()
        });

        toast({
          title: "Logged Out",
          description: "You have been securely logged out."
        });

        navigate('/login');
      } else {
        toast({
          title: "Logout Error",
          description: result.error || 'Failed to logout',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [navigate, toast]);

  // Initial auth check and periodic security checks
  useEffect(() => {
    let securityCheckInterval: NodeJS.Timeout;

    const initializeAuth = async () => {
      await performSecurityCheck();
      
      // Set up periodic security checks
      securityCheckInterval = setInterval(performSecurityCheck, SECURITY_CHECK_INTERVAL);
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_OUT' || !session) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
          sessionChecked: true,
          lastSecurityCheck: Date.now()
        });
        secureRemoveItem('userProfile');
        secureRemoveItem('authState');
      } else if (event === 'SIGNED_IN' && session) {
        await performSecurityCheck();
      }
    });

    return () => {
      subscription.unsubscribe();
      if (securityCheckInterval) {
        clearInterval(securityCheckInterval);
      }
    };
  }, [performSecurityCheck]);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    userId: authState.userId,
    sessionChecked: authState.sessionChecked,
    lastSecurityCheck: authState.lastSecurityCheck,
    secureLogin,
    secureLogout,
    performSecurityCheck
  };
};

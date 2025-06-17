
/**
 * Authentication security utilities
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced session validation with security checks
 */
export const validateSession = async (): Promise<{ isValid: boolean; userId?: string; error?: string }> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      return { isValid: false, error: error.message };
    }
    
    if (!session) {
      return { isValid: false, error: 'No active session' };
    }
    
    // Check if session is expired
    const now = Date.now() / 1000;
    if (session.expires_at && session.expires_at < now) {
      return { isValid: false, error: 'Session expired' };
    }
    
    // Validate user exists
    if (!session.user?.id) {
      return { isValid: false, error: 'Invalid user data' };
    }
    
    return { isValid: true, userId: session.user.id };
  } catch (error) {
    console.error('Session validation failed:', error);
    return { isValid: false, error: 'Session validation failed' };
  }
};

/**
 * Secure sign out with cleanup
 */
export const secureSignOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
    
    // Clear all local storage data
    try {
      localStorage.clear();
    } catch (localStorageError) {
      console.warn('Failed to clear localStorage:', localStorageError);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Secure sign out failed:', error);
    return { success: false, error: 'Sign out failed' };
  }
};

/**
 * Rate limiting for authentication attempts
 */
class AuthRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      const oldestAttempt = Math.min(...recentAttempts);
      const resetTime = oldestAttempt + this.windowMs;
      
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime
      };
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return {
      allowed: true,
      remainingAttempts: this.maxAttempts - recentAttempts.length
    };
  }

  clearAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const authRateLimiter = new AuthRateLimiter();

/**
 * Secure password validation
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Generate secure redirect URL for authentication
 */
export const generateSecureRedirectUrl = (basePath: string = '/dashboard'): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}${basePath}`;
};

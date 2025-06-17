
/**
 * Security context provider for application-wide security features
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { validateSession } from '@/utils/security/authSecurity';
import { useToast } from '@/components/ui/use-toast';

interface SecurityContextType {
  isSecure: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  lastSecurityCheck: number | null;
  performSecurityAudit: () => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

interface SecurityProviderProps {
  children: React.ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { isAuthenticated, lastSecurityCheck } = useSecureAuth();
  const [isSecure, setIsSecure] = useState(false);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('low');
  const { toast } = useToast();

  const performSecurityAudit = async () => {
    try {
      let score = 0;
      const checks = [];

      // Check 1: Valid session
      const sessionValidation = await validateSession();
      if (sessionValidation.isValid) {
        score += 30;
        checks.push('✓ Valid authentication session');
      } else {
        checks.push('✗ Invalid or expired session');
      }

      // Check 2: Secure storage availability
      if (typeof Storage !== 'undefined') {
        score += 20;
        checks.push('✓ Secure storage available');
      } else {
        checks.push('✗ Secure storage not available');
      }

      // Check 3: HTTPS connection
      if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
        score += 25;
        checks.push('✓ Secure connection (HTTPS)');
      } else {
        checks.push('✗ Insecure connection (HTTP)');
      }

      // Check 4: Recent security check
      if (lastSecurityCheck && (Date.now() - lastSecurityCheck) < 5 * 60 * 1000) {
        score += 15;
        checks.push('✓ Recent security validation');
      } else {
        checks.push('✗ Security validation needed');
      }

      // Check 5: Browser security features
      if (window.isSecureContext) {
        score += 10;
        checks.push('✓ Secure browser context');
      } else {
        checks.push('✗ Insecure browser context');
      }

      // Determine security level
      let level: 'low' | 'medium' | 'high' = 'low';
      if (score >= 80) level = 'high';
      else if (score >= 60) level = 'medium';

      setSecurityLevel(level);
      setIsSecure(score >= 60);

      console.log('Security Audit Results:', {
        score,
        level,
        checks
      });

      if (score < 60) {
        toast({
          title: "Security Warning",
          description: "Some security checks failed. Please ensure you're using a secure connection.",
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Security audit failed:', error);
      setIsSecure(false);
      setSecurityLevel('low');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      performSecurityAudit();
    }
  }, [isAuthenticated, lastSecurityCheck]);

  const contextValue: SecurityContextType = {
    isSecure,
    securityLevel,
    lastSecurityCheck,
    performSecurityAudit
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

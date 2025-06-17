
/**
 * Security status indicator component
 */

import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useSecurityContext } from './SecurityProvider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SecurityIndicator: React.FC = () => {
  const { isSecure, securityLevel, lastSecurityCheck } = useSecurityContext();

  const getSecurityIcon = () => {
    if (securityLevel === 'high') return <ShieldCheck className="h-4 w-4 text-green-600" />;
    if (securityLevel === 'medium') return <Shield className="h-4 w-4 text-yellow-600" />;
    return <ShieldAlert className="h-4 w-4 text-red-600" />;
  };

  const getSecurityColor = () => {
    if (securityLevel === 'high') return 'bg-green-100 text-green-800 border-green-300';
    if (securityLevel === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getSecurityMessage = () => {
    if (securityLevel === 'high') return 'Your connection is secure';
    if (securityLevel === 'medium') return 'Your connection has some security warnings';
    return 'Your connection may not be secure';
  };

  const formatLastCheck = () => {
    if (!lastSecurityCheck) return 'Never';
    const minutes = Math.floor((Date.now() - lastSecurityCheck) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${getSecurityColor()} cursor-help`}>
            {getSecurityIcon()}
            <span className="ml-1 text-xs capitalize">{securityLevel}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">{getSecurityMessage()}</p>
            <p className="text-muted-foreground">Last check: {formatLastCheck()}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};


import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RefreshButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  onClick, 
  disabled = false,
  isLoading = false
}) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled || isLoading}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Loading...' : 'Refresh'}
    </Button>
  );
};

export default RefreshButton;

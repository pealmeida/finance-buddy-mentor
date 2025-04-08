
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SavingsEmptyStateProps {
  onRefresh?: () => void;
}

const SavingsEmptyState: React.FC<SavingsEmptyStateProps> = ({ onRefresh }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md flex flex-col justify-center items-center h-64 space-y-4">
      <p className="text-gray-500">No savings data available for the selected year.</p>
      
      {onRefresh && (
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default SavingsEmptyState;

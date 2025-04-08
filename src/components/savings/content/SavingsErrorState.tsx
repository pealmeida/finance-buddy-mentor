
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SavingsErrorStateProps {
  error: string;
  onRefresh?: () => void;
}

const SavingsErrorState: React.FC<SavingsErrorStateProps> = ({ error, onRefresh }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Error loading data: {error}</AlertDescription>
      </Alert>
      
      {onRefresh && (
        <div className="flex justify-center">
          <Button 
            onClick={onRefresh} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Loading Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavingsErrorState;

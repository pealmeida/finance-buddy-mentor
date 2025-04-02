
import React from 'react';
import { Loader2 } from 'lucide-react';

interface MonthlySavingsLoadingProps {
  message?: string;
  debugInfo?: string;
}

const MonthlySavingsLoading: React.FC<MonthlySavingsLoadingProps> = ({ 
  message = 'Loading savings data...',
  debugInfo
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p className="text-blue-700 font-medium">{message}</p>
        </div>
        <p className="text-sm text-gray-500">Please wait while we retrieve your information</p>
        {debugInfo && (
          <p className="text-xs text-gray-400 mt-4 max-w-md text-center">
            Debug: {debugInfo}
          </p>
        )}
      </div>
    </div>
  );
};

export default MonthlySavingsLoading;

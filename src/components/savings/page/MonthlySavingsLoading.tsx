
import React from 'react';
import { Loader2 } from 'lucide-react';

const MonthlySavingsLoading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <p>Loading savings data...</p>
        </div>
      </div>
    </div>
  );
};

export default MonthlySavingsLoading;

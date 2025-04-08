
import React from 'react';
import { Loader2 } from 'lucide-react';

const SavingsLoadingState: React.FC = () => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-md flex justify-center items-center h-64">
      <div className="flex items-center gap-2 text-blue-500">
        <Loader2 className="h-6 w-6 animate-spin" />
        <p>Loading savings data...</p>
      </div>
    </div>
  );
};

export default SavingsLoadingState;

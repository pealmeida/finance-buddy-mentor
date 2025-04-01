
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-t-finance-blue border-r-finance-blue border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading your profile...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

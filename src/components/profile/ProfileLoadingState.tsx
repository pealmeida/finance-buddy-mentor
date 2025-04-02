
import React from 'react';

const ProfileLoadingState: React.FC = () => {
  return (
    <div className="flex justify-center my-12">
      <div className="animate-pulse flex flex-col space-y-4 w-full max-w-md">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export default ProfileLoadingState;

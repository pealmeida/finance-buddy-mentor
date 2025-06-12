import React from "react";

const SavingsEmptyState: React.FC = () => {
  return (
    <div className='p-8 bg-white rounded-lg shadow-md flex flex-col justify-center items-center h-64 space-y-4'>
      <p className='text-gray-500'>
        No savings data available for the selected year.
      </p>
    </div>
  );
};

export default SavingsEmptyState;

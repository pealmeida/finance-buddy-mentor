
import React from 'react';
import YearSelector from '@/components/savings/YearSelector';

interface SavingsAnalysisHeaderProps {
  selectedYear: number;
  handleYearChange: (year: number) => void;
  loadingData: boolean;
}

const SavingsAnalysisHeader: React.FC<SavingsAnalysisHeaderProps> = ({
  selectedYear,
  handleYearChange,
  loadingData
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Savings Analysis</h1>
        <p className="text-gray-600 mt-1">
          Analyze and track your savings progress over time
        </p>
      </div>
      
      <div className="mt-4 sm:mt-0">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          disabled={loadingData}
        />
      </div>
    </div>
  );
};

export default SavingsAnalysisHeader;

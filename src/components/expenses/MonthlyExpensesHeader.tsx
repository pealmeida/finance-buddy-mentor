
import React from 'react';
import { CircleDollarSign } from 'lucide-react';
import YearSelector from '../savings/YearSelector';
import SaveAllButton from '../savings/SaveAllButton';

interface MonthlyExpensesHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onSaveAll: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const MonthlyExpensesHeader: React.FC<MonthlyExpensesHeaderProps> = ({
  selectedYear,
  onYearChange,
  onSaveAll,
  disabled,
  isSaving
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="text-red-600" />
          Monthly Expenses
        </h2>
        <div className="flex gap-4 items-center">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            disabled={disabled}
          />
          
          <SaveAllButton
            onSave={onSaveAll}
            disabled={disabled}
            isSaving={isSaving}
          />
        </div>
      </div>
      
      <p className="text-gray-600">
        Track your monthly expenses to monitor your spending habits throughout the year.
      </p>
    </>
  );
};

export default MonthlyExpensesHeader;

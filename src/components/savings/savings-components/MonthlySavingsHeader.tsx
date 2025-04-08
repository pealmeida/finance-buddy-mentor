
import React from 'react';
import { CircleDollarSign, RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import YearSelector from '../YearSelector';

interface MonthlySavingsHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onSaveAll: () => void;
  onRefresh: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const MonthlySavingsHeader: React.FC<MonthlySavingsHeaderProps> = ({
  selectedYear,
  onYearChange,
  onSaveAll,
  onRefresh,
  disabled,
  isSaving
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CircleDollarSign className="text-finance-blue" />
          Monthly Savings
        </h2>
        <div className="flex gap-4 items-center">
          <YearSelector
            selectedYear={selectedYear}
            onYearChange={onYearChange}
            disabled={disabled}
          />
          
          <Button 
            onClick={onSaveAll}
            className="flex items-center gap-2 bg-finance-blue hover:bg-finance-blue-dark"
            disabled={disabled || isSaving}
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={16} />
                Save All
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={disabled}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${disabled ? 'animate-spin' : ''}`} />
            {disabled ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      <p className="text-gray-600">
        Track your monthly savings to visualize your progress throughout the year.
      </p>
    </>
  );
};

export default MonthlySavingsHeader;


import React from 'react';
import { RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import YearSelector from '../YearSelector';

interface MonthlySavingsHeaderProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  onSaveAll: () => void;
  disabled: boolean;
  isSaving: boolean;
}

const MonthlySavingsHeader: React.FC<MonthlySavingsHeaderProps> = ({
  selectedYear,
  onYearChange,
  onSaveAll,
  disabled,
  isSaving
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Monthly Savings</h2>
        <p className="text-gray-600">
          Track your monthly savings to visualize your progress throughout the year.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={onYearChange}
          disabled={disabled}
        />
        
        <Button
          onClick={onSaveAll}
          disabled={disabled || isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save All
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => {}}
          disabled={disabled}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${disabled ? 'animate-spin' : ''}`} />
          {disabled ? 'Loading...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default MonthlySavingsHeader;

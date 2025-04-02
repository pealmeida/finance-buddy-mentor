
import React from 'react';
import { Button } from '@/components/ui/button';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  disabled: boolean;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
  disabled
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => onYearChange(selectedYear - 1)}
        disabled={disabled}
      >
        Previous Year
      </Button>
      <div className="flex items-center justify-center bg-background border rounded-md px-4 font-medium">
        {selectedYear}
      </div>
      <Button 
        variant="outline" 
        onClick={() => onYearChange(selectedYear + 1)}
        disabled={disabled}
      >
        Next Year
      </Button>
    </div>
  );
};

export default YearSelector;

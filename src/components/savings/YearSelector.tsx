
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  disabled?: boolean;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
  disabled = false
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onYearChange(selectedYear - 1)}
        disabled={disabled}
      >
        <ChevronLeft size={16} />
      </Button>
      
      <div className="min-w-12 text-center font-medium">
        {selectedYear}
      </div>
      
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onYearChange(selectedYear + 1)}
        disabled={disabled}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};

export default YearSelector;
